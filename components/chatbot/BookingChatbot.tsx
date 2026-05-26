"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CalendarCheck, ChevronDown, Loader2, MessageCircle, RotateCcw, Send, X } from "lucide-react";
import { bookingDurations } from "@/data/bookingDurations";
import { businessHours } from "@/data/businessHours";
import { chatbotConfig } from "@/data/bookingConfig";
import { chatbotMessages } from "@/data/chatbotMessages";
import { bookingSports } from "@/data/sports";
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

const INITIAL_SLOT_COUNT = chatbotConfig.initialVisibleSlots;
const SESSION_TIMEOUT_MS = chatbotConfig.inactivityResetMinutes * 60 * 1000;

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

export function BookingChatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("menu");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [visibleSlotCount, setVisibleSlotCount] = useState(INITIAL_SLOT_COUNT);
  const [form, setForm] = useState({ sportId: "", durationId: "", clientName: "", phone: "", date: "" });
  const [viewForm, setViewForm] = useState({ phone: "" });
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const bookingWindow = useMemo(getBookingWindow, []);

  function addMessage(role: ChatRole, content: ReactNode) {
    setMessages((current) => [...current, { id: makeId(), role, content }]);
  }

  function resetChat(showTimeoutMessage = false) {
    setMode("menu");
    setInputValue("");
    setIsLoading(false);
    setSlots([]);
    setVisibleSlotCount(INITIAL_SLOT_COUNT);
    setForm({ sportId: "", durationId: "", clientName: "", phone: "", date: "" });
    setViewForm({ phone: "" });
    setMessages([
      ...(showTimeoutMessage ? [{ id: makeId(), role: "bot" as const, content: chatbotMessages.timeoutReset }] : []),
      { id: makeId(), role: "bot", content: chatbotMessages.greeting },
      { id: makeId(), role: "bot", content: chatbotMessages.mainMenu },
    ]);
  }

  function cancelCurrentFlow() {
    setMode("menu");
    setInputValue("");
    setIsLoading(false);
    setSlots([]);
    setVisibleSlotCount(INITIAL_SLOT_COUNT);
    addMessage("bot", chatbotMessages.mainMenu);
  }

  useEffect(() => {
    if (isOpen && messages.length === 0) resetChat();
  }, [isOpen, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, slots, visibleSlotCount, isLoading]);

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

  function showNextActions() {
    addMessage("bot", chatbotMessages.nextActionPrompt);
    setMode("final");
  }

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
      addMessage("bot", chatbotMessages.createBooking);
      addMessage("bot", chatbotMessages.chooseSport);
      setMode("create-sport");
      return;
    }
    if (value === "view") {
      addMessage("bot", chatbotMessages.viewBooking);
      addMessage("bot", chatbotMessages.phonePrompt);
      setMode("view-phone");
      return;
    }
    if (value === "edit") {
      addMessage("bot", chatbotMessages.editBooking);
      showNextActions();
      return;
    }
    if (value === "cancel") {
      addMessage("bot", chatbotMessages.cancelBooking);
      showNextActions();
    }
  }

  function handleSport(value: string, label: string) {
    setForm((current) => ({ ...current, sportId: value }));
    addMessage("user", label);
    addMessage("bot", chatbotMessages.chooseDuration);
    setMode("create-duration");
  }

  function handleDuration(value: string, label: string) {
    setForm((current) => ({ ...current, durationId: value }));
    addMessage("user", label);
    addMessage("bot", chatbotMessages.namePrompt);
    setMode("create-name");
  }

  async function fetchSlots(selectedDate: string) {
    setIsLoading(true);
    setSlots([]);
    setVisibleSlotCount(INITIAL_SLOT_COUNT);
    addMessage("bot", chatbotMessages.loadingSlots);

    try {
      const response = await fetch("/api/chatbot/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sportId: form.sportId, durationId: form.durationId, date: selectedDate }),
      });
      const data = (await response.json()) as { ok: boolean; slots?: Slot[]; message?: string };
      if (!response.ok || !data.ok) throw new Error(data.message || chatbotMessages.genericError);

      const nextSlots = data.slots ?? [];
      setSlots(nextSlots);
      addMessage("bot", nextSlots.length > 0 ? chatbotMessages.slotsPrompt : chatbotMessages.noSlots);
      setMode("create-slots");
    } catch (error) {
      addMessage("bot", error instanceof Error ? error.message : chatbotMessages.genericError);
      setMode("create-date");
    } finally {
      setIsLoading(false);
    }
  }

  async function createBooking(slot: Slot) {
    setIsLoading(true);
    addMessage("user", slot.label);
    addMessage("bot", chatbotMessages.creatingBooking);

    try {
      const response = await fetch("/api/chatbot/create-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, startIso: slot.startIso, endIso: slot.endIso, website: "" }),
      });
      const data = (await response.json()) as { ok: boolean; booking?: BookingRecord; code?: string; message?: string };
      if (!response.ok || !data.ok || !data.booking) {
        if (data.code === "SLOT_TAKEN") throw new Error(chatbotMessages.slotTaken);
        throw new Error(data.message || chatbotMessages.bookingFailure);
      }

      addMessage(
        "bot",
        <span>
          {chatbotMessages.bookingSuccessPrefix} Your booking ID is <strong>{data.booking.bookingId}</strong>. {chatbotMessages.bookingSuccessSuffix}
        </span>,
      );
      showNextActions();
    } catch (error) {
      addMessage("bot", error instanceof Error ? error.message : chatbotMessages.bookingFailure);
    } finally {
      setIsLoading(false);
    }
  }

  async function viewBookings(details = viewForm) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/chatbot/view-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });
      const data = (await response.json()) as { ok: boolean; bookings?: BookingRecord[]; code?: string; message?: string };
      if (!response.ok || !data.ok || !data.bookings) {
        throw new Error(data.code === "NOT_FOUND" ? chatbotMessages.bookingNotFound : data.message || chatbotMessages.genericError);
      }

      addMessage(
        "bot",
        <div className="space-y-3">
          <span className="block font-extrabold">{chatbotMessages.viewBookingResult}</span>
          <span className="block text-xs font-semibold text-[color:var(--muted)]">Mobile: {maskPhone(details.phone)}</span>
          {data.bookings.map((booking) => (
            <span key={booking.bookingId} className="block rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-3 text-xs leading-6">
              <strong className="block text-sm text-[color:var(--text)]">{booking.bookingId}</strong>
              <span className="block">Sport: {booking.sportName}</span>
              <span className="block">Date: {formatDate(booking.startIso)}</span>
              <span className="block">Time: {formatTimeRange(booking.startIso, booking.endIso)}</span>
              <span className="block">Duration: {booking.durationMinutes} minutes</span>
              <span className="block">Status: {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
            </span>
          ))}
        </div>,
      );
      showNextActions();
    } catch (error) {
      addMessage("bot", error instanceof Error ? error.message : chatbotMessages.bookingNotFound);
      showNextActions();
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
    addMessage("user", value);
    void fetchSlots(value);
  }

  const showTextInput = ["create-name", "create-phone", "view-phone"].includes(mode);
  const inputPlaceholder = mode.includes("phone") ? "03001234567" : "Type here...";
  const visibleSlots = slots.slice(0, visibleSlotCount);
  const showFlowControls = mode !== "menu";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open booking assistant"
        className={cn(
          "fixed bottom-24 left-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--accent)] text-slate-950 shadow-[0_18px_60px_-20px_rgba(6,182,212,0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 sm:bottom-6",
          isOpen && "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-[color:var(--bg)] bg-emerald-400" />
      </button>

      <aside
        aria-label="Elite Courts booking assistant"
        className={cn(
          "fixed bottom-4 left-3 z-50 w-[calc(100vw-1.5rem)] max-w-[25rem] overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] shadow-[0_30px_90px_-34px_rgba(2,6,23,0.85)] backdrop-blur-xl transition-all duration-300 sm:bottom-5 sm:left-5",
          isOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
        )}
      >
        <div className="flex items-center justify-between border-b border-[color:var(--border)] px-4 py-3">
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

        <div ref={scrollRef} className="max-h-[58vh] space-y-3 overflow-y-auto px-4 py-4 sm:max-h-[34rem]">
          {messages.map((message) => (
            <ChatMessage key={message.id} role={message.role}>{message.content}</ChatMessage>
          ))}

          {mode === "menu" && <ChatOptions options={mainOptions} onSelect={handleMainOption} />}
          {mode === "final" && <ChatOptions options={nextActionOptions} onSelect={handleMainOption} />}
          {mode === "create-sport" && (
            <ChatOptions options={bookingSports.map((sport) => ({ label: sport.name, value: sport.id }))} onSelect={handleSport} />
          )}
          {mode === "create-duration" && (
            <ChatOptions options={bookingDurations.map((duration) => ({ label: duration.label, value: duration.id }))} onSelect={handleDuration} />
          )}
          {mode === "create-date" && (
            <div className="space-y-2">
              <input
                type="date"
                min={bookingWindow.min}
                max={bookingWindow.max}
                onChange={(event) => handleDateChange(event.target.value)}
                className="h-12 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm font-bold text-[color:var(--text)] focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/15"
              />
              <p className="text-xs font-semibold text-[color:var(--muted)]">Bookings are available until {bookingWindow.max}.</p>
            </div>
          )}
          {mode === "create-slots" && slots.length > 0 && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-2">
                {visibleSlots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={isLoading}
                    onClick={() => createBooking(slot)}
                    className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-left text-sm font-extrabold text-[color:var(--text)] transition hover:-translate-y-0.5 hover:border-cyan-300/45 hover:bg-[color:var(--accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35 disabled:opacity-50"
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
              {visibleSlotCount < slots.length && (
                <button
                  type="button"
                  onClick={() => setVisibleSlotCount((count) => count + INITIAL_SLOT_COUNT)}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black text-[color:var(--accent-strong)] hover:bg-[color:var(--accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35"
                >
                  {chatbotMessages.showMore} <ChevronDown className="h-4 w-4" />
                </button>
              )}
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

        <div className="border-t border-[color:var(--border)] p-3">
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
                <Send className="h-4 w-4" />
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
                <RotateCcw className="h-4 w-4" /> {chatbotMessages.startOver}
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
    </>
  );
}
