import { NextResponse } from "next/server";
import { z } from "zod";
import { getBookingDurationById } from "@/data/bookingDurations";
import { getBookingSportById } from "@/data/sports";
import { generateAvailableSlots, getBusinessWindowForDate, isDateInBookingWindow } from "@/lib/bookingUtils";
import { listBookingsForAvailability } from "@/lib/googleCalendar";
import { requireAdminSession } from "@/lib/portalAuth";

export const runtime = "nodejs";

const schema = z.object({
  sportId: z.string().min(1),
  durationId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  excludeEventId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const payload = schema.parse(await request.json());
    const sport = getBookingSportById(payload.sportId);
    const duration = getBookingDurationById(payload.durationId);
    if (!sport || !duration) return NextResponse.json({ ok: false, message: "Please choose a valid sport and duration." }, { status: 400 });
    if (!isDateInBookingWindow(payload.date)) return NextResponse.json({ ok: false, message: "Selected date is outside the allowed booking window." }, { status: 400 });

    const businessWindow = getBusinessWindowForDate(payload.date);
    const existingBookings = (await listBookingsForAvailability({
      timeMin: businessWindow.start.toISOString(),
      timeMax: businessWindow.end.toISOString(),
      sportId: sport.id,
    })).filter((booking) => booking.eventId !== payload.excludeEventId);

    const slots = generateAvailableSlots({ date: payload.date, durationMinutes: duration.minutes, sportId: sport.id, existingBookings });
    return NextResponse.json({ ok: true, slots });
  } catch (error) {
    const status = error instanceof Error && error.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ ok: false, message: status === 401 ? "Unauthorized" : "Unable to load available slots." }, { status });
  }
}
