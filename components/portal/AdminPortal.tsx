"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  Loader2,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  X,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { bookingDurations } from "@/data/bookingDurations";
import { bookingSyncConfig } from "@/data/bookingConfig";
import { getBookingStatus } from "@/data/bookingStatuses";
import { businessHours } from "@/data/businessHours";
import { bookingSports } from "@/data/sports";
import { bookingTableColumns, type AdminBookingColumnKey } from "@/data/adminBookingTableColumns";
import { REGEX } from "@/lib/regex";
import { cn } from "@/lib/utils";
import { BookingStatusBadge } from "./BookingStatusBadge";

interface BookingRecord {
  eventId: string;
  bookingId: string;
  clientName: string;
  phone: string;
  sportId: string;
  sportName: string;
  durationMinutes: number;
  status: "pending" | "confirmed" | "cancelled" | string;
  channel: string;
  startIso: string;
  endIso: string;
  createdAt?: string;
}

interface BookingStats {
  totalActive: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  todayConfirmed: number;
  upcomingConfirmed: number;
}

interface Slot {
  id: string;
  label: string;
  startIso: string;
  endIso: string;
}

interface AdminPortalProps {
  initialAuthenticated: boolean;
}

type SortDirection = "asc" | "desc";
type ModalState =
  | { type: "none" }
  | { type: "cancel"; booking: BookingRecord }
  | { type: "delete"; booking: BookingRecord }
  | { type: "create" }
  | { type: "edit"; booking: BookingRecord };

