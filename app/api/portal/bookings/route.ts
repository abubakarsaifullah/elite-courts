import { NextResponse } from "next/server";
import { getAdminBookings, isGoogleCalendarConfigured } from "@/lib/googleCalendar";
import { getStatusStats } from "@/lib/bookingUtils";
import { requireAdminSession } from "@/lib/portalAuth";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdminSession();

    if (!isGoogleCalendarConfigured()) {
      return NextResponse.json({ ok: false, message: "Google Calendar is not configured." }, { status: 503 });
    }

    const bookings = await getAdminBookings();
    return NextResponse.json({ ok: true, bookings, stats: getStatusStats(bookings), lastUpdated: new Date().toISOString() });
  } catch (error) {
    const status = error instanceof Error && error.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ ok: false, message: status === 401 ? "Unauthorized" : "Unable to load bookings." }, { status });
  }
}
