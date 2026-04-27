import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildWhatsAppUrl } from "@/data/siteContent";
import { cn } from "@/lib/utils";

interface PadelBundle {
  label: string;
  badge: string;
  featured: boolean;
  weekday: { originalPrice?: string; price: string };
  weekend: { originalPrice?: string; price: string };
  savings: string | null;
}

interface PickleballBundle {
  label: string;
  badge: string;
  featured: boolean;
  rate: { originalPrice?: string; price: string };
  savings: string | null;
}

export function PadelBundleGrid({ bundles }: { bundles: readonly PadelBundle[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {bundles.map((bundle) => (
        <Card
          key={bundle.label}
          className={cn(
            "h-full hover:-translate-y-1 hover:border-cyan-400/25",
            bundle.featured && "border-cyan-400/45 shadow-[0_28px_90px_-40px_rgba(6,182,212,0.32)]",
          )}
        >
          <CardContent className="space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-[color:var(--text)]">{bundle.label}</p>
                <p className="mt-1 text-sm text-[color:var(--muted)]">Multi-hour bundle</p>
              </div>
              <Badge>{bundle.badge}</Badge>
            </div>

            <div className="grid gap-3 rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
              <div className="rounded-2xl bg-[color:var(--surface)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--accent-strong)]">Weekday</p>
                {bundle.weekday.originalPrice ? (
                  <p className="mt-2 text-sm text-[color:var(--muted)] line-through">{bundle.weekday.originalPrice}</p>
                ) : null}
                <p className="text-2xl font-semibold text-[color:var(--text)]">{bundle.weekday.price}</p>
              </div>
              <div className="rounded-2xl bg-[color:var(--surface)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--accent-strong)]">Weekend</p>
                {bundle.weekend.originalPrice ? (
                  <p className="mt-2 text-sm text-[color:var(--muted)] line-through">{bundle.weekend.originalPrice}</p>
                ) : null}
                <p className="text-2xl font-semibold text-[color:var(--text)]">{bundle.weekend.price}</p>
              </div>
            </div>

            {bundle.savings ? (
              <p className="text-sm text-[color:var(--accent-strong)]">{bundle.savings}</p>
            ) : (
              <p className="text-sm text-[color:var(--muted)]">Standard rate</p>
            )}

            <Button asChild variant="secondary" className="w-full">
              <Link
                href={buildWhatsAppUrl(`I'm interested in the ${bundle.label} Padel bundle at Elite Courts.`)}
                target="_blank"
                rel="noreferrer"
              >
                Ask about this bundle
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function PickleballBundleGrid({ bundles }: { bundles: readonly PickleballBundle[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {bundles.map((bundle) => (
        <Card
          key={bundle.label}
          className={cn(
            "h-full hover:-translate-y-1 hover:border-cyan-400/25",
            bundle.featured && "border-cyan-400/45 shadow-[0_28px_90px_-40px_rgba(6,182,212,0.32)]",
          )}
        >
          <CardContent className="space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-[color:var(--text)]">{bundle.label}</p>
                <p className="mt-1 text-sm text-[color:var(--muted)]">Flat rate all week</p>
              </div>
              <Badge>{bundle.badge}</Badge>
            </div>

            <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--accent-strong)]">All week</p>
              {bundle.rate.originalPrice ? (
                <p className="mt-2 text-sm text-[color:var(--muted)] line-through">{bundle.rate.originalPrice}</p>
              ) : null}
              <p className="text-3xl font-semibold text-[color:var(--text)]">{bundle.rate.price}</p>
            </div>

            {bundle.savings ? (
              <p className="text-sm text-[color:var(--accent-strong)]">{bundle.savings}</p>
            ) : (
              <p className="text-sm text-[color:var(--muted)]">Standard rate</p>
            )}

            <Button asChild variant="secondary" className="w-full">
              <Link
                href={buildWhatsAppUrl(`I'm interested in the ${bundle.label} Pickleball bundle at Elite Courts.`)}
                target="_blank"
                rel="noreferrer"
              >
                Ask about this bundle
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
