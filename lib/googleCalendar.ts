import { createSign } from "node:crypto";
import { businessHours } from "@/data/businessHours";
import { type BookingStatusId } from "@/data/bookingStatuses";
import { bookingSports, getBookingSportById } from "@/data/sports";
import {
  buildEventDescription,
  buildEventTitle,
  eventLooksLikeSport,
  isActiveBooking,
  normalizeStatus,
  parseDescriptionFields,
  type BookingInput,
  type BookingRecord,
} from "@/lib/bookingUtils";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3";
const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar";

interface GoogleCalendarDateTime {
  date?: string;
  dateTime?: string;
  timeZone?: string;
}

interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  colorId?: string;
  status?: string;
  created?: string;
  updated?: string;
  start?: GoogleCalendarDateTime;
  end?: GoogleCalendarDateTime;
  extendedProperties?: {
    private?: Record<string, string | undefined>;
  };
}

interface GoogleCalendarListResponse {
  items?: GoogleCalendarEvent[];
  nextPageToken?: string;
}

let cachedToken: { token: string; expiresAt: number } | null = null;

function base64url(input: string | Buffer) {
  return Buffer.from(input).toString("base64url");
}

function getPrivateKey() {
  return process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
}

export function isGoogleCalendarConfigured() {
  return Boolean(process.env.GOOGLE_CALENDAR_ID && process.env.GOOGLE_CLIENT_EMAIL && getPrivateKey());
}

function getCalendarId() {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) throw new Error("GOOGLE_CALENDAR_ID is not configured.");
  return calendarId;
}

