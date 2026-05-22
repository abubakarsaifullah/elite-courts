import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PackageStatusBadge } from "@/components/pricing/package-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildWhatsAppUrl } from "@/data/siteContent";
import { formatPackagePrice, getPackageBadgeLabel, type SitePackage } from "@/data/packages";

interface MembershipCardProps {
  membership: {
    title: string;
    subtitle: string;
    plans: readonly SitePackage[];
    perksTitle: string | null;
    perks: readonly string[];
    whatsappMessage: string;
  };
}

export function MembershipCard({ membership }: MembershipCardProps) {
  return (
    <Card className="group h-full hover:-translate-y-1 hover:border-cyan-400/25 hover:shadow-[0_28px_90px_-45px_rgba(6,182,212,0.3)]">
      <CardContent className="flex h-full flex-col gap-6">
        <div className="space-y-3">
          <Badge>Monthly membership</Badge>
          <div>
            <h3 className="text-2xl font-semibold text-[color:var(--text)]">{membership.title}</h3>
            <p className="mt-2 text-sm text-[color:var(--muted)]">{membership.subtitle}</p>
          </div>
        </div>
        <div className="space-y-3 rounded-[1.6rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4 transition-colors duration-300 group-hover:border-cyan-400/25">
          {membership.plans.map((plan) => (
            <div key={plan.id} className="flex items-center justify-between gap-3 border-b border-[color:var(--border)] py-2 last:border-b-0">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[color:var(--muted-strong)]">{plan.availability || plan.title}</span>
                <PackageStatusBadge label={getPackageBadgeLabel(plan)} />
              </div>
              <span className="text-sm font-extrabold text-[color:var(--text)]">{formatPackagePrice(plan)}</span>
            </div>
          ))}
        </div>
        {membership.perks.length ? (
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-strong)]">{membership.perksTitle}</p>
            <ul className="space-y-2 text-sm text-[color:var(--muted-strong)]">
              {membership.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="mt-auto">
          <Button asChild className="w-full">
            <Link href={buildWhatsAppUrl(membership.whatsappMessage)} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" />
              Inquire on WhatsApp
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
