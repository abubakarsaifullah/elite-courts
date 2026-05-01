"use client";

import { Film } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { pageContent } from "@/data/siteContent";
import type { VideoItem } from "@/data/videos";

interface VideoGridProps {
  videos: VideoItem[];
  columnsClassName?: string;
}

export function VideoGrid({ videos, columnsClassName = "grid gap-6 md:grid-cols-2 xl:grid-cols-3" }: VideoGridProps) {
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
    <>
      <div className={columnsClassName}>
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </>
  );
}

function VideoCard({ video }: { video: VideoItem }) {
  return (
    <Card className="group h-full overflow-hidden hover:-translate-y-1 hover:border-cyan-400/25 hover:shadow-[0_28px_90px_-44px_rgba(6,182,212,0.28)]">
      <div className="relative overflow-hidden border-b border-[color:var(--border)] bg-[color:var(--surface-strong)]">
        {video.platform === "youtube" ? (
          <div className={video.isShort ? "mx-auto aspect-[9/16] max-h-[38rem] w-full max-w-[22rem]" : "aspect-video"}>
            <iframe
              src={video.embedUrl}
              title={video.isShort ? "Elite Courts YouTube Short" : "Elite Courts YouTube video"}
              loading="lazy"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="mx-auto aspect-[9/16] max-h-[38rem] w-full max-w-[22rem]">
            <iframe
              src={video.embedUrl}
              title="Elite Courts TikTok video"
              loading="lazy"
              className="h-full w-full"
              allow="encrypted-media; fullscreen; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        )}
      </div>
      <CardContent>
        <a
          href={video.watchUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-[color:var(--accent-strong)] hover:underline"
        >
          {video.platform === "youtube" ? "Watch on YouTube" : "Watch on TikTok"}
        </a>
      </CardContent>
    </Card>
  );
}
