import { randomBytes } from "node:crypto";
import { businessHours, type BusinessDayHours, type Weekday, weekdayOrder } from "@/data/businessHours";
import { bookingStatuses, type BookingStatusId } from "@/data/bookingStatuses";
import { getBookingSportById } from "@/data/sports";
import { REGEX } from "@/lib/regex";

export interface BookingSlot {
  id: string;
  label: string;
  startIso: string;
  endIso: string;
}

export interface BookingRecord {
  eventId: string;
  bookingId: string;
  clientName: string;
  phone: string;
  sportId: string;
  sportName: string;
  durationMinutes: number;
  status: BookingStatusId;
  channel: string;
  startIso: string;
  endIso: string;
  createdAt?: string;
  updatedAt?: string;
  summary?: string;
}

export interface BookingInput {
  bookingId: string;
  clientName: string;
  phone: string;
  sportId: string;
  sportName: string;
  durationMinutes: number;
  status: BookingStatusId;
  channel: string;
  startIso: string;
  endIso: string;
  createdAt: string;
}

const weekdayIndexMap: Record<Weekday, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

const weekdayByUtcIndex = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;

export function sanitizeText(value: string, maxLength = 120) {
  return value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export function validateName(value: string) {
  const clean = sanitizeText(value, 50);
  return REGEX.name.test(clean) ? clean : null;
}

export function validatePakistaniMobile(value: string) {
  const clean = value.replace(/[\s-]/g, "").trim();
  return REGEX.pakistaniMobile.test(clean) ? clean : null;
}

export function validateBookingId(value: string) {
  const clean = value.trim().toUpperCase();
  return REGEX.bookingId.test(clean) ? clean : null;
}

export function normalizeStatus(value: string | null | undefined): BookingStatusId {
  const normalized = (value ?? "pending").toLowerCase().replace(/\s+/g, "_") as BookingStatusId;
  return bookingStatuses[normalized] ? normalized : "pending";
}

export function getKarachiDateParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: businessHours.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
  const hour = Number(parts.hour === "24" ? "0" : parts.hour);

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour,
    minute: Number(parts.minute),
    second: Number(parts.second),
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${String(hour).padStart(2, "0")}:${parts.minute}`,
  };
}

function dateOnlyUtc(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function addDaysToDateString(dateString: string, days: number) {
  const date = dateOnlyUtc(dateString);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function getWeekdayForDate(dateString: string): Weekday {
  return weekdayByUtcIndex[dateOnlyUtc(dateString).getUTCDay()];
}

export function getBusinessHoursForDate(dateString: string): BusinessDayHours {
  return businessHours.weeklyHours[getWeekdayForDate(dateString)];
}

export function karachiDateTimeToDate(dateString: string, time: string) {
  return new Date(`${dateString}T${time}:00+05:00`);
}

export function getBusinessWindowForDate(dateString: string) {
  const hours = getBusinessHoursForDate(dateString);
  const start = karachiDateTimeToDate(dateString, hours.open);
  const endDate = hours.closesNextDay || hours.close <= hours.open ? addDaysToDateString(dateString, 1) : dateString;
  const end = karachiDateTimeToDate(endDate, hours.close);
  return { businessDate: dateString, start, end, hours };
}

export function getCurrentBusinessDate(now = new Date()) {
  const today = getKarachiDateParts(now).date;
  const todayWindow = getBusinessWindowForDate(today);
  const previousDate = addDaysToDateString(today, -1);
  const previousWindow = getBusinessWindowForDate(previousDate);

  if (now >= previousWindow.start && now < previousWindow.end) return previousDate;
  if (now >= todayWindow.start && now < todayWindow.end) return today;
  return today;
}

export function getCurrentBusinessWindow(now = new Date()) {
  return getBusinessWindowForDate(getCurrentBusinessDate(now));
}

export function getAllowedBookingWindow(now = new Date()) {
  const startDate = getCurrentBusinessDate(now);
  const dayIndex = dateOnlyUtc(startDate).getUTCDay();
  const daysUntilThisSunday = (7 - dayIndex) % 7;
  const endDate = addDaysToDateString(startDate, daysUntilThisSunday + 7);
  return { startDate, endDate };
}

export function isDateInBookingWindow(dateString: string, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
  const { startDate, endDate } = getAllowedBookingWindow(now);
  return dateString >= startDate && dateString <= endDate;
}

export function formatDateForInput(now = new Date()) {
  return getKarachiDateParts(now).date;
}

export function formatTime(iso: string) {
  return new Intl.DateTimeFormat("en-PK", {
    timeZone: businessHours.timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

export function formatSlotLabel(startIso: string, endIso: string) {
  return `${formatTime(startIso)} - ${formatTime(endIso)}`;
}

export function formatBookingDate(startIso: string) {
  return new Intl.DateTimeFormat("en-PK", {
    timeZone: businessHours.timezone,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(startIso));
}

export function formatBookingTimeRange(startIso: string, endIso: string) {
  return formatSlotLabel(startIso, endIso);
}

export function formatBusinessTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  const date = new Date(Date.UTC(2026, 0, 1, hour, minute));
  return new Intl.DateTimeFormat("en-PK", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "UTC" }).format(date);
}

export function getBusinessHoursSummary() {
  const entries = weekdayOrder.map((weekday) => businessHours.weeklyHours[weekday]);
  const first = entries[0];
  const sameEveryDay = entries.every(
    (item) => item.open === first.open && item.close === first.close && item.closesNextDay === first.closesNextDay && item.closed === first.closed,
  );

  if (sameEveryDay) {
    return `Monday - Sunday: ${formatBusinessTime(first.open)} - ${formatBusinessTime(first.close)}${first.closesNextDay ? " next day" : ""}`;
  }

  return weekdayOrder
    .map((weekday) => {
      const item = businessHours.weeklyHours[weekday];
      const label = weekday.charAt(0).toUpperCase() + weekday.slice(1);
      if (item.closed) return `${label}: Closed`;
      return `${label}: ${formatBusinessTime(item.open)} - ${formatBusinessTime(item.close)}${item.closesNextDay ? " next day" : ""}`;
    })
    .join("\n");
}

function intervalsOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && aEnd > bStart;
}

export function isBlockingBookingStatus(status: string | null | undefined) {
  const normalized = normalizeStatus(status);
  return normalized === "pending" || normalized === "confirmed";
}

export function isActiveBooking(booking: Pick<BookingRecord, "endIso" | "status">, now = new Date()) {
  return new Date(booking.endIso).getTime() > now.getTime() && booking.status !== "rejected" && booking.status !== "completed" && booking.status !== "no_show";
}

export function isCustomerVisibleBooking(booking: Pick<BookingRecord, "endIso" | "status">, now = new Date()) {
  return new Date(booking.endIso).getTime() > now.getTime() && (booking.status === "pending" || booking.status === "confirmed");
}

export function isBookingInBusinessWindow(booking: BookingRecord, window: { start: Date; end: Date }) {
  return new Date(booking.startIso) < window.end && new Date(booking.endIso) > window.start;
}

export function generateAvailableSlots(params: {
  date: string;
  durationMinutes: number;
  sportId: string;
  existingBookings: readonly BookingRecord[];
  now?: Date;
}) {
  const now = params.now ?? new Date();
  const { start, end, hours } = getBusinessWindowForDate(params.date);
  const slots: BookingSlot[] = [];
  if (hours.closed) return slots;

  const stepMs = params.durationMinutes * 60 * 1000;
  const bufferMs = businessHours.slotBufferMinutes * 60 * 1000;
  const blocked = params.existingBookings.filter(
    (booking) => booking.sportId === params.sportId && isBlockingBookingStatus(booking.status),
  );

  for (let cursor = start.getTime(); cursor + stepMs <= end.getTime(); cursor += stepMs) {
    const slotStart = new Date(cursor);
    const slotEnd = new Date(cursor + stepMs);

    if (slotStart.getTime() <= now.getTime() + bufferMs) continue;

    const hasConflict = blocked.some((booking) =>
      intervalsOverlap(slotStart, slotEnd, new Date(booking.startIso), new Date(booking.endIso)),
    );

    if (!hasConflict) {
      const startIso = slotStart.toISOString();
      const endIso = slotEnd.toISOString();
      slots.push({ id: `${startIso}_${endIso}`, label: formatSlotLabel(startIso, endIso), startIso, endIso });
    }
  }

  return slots;
}

export function getSportCode(sportId: string) {
  const codeMap: Record<string, string> = {
    padel: "PDL",
    pickleball: "PKL",
    cricket: "CRT",
    "table-tennis": "TT",
    badminton: "BDM",
  };
  return codeMap[sportId] ?? (sportId.replace(/[^a-z0-9]/gi, "").slice(0, 3).toUpperCase() || "BK");
}

export function generateBookingId(sportId: string, now = new Date()) {
  const { year, month, day } = getKarachiDateParts(now);
  const date = `${String(year).slice(-2)}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}`;
  const suffix = randomBytes(3).toString("base64url").replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(0, 4);
  return `EC-${getSportCode(sportId)}-${date}-${suffix}`;
}

export function buildEventDescription(params: BookingRecord | BookingInput) {
  const status = bookingStatuses[params.status] ?? bookingStatuses.pending;

  return [
    `Booking ID: ${params.bookingId}`,
    `Name: ${params.clientName}`,
    `Phone: ${params.phone}`,
    `Sport: ${params.sportName}`,
    `Duration: ${params.durationMinutes}`,
    `Channel: ${params.channel}`,
    `Status: ${status.label}`,
    `Created: ${params.createdAt ?? new Date().toISOString()}`,
    `Updated: ${("updatedAt" in params ? params.updatedAt : undefined) ?? ""}`,
  ].filter(Boolean).join("\n");
}

export function buildEventTitle(status: BookingStatusId, sportName: string, clientName: string) {
  const statusLabel = bookingStatuses[status]?.label ?? bookingStatuses.pending.label;
  return `${statusLabel} Booking - ${sportName} - ${clientName}`;
}

export function eventLooksLikeSport(summary: string | undefined, sportId: string) {
  const sport = getBookingSportById(sportId);
  if (!sport || !summary) return false;
  return summary.toLowerCase().includes(sport.name.toLowerCase()) || summary.toLowerCase().includes(sportId);
}

export function parseDescriptionFields(description: string | undefined) {
  const fields: Record<string, string> = {};
  for (const line of (description ?? "").split(/\r?\n/)) {
    const [rawKey, ...rest] = line.split(":");
    if (!rawKey || rest.length === 0) continue;
    const key = rawKey.trim().toLowerCase().replace(/\s+/g, "");
    fields[key] = rest.join(":").trim();
  }
  return fields;
}

export function getStatusStats(bookings: BookingRecord[], now = new Date()) {
  const currentBusinessWindow = getCurrentBusinessWindow(now);
  const active = bookings.filter((booking) => isActiveBooking(booking, now));
  const activePending = active.filter((booking) => booking.status === "pending");
  const activeConfirmed = active.filter((booking) => booking.status === "confirmed");

  return {
    totalActive: activePending.length + activeConfirmed.length,
    pending: activePending.length,
    confirmed: activeConfirmed.length,
    cancelled: active.filter((booking) => booking.status === "cancelled").length,
    todayConfirmed: activeConfirmed.filter((booking) => isBookingInBusinessWindow(booking, currentBusinessWindow)).length,
    upcomingConfirmed: activeConfirmed.filter((booking) => new Date(booking.startIso) >= currentBusinessWindow.end).length,
  };
}
