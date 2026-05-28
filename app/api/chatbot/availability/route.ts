import { NextResponse } from "next/server";
import { z } from "zod";
import { bookingLimits } from "@/data/bookingLimits";
import { getBookingPriceEstimate } from "@/data/sportBookingConfig";
import {
  generateAvailableSlots,
  getSportBusinessWindowForDate,
  validateBookingConfigSelection,
  validatePakistaniMobile,
} from "@/lib/bookingUtils";
import { countActivePendingBookingsByPhone, isGoogleCalendarConfigured, listBookingsForAvailability } from "@/lib/googleCalendar";
import { checkRateLimit, getClientKey } from "@/lib/rateLimit";

export const runtime = "nodejs";

const schema = z.object({
  sportId: z.string().min(1),
  durationId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  phone: z.string().optional(),
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
    const selection = validateBookingConfigSelection(payload);
    if (!selection.ok) return NextResponse.json({ ok: false, message: selection.message }, { status: 400 });

    if (payload.phone) {
      const phone = validatePakistaniMobile(payload.phone);
      if (!phone) return NextResponse.json({ ok: false, message: "Please enter a valid Pakistani mobile number." }, { status: 400 });

      const pendingCount = await countActivePendingBookingsByPhone(phone);
      if (pendingCount >= bookingLimits.maxPendingRequestsPerPhone) {
        return NextResponse.json(
          {
            ok: false,
            code: "PENDING_LIMIT",
            message: `You already have ${bookingLimits.maxPendingRequestsPerPhone} pending booking requests. Please contact our team before creating another one.`,
          },
          { status: 429 },
        );
      }
    }

    const businessWindow = getSportBusinessWindowForDate(selection.sport.id, payload.date);
    if (!businessWindow) return NextResponse.json({ ok: false, message: "This sport is not available on the selected date." }, { status: 400 });

    const existingBookings = await listBookingsForAvailability({
      timeMin: businessWindow.start.toISOString(),
      timeMax: businessWindow.end.toISOString(),
      sportId: selection.sport.id,
    });

    const slots = generateAvailableSlots({
      date: payload.date,
      durationMinutes: selection.duration.minutes,
      sportId: selection.sport.id,
      existingBookings,
    });

    const price = getBookingPriceEstimate({ sportId: selection.sport.id, durationId: selection.duration.id, date: payload.date });
    return NextResponse.json({ ok: true, slots, price });
  } catch {
    return NextResponse.json({ ok: false, message: "Unable to load available slots." }, { status: 500 });
  }
}
