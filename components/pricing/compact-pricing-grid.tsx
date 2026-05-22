import Link from "next/link";
import { PackageStatusBadge } from "@/components/pricing/package-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildWhatsAppUrl } from "@/data/siteContent";

interface RateItem {
  label: string;
  price: string;
  badge?: string;
}

interface CompactPricingGridProps {
  title: string;
  subtitle: string;
  rates: readonly RateItem[];
  includes?: readonly string[];
  whatsappMessage: string;
}

export function CompactPricingGrid({ title, subtitle, rates, includes, whatsappMessage }: CompactPricingGridProps) {
  return (
    <Card className="h-full hover:-translate-y-1 hover:border-cyan-400/25">
      <CardContent className="flex h-full flex-col gap-6">
        <div>
          <p className="text-2xl font-semibold text-[color:var(--text)]">{title}</p>
          <p className="mt-2 text-sm text-[color:var(--muted)]">{subtitle}</p>
        </div>
        <div className="space-y-3 rounded-[1.6rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
          {rates.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3 border-b border-[color:var(--border)] py-2 last:border-b-0">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[color:var(--muted-strong)]">{item.label}</span>
                <PackageStatusBadge label={item.badge} />
              </div>
              <span className="text-sm font-extrabold text-[color:var(--text)]">{item.price}</span>
            </div>
          ))}
        </div>
        {includes?.length ? (
          <ul className="space-y-2 text-sm text-[color:var(--muted-strong)]">
            {includes.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-auto">
          <Button asChild className="w-full">
            <Link href={buildWhatsAppUrl(whatsappMessage)} target="_blank" rel="noreferrer">
              Book via WhatsApp
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
