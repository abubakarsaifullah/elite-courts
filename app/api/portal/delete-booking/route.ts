import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteCancelledCalendarBooking } from "@/lib/googleCalendar";
import { requireAdminSession } from "@/lib/portalAuth";
import { checkRateLimit, getClientKey } from "@/lib/rateLimit";

export const runtime = "nodejs";

const schema = z.object({ eventId: z.string().min(1) });

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const rateLimit = checkRateLimit(getClientKey(request, "portal-delete-booking"), { limit: 40, windowMs: 15 * 60 * 1000 });
    if (!rateLimit.allowed) return NextResponse.json({ ok: false, message: "Too many requests. Please try again shortly." }, { status: 429 });

    const payload = schema.parse(await request.json());
    await deleteCancelledCalendarBooking(payload.eventId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = error instanceof Error && error.message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ ok: false, message: status === 401 ? "Unauthorized" : error instanceof Error ? error.message : "Unable to delete booking." }, { status });
  }
}