async function getAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.token;

  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = getPrivateKey();

  if (!clientEmail || !privateKey) {
    throw new Error("Google Calendar service account credentials are not configured.");
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: clientEmail,
    scope: CALENDAR_SCOPE,
    aud: TOKEN_URL,
    exp: nowSeconds + 3600,
    iat: nowSeconds,
  };

  const unsignedJwt = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsignedJwt);
  signer.end();
  const signature = signer.sign(privateKey, "base64url");
  const assertion = `${unsignedJwt}.${signature}`;

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Unable to authenticate with Google Calendar: ${response.status} ${text}`);
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };
  cachedToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

async function calendarFetch<T>(path: string, init?: RequestInit) {
  const token = await getAccessToken();
  const response = await fetch(`${CALENDAR_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google Calendar API error: ${response.status} ${text}`);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function getEventDateTime(value: GoogleCalendarDateTime | undefined) {
  return value?.dateTime ?? (value?.date ? `${value.date}T00:00:00+05:00` : undefined);
}

function getManualSport(summary: string | undefined, description: string | undefined, sportId?: string, sportName?: string) {
  if (sportId) return getBookingSportById(sportId);
  const descriptionSport = sportName?.toLowerCase();
  return bookingSports.find((sport) => {
    const name = sport.name.toLowerCase();
    return descriptionSport === name || summary?.toLowerCase().includes(name) || summary?.toLowerCase().includes(sport.id);
  });
}

export function calendarEventToBookingRecord(event: GoogleCalendarEvent): BookingRecord | null {
  const privateProps = event.extendedProperties?.private ?? {};
  const descriptionFields = parseDescriptionFields(event.description);
  const startIso = getEventDateTime(event.start);
  const endIso = getEventDateTime(event.end);

  if (!event.id || !startIso || !endIso) return null;

  const manualSport = getManualSport(event.summary, event.description, privateProps.sportId, descriptionFields.sport);
  const bookingId = privateProps.bookingId ?? descriptionFields.bookingid ?? `CAL-${event.id.slice(0, 10).toUpperCase()}`;
  const status = normalizeStatus(privateProps.status ?? descriptionFields.status ?? (event.status === "cancelled" ? "cancelled" : "pending"));
  const durationMinutes = Number(privateProps.durationMinutes ?? descriptionFields.duration ?? 0);

  return {
    eventId: event.id,
    bookingId,
    clientName: privateProps.clientName ?? descriptionFields.name ?? "Calendar Booking",
    phone: privateProps.phone ?? descriptionFields.phone ?? "",
    sportId: privateProps.sportId ?? manualSport?.id ?? "manual",
    sportName: privateProps.sportName ?? descriptionFields.sport ?? manualSport?.name ?? "Unmapped Calendar Event",
    durationMinutes: Number.isFinite(durationMinutes) && durationMinutes > 0 ? durationMinutes : Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000),
    status,
    channel: privateProps.channel ?? descriptionFields.channel ?? (privateProps.bookingId ? "Chatbot" : "Google Calendar"),
    startIso: new Date(startIso).toISOString(),
    endIso: new Date(endIso).toISOString(),
    createdAt: privateProps.createdAt ?? descriptionFields.created ?? event.created,
    updatedAt: privateProps.updatedAt ?? event.updated,
    summary: event.summary,
  };
}

export async function listCalendarBookings(params: {
  timeMin: string;
  timeMax: string;
  includeNonChatbot?: boolean;
}) {
  if (!isGoogleCalendarConfigured()) {
    throw new Error("Google Calendar is not configured.");
  }

  const calendarId = encodeURIComponent(getCalendarId());
  const bookings: BookingRecord[] = [];
  let pageToken: string | undefined;

  do {
    const search = new URLSearchParams({
      singleEvents: "true",
      orderBy: "startTime",
      timeMin: params.timeMin,
      timeMax: params.timeMax,
      maxResults: "2500",
      showDeleted: "false",
    });

    if (pageToken) search.set("pageToken", pageToken);

    const data = await calendarFetch<GoogleCalendarListResponse>(`/calendars/${calendarId}/events?${search.toString()}`);
    for (const event of data.items ?? []) {
      const record = calendarEventToBookingRecord(event);
      if (!record) continue;
      if (!params.includeNonChatbot && record.channel.toLowerCase() !== "chatbot") continue;
      bookings.push(record);
    }

    pageToken = data.nextPageToken;
  } while (pageToken);

  return bookings;
}

export async function listBookingsForAvailability(params: { timeMin: string; timeMax: string; sportId: string }) {
  const allBookings = await listCalendarBookings({ timeMin: params.timeMin, timeMax: params.timeMax, includeNonChatbot: true });
  return allBookings.filter((booking) => booking.sportId === params.sportId || eventLooksLikeSport(booking.summary, params.sportId));
}

function buildEventBody(input: BookingInput) {
  const sport = getBookingSportById(input.sportId);
  const record: BookingRecord = {
    eventId: "",
    bookingId: input.bookingId,
    clientName: input.clientName,
    phone: input.phone,
    sportId: input.sportId,
    sportName: input.sportName,
    durationMinutes: input.durationMinutes,
    status: input.status,
    channel: input.channel,
    startIso: input.startIso,
    endIso: input.endIso,
    createdAt: input.createdAt,
  };

  return {
    summary: buildEventTitle(input.status, input.sportName, input.clientName),
    description: buildEventDescription(record),
    colorId: sport?.calendarColorId,
    start: { dateTime: input.startIso, timeZone: businessHours.timezone },
    end: { dateTime: input.endIso, timeZone: businessHours.timezone },
    extendedProperties: {
      private: {
        bookingId: input.bookingId,
        clientName: input.clientName,
        phone: input.phone,
        sportId: input.sportId,
        sportName: input.sportName,
        durationMinutes: String(input.durationMinutes),
        status: input.status,
        channel: input.channel,
        createdAt: input.createdAt,
      },
    },
  };
}

export async function createCalendarBooking(input: BookingInput) {
  if (!isGoogleCalendarConfigured()) throw new Error("Google Calendar is not configured.");
  const calendarId = encodeURIComponent(getCalendarId());
  const created = await calendarFetch<GoogleCalendarEvent>(`/calendars/${calendarId}/events`, {
    method: "POST",
    body: JSON.stringify(buildEventBody(input)),
  });
  const parsed = calendarEventToBookingRecord(created);
  if (!parsed) throw new Error("Google Calendar returned an invalid booking event.");
  return parsed;
}

export async function createPendingCalendarBooking(input: BookingInput) {
  return createCalendarBooking(input);
}

export async function getCalendarBookingByEventId(eventId: string) {
  if (!isGoogleCalendarConfigured()) throw new Error("Google Calendar is not configured.");
  const calendarId = encodeURIComponent(getCalendarId());
  const event = await calendarFetch<GoogleCalendarEvent>(`/calendars/${calendarId}/events/${encodeURIComponent(eventId)}`);
  return calendarEventToBookingRecord(event);
}

export async function findBookingById(bookingId: string) {
  if (!isGoogleCalendarConfigured()) throw new Error("Google Calendar is not configured.");
  const calendarId = encodeURIComponent(getCalendarId());
  const now = new Date();
  const timeMin = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
  const timeMax = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();
  const search = new URLSearchParams({
    singleEvents: "true",
    orderBy: "startTime",
    timeMin,
    timeMax,
    maxResults: "20",
    privateExtendedProperty: `bookingId=${bookingId}`,
  });

  const data = await calendarFetch<GoogleCalendarListResponse>(`/calendars/${calendarId}/events?${search.toString()}`);
  return (data.items ?? []).map(calendarEventToBookingRecord).find((booking): booking is BookingRecord => Boolean(booking)) ?? null;
}

export async function findActiveBookingsByPhone(phone: string) {
  const now = new Date();
  const timeMin = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const timeMax = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString();
  const bookings = await listCalendarBookings({ timeMin, timeMax, includeNonChatbot: true });
  return bookings
    .filter((booking) => booking.phone === phone)
    .filter((booking) => isActiveBooking(booking, now))
    .filter((booking) => booking.status === "pending" || booking.status === "confirmed")
    .sort((a, b) => new Date(a.startIso).getTime() - new Date(b.startIso).getTime());
}

export async function countActivePendingBookingsByPhone(phone: string) {
  const bookings = await findActiveBookingsByPhone(phone);
  return bookings.filter((booking) => booking.status === "pending").length;
}

export async function getAdminBookings() {
  const now = new Date();
  const timeMin = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const timeMax = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString();
  const bookings = await listCalendarBookings({ timeMin, timeMax, includeNonChatbot: true });
  return bookings
    .filter((booking) => isActiveBooking(booking, now))
    .sort((a, b) => new Date(a.startIso).getTime() - new Date(b.startIso).getTime());
}

export async function updateCalendarBookingStatus(params: { eventId: string; status: "pending" | "confirmed" | "cancelled"; reason?: string }) {
  if (!isGoogleCalendarConfigured()) throw new Error("Google Calendar is not configured.");

  const calendarId = encodeURIComponent(getCalendarId());
  const eventId = encodeURIComponent(params.eventId);
  const event = await calendarFetch<GoogleCalendarEvent>(`/calendars/${calendarId}/events/${eventId}`);
  const record = calendarEventToBookingRecord(event);

  if (!record) throw new Error("Booking event was not found or is missing booking metadata.");
  if (!isActiveBooking(record)) throw new Error("PAST_BOOKING");

  const updatedRecord: BookingRecord = { ...record, status: params.status, updatedAt: new Date().toISOString() };
  const privateProps = {
    ...(event.extendedProperties?.private ?? {}),
    status: params.status,
    updatedAt: updatedRecord.updatedAt,
    ...(params.reason ? { cancellationReason: params.reason } : {}),
  };

  const updated = await calendarFetch<GoogleCalendarEvent>(`/calendars/${calendarId}/events/${eventId}`, {
    method: "PATCH",
    body: JSON.stringify({
      summary: buildEventTitle(params.status, record.sportName, record.clientName),
      description: `${buildEventDescription(updatedRecord)}${params.reason ? `\nCancellation Reason: ${params.reason}` : ""}`,
      extendedProperties: { private: privateProps },
    }),
  });

  const parsed = calendarEventToBookingRecord(updated);
  if (!parsed) throw new Error("Google Calendar returned an invalid updated booking event.");
  return parsed;
}

export async function updateCalendarBooking(params: {
  eventId: string;
  clientName: string;
  phone: string;
  sportId: string;
  sportName: string;
  durationMinutes: number;
  status: "pending" | "confirmed" | "cancelled";
  startIso: string;
  endIso: string;
}) {
  if (!isGoogleCalendarConfigured()) throw new Error("Google Calendar is not configured.");
  const calendarId = encodeURIComponent(getCalendarId());
  const eventId = encodeURIComponent(params.eventId);
  const event = await calendarFetch<GoogleCalendarEvent>(`/calendars/${calendarId}/events/${eventId}`);
  const existing = calendarEventToBookingRecord(event);
  if (!existing) throw new Error("Booking event was not found.");
  if (!isActiveBooking(existing)) throw new Error("PAST_BOOKING");
  if (existing.status === "cancelled") throw new Error("CANCELLED_BOOKING");

  const sport = getBookingSportById(params.sportId);
  const updatedRecord: BookingRecord = {
    ...existing,
    clientName: params.clientName,
    phone: params.phone,
    sportId: params.sportId,
    sportName: params.sportName,
    durationMinutes: params.durationMinutes,
    status: params.status,
    startIso: params.startIso,
    endIso: params.endIso,
    updatedAt: new Date().toISOString(),
  };

  const updated = await calendarFetch<GoogleCalendarEvent>(`/calendars/${calendarId}/events/${eventId}`, {
    method: "PATCH",
    body: JSON.stringify({
      summary: buildEventTitle(params.status, params.sportName, params.clientName),
      description: buildEventDescription(updatedRecord),
      colorId: sport?.calendarColorId,
      start: { dateTime: params.startIso, timeZone: businessHours.timezone },
      end: { dateTime: params.endIso, timeZone: businessHours.timezone },
      extendedProperties: {
        private: {
          ...(event.extendedProperties?.private ?? {}),
          bookingId: existing.bookingId,
          clientName: params.clientName,
          phone: params.phone,
          sportId: params.sportId,
          sportName: params.sportName,
          durationMinutes: String(params.durationMinutes),
          status: params.status,
          channel: existing.channel || "Admin Portal",
          updatedAt: updatedRecord.updatedAt,
        },
      },
    }),
  });

  const parsed = calendarEventToBookingRecord(updated);
  if (!parsed) throw new Error("Google Calendar returned an invalid updated booking event.");
  return parsed;
}

export async function deleteCancelledCalendarBooking(eventId: string) {
  if (!isGoogleCalendarConfigured()) throw new Error("Google Calendar is not configured.");
  const record = await getCalendarBookingByEventId(eventId);
  if (!record) throw new Error("Booking event was not found.");
  if (record.status !== "cancelled") throw new Error("Only cancelled bookings can be deleted.");

  const calendarId = encodeURIComponent(getCalendarId());
  await calendarFetch<void>(`/calendars/${calendarId}/events/${encodeURIComponent(eventId)}`, { method: "DELETE" });
  return { ok: true };
}
