export interface VideoItem {
  id: string;
  title: string;
  description: string;
  src: string;
  thumbnail?: string;
  category: "Padel" | "Pickleball" | "Cricket" | "Badminton" | "Table Tennis" | "Facility";
  date?: string;
}

// Add real Elite Courts videos here after placing MP4 files in /public/videos.
// Example:
// {
//   id: "padel-night-rally",
//   title: "Padel night rally",
//   description: "A short rally clip from Elite Courts Lahore.",
//   src: "/videos/padel-night-rally.mp4",
//   thumbnail: "/videos/thumbnails/padel-night-rally.webp",
//   category: "Padel",
//   date: "2026-04-27",
// }
export const videos: VideoItem[] = [];
