import { CalendarDays, Film } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { pageContent } from "@/data/siteContent";
import type { VideoItem } from "@/data/videos";

interface VideoGridProps {
  videos: VideoItem[];
}

export function VideoGrid({ videos }: VideoGridProps) {
  if (!videos.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-start gap-4 p-8 sm:p-10">
          <div className="rounded-2xl bg-[color:var(--accent-soft)] p-3 text-[color:var(--accent-strong)]">
            <Film className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-[color:var(--text)]">{pageContent.videos.emptyState.title}</h3>
            <p className="max-w-2xl text-sm leading-7 text-[color:var(--muted)]">{pageContent.videos.emptyState.description}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}

function VideoCard({ video }: { video: VideoItem }) {
  return (
    <Card className="group h-full overflow-hidden hover:-translate-y-1 hover:border-cyan-400/25 hover:shadow-[0_28px_90px_-44px_rgba(6,182,212,0.28)]">
      <div className="relative aspect-video overflow-hidden border-b border-[color:var(--border)] bg-[color:var(--surface-strong)]">
        <video
          controls
          preload="metadata"
          poster={video.thumbnail}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          aria-label={video.title}
        >
          <source src={video.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{video.category}</Badge>
          {video.date ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border)] px-3 py-1 text-xs text-[color:var(--muted)]">
              <CalendarDays className="h-3.5 w-3.5" />
              {video.date}
            </span>
          ) : null}
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-[color:var(--text)]">{video.title}</h3>
          <p className="text-sm leading-7 text-[color:var(--muted)]">{video.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
