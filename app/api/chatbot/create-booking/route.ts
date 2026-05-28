import { NextResponse } from "next/server";
import { z } from "zod";
import { bookingLimits } from "@/data/bookingLimits";
import {
  generateAvailableSlots,
  generateBookingId,
  getSportBusinessWindowForDate,
  sanitizeText,
  validateBookingConfigSelection,
  validateName,
  validatePakistaniMobile,
} from "@/lib/bookingUtils";
import {
  countActivePendingBookingsByPhone,
  createCalendarBooking,
  findBookingById,
  isGoogleCalendarConfigured,
  listBookingsForAvailability,
} from "@/lib/googleCalendar";
import { checkRateLimit, getClientKey } from "@/lib/rateLimit";

export const runtime = "nodejs";

const schema = z.object({
  sportId: z.string().min(1),
  durationId: z.string().min(1),
  clientName: z.string().min(1),
  phone: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startIso: z.string().datetime(),
  endIso: z.string().datetime(),
  website: z.string().optional(), // honeypot; should remain empty
});

async function generateUniqueBookingId(sportId: string, date = new Date()) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const bookingId = generateBookingId(sportId, date);
    const existing = await findBookingById(bookingId);
    if (!existing) return bookingId;
  }
  throw new Error("Unable to generate a unique booking ID.");
}

export async function POST(request: Request) {
  try {
    const rateLimit = checkRateLimit(getClientKey(request, "chatbot-create-booking"), {
      limit: bookingLimits.maxCreateRequestsPerIpPerHour,
      windowMs: 60 * 60 * 1000,
    });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { ok: false, message: "You’ve made several booking requests recently. Please try again later or contact our team on WhatsApp." },
        { status: 429 },
      );
    }

    const cooldownCookie = request.headers.get("cookie")?.includes(`${bookingLimits.deviceCooldownCookieName}=`);
    if (cooldownCookie) {
      return NextResponse.json(
        { ok: false, message: "Please wait a few minutes before creating another booking request." },
        { status: 429 },
      );
    }

    if (!isGoogleCalendarConfigured()) {
      return NextResponse.json({ ok: false, message: "Booking calendar is not configured yet." }, { status: 503 });
    }

    const payload = schema.parse(await request.json());
    if (payload.website) return NextResponse.json({ ok: false, message: "Unable to create booking." }, { status: 400 });

    const selection = validateBookingConfigSelection(payload);
    const clientName = validateName(payload.clientName);
    const phone = validatePakistaniMobile(payload.phone);

    if (!selection.ok || !clientName || !phone) {
      return NextResponse.json({ ok: false, message: selection.ok ? "Please check your booking details and try again." : selection.message }, { status: 400 });
    }

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

    const businessWindow = getSportBusinessWindowForDate(selection.sport.id, payload.date);
    if (!businessWindow) return NextResponse.json({ ok: false, message: "This sport is not available on the selected date." }, { status: 400 });

    const existingBookings = await listBookingsForAvailability({
      timeMin: businessWindow.start.toISOString(),
      timeMax: businessWindow.end.toISOString(),
      sportId: selection.sport.id,
    });

    const availableSlots = generateAvailableSlots({
      date: payload.date,
      durationMinutes: selection.duration.minutes,
      sportId: selection.sport.id,
      existingBookings,
    });

    const requestedSlot = availableSlots.find((slot) => slot.startIso === payload.startIso && slot.endIso === payload.endIso);
    if (!requestedSlot) {
      return NextResponse.json({ ok: false, code: "SLOT_TAKEN", message: "Sorry, this slot was just taken." }, { status: 409 });
    }

    const bookingId = await generateUniqueBookingId(selection.sport.id, new Date(requestedSlot.startIso));
    const booking = await createCalendarBooking({
      bookingId,
      clientName: sanitizeText(clientName, 50),
      phone,
      sportId: selection.sport.id,
      sportName: selection.sport.name,
      durationMinutes: selection.duration.minutes,
      status: "pending",
      channel: "Chatbot",
      startIso: requestedSlot.startIso,
      endIso: requestedSlot.endIso,
      createdAt: new Date().toISOString(),
    });

    const response = NextResponse.json({ ok: true, booking });
    response.cookies.set({
      name: bookingLimits.deviceCooldownCookieName,
      value: "1",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: bookingLimits.cooldownMinutesAfterBooking * 60,
    });
    return response;
  } catch {
    return NextResponse.json({ ok: false, message: "Unable to create booking." }, { status: 500 });
  }
}
