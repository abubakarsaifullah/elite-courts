import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/data/siteContent";

interface SportCardProps {
  sport: {
    name: string;
    shortName: string;
    summary: string;
    features: readonly string[];
    image: string;
    bookingMessage: string;
  };
}

export function SportCard({ sport }: SportCardProps) {
  const remote = sport.image.startsWith("https://");

  return (
    <Card className="group h-full overflow-hidden hover:-translate-y-1 hover:border-cyan-400/25 hover:shadow-[0_28px_90px_-44px_rgba(6,182,212,0.28)]">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-[color:var(--border)]">
        <Image
          src={sport.image}
          alt={`${sport.name} at Elite Courts`}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
          unoptimized={remote}
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
        <div className="absolute left-5 top-5">
          <Badge className="border-white/10 bg-black/20 text-cyan-100">{sport.shortName}</Badge>
        </div>
      </div>
      <CardContent className="flex h-full flex-col gap-5">
        <div className="space-y-3">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-[color:var(--text)]">{sport.name}</h3>
            <p className="text-sm leading-7 text-[color:var(--muted)]">{sport.summary}</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm text-[color:var(--muted-strong)]">
          {sport.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href={buildWhatsAppUrl(sport.bookingMessage)} target="_blank" rel="noreferrer">
              Book via WhatsApp
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/pricing">
              View pricing
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
