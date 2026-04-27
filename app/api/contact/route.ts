import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/contact";
import { sendContactEmail } from "@/lib/mailer";

export const runtime = "nodejs";

type Bucket = { hits: number[] };

const rateLimitStore = new Map<string, Bucket>();
const WINDOW_MS = 5 * 60 * 1000;
const MAX_HITS = 5;

function isRateLimited(ip: string) {
  const now = Date.now();
  const bucket = rateLimitStore.get(ip) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((timestamp) => now - timestamp < WINDOW_MS);

  if (bucket.hits.length >= MAX_HITS) {
    rateLimitStore.set(ip, bucket);
    return true;
  }

  bucket.hits.push(now);
  rateLimitStore.set(ip, bucket);
  return false;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again shortly." },
        { status: 429 },
      );
    }

    const json = (await request.json()) as unknown;
    const parsed = contactFormSchema.safeParse(json);

    if (!parsed.success) {
      const firstMessage = Object.values(parsed.error.flatten().fieldErrors).flat()[0] || "Please check the form and try again.";
      return NextResponse.json({ success: false, message: firstMessage }, { status: 400 });
    }

    if (parsed.data.website) {
      return NextResponse.json({ success: true, message: "Thanks. Your message has been received." });
    }

    await sendContactEmail(parsed.data);

    return NextResponse.json({
      success: true,
      message: "Thanks. Elite Courts has received your message and will get back to you soon.",
    });
  } catch (error) {
    console.error("[contact-route]", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong while sending your message." },
      { status: 500 },
    );
  }
}
