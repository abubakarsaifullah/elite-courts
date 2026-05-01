export interface VideoItem {
  id: string;
  embedId: string;
  platform: "youtube" | "tiktok";
  isShort?: boolean;
  watchUrl: string;
  embedUrl: string;
}

// Add/remove videos by editing only this array.
// - Add a video: paste a YouTube or TikTok URL in this list.
// - Remove a video: delete the URL from this list.
const videoLinks = [
  "https://www.youtube.com/watch?v=DacjaZlntM0",
  "https://www.youtube.com/shorts/2icrqlN5iG4",
  "https://www.youtube.com/shorts/3Ckb50rwJRQ",
  "https://www.youtube.com/shorts/YIh9CDtucPQ",
  "https://www.youtube.com/shorts/ZlmKEQB0Umc",
  "https://www.tiktok.com/@elite.courts/video/7592347919181761810",
  "https://www.tiktok.com/@elite.courts/video/7631754920902839572",
  "https://www.tiktok.com/@elite.courts/video/7595633165780192530",
  "https://www.tiktok.com/@elite.courts/video/7590725879936912661",
  "https://www.tiktok.com/@elite.courts/video/7612472898879507732",
  "https://www.tiktok.com/@elite.courts/video/7595194179559771410",
];

function extractYouTube(url: string): { videoId: string; isShort: boolean } | null {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      const videoId = parsed.pathname.slice(1);
      return videoId ? { videoId, isShort: false } : null;
    }

    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return { videoId: id, isShort: false };

      if (parsed.pathname.startsWith("/embed/")) {
        const videoId = parsed.pathname.replace("/embed/", "");
        return videoId ? { videoId, isShort: false } : null;
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        const videoId = parsed.pathname.replace("/shorts/", "").split("/")[0];
        return videoId ? { videoId, isShort: true } : null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

function extractTikTokVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("tiktok.com")) return null;

    const segments = parsed.pathname.split("/").filter(Boolean);
    const videoIndex = segments.findIndex((segment) => segment === "video");
    if (videoIndex === -1) return null;

    return segments[videoIndex + 1] || null;
  } catch {
    return null;
  }
}

export const videos: VideoItem[] = videoLinks
  .map((link, index): VideoItem | null => {
    const youTubeData = extractYouTube(link);
    if (youTubeData) {
      return {
        id: `${youTubeData.videoId}-${index}`,
        embedId: youTubeData.videoId,
        platform: "youtube" as const,
        isShort: youTubeData.isShort,
        watchUrl: link,
        embedUrl: `https://www.youtube-nocookie.com/embed/${youTubeData.videoId}`,
      };
    }

    const tikTokId = extractTikTokVideoId(link);
    if (!tikTokId) return null;

    return {
      id: `${tikTokId}-${index}`,
      embedId: tikTokId,
      platform: "tiktok" as const,
      watchUrl: link,
      embedUrl: `https://www.tiktok.com/embed/v2/${tikTokId}?autoplay=0&playButton=1`,
    };
  })
  .filter((video): video is VideoItem => video !== null);
