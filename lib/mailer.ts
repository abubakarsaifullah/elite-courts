import nodemailer from "nodemailer";
import type { ContactFormValues } from "@/lib/contact";
import { siteConfig } from "@/data/siteContent";

function buildHtml(payload: ContactFormValues) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2>New Elite Courts contact request</h2>
      <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(payload.message).replace(/\n/g, "<br />")}</p>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildTransport() {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    const resendPort = Number(process.env.RESEND_SMTP_PORT ?? 465);
    return nodemailer.createTransport({
      host: "smtp.resend.com",
      port: resendPort,
      secure: resendPort === 465 || resendPort === 2465,
      auth: {
        user: "resend",
        pass: resendApiKey,
      },
    });
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = String(process.env.SMTP_SECURE ?? "false") === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function sendContactEmail(payload: ContactFormValues) {
  const transporter = buildTransport();
  const to = process.env.CONTACT_RECEIVER_EMAIL || process.env.CONTACT_EMAIL_TO || siteConfig.email;
  const from =
    process.env.CONTACT_SENDER_EMAIL ||
    process.env.CONTACT_EMAIL_FROM ||
    process.env.RESEND_FROM ||
    `Elite Courts <noreply@${new URL(siteConfig.siteUrl).hostname}>`;

  if (!transporter) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Email service is not configured.");
    }

    console.info("[contact-form] Email service not configured. Payload follows:", payload);
    return;
  }

  await transporter.sendMail({
    from,
    to,
    replyTo: payload.email,
    subject: `Elite Courts website inquiry: ${payload.subject}`,
    html: buildHtml(payload),
    text: [
      "New Elite Courts contact request",
      "",
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone}`,
      `Subject: ${payload.subject}`,
      "",
      payload.message,
    ].join("\n"),
  });
}
