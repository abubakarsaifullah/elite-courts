import Link from "next/link";
import { ExternalLink, MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { siteConfig, siteContent } from "@/data/siteContent";

const mapQuery = encodeURIComponent(siteConfig.address);
const mapEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;

export function LocationPreview() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <Card className="hover:-translate-y-0.5 hover:border-cyan-400/20">
        <CardContent className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-[color:var(--accent-soft)] p-3 text-[color:var(--accent-strong)]">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-[color:var(--text)]">{siteContent.location.visitTitle}</h3>
              <p className="text-sm leading-7 text-[color:var(--muted)]">{siteConfig.address}</p>
            </div>
          </div>
          <p className="text-sm leading-7 text-[color:var(--muted)]">{siteConfig.locationSummary}</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href={directionsUrl} target="_blank" rel="noreferrer">
                {siteContent.location.directionsLabel}
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href={siteConfig.phoneHref}>
                <Phone className="h-4 w-4" />
                {siteContent.location.callLabel}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden hover:-translate-y-0.5 hover:border-cyan-400/20">
        <div className="aspect-[16/11] w-full bg-[color:var(--surface-strong)]">
          <iframe
            title={siteContent.location.mapTitle}
            src={mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0"
          />
        </div>
      </Card>
    </div>
  );
}
