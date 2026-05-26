import { NextResponse } from "next/server";
import { z } from "zod";
import { updateCalendarBookingStatus } from "@/lib/googleCalendar";
import { requireAdminSession } from "@/lib/portalAuth";
import { checkRateLimit, getClientKey } from "@/lib/rateLimit";

export const runtime = "nodejs";

const schema = z.object({
  eventId: z.string().min(1),
  status: z.enum(["pending", "confirmed", "cancelled"]),
  reason: z.string().max(240).optional(),
});

export async function POST(request: Request) {
  try {
    await requireAdminSession();

    const rateLimit = checkRateLimit(getClientKey(request, "portal-update-status"), { limit: 80, windowMs: 15 * 60 * 1000 });
    if (!rateLimit.allowed) {
      return NextResponse.json({ ok: false, message: "Too many updates. Please try again shortly." }, { status: 429 });
    }

    const payload = schema.parse(await request.json());
    const booking = await updateCalendarBookingStatus(payload);
    return NextResponse.json({ ok: true, booking });
  } catch (error) {
    const message = error instanceof Error && error.message === "PAST_BOOKING"
      ? "This booking is no longer active. The list will refresh."
      : "Unable to update booking status.";
    const status = error instanceof Error && error.message === "Unauthorized" ? 401 : error instanceof Error && error.message === "PAST_BOOKING" ? 409 : 500;
    return NextResponse.json({ ok: false, code: error instanceof Error ? error.message : undefined, message: status === 401 ? "Unauthorized" : message }, { status });
  }
}
