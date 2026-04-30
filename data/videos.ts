export interface VideoItem {
  id: string;
  watchUrl: string;
  embedUrl: string;
}

// Add/remove videos by editing only this array.
// - Add a video: paste a YouTube watch/share URL in this list.
// - Remove a video: delete the URL from this list.
const videoLinks = ["https://www.youtube.com/watch?v=DacjaZlntM0"];

function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1) || null;
    }

    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return id;

      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.replace("/embed/", "") || null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export const videos: VideoItem[] = videoLinks
  .map((link, index) => {
    const videoId = extractYouTubeId(link);
    if (!videoId) return null;

    return {
      id: `${videoId}-${index}`,
      watchUrl: link,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
    };
  })
  .filter((video): video is VideoItem => video !== null);
