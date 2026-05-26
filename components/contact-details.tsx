import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl, siteConfig } from "@/data/siteContent";
import { BusinessHoursCard } from "@/components/business-hours-card";

const details = [
  {
    icon: Mail,
    title: "Email",
    content: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: Phone,
    title: "Phone",
    content: siteConfig.phoneDisplay,
    href: siteConfig.phoneHref,
  },
  {
    icon: MapPin,
    title: "Address",
    content: siteConfig.address,
    href: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(siteConfig.address)}`,
  },
] as const;

export function ContactDetails() {
  return (
    <div className="space-y-4">
      {details.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="hover:-translate-y-0.5 hover:border-cyan-400/20">
            <CardContent className="flex items-start gap-4 p-5">
              <div className="rounded-2xl bg-[color:var(--accent-soft)] p-3 text-[color:var(--accent-strong)]">
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--text)]">{item.title}</p>
                <Link
                  href={item.href}
                  className="text-sm leading-7 text-[color:var(--muted)] transition hover:text-[color:var(--text)]"
                  target={item.href.startsWith("https") ? "_blank" : undefined}
                  rel={item.href.startsWith("https") ? "noreferrer" : undefined}
                >
                  {item.content}
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <BusinessHoursCard compact />

      <Button asChild className="w-full">
        <Link href={buildWhatsAppUrl(siteConfig.primaryWhatsappMessage)} target="_blank" rel="noreferrer">
          <MessageCircle className="h-4 w-4" />
          Chat on WhatsApp
        </Link>
      </Button>
    </div>
  );
}
