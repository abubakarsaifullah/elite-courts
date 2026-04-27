import { Camera, Coffee, Gamepad2, ParkingCircle, Sparkles, Wifi } from "lucide-react";
import { amenities } from "@/data/siteContent";
import { Card, CardContent } from "@/components/ui/card";

const iconMap = {
  camera: Camera,
  coffee: Coffee,
  gamepad: Gamepad2,
  parking: ParkingCircle,
  sparkles: Sparkles,
  wifi: Wifi,
} as const;

export function AmenitiesGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {amenities.map((item) => {
        const Icon = iconMap[item.icon] || Sparkles;
        return (
          <Card key={item.title} className="group h-full hover:-translate-y-1 hover:border-cyan-400/25 hover:shadow-[0_24px_70px_-42px_rgba(6,182,212,0.35)]">
            <CardContent className="flex h-full items-start gap-4 p-5">
              <div className="rounded-2xl bg-[color:var(--accent-soft)] p-3 text-[color:var(--accent-strong)] transition-transform duration-200 group-hover:-translate-y-0.5">
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-[color:var(--text)]">{item.title}</h3>
                <p className="text-sm leading-6 text-[color:var(--muted)]">{item.description}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
