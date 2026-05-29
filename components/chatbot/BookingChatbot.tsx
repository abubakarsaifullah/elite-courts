"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Bot, CalendarCheck, CalendarDays, ChevronDown, Loader2, RotateCcw, Send, Sparkles, X } from "lucide-react";
import { businessHours } from "@/data/businessHours";
import { chatbotConfig } from "@/data/bookingConfig";
import { bookingLimits } from "@/data/bookingLimits";
import { chatbotMessages } from "@/data/chatbotMessages";
import { getAllowedDurationsForSport, getBookingPriceEstimate } from "@/data/sportBookingConfig";
import { getActiveBookingSports } from "@/data/sports";
import { renderTemplate, whatsappTemplates } from "@/data/whatsappTemplates";
import { buildWhatsAppUrl, siteConfig } from "@/data/siteContent";
import { REGEX } from "@/lib/regex";
import { cn } from "@/lib/utils";
import { ChatMessage } from "./ChatMessage";
import { ChatOptions } from "./ChatOptions";

type Mode =
  | "menu"
  | "create-sport"
  | "create-duration"
  | "create-name"
  | "create-phone"
  | "create-date"
  | "create-slots"
  | "create-confirm"
  | "view-phone"
  | "final";
type ChatRole = "bot" | "user";

interface Message {
  id: string;
  role: ChatRole;
  content: ReactNode;
}

interface Slot {
  id: string;
  label: string;
  startIso: string;
  endIso: string;
  priceLabel?: string;
}

interface BookingRecord {
  bookingId: string;
  clientName: string;
  phone: string;
  sportName: string;
  durationMinutes: number;
  status: string;
  startIso: string;
  endIso: string;
  channel: string;
}

interface PriceEstimate {
  amount: number | null;
  currency: string;
  label: string;
  note?: string;
}

const INITIAL_SLOT_COUNT = chatbotConfig.initialVisibleSlots;
const SESSION_TIMEOUT_MS = chatbotConfig.inactivityResetMinutes * 60 * 1000;
const activeSports = getActiveBookingSports();


async function readApiJson<T>(response: Response, fallbackMessage: string): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  const text = await response.text().catch(() => "");
  const isHtml = text.trimStart().startsWith("<!DOCTYPE") || text.trimStart().startsWith("<html");

  if (response.status === 404 || isHtml) {
    throw new Error("The booking service returned a page instead of JSON. Please make sure the API routes exist and restart the development server.");
  }

  throw new Error(fallbackMessage);
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getTodayDateInputValue() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function addDays(dateString: string, days: number) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function getCompactBookingDates(minDate: string, maxDate: string, selectedDate: string, todayDate: string) {
  const dates: Array<{
    value: string;
    day: number;
    weekday: string;
    month: string;
    isSelected: boolean;
    isToday: boolean;
  }> = [];

  let cursor = minDate;
  while (cursor <= maxDate) {
    const [year, month, day] = cursor.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    dates.push({
      value: cursor,
      day: date.getUTCDate(),
      weekday: new Intl.DateTimeFormat("en-PK", { weekday: "short", timeZone: "UTC" }).format(date),
      month: new Intl.DateTimeFormat("en-PK", { month: "short", timeZone: "UTC" }).format(date),
      isSelected: cursor === selectedDate,
      isToday: cursor === todayDate,
    });

    cursor = addDays(cursor, 1);
  }

  return dates;
}

function getBusinessWindowForDate(dateString: string) {
  const weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][new Date(`${dateString}T00:00:00Z`).getUTCDay()] as keyof typeof businessHours.weeklyHours;
  const hours = businessHours.weeklyHours[weekday];
  const endDate = hours.closesNextDay || hours.close <= hours.open ? addDays(dateString, 1) : dateString;
  return {
    start: new Date(`${dateString}T${hours.open}:00+05:00`),
    end: new Date(`${endDate}T${hours.close}:00+05:00`),
  };
}

function getCurrentBusinessDate() {
  const today = getTodayDateInputValue();
  const previous = addDays(today, -1);
  const now = new Date();
  const previousWindow = getBusinessWindowForDate(previous);
  const todayWindow = getBusinessWindowForDate(today);
  if (now >= previousWindow.start && now < previousWindow.end) return previous;
  if (now >= todayWindow.start && now < todayWindow.end) return today;
  return today;
}

