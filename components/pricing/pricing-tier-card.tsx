import Link from "next/link";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PackageStatusBadge } from "@/components/pricing/package-status-badge";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/data/siteContent";

interface PricingTierCardProps {
  label: string;
  duration: string;
  price: string;
  note: string;
  includes: readonly string[];
  whatsappMessage: string;
  badge?: string | null;
}

export function PricingTierCard({ label, duration, price, note, includes, whatsappMessage, badge }: PricingTierCardProps) {
  return (
    <Card className="h-full hover:-translate-y-1 hover:border-cyan-400/25">
      <CardContent className="flex h-full flex-col gap-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <Badge>{label}</Badge>
            <PackageStatusBadge label={badge} />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-[color:var(--text)]">{price}</h3>
            <p className="mt-1 text-sm text-[color:var(--muted)]">{duration}</p>
          </div>
          <p className="text-sm font-bold text-[color:var(--accent-strong)]">{note}</p>
        </div>
        <ul className="space-y-3 text-sm text-[color:var(--muted-strong)]">
          {includes.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-0.5 rounded-full bg-[color:var(--accent-soft)] p-1 text-[color:var(--accent-strong)]">
                <Check className="h-3.5 w-3.5" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-2">
          <Button asChild className="w-full">
            <Link href={buildWhatsAppUrl(whatsappMessage)} target="_blank" rel="noreferrer">
              Book now
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
