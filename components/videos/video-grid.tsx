"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ExternalLink, Film, Play, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { pageContent } from "@/data/siteContent";
import { getVideoEmbedUrl, sortVideos, videoCategories, type VideoCategory, type VideoItem, type VideoType } from "@/data/videos";
import { cn } from "@/lib/utils";

interface VideoGridProps {
  videos: readonly VideoItem[];
  columnsClassName?: string;
}

const platformSections = [
  {
    type: "youtube",
    title: "YouTube",
    description: "Longer videos and Shorts from the Elite Courts YouTube channel.",
  },
  {
    type: "tiktok",
    title: "TikTok",
    description: "Quick match clips, rallies, and short highlights from TikTok.",
  },
] as const satisfies readonly { type: VideoType; title: string; description: string }[];

export function VideoGrid({ videos, columnsClassName = "grid gap-6 md:grid-cols-2 xl:grid-cols-3" }: VideoGridProps) {
  const [activeCategory, setActiveCategory] = useState<VideoCategory>("All");
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const availableCategories = useMemo(() => {
    const present = new Set<VideoCategory>(videos.map((video: VideoItem) => video.category));
    return videoCategories.filter((category) => category === "All" || present.has(category));
  }, [videos]);

  const filteredVideos = useMemo(() => {
    const items = activeCategory === "All" ? videos : videos.filter((video: VideoItem) => video.category === activeCategory);
    return sortVideos(items);
  }, [activeCategory, videos]);

  const groupedSections = useMemo(() => {
    const knownTypes = new Set<VideoType>(platformSections.map((section) => section.type));
    const primarySections = platformSections
      .map((section) => ({
        ...section,
        videos: filteredVideos.filter((video: VideoItem) => video.type === section.type),
      }))
      .filter((section) => section.videos.length > 0);

    const otherVideos = filteredVideos.filter((video: VideoItem) => !knownTypes.has(video.type));

    if (!otherVideos.length) return primarySections;

    return [
      ...primarySections,
      {
        type: "external" as VideoType,
        title: "More Videos",
        description: "Additional clips and links from other platforms.",
        videos: otherVideos,
      },
    ];
  }, [filteredVideos]);

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
    <div className="space-y-10">
      <div className="flex flex-wrap gap-2">
        {availableCategories.map((category: VideoCategory) => (
          <button
            key={category}
            type="button"
            onClick={() => {
              setActiveCategory(category);
              setActiveVideoId(null);
            }}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35",
              category === activeCategory
                ? "border-cyan-400/50 bg-[color:var(--accent-soft)] text-[color:var(--text)] shadow-sm"
                : "border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--muted-strong)] hover:-translate-y-0.5 hover:border-cyan-400/30 hover:text-[color:var(--text)]",
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-14">
        {groupedSections.map((section: { title: string; description: string; videos: readonly VideoItem[] }) => (
          <section key={section.title} className="space-y-5" aria-labelledby={`${section.title.toLowerCase().replace(/\s+/g, "-")}-videos`}>
            <div className="flex flex-col gap-2 border-l-2 border-[color:var(--accent)] pl-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--accent-strong)]">{section.title}</p>
              <h2 id={`${section.title.toLowerCase().replace(/\s+/g, "-")}-videos`} className="text-2xl font-semibold tracking-tight text-[color:var(--text)] sm:text-3xl">
                {section.title} highlights
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-[color:var(--muted)]">{section.description}</p>
            </div>

            <div className={columnsClassName}>
              {section.videos.map((video: VideoItem) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  isActive={activeVideoId === video.id}
                  onActivate={() => setActiveVideoId(video.id)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function VideoCard({ video, isActive, onActivate }: { video: VideoItem; isActive: boolean; onActivate: () => void }) {
  const isVertical = video.type === "tiktok" || video.url.includes("/shorts/");
  const mediaRatio = isVertical ? "aspect-[9/16]" : "aspect-video";

  return (
    <Card className="group h-full overflow-hidden hover:-translate-y-1 hover:border-cyan-400/25 hover:shadow-[0_28px_90px_-44px_rgba(6,182,212,0.28)]">
      <div className="relative overflow-hidden border-b border-[color:var(--border)] bg-[color:var(--surface-strong)]">
        {isActive ? (
          <ActivePlayer video={video} className={mediaRatio} />
        ) : (
          <button
            type="button"
            onClick={onActivate}
            className={cn("relative block w-full overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40", mediaRatio)}
            aria-label={`Play ${video.title}`}
          >
            {video.thumbnail ? (
              <Image
                src={video.thumbnail}
                alt={video.alt}
                fill
                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-105"
                unoptimized={video.thumbnail.startsWith("https://")}
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.22),transparent_38%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(2,6,23,0.76))]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/18 to-transparent" />
            <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
              {formatVideoType(video.type)}
            </div>
            <span className="absolute left-1/2 top-1/2 inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/18 text-white shadow-[0_20px_60px_-24px_rgba(2,6,23,0.95)] backdrop-blur-md transition duration-300 group-hover:scale-110 group-hover:bg-white/25">
              <Play className="ml-1 h-7 w-7 fill-current" />
            </span>
            <div className="absolute inset-x-4 bottom-4 text-white">
              <p className="text-sm font-semibold drop-shadow">{getInactiveVideoActionLabel(video)}</p>
              <p className="mt-1 text-xs text-white/78">Only one video opens at a time.</p>
            </div>
          </button>
        )}
      </div>

      <CardContent className="space-y-4 p-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--accent-strong)]">
            <Video className="h-3.5 w-3.5" />
            {video.category}
          </div>
          <h3 className="text-xl font-semibold text-[color:var(--text)]">{video.title}</h3>
          <p className="text-sm leading-6 text-[color:var(--muted)]">{video.description}</p>
        </div>

        <Button asChild variant="secondary" size="sm">
          <a href={video.url} target="_blank" rel="noreferrer" aria-label={`Open ${video.title} on the original platform`}>
            Open original
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

function ActivePlayer({ video, className }: { video: VideoItem; className: string }) {
  const [embedFailed, setEmbedFailed] = useState(false);
  const embedUrl = getVideoEmbedUrl(video, { autoplay: video.type === "youtube" });

  if (video.type === "local") {
    return (
      <video className={cn("h-full w-full bg-black object-cover", className)} controls preload="metadata" poster={video.thumbnail}>
        <source src={video.url} type="video/mp4" />
        Your browser does not support this video.
      </video>
    );
  }

  if (!embedUrl || video.type === "external" || embedFailed) {
    return <VideoFallback video={video} className={className} />;
  }

  const allow =
    video.type === "youtube"
      ? "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
      : "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen";

  return (
    <div className={cn("relative mx-auto w-full overflow-hidden bg-black", className, video.type === "tiktok" && "max-h-[42rem] max-w-[24rem]")}>
      <iframe
        key={embedUrl}
        src={embedUrl}
        title={video.title}
        loading="lazy"
        className="h-full w-full border-0"
        allow={allow}
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        onError={() => setEmbedFailed(true)}
      />
      {video.type === "tiktok" ? (
        <a
          href={video.url}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          Watch on TikTok
        </a>
      ) : null}
    </div>
  );
}

function VideoFallback({ video, className }: { video: VideoItem; className: string }) {
  const label = video.type === "tiktok" ? "Watch on TikTok" : "Open video";

  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden bg-[color:var(--surface-strong)] p-6", className)}>
      {video.thumbnail ? (
        <Image src={video.thumbnail} alt={video.alt} fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover opacity-45" unoptimized={video.thumbnail.startsWith("https://")} />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.25),transparent_38%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(2,6,23,0.8))]" />
      )}
      <div className="relative z-10 max-w-xs space-y-3 text-center text-white">
        <p className="text-sm font-semibold">This embed may be blocked by the platform or browser.</p>
        <a href={video.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:shadow-lg">
          {label}
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

function getInactiveVideoActionLabel(video: VideoItem) {
  if (video.type === "youtube") return "Click to play";
  if (video.type === "tiktok") return "Click to load TikTok";
  return "Click to load";
}

function formatVideoType(type: VideoType) {
  if (type === "youtube") return "YouTube";
  if (type === "tiktok") return "TikTok";
  if (type === "instagram") return "Instagram";
  if (type === "local") return "Video";
  return "External";
}
