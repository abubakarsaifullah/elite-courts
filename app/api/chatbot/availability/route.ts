import { NextResponse } from "next/server";
import { z } from "zod";
import { getBookingDurationById } from "@/data/bookingDurations";
import { getBookingSportById } from "@/data/sports";
import { getBusinessWindowForDate, generateAvailableSlots, isDateInBookingWindow } from "@/lib/bookingUtils";
import { isGoogleCalendarConfigured, listBookingsForAvailability } from "@/lib/googleCalendar";
import { checkRateLimit, getClientKey } from "@/lib/rateLimit";

export const runtime = "nodejs";

const schema = z.object({
  sportId: z.string().min(1),
  durationId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function POST(request: Request) {
  try {
    const rateLimit = checkRateLimit(getClientKey(request, "chatbot-availability"), { limit: 80, windowMs: 15 * 60 * 1000 });
    if (!rateLimit.allowed) {
      return NextResponse.json({ ok: false, message: "Too many requests. Please try again shortly." }, { status: 429 });
    }

    if (!isGoogleCalendarConfigured()) {
      return NextResponse.json({ ok: false, message: "Booking calendar is not configured yet." }, { status: 503 });
    }

    const payload = schema.parse(await request.json());
    const sport = getBookingSportById(payload.sportId);
    const duration = getBookingDurationById(payload.durationId);

    if (!sport || !duration) {
      return NextResponse.json({ ok: false, message: "Please choose a valid sport and duration." }, { status: 400 });
    }

    if (!isDateInBookingWindow(payload.date)) {
      return NextResponse.json(
        { ok: false, message: "We can only accept bookings for the current week and next week." },
        { status: 400 },
      );
    }

    const businessWindow = getBusinessWindowForDate(payload.date);
    const existingBookings = await listBookingsForAvailability({
      timeMin: businessWindow.start.toISOString(),
      timeMax: businessWindow.end.toISOString(),
      sportId: sport.id,
    });

    const slots = generateAvailableSlots({
      date: payload.date,
      durationMinutes: duration.minutes,
      sportId: sport.id,
      existingBookings,
    });

    return NextResponse.json({ ok: true, slots });
  } catch {
    return NextResponse.json({ ok: false, message: "Unable to load available slots." }, { status: 500 });
  }
}
