import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope, Sora } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsAppFloatingButton } from "@/components/whatsapp-floating-button";
import { BackToTopButton } from "@/components/back-to-top-button";
import { AnnouncementMarquee } from "@/components/announcement-marquee";
import { BookingChatbot } from "@/components/chatbot/BookingChatbot";
import { buildMetadata } from "@/lib/metadata";
import { siteContent } from "@/data/siteContent";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = buildMetadata({
  title: siteContent.seo.defaultTitle,
  description: siteContent.seo.defaultDescription,
});

const themeScript = `
(() => {
  try {
    const key = "elite-theme";
    const stored = window.localStorage.getItem(key);
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored ?? (systemDark ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {
    document.documentElement.dataset.theme = "dark";
    document.documentElement.style.colorScheme = "dark";
  }
})();
`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${manrope.variable} ${sora.variable}`}>
      <body className="min-h-screen font-sans text-[color:var(--text)] antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <div className="relative isolate flex min-h-screen flex-col overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[44rem] bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.12),transparent_34%)]" />
          <SiteHeader />
          <AnnouncementMarquee />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <BackToTopButton />
          <BookingChatbot />
          <WhatsAppFloatingButton />
        </div>
      </body>
    </html>
  );
}
