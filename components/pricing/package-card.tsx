import Link from "next/link";
import { Check, MessageCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { isNewPackageBadge, PackageStatusBadge } from "@/components/pricing/package-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildWhatsAppUrl } from "@/data/siteContent";
import { formatOriginalPrice, formatPackagePrice, getPackageBadgeLabel, getPackageSavings, type SitePackage } from "@/data/packages";
import { cn } from "@/lib/utils";

interface PricingPackageCardProps {
  item: SitePackage;
  compact?: boolean;
}


export function PricingPackageCard({ item, compact = false }: PricingPackageCardProps) {
  const original = formatOriginalPrice(item);
  const savings = getPackageSavings(item);
  const badge = getPackageBadgeLabel(item);
  const features = compact ? item.features.slice(0, 3) : item.features;
  const isNew = isNewPackageBadge(badge);

  return (
    <Card
      className={cn(
        "group h-full overflow-hidden hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_28px_90px_-45px_rgba(6,182,212,0.36)]",
        item.isRecommended && "border-cyan-400/45 shadow-[0_28px_90px_-44px_rgba(6,182,212,0.3)]",
        isNew && "border-emerald-400/35 shadow-[0_28px_90px_-48px_rgba(16,185,129,0.34)]",
      )}
    >
      {isNew ? (
        <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-400" />
      ) : item.isRecommended ? (
        <div className="h-1.5 bg-[color:var(--accent)]" />
      ) : null}
      <CardContent className="flex h-full flex-col gap-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <Badge>{item.sport}</Badge>
            <PackageStatusBadge label={badge} className="border-cyan-400/30 bg-[color:var(--surface-strong)]" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-[color:var(--text)]">{item.title}</h3>
            {item.subtitle ? <p className="text-sm text-[color:var(--muted)]">{item.subtitle}</p> : null}
          </div>

          <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4 transition-colors duration-300 group-hover:border-cyan-400/25">
            {original ? <p className="text-sm text-[color:var(--muted)] line-through">{original}</p> : null}
            <p className="mt-1 font-display text-3xl font-extrabold text-[color:var(--text)]">{formatPackagePrice(item)}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-[color:var(--muted-strong)]">
              <span className="rounded-full bg-[color:var(--surface)] px-3 py-1 ring-1 ring-[color:var(--border)]">{item.duration}</span>
              {item.availability ? (
                <span className="rounded-full bg-[color:var(--surface)] px-3 py-1 ring-1 ring-[color:var(--border)]">{item.availability}</span>
              ) : null}
            </div>
          </div>

          {item.promotionLabel || savings ? (
            <div className="vibrate-1 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-[color:var(--accent-soft)] px-3 py-1.5 text-xs font-extrabold text-[color:var(--accent-strong)]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {item.promotionLabel || `Save ${item.currency} ${savings?.toLocaleString("en-PK")}`}
            </div>
          ) : null}
        </div>

        {item.description && !compact ? <p className="text-sm leading-7 text-[color:var(--muted)]">{item.description}</p> : null}

        <ul className="space-y-3 text-sm text-[color:var(--muted-strong)]">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span className="mt-0.5 rounded-full bg-[color:var(--accent-soft)] p-1 text-[color:var(--accent-strong)]">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {!compact && item.terms?.length ? (
          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4 text-xs leading-6 text-[color:var(--muted)]">
            {item.terms.map((term) => (
              <p key={term}>{term}</p>
            ))}
          </div>
        ) : null}

        <div className="mt-auto pt-1">
          <Button asChild className="w-full">
            <Link href={buildWhatsAppUrl(item.whatsappMessage)} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Book now
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
