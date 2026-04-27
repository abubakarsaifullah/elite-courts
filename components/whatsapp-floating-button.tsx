import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl, siteConfig } from "@/data/siteContent";

export function WhatsAppFloatingButton() {
  return (
    <Link
      href={buildWhatsAppUrl(siteConfig.primaryWhatsappMessage)}
      target="_blank"
      rel="noreferrer"
      aria-label="Book on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-slate-950 shadow-[0_18px_60px_-20px_rgba(16,185,129,0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
    >
      <MessageCircle className="h-6 w-6" />
    </Link>
  );
}
