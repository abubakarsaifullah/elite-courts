import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearActiveSession, getSessionCookieName } from "@/lib/portalAuth";

export const runtime = "nodejs";

export async function POST() {
  const cookieStore = await cookies();
  clearActiveSession(cookieStore.get(getSessionCookieName())?.value);

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: getSessionCookieName(),
    value: "",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
