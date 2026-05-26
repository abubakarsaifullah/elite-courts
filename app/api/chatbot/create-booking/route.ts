import { NextResponse } from "next/server";
import { z } from "zod";
import { getBookingDurationById } from "@/data/bookingDurations";
import { bookingLimits } from "@/data/bookingLimits";
import { getBookingSportById } from "@/data/sports";
import {
  generateAvailableSlots,
  generateBookingId,
  getBusinessWindowForDate,
  isDateInBookingWindow,
  sanitizeText,
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

async function generateUniqueBookingId(sportId: string) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const bookingId = generateBookingId(sportId);
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

    const sport = getBookingSportById(payload.sportId);
    const duration = getBookingDurationById(payload.durationId);
    const clientName = validateName(payload.clientName);
    const phone = validatePakistaniMobile(payload.phone);

    if (!sport || !duration || !clientName || !phone) {
      return NextResponse.json({ ok: false, message: "Please check your booking details and try again." }, { status: 400 });
    }

    if (!isDateInBookingWindow(payload.date)) {
      return NextResponse.json(
        { ok: false, message: "We can only accept bookings for the current week and next week." },
        { status: 400 },
      );
    }

    const pendingCount = await countActivePendingBookingsByPhone(phone);
    if (pendingCount >= bookingLimits.maxPendingBookingsPerPhone) {
      return NextResponse.json(
        { ok: false, message: "You already have multiple pending booking requests. Please contact our team before creating another one." },
        { status: 429 },
      );
    }

    const businessWindow = getBusinessWindowForDate(payload.date);
    const existingBookings = await listBookingsForAvailability({
      timeMin: businessWindow.start.toISOString(),
      timeMax: businessWindow.end.toISOString(),
      sportId: sport.id,
    });

    const availableSlots = generateAvailableSlots({
      date: payload.date,
      durationMinutes: duration.minutes,
      sportId: sport.id,
      existingBookings,
    });

    const requestedSlot = availableSlots.find((slot) => slot.startIso === payload.startIso && slot.endIso === payload.endIso);
    if (!requestedSlot) {
      return NextResponse.json({ ok: false, code: "SLOT_TAKEN", message: "Sorry, this slot was just taken." }, { status: 409 });
    }

    const bookingId = await generateUniqueBookingId(sport.id);
    const booking = await createCalendarBooking({
      bookingId,
      clientName: sanitizeText(clientName, 50),
      phone,
      sportId: sport.id,
      sportName: sport.name,
      durationMinutes: duration.minutes,
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
