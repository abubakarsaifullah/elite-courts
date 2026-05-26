import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createSessionToken,
  getSessionCookieName,
  getSessionMaxAgeSeconds,
  isPortalAuthConfigured,
  verifyAdminCredentials,
} from "@/lib/portalAuth";
import { checkRateLimit, getClientKey } from "@/lib/rateLimit";

export const runtime = "nodejs";

const schema = z.object({
  username: z.string().min(1).max(80),
  password: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  try {
    const rateLimit = checkRateLimit(getClientKey(request, "portal-login"), { limit: 8, windowMs: 15 * 60 * 1000 });
    if (!rateLimit.allowed) {
      return NextResponse.json({ ok: false, message: "Too many login attempts. Please try again later." }, { status: 429 });
    }

    if (!isPortalAuthConfigured()) {
      return NextResponse.json({ ok: false, message: "Portal authentication is not configured." }, { status: 503 });
    }

    const payload = schema.parse(await request.json());

    if (!verifyAdminCredentials(payload.username, payload.password)) {
      return NextResponse.json({ ok: false, message: "Invalid login details." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: getSessionCookieName(),
      value: createSessionToken(payload.username),
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: getSessionMaxAgeSeconds(),
    });

    return response;
  } catch {
    return NextResponse.json({ ok: false, message: "Unable to sign in." }, { status: 400 });
  }
}
