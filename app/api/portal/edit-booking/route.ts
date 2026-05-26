import { NextResponse } from "next/server";
import { z } from "zod";
import { getBookingDurationById } from "@/data/bookingDurations";
import { getBookingSportById } from "@/data/sports";
import {
  generateAvailableSlots,
  getBusinessWindowForDate,
  isDateInBookingWindow,
  sanitizeText,
  validateName,
  validatePakistaniMobile,
} from "@/lib/bookingUtils";
import { getCalendarBookingByEventId, listBookingsForAvailability, updateCalendarBooking } from "@/lib/googleCalendar";
import { requireAdminSession } from "@/lib/portalAuth";

export const runtime = "nodejs";

const schema = z.object({
  eventId: z.string().min(1),
  sportId: z.string().min(1),
  durationId: z.string().min(1),
  clientName: z.string().min(1),
  phone: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startIso: z.string().datetime(),
  endIso: z.string().datetime(),
  status: z.enum(["pending", "confirmed"]).default("confirmed"),
});

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const payload = schema.parse(await request.json());
    const existing = await getCalendarBookingByEventId(payload.eventId);
    if (!existing) return NextResponse.json({ ok: false, message: "Booking not found." }, { status: 404 });
    if (new Date(existing.endIso).getTime() <= Date.now()) return NextResponse.json({ ok: false, code: "PAST_BOOKING", message: "Past bookings cannot be edited." }, { status: 409 });
    if (existing.status === "cancelled") return NextResponse.json({ ok: false, message: "Cancelled bookings cannot be edited. Create a new booking instead." }, { status: 400 });

    const sport = getBookingSportById(payload.sportId);
    const duration = getBookingDurationById(payload.durationId);
    const clientName = validateName(payload.clientName);
    const phone = validatePakistaniMobile(payload.phone);

    if (!sport || !duration || !clientName || !phone) return NextResponse.json({ ok: false, message: "Please check the booking details." }, { status: 400 });
    if (!isDateInBookingWindow(payload.date)) return NextResponse.json({ ok: false, message: "Selected date is outside the allowed booking window." }, { status: 400 });

    const businessWindow = getBusinessWindowForDate(payload.date);
    const existingBookings = (await listBookingsForAvailability({
      timeMin: businessWindow.start.toISOString(),
      timeMax: businessWindow.end.toISOString(),
      sportId: sport.id,
    })).filter((booking) => booking.eventId !== payload.eventId);
    const availableSlots = generateAvailableSlots({ date: payload.date, durationMinutes: duration.minutes, sportId: sport.id, existingBookings });
    const requestedSlot = availableSlots.find((slot) => slot.startIso === payload.startIso && slot.endIso === payload.endIso);
    if (!requestedSlot) return NextResponse.json({ ok: false, code: "SLOT_TAKEN", message: "This slot is no longer available." }, { status: 409 });

    const booking = await updateCalendarBooking({
      eventId: payload.eventId,
      clientName: sanitizeText(clientName, 50),
      phone,
      sportId: sport.id,
      sportName: sport.name,
      durationMinutes: duration.minutes,
      status: payload.status,
      startIso: requestedSlot.startIso,
      endIso: requestedSlot.endIso,
    });
    return NextResponse.json({ ok: true, booking });
  } catch (error) {
    const status = error instanceof Error && error.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ ok: false, message: status === 401 ? "Unauthorized" : "Unable to edit booking." }, { status });
  }
}
