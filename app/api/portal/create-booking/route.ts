import { NextResponse } from "next/server";
import { z } from "zod";
import {
  generateAvailableSlots,
  generateBookingId,
  getSportBusinessWindowForDate,
  sanitizeText,
  validateBookingConfigSelection,
  validateName,
  validatePakistaniMobile,
} from "@/lib/bookingUtils";
import { createCalendarBooking, findBookingById, listBookingsForAvailability } from "@/lib/googleCalendar";
import { requireAdminSession } from "@/lib/portalAuth";

export const runtime = "nodejs";

const schema = z.object({
  sportId: z.string().min(1),
  durationId: z.string().min(1),
  clientName: z.string().min(1),
  phone: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startIso: z.string().datetime(),
  endIso: z.string().datetime(),
  status: z.enum(["pending", "confirmed"]).default("confirmed"),
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
    await requireAdminSession();
    const payload = schema.parse(await request.json());
    const selection = validateBookingConfigSelection(payload);
    const clientName = validateName(payload.clientName);
    const phone = validatePakistaniMobile(payload.phone);

    if (!selection.ok || !clientName || !phone) {
      return NextResponse.json({ ok: false, message: selection.ok ? "Please check the booking details." : selection.message }, { status: 400 });
    }

    const businessWindow = getSportBusinessWindowForDate(selection.sport.id, payload.date);
    if (!businessWindow) return NextResponse.json({ ok: false, message: "This sport is not available on the selected date." }, { status: 400 });

    const existingBookings = await listBookingsForAvailability({
      timeMin: businessWindow.start.toISOString(),
      timeMax: businessWindow.end.toISOString(),
      sportId: selection.sport.id,
    });
    const availableSlots = generateAvailableSlots({ date: payload.date, durationMinutes: selection.duration.minutes, sportId: selection.sport.id, existingBookings });
    const requestedSlot = availableSlots.find((slot) => slot.startIso === payload.startIso && slot.endIso === payload.endIso);
    if (!requestedSlot) return NextResponse.json({ ok: false, code: "SLOT_TAKEN", message: "This slot is no longer available." }, { status: 409 });

    const booking = await createCalendarBooking({
      bookingId: await generateUniqueBookingId(selection.sport.id, new Date(requestedSlot.startIso)),
      clientName: sanitizeText(clientName, 50),
      phone,
      sportId: selection.sport.id,
      sportName: selection.sport.name,
      durationMinutes: selection.duration.minutes,
      status: payload.status,
      channel: "Admin Portal",
      startIso: requestedSlot.startIso,
      endIso: requestedSlot.endIso,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, booking });
  } catch (error) {
    const status = error instanceof Error && error.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ ok: false, message: status === 401 ? "Unauthorized" : "Unable to create booking." }, { status });
  }
}
