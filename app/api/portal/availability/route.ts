import { NextResponse } from "next/server";
import { z } from "zod";
import { getBookingPriceEstimate } from "@/data/sportBookingConfig";
import { generateAvailableSlots, getSportBusinessWindowForDate, validateBookingConfigSelection } from "@/lib/bookingUtils";
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
    const selection = validateBookingConfigSelection(payload);
    if (!selection.ok) return NextResponse.json({ ok: false, message: selection.message }, { status: 400 });

    const businessWindow = getSportBusinessWindowForDate(selection.sport.id, payload.date);
    if (!businessWindow) return NextResponse.json({ ok: false, message: "This sport is not available on the selected date." }, { status: 400 });

    const existingBookings = (await listBookingsForAvailability({
      timeMin: businessWindow.start.toISOString(),
      timeMax: businessWindow.end.toISOString(),
      sportId: selection.sport.id,
    })).filter((booking) => booking.eventId !== payload.excludeEventId);

    const slots = generateAvailableSlots({ date: payload.date, durationMinutes: selection.duration.minutes, sportId: selection.sport.id, existingBookings });
    const price = getBookingPriceEstimate({ sportId: selection.sport.id, durationId: selection.duration.id, date: payload.date });
    return NextResponse.json({ ok: true, slots, price });
  } catch (error) {
    const status = error instanceof Error && error.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ ok: false, message: status === 401 ? "Unauthorized" : "Unable to load available slots." }, { status });
  }
}