interface BookingFormState {
  sportId: string;
  durationId: string;
  clientName: string;
  phone: string;
  date: string;
  status: "pending" | "confirmed";
  startIso: string;
  endIso: string;
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-PK", {
    timeZone: businessHours.timezone,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

function formatTime(iso: string) {
  return new Intl.DateTimeFormat("en-PK", {
    timeZone: businessHours.timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

function formatDateInput(iso = new Date().toISOString()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: businessHours.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(iso));
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

function getCurrentBusinessWindow() {
  const today = formatDateInput();
  const todayWindow = getBusinessWindowForDate(today);
  const previous = addDays(today, -1);
  const previousWindow = getBusinessWindowForDate(previous);
  const now = new Date();
  if (now >= previousWindow.start && now < previousWindow.end) return previousWindow;
  return todayWindow;
}

function getBusinessDateForIso(iso: string) {
  const calendarDate = formatDateInput(iso);
  const previous = addDays(calendarDate, -1);
  const date = new Date(iso);
  const previousWindow = getBusinessWindowForDate(previous);
  if (date >= previousWindow.start && date < previousWindow.end) return previous;
  return calendarDate;
}

function isInCurrentBusinessWindow(booking: BookingRecord) {
  const window = getCurrentBusinessWindow();
  return new Date(booking.startIso) < window.end && new Date(booking.endIso) > window.start;
}

function isUpcomingAfterToday(booking: BookingRecord) {
  return new Date(booking.startIso) >= getCurrentBusinessWindow().end;
}

function StatCard({ label, value, icon: Icon, hint }: { label: string; value: number | string; icon: LucideIcon; hint?: string }) {
  return (
    <div className="rounded-[1.7rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[var(--shadow)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[color:var(--muted)]">{label}</p>
          <p className="mt-2 text-3xl font-black text-[color:var(--text)]">{value}</p>
          {hint && <p className="mt-1 text-[11px] font-semibold text-[color:var(--muted)]">{hint}</p>}
        </div>
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

function getStatusLabel(status: string) {
  return getBookingStatus(status).label;
}

function getDefaultForm(booking?: BookingRecord): BookingFormState {
  const duration = bookingDurations.find((item) => item.minutes === booking?.durationMinutes) ?? bookingDurations[1];
  const sport = bookingSports.find((item) => item.id === booking?.sportId) ?? bookingSports[0];
  return {
    sportId: sport.id,
    durationId: duration.id,
    clientName: booking?.clientName ?? "",
    phone: booking?.phone ?? "",
    date: booking ? getBusinessDateForIso(booking.startIso) : formatDateInput(),
    status: booking?.status === "pending" ? "pending" : "confirmed",
    startIso: booking?.startIso ?? "",
    endIso: booking?.endIso ?? "",
  };
}

function ModalShell({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/58 px-4 py-6 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
      <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] shadow-[0_30px_90px_-34px_rgba(2,6,23,0.95)]">
        <div className="flex items-center justify-between border-b border-[color:var(--border)] px-5 py-4">
          <h2 className="text-xl font-black text-[color:var(--text)]">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-[color:var(--muted)] transition hover:bg-[color:var(--surface)] hover:text-[color:var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function AdminPortal({ initialAuthenticated }: AdminPortalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticated);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [sportFilter, setSportFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [updatingEventId, setUpdatingEventId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<AdminBookingColumnKey>("startIso");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [cancelReason, setCancelReason] = useState("");
  const [form, setForm] = useState<BookingFormState>(() => getDefaultForm());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  async function loadBookings(silent = false) {
    if (!silent) setIsLoadingBookings(true);
    setBookingsError("");
    try {
      const response = await fetch("/api/portal/bookings", { cache: "no-store" });
      const data = (await response.json()) as { ok: boolean; bookings?: BookingRecord[]; stats?: BookingStats; lastUpdated?: string; message?: string };
      if (response.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      if (!response.ok || !data.ok) throw new Error(data.message || "Unable to load bookings.");
      setBookings(data.bookings ?? []);
      setStats(data.stats ?? null);
      setLastUpdated(data.lastUpdated ?? new Date().toISOString());
    } catch (error) {
      if (!silent) setBookingsError(error instanceof Error ? error.message : "Unable to load bookings.");
    } finally {
      if (!silent) setIsLoadingBookings(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated) void loadBookings();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || bookingSyncConfig.adminPortalRefreshSeconds <= 0) return;
    const interval = window.setInterval(() => void loadBookings(true), bookingSyncConfig.adminPortalRefreshSeconds * 1000);
    return () => window.clearInterval(interval);
  }, [isAuthenticated]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");
    try {
      const response = await fetch("/api/portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await response.json()) as { ok: boolean; message?: string };
      if (!response.ok || !data.ok) throw new Error(data.message || "Invalid login details.");
      setIsAuthenticated(true);
      setPassword("");
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Invalid login details.");
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/portal/logout", { method: "POST" });
    setIsAuthenticated(false);
    setBookings([]);
  }

  function toggleSort(key: AdminBookingColumnKey) {
    if (key === "actions") return;
    if (sortKey === key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection("asc");
  }

  async function updateStatus(eventId: string, status: "pending" | "confirmed" | "cancelled", reason?: string) {
    setUpdatingEventId(eventId);
    setToast("");
    try {
      const response = await fetch("/api/portal/update-booking-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, status, reason }),
      });
      const data = (await response.json()) as { ok: boolean; booking?: BookingRecord; code?: string; message?: string };
      if (data.code === "PAST_BOOKING") {
        await loadBookings(true);
        setModal({ type: "none" });
        return;
      }
      if (!response.ok || !data.ok || !data.booking) throw new Error(data.message || "Unable to update booking.");
      setBookings((current) => current.map((booking) => (booking.eventId === eventId ? data.booking! : booking)));
      setToast("Booking status updated in Google Calendar.");
      setModal({ type: "none" });
      setCancelReason("");
      void loadBookings(true);
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Unable to update booking.");
    } finally {
      setUpdatingEventId(null);
    }
  }

  async function deleteBooking(eventId: string) {
    setUpdatingEventId(eventId);
    setToast("");
    try {
      const response = await fetch("/api/portal/delete-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      const data = (await response.json()) as { ok: boolean; message?: string };
      if (!response.ok || !data.ok) throw new Error(data.message || "Unable to delete booking.");
      setBookings((current) => current.filter((booking) => booking.eventId !== eventId));
      setToast("Cancelled booking deleted from Google Calendar.");
      setModal({ type: "none" });
      void loadBookings(true);
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Unable to delete booking.");
    } finally {
      setUpdatingEventId(null);
    }
  }

  async function loadSlots(excludeEventId?: string) {
    setFormError("");
    setSlots([]);
    if (!form.sportId || !form.durationId || !form.date) return;
    setFormLoading(true);
    try {
      const response = await fetch("/api/portal/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sportId: form.sportId, durationId: form.durationId, date: form.date, excludeEventId }),
      });
      const data = (await response.json()) as { ok: boolean; slots?: Slot[]; message?: string };
      if (!response.ok || !data.ok) throw new Error(data.message || "Unable to load slots.");
      setSlots(data.slots ?? []);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to load slots.");
    } finally {
      setFormLoading(false);
    }
  }

  function openCreateModal() {
    setForm(getDefaultForm());
    setSlots([]);
    setFormError("");
    setModal({ type: "create" });
  }

  function openEditModal(booking: BookingRecord) {
    setForm(getDefaultForm(booking));
    setSlots([{ id: `${booking.startIso}_${booking.endIso}`, label: `${formatTime(booking.startIso)} - ${formatTime(booking.endIso)} (current)`, startIso: booking.startIso, endIso: booking.endIso }]);
    setFormError("");
    setModal({ type: "edit", booking });
  }

  async function submitBookingForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    if (!REGEX.name.test(form.clientName.trim())) {
      setFormError("Please enter a valid client name.");
      return;
    }
    if (!REGEX.pakistaniMobile.test(form.phone.replace(/[\s-]/g, ""))) {
      setFormError("Please enter a valid Pakistani mobile number.");
      return;
    }
    if (!form.startIso || !form.endIso) {
      setFormError("Please load and choose an available slot.");
      return;
    }
    setFormLoading(true);
    try {
      const endpoint = modal.type === "edit" ? "/api/portal/edit-booking" : "/api/portal/create-booking";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, eventId: modal.type === "edit" ? modal.booking.eventId : undefined }),
      });
      const data = (await response.json()) as { ok: boolean; booking?: BookingRecord; message?: string; code?: string };
      if (!response.ok || !data.ok || !data.booking) throw new Error(data.message || "Unable to save booking.");
      setToast(modal.type === "edit" ? "Booking updated in Google Calendar." : "Booking created in Google Calendar.");
      setModal({ type: "none" });
      await loadBookings(true);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to save booking.");
    } finally {
      setFormLoading(false);
    }
  }

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();
    const sorted = bookings.filter((booking) => {
      if (statusFilter === "pending" && booking.status !== "pending") return false;
      if (statusFilter === "confirmed" && booking.status !== "confirmed") return false;
      if (statusFilter === "cancelled" && booking.status !== "cancelled") return false;
      if (statusFilter === "today" && !isInCurrentBusinessWindow(booking)) return false;
      if (statusFilter === "upcoming" && !isUpcomingAfterToday(booking)) return false;
      if (sportFilter !== "all" && booking.sportId !== sportFilter) return false;
      if (!query) return true;
      return [booking.bookingId, booking.clientName, booking.phone, booking.sportName, booking.status]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    });

    sorted.sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      if (sortKey === "startIso") return (new Date(a.startIso).getTime() - new Date(b.startIso).getTime()) * direction;
      if (sortKey === "status") return getStatusLabel(a.status).localeCompare(getStatusLabel(b.status)) * direction;
      if (sortKey === "sportName") return a.sportName.localeCompare(b.sportName) * direction;
      if (sortKey === "bookingId") return a.bookingId.localeCompare(b.bookingId) * direction;
      return a.clientName.localeCompare(b.clientName) * direction;
    });

    return sorted;
  }, [bookings, search, sportFilter, statusFilter, sortDirection, sortKey]);

  const sportCounts = useMemo(() => {
    return bookingSports.map((sport) => ({
      sport,
      count: bookings.filter((booking) => booking.sportId === sport.id && booking.status === "confirmed").length,
    }));
  }, [bookings]);

  if (!isAuthenticated) {
    return (
      <main className="min-h-[calc(100vh-8rem)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow)] backdrop-blur-xl sm:p-8">
          <div className="mb-8 text-center">
            <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]">
              <ShieldCheck className="h-7 w-7" />
            </span>
            <h1 className="mt-5 text-3xl font-black text-[color:var(--text)]">Admin Portal</h1>
            <p className="mt-2 text-sm font-medium text-[color:var(--muted)]">Sign in to manage Elite Courts booking requests.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-username" className="mb-2 block text-sm font-bold text-[color:var(--text)]">Username</label>
              <input id="admin-username" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" className="h-12 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 text-sm text-[color:var(--text)] focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/15" />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-2 block text-sm font-bold text-[color:var(--text)]">Password</label>
              <input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" className="h-12 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 text-sm text-[color:var(--text)] focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/15" />
            </div>
            {loginError && <p className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-600 dark:text-rose-200">{loginError}</p>}
            <button type="submit" disabled={isLoggingIn} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-5 text-sm font-black text-slate-950 shadow-[0_18px_60px_-24px_rgba(6,182,212,0.65)] transition hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:opacity-50">
              {isLoggingIn && <Loader2 className="h-4 w-4 animate-spin" />} Sign In
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[color:var(--accent-strong)]">Elite Courts Portal</p>
            <h1 className="mt-2 text-3xl font-black text-[color:var(--text)] sm:text-4xl">Booking Dashboard</h1>
            <p className="mt-2 max-w-3xl text-sm font-medium text-[color:var(--muted)]">
              Active current and future bookings synced from Google Calendar. Auto-refresh runs every {bookingSyncConfig.adminPortalRefreshSeconds} seconds.
            </p>
            {lastUpdated && <p className="mt-2 text-xs font-bold text-[color:var(--muted)]">Last updated: {formatDate(lastUpdated)} · {formatTime(lastUpdated)}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={openCreateModal} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-4 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
              <Plus className="h-4 w-4" /> Create Booking
            </button>
            <button type="button" onClick={() => loadBookings()} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 text-sm font-black text-[color:var(--text)] transition hover:-translate-y-0.5 hover:border-cyan-300/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35">
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
            <button type="button" onClick={handleLogout} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 text-sm font-black text-[color:var(--text)] transition hover:-translate-y-0.5 hover:border-cyan-300/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <StatCard label="Active Bookings" value={stats?.totalActive ?? bookings.length} icon={CalendarDays} />
          <StatCard label="Pending Requests" value={stats?.pending ?? 0} icon={Loader2} />
          <StatCard label="Confirmed" value={stats?.confirmed ?? 0} icon={CheckCircle2} />
          <StatCard label="Cancelled" value={stats?.cancelled ?? 0} icon={XCircle} />
          <StatCard label="Today Confirmed" value={stats?.todayConfirmed ?? 0} icon={Clock3} hint="Business day" />
          <StatCard label="Upcoming Confirmed" value={stats?.upcomingConfirmed ?? 0} icon={CalendarDays} hint="After today" />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
          <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[var(--shadow)] backdrop-blur-xl">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-black text-[color:var(--text)]">Booking Requests</h2>
                <p className="text-sm font-medium text-[color:var(--muted)]">Only current and future bookings are shown for active management.</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-[1fr_11rem_12rem]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)]" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search booking ID, name, phone..." className="h-12 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] pl-11 pr-4 text-sm text-[color:var(--text)] focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/15" />
              </label>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-12 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 text-sm font-bold text-[color:var(--text)] focus:outline-none focus:ring-2 focus:ring-cyan-400/15">
                <option value="active">All Active</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
              </select>
              <select value={sportFilter} onChange={(event) => setSportFilter(event.target.value)} className="h-12 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 text-sm font-bold text-[color:var(--text)] focus:outline-none focus:ring-2 focus:ring-cyan-400/15">
                <option value="all">All Sports</option>
                {bookingSports.map((sport) => <option key={sport.id} value={sport.id}>{sport.name}</option>)}
              </select>
            </div>

            {toast && <p className="mt-4 rounded-2xl bg-[color:var(--accent-soft)] px-4 py-3 text-sm font-bold text-[color:var(--accent-strong)]">{toast}</p>}
            {bookingsError && <p className="mt-4 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-600 dark:text-rose-200">{bookingsError}</p>}

            <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-[color:var(--border)]">
              <div className="hidden bg-[color:var(--surface-strong)] px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-[color:var(--muted)] lg:grid lg:grid-cols-[1.15fr_1fr_1fr_1fr_0.8fr_13rem]">
                {bookingTableColumns.map((column) => (
                  <button key={column.key} type="button" disabled={!column.sortable} onClick={() => toggleSort(column.key)} className={cn("text-left uppercase tracking-[0.14em]", column.sortable && "transition hover:text-[color:var(--accent-strong)]")}> 
                    {column.label}{sortKey === column.key && column.sortable ? (sortDirection === "asc" ? " ↑" : " ↓") : ""}
                  </button>
                ))}
              </div>

              {isLoadingBookings ? (
                <div className="flex items-center justify-center gap-2 px-4 py-12 text-sm font-bold text-[color:var(--muted)]"><Loader2 className="h-5 w-5 animate-spin" /> Loading bookings...</div>
              ) : filteredBookings.length === 0 ? (
                <div className="px-4 py-12 text-center text-sm font-bold text-[color:var(--muted)]">No active booking requests found.</div>
              ) : (
                <div className="divide-y divide-[color:var(--border)]">
                  {filteredBookings.map((booking) => (
                    <div key={booking.eventId} className={cn("grid gap-3 bg-[color:var(--surface)] px-4 py-4 text-sm lg:grid-cols-[1.15fr_1fr_1fr_1fr_0.8fr_13rem] lg:items-center", booking.status === "pending" && "bg-amber-400/[0.06]")}> 
                      <div>
                        <p className="font-black text-[color:var(--text)]">{booking.clientName}</p>
                        <p className="text-xs font-semibold text-[color:var(--muted)]">{booking.phone}</p>
                      </div>
                      <div className="font-bold text-[color:var(--text)]">{booking.sportName}</div>
                      <div>
                        <p className="font-bold text-[color:var(--text)]">{formatDate(booking.startIso)}</p>
                        <p className="text-xs font-semibold text-[color:var(--muted)]">{formatTime(booking.startIso)} - {formatTime(booking.endIso)} · {booking.durationMinutes} min</p>
                      </div>
                      <div><BookingStatusBadge status={booking.status} /></div>
                      <div className="text-xs font-black text-[color:var(--muted-strong)]">{booking.bookingId}</div>
                      <div className="flex flex-wrap gap-2">
                        {booking.status !== "cancelled" && (
                          <button type="button" onClick={() => openEditModal(booking)} className="rounded-full border border-[color:var(--border)] px-3 py-2 text-xs font-black text-[color:var(--text)] transition hover:border-cyan-300/45 hover:bg-[color:var(--surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35"><Edit3 className="mr-1 inline h-3.5 w-3.5" />Edit</button>
                        )}
                        {booking.status !== "confirmed" && booking.status !== "cancelled" && (
                          <button type="button" disabled={updatingEventId === booking.eventId} onClick={() => updateStatus(booking.eventId, "confirmed")} className="rounded-full bg-emerald-500 px-3 py-2 text-xs font-black text-slate-950 transition hover:-translate-y-0.5 disabled:opacity-50">Confirm</button>
                        )}
                        {booking.status !== "cancelled" && (
                          <button type="button" onClick={() => setModal({ type: "cancel", booking })} className="rounded-full bg-rose-500/12 px-3 py-2 text-xs font-black text-rose-600 transition hover:bg-rose-500/18 dark:text-rose-200">Cancel</button>
                        )}
                        {booking.status === "cancelled" && (
                          <button type="button" onClick={() => setModal({ type: "delete", booking })} className="rounded-full bg-rose-600 px-3 py-2 text-xs font-black text-white transition hover:-translate-y-0.5"><Trash2 className="mr-1 inline h-3.5 w-3.5" />Delete</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[var(--shadow)] backdrop-blur-xl">
              <h2 className="text-lg font-black text-[color:var(--text)]">Confirmed by Sport</h2>
              <div className="mt-4 space-y-3">
                {sportCounts.map(({ sport, count }) => (
                  <div key={sport.id} className="flex items-center justify-between gap-3 rounded-2xl bg-[color:var(--surface-strong)] px-4 py-3">
                    <span className="text-sm font-bold text-[color:var(--text)]">{sport.name}</span>
                    <span className="rounded-full bg-[color:var(--accent-soft)] px-2.5 py-1 text-xs font-black text-[color:var(--accent-strong)]">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[var(--shadow)] backdrop-blur-xl">
              <h2 className="text-lg font-black text-[color:var(--text)]">Workflow</h2>
              <ol className="mt-4 space-y-3 text-sm font-medium text-[color:var(--muted)]">
                <li>1. Customer or admin creates a request.</li>
                <li>2. Chatbot requests start as Pending.</li>
                <li>3. Admin confirms or cancels.</li>
                <li>4. Google Calendar updates immediately.</li>
              </ol>
            </div>
          </aside>
        </div>
      </div>

      {modal.type === "cancel" && (
        <ModalShell title="Cancel Booking" onClose={() => setModal({ type: "none" })}>
          <div className="space-y-5 p-5">
            <div className="rounded-2xl bg-[color:var(--surface)] p-4 text-sm leading-7 text-[color:var(--text)]">
              <p><strong>Booking ID:</strong> {modal.booking.bookingId}</p>
              <p><strong>Client:</strong> {modal.booking.clientName}</p>
              <p><strong>Sport:</strong> {modal.booking.sportName}</p>
              <p><strong>Time:</strong> {formatDate(modal.booking.startIso)} · {formatTime(modal.booking.startIso)} - {formatTime(modal.booking.endIso)}</p>
            </div>
            <label className="block text-sm font-bold text-[color:var(--text)]">Cancellation reason <span className="text-[color:var(--muted)]">(optional)</span></label>
            <textarea value={cancelReason} onChange={(event) => setCancelReason(event.target.value)} rows={3} className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm text-[color:var(--text)] focus:outline-none focus:ring-2 focus:ring-cyan-400/15" />
            <div className="flex flex-wrap justify-end gap-3">
              <button type="button" onClick={() => setModal({ type: "none" })} className="rounded-full border border-[color:var(--border)] px-4 py-2 text-sm font-black text-[color:var(--text)]">Keep Booking</button>
              <button type="button" disabled={updatingEventId === modal.booking.eventId} onClick={() => updateStatus(modal.booking.eventId, "cancelled", cancelReason)} className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-sm font-black text-white disabled:opacity-50">{updatingEventId === modal.booking.eventId && <Loader2 className="h-4 w-4 animate-spin" />}Confirm Cancellation</button>
            </div>
          </div>
        </ModalShell>
      )}

      {modal.type === "delete" && (
        <ModalShell title="Delete Cancelled Booking" onClose={() => setModal({ type: "none" })}>
          <div className="space-y-5 p-5">
            <p className="text-sm leading-7 text-[color:var(--muted)]">This will remove the cancelled event from Google Calendar. Pending or confirmed bookings cannot be deleted.</p>
            <div className="rounded-2xl bg-[color:var(--surface)] p-4 text-sm leading-7 text-[color:var(--text)]">
              <p><strong>Booking ID:</strong> {modal.booking.bookingId}</p>
              <p><strong>Client:</strong> {modal.booking.clientName}</p>
              <p><strong>Sport:</strong> {modal.booking.sportName}</p>
            </div>
            <div className="flex flex-wrap justify-end gap-3">
              <button type="button" onClick={() => setModal({ type: "none" })} className="rounded-full border border-[color:var(--border)] px-4 py-2 text-sm font-black text-[color:var(--text)]">Close</button>
              <button type="button" disabled={updatingEventId === modal.booking.eventId} onClick={() => deleteBooking(modal.booking.eventId)} className="inline-flex items-center gap-2 rounded-full bg-rose-700 px-4 py-2 text-sm font-black text-white disabled:opacity-50"><Trash2 className="h-4 w-4" />Delete Event</button>
            </div>
          </div>
        </ModalShell>
      )}

      {(modal.type === "create" || modal.type === "edit") && (
        <ModalShell title={modal.type === "edit" ? "Edit Booking" : "Create Booking"} onClose={() => setModal({ type: "none" })}>
          <form onSubmit={submitBookingForm} className="space-y-5 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-bold text-[color:var(--text)]">Sport
                <select value={form.sportId} onChange={(event) => setForm((current) => ({ ...current, sportId: event.target.value, startIso: "", endIso: "" }))} className="h-11 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-sm">
                  {bookingSports.map((sport) => <option key={sport.id} value={sport.id}>{sport.name}</option>)}
                </select>
              </label>
              <label className="space-y-2 text-sm font-bold text-[color:var(--text)]">Duration
                <select value={form.durationId} onChange={(event) => setForm((current) => ({ ...current, durationId: event.target.value, startIso: "", endIso: "" }))} className="h-11 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-sm">
                  {bookingDurations.map((duration) => <option key={duration.id} value={duration.id}>{duration.label}</option>)}
                </select>
              </label>
              <label className="space-y-2 text-sm font-bold text-[color:var(--text)]">Client Name
                <input value={form.clientName} onChange={(event) => setForm((current) => ({ ...current, clientName: event.target.value }))} className="h-11 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-sm" />
              </label>
              <label className="space-y-2 text-sm font-bold text-[color:var(--text)]">Phone
                <input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} placeholder="03001234567" className="h-11 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-sm" />
              </label>
              <label className="space-y-2 text-sm font-bold text-[color:var(--text)]">Date
                <input type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value, startIso: "", endIso: "" }))} className="h-11 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-sm" />
              </label>
              <label className="space-y-2 text-sm font-bold text-[color:var(--text)]">Status
                <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as "pending" | "confirmed" }))} className="h-11 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-sm">
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                </select>
              </label>
            </div>
            <div className="space-y-3 rounded-2xl bg-[color:var(--surface)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-black text-[color:var(--text)]">Available Slots</p>
                <button type="button" onClick={() => loadSlots(modal.type === "edit" ? modal.booking.eventId : undefined)} disabled={formLoading} className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-4 py-2 text-xs font-black text-slate-950 disabled:opacity-50">{formLoading && <Loader2 className="h-4 w-4 animate-spin" />}Load Slots</button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {slots.map((slot) => (
                  <button key={slot.id} type="button" onClick={() => setForm((current) => ({ ...current, startIso: slot.startIso, endIso: slot.endIso }))} className={cn("rounded-2xl border px-3 py-2 text-left text-xs font-black transition", form.startIso === slot.startIso ? "border-cyan-300 bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]" : "border-[color:var(--border)] bg-[color:var(--surface-strong)] text-[color:var(--text)] hover:border-cyan-300/45")}>{slot.label}</button>
                ))}
                {slots.length === 0 && <p className="text-xs font-semibold text-[color:var(--muted)]">Load slots after choosing sport, duration, and date.</p>}
              </div>
            </div>
            {formError && <p className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-600 dark:text-rose-200">{formError}</p>}
            <div className="flex flex-wrap justify-end gap-3">
              <button type="button" onClick={() => setModal({ type: "none" })} className="rounded-full border border-[color:var(--border)] px-4 py-2 text-sm font-black text-[color:var(--text)]">Close</button>
              <button type="submit" disabled={formLoading} className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-2 text-sm font-black text-slate-950 disabled:opacity-50">{formLoading && <Loader2 className="h-4 w-4 animate-spin" />}{modal.type === "edit" ? "Save Changes" : "Create Booking"}</button>
            </div>
          </form>
        </ModalShell>
      )}
    </main>
  );
}
