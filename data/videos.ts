// Video gallery configuration
//
// Add, remove, or update videos here. The Videos/Highlights page reads this file only.
//
// How to add videos:
// - YouTube: set type to "youtube" and paste a normal YouTube watch URL, Shorts URL, youtu.be URL,
//   or embed URL in the url field. The helper below extracts the video ID automatically.
// - TikTok: set type to "tiktok" and paste the full public TikTok video URL, for example
//   https://www.tiktok.com/@elite.courts/video/1234567890. The helper extracts the post ID.
// - Local MP4: place the file in public/videos/ and the thumbnail in public/videos/thumbnails/.
//
// Keep the order numbers unique. Lower order numbers appear first.
// Do not upload very large uncompressed videos.

export type VideoType = "youtube" | "tiktok" | "instagram" | "local" | "external";
export type VideoCategory = "All" | "Padel" | "Pickleball" | "Cricket" | "Badminton" | "Table Tennis" | "Facility" | "Highlights";

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  category: Exclude<VideoCategory, "All">;
  type: VideoType;
  url: string;
  thumbnail?: string;
  alt: string;
  order: number;
  date?: string;
}

export const videoCategories = ["All", "Highlights", "Padel", "Pickleball", "Cricket", "Badminton", "Table Tennis", "Facility"] as const satisfies readonly VideoCategory[];

export const videos = [
  {
    id: "youtube-feature-1",
    title: "Elite Courts video highlight",
    description: "A public video from the Elite Courts YouTube channel.",
    category: "Highlights",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=DacjaZlntM0",
    thumbnail: "https://img.youtube.com/vi/DacjaZlntM0/hqdefault.jpg",
    alt: "Elite Courts YouTube video thumbnail",
    order: 1,
  },
  {
    id: "youtube-short-1",
    title: "Elite Courts short clip",
    description: "A short public clip from the Elite Courts YouTube channel.",
    category: "Highlights",
    type: "youtube",
    url: "https://www.youtube.com/shorts/2icrqlN5iG4",
    thumbnail: "https://img.youtube.com/vi/2icrqlN5iG4/hqdefault.jpg",
    alt: "Elite Courts YouTube Shorts thumbnail",
    order: 2,
  },
  {
    id: "youtube-short-2",
    title: "Elite Courts short clip",
    description: "A short public clip from the Elite Courts YouTube channel.",
    category: "Highlights",
    type: "youtube",
    url: "https://www.youtube.com/shorts/3Ckb50rwJRQ",
    thumbnail: "https://img.youtube.com/vi/3Ckb50rwJRQ/hqdefault.jpg",
    alt: "Elite Courts YouTube Shorts thumbnail",
    order: 3,
  },
  {
    id: "youtube-short-3",
    title: "Elite Courts short clip",
    description: "A short public clip from the Elite Courts YouTube channel.",
    category: "Highlights",
    type: "youtube",
    url: "https://www.youtube.com/shorts/YIh9CDtucPQ",
    thumbnail: "https://img.youtube.com/vi/YIh9CDtucPQ/hqdefault.jpg",
    alt: "Elite Courts YouTube Shorts thumbnail",
    order: 4,
  },
  {
    id: "youtube-short-4",
    title: "Elite Courts short clip",
    description: "A short public clip from the Elite Courts YouTube channel.",
    category: "Highlights",
    type: "youtube",
    url: "https://www.youtube.com/shorts/ZlmKEQB0Umc",
    thumbnail: "https://img.youtube.com/vi/ZlmKEQB0Umc/hqdefault.jpg",
    alt: "Elite Courts YouTube Shorts thumbnail",
    order: 5,
  },
  {
    id: "tiktok-7592347919181761810",
    title: "Elite Courts TikTok highlight",
    description: "A public TikTok clip from the Elite Courts account.",
    category: "Highlights",
    type: "tiktok",
    url: "https://www.tiktok.com/@elite.courts/video/7592347919181761810",
    alt: "Elite Courts TikTok video preview",
    order: 6,
  },
  {
    id: "tiktok-7631754920902839572",
    title: "Elite Courts TikTok highlight",
    description: "A public TikTok clip from the Elite Courts account.",
    category: "Highlights",
    type: "tiktok",
    url: "https://www.tiktok.com/@elite.courts/video/7631754920902839572",
    alt: "Elite Courts TikTok video preview",
    order: 7,
  },
  {
    id: "tiktok-7595633165780192530",
    title: "Elite Courts TikTok highlight",
    description: "A public TikTok clip from the Elite Courts account.",
    category: "Highlights",
    type: "tiktok",
    url: "https://www.tiktok.com/@elite.courts/video/7595633165780192530",
    alt: "Elite Courts TikTok video preview",
    order: 8,
  },
  {
    id: "tiktok-7590725879936912661",
    title: "Elite Courts TikTok highlight",
    description: "A public TikTok clip from the Elite Courts account.",
    category: "Highlights",
    type: "tiktok",
    url: "https://www.tiktok.com/@elite.courts/video/7590725879936912661",
    alt: "Elite Courts TikTok video preview",
    order: 9,
  },
  {
    id: "tiktok-7612472898879507732",
    title: "Elite Courts TikTok highlight",
    description: "A public TikTok clip from the Elite Courts account.",
    category: "Highlights",
    type: "tiktok",
    url: "https://www.tiktok.com/@elite.courts/video/7612472898879507732",
    alt: "Elite Courts TikTok video preview",
    order: 10,
  },
  {
    id: "tiktok-7595194179559771410",
    title: "Elite Courts TikTok highlight",
    description: "A public TikTok clip from the Elite Courts account.",
    category: "Highlights",
    type: "tiktok",
    url: "https://www.tiktok.com/@elite.courts/video/7595194179559771410",
    alt: "Elite Courts TikTok video preview",
    order: 11,
  },
] as const satisfies readonly VideoItem[];

export function sortVideos(items: readonly VideoItem[]) {
  return [...items].sort((a, b) => a.order - b.order);
}

export function extractYouTubeId(url: string) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1).split("/")[0] || null;
    }

    if (parsed.hostname.includes("youtube.com")) {
      const fromQuery = parsed.searchParams.get("v");
      if (fromQuery) return fromQuery;

      if (parsed.pathname.startsWith("/embed/")) return parsed.pathname.replace("/embed/", "").split("/")[0] || null;
      if (parsed.pathname.startsWith("/shorts/")) return parsed.pathname.replace("/shorts/", "").split("/")[0] || null;
    }
  } catch {
    return null;
  }

  return null;
}

export function extractTikTokId(url: string) {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("tiktok.com")) return null;

    const segments = parsed.pathname.split("/").filter(Boolean);
    const videoIndex = segments.findIndex((segment) => segment === "video");
    return videoIndex >= 0 ? segments[videoIndex + 1] || null : null;
  } catch {
    return null;
  }
}

export function getVideoEmbedUrl(video: VideoItem, options: { autoplay?: boolean } = {}) {
  if (video.type === "youtube") {
    const id = extractYouTubeId(video.url);
    if (!id) return null;

    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
    });

    if (options.autoplay) params.set("autoplay", "1");

    return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
  }

  if (video.type === "tiktok") {
    const id = extractTikTokId(video.url);
    if (!id) return null;

    const params = new URLSearchParams({
      controls: "1",
      autoplay: "0",
      loop: "0",
      rel: "0",
      music_info: "1",
      description: "1",
    });

    return `https://www.tiktok.com/player/v1/${id}?${params.toString()}`;
  }

  if (video.type === "instagram") return video.url;
  if (video.type === "external") return video.url;
  return null;
}
