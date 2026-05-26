import { NextResponse } from "next/server";
import { z } from "zod";
import { validatePakistaniMobile } from "@/lib/bookingUtils";
import { findActiveBookingsByPhone, isGoogleCalendarConfigured } from "@/lib/googleCalendar";
import { checkRateLimit, getClientKey } from "@/lib/rateLimit";
import { bookingLimits } from "@/data/bookingLimits";

export const runtime = "nodejs";

const schema = z.object({
  phone: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const rateLimit = checkRateLimit(getClientKey(request, "chatbot-view-booking"), {
      limit: bookingLimits.maxViewRequestsPerIpPer15Minutes,
      windowMs: 15 * 60 * 1000,
    });
    if (!rateLimit.allowed) {
      return NextResponse.json({ ok: false, message: "Too many requests. Please try again shortly." }, { status: 429 });
    }

    if (!isGoogleCalendarConfigured()) {
      return NextResponse.json({ ok: false, message: "Booking calendar is not configured yet." }, { status: 503 });
    }

    const payload = schema.parse(await request.json());
    const phone = validatePakistaniMobile(payload.phone);

    if (!phone) {
      return NextResponse.json({ ok: false, message: "Please enter a valid Pakistani mobile number." }, { status: 400 });
    }

    const bookings = await findActiveBookingsByPhone(phone);
    if (bookings.length === 0) {
      return NextResponse.json({ ok: false, code: "NOT_FOUND", message: "You don’t have any pending or confirmed bookings." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, bookings });
  } catch {
    return NextResponse.json({ ok: false, message: "Unable to view bookings." }, { status: 500 });
  }
}