function getBookingWindow() {
  const businessDate = getCurrentBusinessDate();
  const [year, month, day] = businessDate.split("-").map(Number);
  const dayIndex = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  const daysUntilThisSunday = (7 - dayIndex) % 7;
  return { min: businessDate, max: addDays(businessDate, daysUntilThisSunday + 7) };
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-PK", {
    timeZone: "Asia/Karachi",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

function formatTimeRange(startIso: string, endIso: string) {
  const formatter = new Intl.DateTimeFormat("en-PK", {
    timeZone: "Asia/Karachi",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${formatter.format(new Date(startIso))} - ${formatter.format(new Date(endIso))}`;
}

function maskPhone(phone: string) {
  return phone.length === 11 ? `${phone.slice(0, 4)}***${phone.slice(-3)}` : phone;
}

function notifyAdminPortalBookingCreated() {
  try {
    const channel = new BroadcastChannel("elite-courts-bookings");
    channel.postMessage({ type: "booking-created", source: "chatbot", at: new Date().toISOString() });
    channel.close();
  } catch {
    // BroadcastChannel is best-effort; admin polling is still the fallback.
  }
}

export function BookingChatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("menu");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [visibleSlotCount, setVisibleSlotCount] = useState(INITIAL_SLOT_COUNT);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [price, setPrice] = useState<PriceEstimate | null>(null);
  const [form, setForm] = useState({ sportId: "", durationId: "", clientName: "", phone: "", date: "" });
  const [viewForm, setViewForm] = useState({ phone: "" });
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const bookingWindow = useMemo(getBookingWindow, []);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const selectedSport = activeSports.find((sport) => sport.id === form.sportId);
  const durationOptions = form.sportId ? getAllowedDurationsForSport(form.sportId) : [];
  const selectedDuration = durationOptions.find((duration) => duration.id === form.durationId);
  const localPrice = form.sportId && form.durationId ? getBookingPriceEstimate({ sportId: form.sportId, durationId: form.durationId, date: form.date }) : null;

  function addMessage(role: ChatRole, content: ReactNode) {
    setMessages((current) => [...current, { id: makeId(), role, content }]);
  }

  function resetChat(showTimeoutMessage = false) {
    setMode("menu");
    setInputValue("");
    setIsLoading(false);
    setSlots([]);
    setSelectedSlot(null);
    setPrice(null);
    setVisibleSlotCount(INITIAL_SLOT_COUNT);
    setForm({ sportId: "", durationId: "", clientName: "", phone: "", date: "" });
    setViewForm({ phone: "" });
    setIsDatePickerOpen(false);
    setMessages([
      ...(showTimeoutMessage ? [{ id: makeId(), role: "bot" as const, content: chatbotMessages.timeoutReset }] : []),
      { id: makeId(), role: "bot", content: chatbotMessages.greeting },
    ]);
  }

  function cancelCurrentFlow() {
    setMode("menu");
    setInputValue("");
    setIsLoading(false);
    setSlots([]);
    setSelectedSlot(null);
    setPrice(null);
    setVisibleSlotCount(INITIAL_SLOT_COUNT);
    setIsDatePickerOpen(false);
    addMessage("bot", chatbotMessages.mainMenu);
  }

  useEffect(() => {
    if (isOpen && messages.length === 0) resetChat();
  }, [isOpen, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, slots, visibleSlotCount, isLoading, selectedSlot]);

  useEffect(() => {
    if (!isOpen) return;
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => resetChat(true), SESSION_TIMEOUT_MS);
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, [isOpen, messages.length, mode]);

  if (pathname?.startsWith("/portal")) return null;

  const mainOptions = [
    { label: "Create Booking", value: "create" },
    { label: "View Booking", value: "view" },
    { label: "Edit Booking", value: "edit" },
    { label: "Cancel Booking", value: "cancel" },
  ];

  const nextActionOptions = [
    { label: chatbotMessages.createAnotherBooking, value: "create" },
    { label: chatbotMessages.viewAnotherBooking, value: "view" },
    { label: chatbotMessages.mainMenuButton, value: "menu" },
    { label: chatbotMessages.closeChat, value: "close" },
  ];

  function handleMainOption(value: string, label: string) {
    addMessage("user", label);
    setInputValue("");

    if (value === "menu") {
      resetChat();
      return;
    }
    if (value === "close") {
      setIsOpen(false);
      return;
    }
    if (value === "create") {
      setForm({ sportId: "", durationId: "", clientName: "", phone: "", date: "" });
      setSlots([]);
      setSelectedSlot(null);
      setPrice(null);
      addMessage("bot", chatbotMessages.createBooking);
      setMode("create-sport");
      return;
    }
    if (value === "view") {
      addMessage("bot", chatbotMessages.viewBooking);
      setMode("view-phone");
      return;
    }
    if (value === "edit") {
      addMessage("bot", chatbotMessages.editBooking);
      setMode("final");
      return;
    }
    if (value === "cancel") {
      addMessage("bot", chatbotMessages.cancelBooking);
      setMode("final");
    }
  }

  function handleSport(value: string, label: string) {
    const durations = getAllowedDurationsForSport(value);
    setForm((current) => ({ ...current, sportId: value, durationId: "" }));
    setSlots([]);
    setSelectedSlot(null);
    setPrice(null);
    addMessage("user", label);
    addMessage("bot", durations.length > 0 ? chatbotMessages.chooseDuration : "This sport is not available for online booking right now.");
    setMode(durations.length > 0 ? "create-duration" : "menu");
  }

  function handleDuration(value: string, label: string) {
    setForm((current) => ({ ...current, durationId: value }));
    setSlots([]);
    setSelectedSlot(null);
    setPrice(null);
    addMessage("user", label);
    addMessage("bot", chatbotMessages.namePrompt);
    setMode("create-name");
  }

  function clearSlotState() {
    setSlots([]);
    setSelectedSlot(null);
    setPrice(null);
    setVisibleSlotCount(INITIAL_SLOT_COUNT);
  }

  function handlePendingLimit(message?: string) {
    clearSlotState();
    addMessage("bot", `${message || `You already have ${bookingLimits.maxPendingRequestsPerPhone} pending booking requests. Please contact our team before creating another one.`} ${chatbotMessages.nextActionPrompt}`);
    setMode("final");
  }

  async function fetchSlots(selectedDate: string) {
    setIsLoading(true);
    setSlots([]);
    setSelectedSlot(null);
    setPrice(null);
    setVisibleSlotCount(INITIAL_SLOT_COUNT);
    addMessage("bot", chatbotMessages.loadingSlots);

    try {
      const response = await fetch("/api/chatbot/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sportId: form.sportId, durationId: form.durationId, date: selectedDate, phone: form.phone }),
      });
      const data = await readApiJson<{ ok: boolean; slots?: Slot[]; price?: PriceEstimate; code?: string; message?: string }>(response, chatbotMessages.genericError);
      if (!response.ok || !data.ok) {
        if (data.code === "PENDING_LIMIT") {
          handlePendingLimit(data.message);
          return;
        }
        throw new Error(data.message || chatbotMessages.genericError);
      }

      const nextSlots = data.slots ?? [];
      setSlots(nextSlots);
      setPrice(data.price ?? localPrice ?? null);
      addMessage("bot", nextSlots.length > 0 ? chatbotMessages.slotsPrompt : chatbotMessages.noSlots);
      setMode("create-slots");
    } catch (error) {
      addMessage("bot", error instanceof Error ? error.message : chatbotMessages.genericError);
      setMode("create-date");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSlotSelect(slot: Slot) {
    setSelectedSlot(slot);
    addMessage("user", slot.label);
    addMessage("bot", chatbotMessages.confirmBookingPrompt);
    setMode("create-confirm");
  }

  async function createBooking() {
    if (!selectedSlot) return;
    setIsLoading(true);
    addMessage("user", chatbotMessages.confirmBookingRequest);
    addMessage("bot", chatbotMessages.creatingBooking);

    try {
      const response = await fetch("/api/chatbot/create-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, startIso: selectedSlot.startIso, endIso: selectedSlot.endIso, website: "" }),
      });
      const data = await readApiJson<{ ok: boolean; booking?: BookingRecord; code?: string; message?: string }>(response, chatbotMessages.bookingFailure);
      if (!response.ok || !data.ok || !data.booking) {
        if (data.code === "PENDING_LIMIT") {
          handlePendingLimit(data.message);
          return;
        }
        if (data.code === "SLOT_TAKEN") throw new Error(chatbotMessages.slotTaken);
        throw new Error(data.message || chatbotMessages.bookingFailure);
      }

      notifyAdminPortalBookingCreated();
      const whatsappMessage = renderTemplate(whatsappTemplates.bookingNotifyTeam, {
        bookingId: data.booking.bookingId,
        name: data.booking.clientName,
        phone: data.booking.phone,
        sport: data.booking.sportName,
        date: formatDate(data.booking.startIso),
        time: formatTimeRange(data.booking.startIso, data.booking.endIso),
        duration: `${data.booking.durationMinutes} minutes`,
        price: (price ?? localPrice)?.label ?? "Price will be confirmed by our team",
        status: "Pending",
      });

      addMessage(
        "bot",
        <div className="space-y-3">
          <span className="block">
            {chatbotMessages.bookingSuccessPrefix} Your booking ID is <strong>{data.booking.bookingId}</strong>. {chatbotMessages.bookingSuccessSuffix} {chatbotMessages.nextActionPrompt}
          </span>
          <a
            href={buildWhatsAppUrl(whatsappMessage)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-4 py-2.5 text-xs font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
          >
            {chatbotMessages.notifyWhatsapp}
          </a>
        </div>,
      );
      setMode("final");
    } catch (error) {
      addMessage("bot", error instanceof Error ? error.message : chatbotMessages.bookingFailure);
      setMode(slots.length > 0 ? "create-slots" : "create-date");
    } finally {
      setIsLoading(false);
    }
  }

  async function viewBookings(details = viewForm) {
    setIsDatePickerOpen(false);
    setIsLoading(true);
    try {
      const response = await fetch("/api/chatbot/view-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });
      const data = await readApiJson<{ ok: boolean; bookings?: BookingRecord[]; code?: string; message?: string }>(response, chatbotMessages.genericError);
      if (!response.ok || !data.ok || !data.bookings) {
        throw new Error(data.code === "NOT_FOUND" ? chatbotMessages.bookingNotFound : data.message || chatbotMessages.genericError);
      }

      addMessage(
        "bot",
        <div className="space-y-3">
          <span className="block font-extrabold">{chatbotMessages.viewBookingResult}</span>
          <span className="block text-xs font-semibold text-[color:var(--muted)]">Mobile: {maskPhone(details.phone)}</span>
          <div className="max-h-[min(15rem,40dvh)] space-y-2 overflow-y-auto overscroll-y-auto pr-1 [scrollbar-gutter:stable]">
            {data.bookings.map((booking) => (
              <div key={booking.bookingId} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-3 text-xs leading-5 shadow-sm">
                <strong className="block break-words text-sm text-[color:var(--text)]">{booking.bookingId}</strong>
                <span className="mt-1 block">Sport: {booking.sportName}</span>
                <span className="block">Date: {formatDate(booking.startIso)}</span>
                <span className="block">Time: {formatTimeRange(booking.startIso, booking.endIso)}</span>
                <span className="block">Duration: {booking.durationMinutes} minutes</span>
                <span className="block">Status: {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
              </div>
            ))}
          </div>
          <span className="block font-semibold text-[color:var(--muted)]">{chatbotMessages.nextActionPrompt}</span>
        </div>,
      );
      setMode("final");
    } catch (error) {
      addMessage("bot", `${error instanceof Error ? error.message : chatbotMessages.bookingNotFound} ${chatbotMessages.nextActionPrompt}`);
      setMode("final");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = inputValue.trim();
    if (!value || isLoading) return;

    if (mode === "create-name") {
      if (!REGEX.name.test(value)) {
        addMessage("bot", chatbotMessages.invalidName);
        return;
      }
      setForm((current) => ({ ...current, clientName: value }));
      addMessage("user", value);
      addMessage("bot", chatbotMessages.phonePrompt);
      setInputValue("");
      setMode("create-phone");
      return;
    }

    if (mode === "create-phone") {
      const phone = value.replace(/[\s-]/g, "");
      if (!REGEX.pakistaniMobile.test(phone)) {
        addMessage("bot", chatbotMessages.invalidPhone);
        return;
      }
      setForm((current) => ({ ...current, phone }));
      addMessage("user", phone);
      addMessage("bot", chatbotMessages.datePrompt);
      setInputValue("");
      setIsDatePickerOpen(false);
      setMode("create-date");
      return;
    }

    if (mode === "view-phone") {
      const phone = value.replace(/[\s-]/g, "");
      if (!REGEX.pakistaniMobile.test(phone)) {
        addMessage("bot", chatbotMessages.invalidPhone);
        return;
      }
      const nextViewForm = { phone };
      setViewForm(nextViewForm);
      addMessage("user", phone);
      setInputValue("");
      void viewBookings(nextViewForm);
    }
  }


  function handleDateChange(value: string) {
    if (!value) return;
    if (value < bookingWindow.min) {
      addMessage("bot", chatbotMessages.pastDateError);
      return;
    }
    if (value > bookingWindow.max) {
      addMessage("bot", chatbotMessages.bookingWindowError);
      return;
    }
    setForm((current) => ({ ...current, date: value }));
    setSelectedSlot(null);
    setIsDatePickerOpen(false);
    addMessage("user", value);
    void fetchSlots(value);
  }


  const showTextInput = ["create-name", "create-phone", "view-phone"].includes(mode);
  const inputPlaceholder = mode.includes("phone") ? "03001234567" : "Type here...";
  const visibleSlots = slots.slice(0, visibleSlotCount);
  const showFlowControls = mode !== "menu";
  const summaryPrice = (price ?? localPrice)?.label ?? "Price will be confirmed by our team";
  const selectedDateLabel = form.date ? formatDate(`${form.date}T12:00:00+05:00`) : "No date selected";
  const isDateSelectionMode = mode === "create-date";
  // Keep the first menu compact. Once a user starts a booking/view flow, lock the
  // shell to a stable viewport-safe height so date picking and results never shrink
  // or stretch the chatbot unexpectedly.
  const shouldUseStableChatHeight = mode !== "menu" || messages.length > 1 || isDatePickerOpen;
  const compactBookingDates = useMemo(
    () => getCompactBookingDates(bookingWindow.min, bookingWindow.max, form.date, getTodayDateInputValue()),
    [bookingWindow.max, bookingWindow.min, form.date],
  );
  const messageAreaClassName = cn(
    "min-h-0 space-y-3 overflow-y-auto overscroll-y-auto px-4 py-4 scroll-smooth [scrollbar-gutter:stable]",
    shouldUseStableChatHeight ? "flex-1" : "max-h-[min(19rem,calc(100dvh-13.5rem))]",
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open Elite Courts booking assistant"
        className={cn(
          "group fixed bottom-24 left-5 z-50 inline-flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-[1.35rem] border border-cyan-200/35 bg-[linear-gradient(135deg,var(--accent),#34d399)] text-slate-950 shadow-[0_22px_70px_-24px_rgba(6,182,212,0.95)] transition-all duration-200 hover:-translate-y-1 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 sm:bottom-6",
          isOpen && "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <Bot className="h-[1.65rem] w-[1.65rem] transition group-hover:scale-105" />
        <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-[color:var(--bg)] bg-emerald-400">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
        </span>
        <span className="absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-lg group-hover:block sm:whitespace-nowrap">Book</span>
      </button>

      <aside
        aria-label="Elite Courts booking assistant"
        className={cn(
          "fixed bottom-3 left-3 z-50 flex max-h-[calc(100dvh-1.5rem)] w-[calc(100vw-1.5rem)] max-w-[25rem] flex-col overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] shadow-[0_30px_90px_-34px_rgba(2,6,23,0.85)] backdrop-blur-xl transition-all duration-300 sm:bottom-5 sm:left-5 sm:max-h-[calc(100dvh-2.5rem)]",
          shouldUseStableChatHeight && "h-[36rem] max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2.5rem)]",
          isOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
        )}
      >
        <div className="shrink-0 flex items-center justify-between border-b border-[color:var(--border)] px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]">
              <CalendarCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-black text-[color:var(--text)]">Booking Assistant</p>
              <p className="text-xs font-semibold text-[color:var(--muted)]">Requests are saved as pending</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close booking assistant"
            className="rounded-full p-2 text-[color:var(--muted)] transition hover:bg-[color:var(--surface)] hover:text-[color:var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div ref={scrollRef} className={messageAreaClassName}>
          {messages.map((message) => (
            <ChatMessage key={message.id} role={message.role}>{message.content}</ChatMessage>
          ))}

          {mode === "menu" && <ChatOptions options={mainOptions} onSelect={handleMainOption} />}
          {mode === "final" && <ChatOptions options={nextActionOptions} onSelect={handleMainOption} />}
          {mode === "create-sport" && (
            <ChatOptions options={activeSports.map((sport) => ({ label: sport.name, value: sport.id }))} onSelect={handleSport} />
          )}
          {mode === "create-duration" && (
            <ChatOptions options={durationOptions.map((duration) => ({ label: duration.label, value: duration.id }))} onSelect={handleDuration} />
          )}
          {mode === "create-date" && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setIsDatePickerOpen((open) => !open)}
                aria-label="Select booking date"
                aria-expanded={isDatePickerOpen}
                aria-controls="booking-assistant-calendar-panel"
                className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-cyan-300/25 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface)_92%,transparent),color-mix(in_srgb,var(--accent-soft)_35%,var(--surface)))] p-2.5 text-left shadow-[0_18px_45px_-34px_rgba(6,182,212,0.9)] transition hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-[color:var(--surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color:var(--accent)] text-slate-950 shadow-[0_12px_30px_-22px_rgba(6,182,212,0.9)] transition group-hover:scale-105">
                    <CalendarDays className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-black text-[color:var(--text)]">{form.date ? "Booking date" : "Select a date"}</span>
                    <span className="block truncate text-xs font-semibold text-[color:var(--muted)]">{form.date ? selectedDateLabel : "Choose from available dates"}</span>
                  </span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[color:var(--surface-strong)] px-2 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-[color:var(--accent-strong)] shadow-sm">
                  {form.date ? "Change" : "Pick"}
                  <ChevronDown className={cn("h-3.5 w-3.5 transition", isDatePickerOpen && "rotate-180")} aria-hidden="true" />
                </span>
              </button>

              <p className="rounded-xl bg-[color:var(--surface)] px-3 py-1.5 text-[10.5px] font-semibold leading-5 text-[color:var(--muted)]">Choose a booking date within the allowed booking window.</p>
            </div>
          )}
          {mode === "create-slots" && slots.length > 0 && (
            <div className="space-y-3">
              <div className="max-h-64 overflow-y-auto rounded-[1.35rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-2 pr-1 shadow-inner">
                <div className="grid grid-cols-1 gap-2">
                  {visibleSlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleSlotSelect(slot)}
                      className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-left text-sm font-extrabold text-[color:var(--text)] transition hover:-translate-y-0.5 hover:border-cyan-300/45 hover:bg-[color:var(--accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35 disabled:opacity-50"
                    >
                      <span className="block">{slot.label}</span>
                      {slot.priceLabel && <span className="mt-1 block text-xs font-bold text-[color:var(--muted)]">Estimated price: {slot.priceLabel}</span>}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[11px] font-semibold text-[color:var(--muted)]">Scroll inside the slot list if more times are visible.</p>
              {visibleSlotCount < slots.length && (
                <button
                  type="button"
                  onClick={() => setVisibleSlotCount((count) => count + INITIAL_SLOT_COUNT)}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black text-[color:var(--accent-strong)] hover:bg-[color:var(--accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35"
                >
                  {chatbotMessages.showMore} <ChevronDown className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
          {mode === "create-confirm" && selectedSlot && (
            <div className="space-y-3 rounded-[1.35rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 text-sm">
              <p className="font-black text-[color:var(--text)]">Booking Summary</p>
              <div className="space-y-1 text-xs font-semibold text-[color:var(--muted)]">
                <p><strong>Name:</strong> {form.clientName}</p>
                <p><strong>Phone:</strong> {form.phone}</p>
                <p><strong>Sport:</strong> {selectedSport?.name}</p>
                <p><strong>Duration:</strong> {selectedDuration?.label}</p>
                <p><strong>Date:</strong> {formatDate(selectedSlot.startIso)}</p>
                <p><strong>Time:</strong> {formatTimeRange(selectedSlot.startIso, selectedSlot.endIso)}</p>
                <p><strong>Estimated Price:</strong> {summaryPrice}</p>
                <p><strong>Status:</strong> Pending</p>
              </div>
              <div className="grid gap-2">
                <button type="button" disabled={isLoading} onClick={createBooking} className="rounded-full bg-[color:var(--accent)] px-4 py-3 text-xs font-black text-slate-950 transition hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:opacity-50">
                  {chatbotMessages.confirmBookingRequest}
                </button>
                <button type="button" onClick={() => setMode("create-slots")} className="rounded-full border border-[color:var(--border)] px-4 py-3 text-xs font-black text-[color:var(--text)] transition hover:bg-[color:var(--surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35">
                  {chatbotMessages.changeSlot}
                </button>
              </div>
            </div>
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--surface)] px-3 py-2 text-xs font-bold text-[color:var(--muted)]">
                <Loader2 className="h-4 w-4 animate-spin" /> Working...
              </div>
            </div>
          )}
        </div>



        <div className="shrink-0 border-t border-[color:var(--border)] bg-[color:var(--surface-strong)] p-3">
          {showTextInput && (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder={inputPlaceholder}
                className="h-11 min-w-0 flex-1 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/15"
              />
              <button
                type="submit"
                disabled={isLoading}
                aria-label="Send message"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent)] text-slate-950 transition hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          )}

          <div className={cn("flex flex-wrap items-center justify-between gap-2", showTextInput && "mt-3")}> 
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => resetChat()}
                className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black text-[color:var(--muted-strong)] transition hover:bg-[color:var(--surface)] hover:text-[color:var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35"
              >
                <RotateCcw className="h-3.5 w-3.5" /> {chatbotMessages.startOver}
              </button>
              {showFlowControls && (
                <button
                  type="button"
                  onClick={cancelCurrentFlow}
                  className="rounded-full px-3 py-2 text-xs font-black text-[color:var(--muted-strong)] transition hover:bg-[color:var(--surface)] hover:text-[color:var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35"
                >
                  {chatbotMessages.cancel}
                </button>
              )}
            </div>
            <a
              href={buildWhatsAppUrl(siteConfig.primaryWhatsappMessage)}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-emerald-500 px-3 py-2 text-xs font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
            >
              {chatbotMessages.contactTeam}
            </a>
          </div>
        </div>
      </aside>

      {isOpen && isDateSelectionMode && isDatePickerOpen && (
        <div
          id="booking-assistant-calendar-panel"
          className="fixed bottom-[7.1rem] left-3 z-[70] w-[min(17rem,calc(100vw-1.5rem))] rounded-[1.35rem] border border-cyan-300/30 bg-[color:var(--surface-strong)] p-3 shadow-[0_30px_90px_-32px_rgba(2,6,23,0.95)] backdrop-blur-xl sm:bottom-[8rem] sm:left-6"
          role="dialog"
          aria-label="Booking date calendar"
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-black text-[color:var(--text)]">Select Booking Date</p>
              <p className="mt-0.5 text-[10px] font-semibold leading-4 text-[color:var(--muted)]">Current week and next week</p>
            </div>
            <button
              type="button"
              onClick={() => setIsDatePickerOpen(false)}
              aria-label="Close calendar"
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--muted)] transition hover:bg-[color:var(--surface-strong)] hover:text-[color:var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {compactBookingDates.map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => handleDateChange(day.value)}
                aria-label={`Select ${day.weekday}, ${day.month} ${day.day}`}
                className={cn(
                  "group flex h-[2.45rem] flex-col items-center justify-center rounded-xl border text-[10px] font-black leading-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35",
                  day.isSelected
                    ? "border-cyan-300/70 bg-[color:var(--accent)] text-slate-950 shadow-[0_14px_32px_-24px_rgba(6,182,212,0.95)]"
                    : "border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text)] hover:-translate-y-0.5 hover:border-cyan-300/45 hover:bg-[color:var(--accent-soft)] hover:text-[color:var(--accent-strong)]",
                )}
              >
                <span className={cn("text-[8px] uppercase tracking-[0.08em]", day.isSelected ? "text-slate-800" : "text-[color:var(--muted)] group-hover:text-[color:var(--accent-strong)]")}>{day.weekday}</span>
                <span className="mt-1 text-[12px]">{day.day}</span>
                {day.isToday && <span className={cn("mt-0.5 h-1 w-1 rounded-full", day.isSelected ? "bg-slate-900" : "bg-[color:var(--accent-strong)]")} aria-hidden="true" />}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-[color:var(--surface)] px-2.5 py-2 text-[9.5px] font-semibold leading-4 text-[color:var(--muted)]">
            <span className="inline-flex h-2 w-2 rounded-full bg-[color:var(--accent)]" aria-hidden="true" />
            <span>Allowed range: {bookingWindow.min} to {bookingWindow.max}</span>
          </div>
        </div>
      )}

    </>
  );
}
