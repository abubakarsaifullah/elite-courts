// Homepage slider configuration
//
// Add optimized slider images to public/images/slider/ and then add one object
// to this array. Keep the id unique, use a useful alt text, and keep captions short.
//
// Owner note:
// - Use landscape images when possible: 1920 x 1080px minimum, 2560 x 1440px for large screens.
// - objectPosition controls which part of the photo stays visible when the image is cropped.
//   Examples: "center", "top", "bottom", "left center", "right center".
// - quality controls Next/Image output quality. Keep slider images high quality, usually 90-95.

export interface SliderImage {
  id: string;
  src: string;
  alt: string;
  label: string;
  caption: string;
  objectPosition?: string;
  quality?: number;
  priority?: boolean;
}

export const sliderImages: readonly SliderImage[] = [
  {
    id: "padel-court",
    src: "/images/slider/padel-court.webp",
    alt: "Elite Courts padel court and player area in Lahore",
    label: "Padel",
    caption: "Premium padel courts for quick games, practice, and competitive rallies.",
    objectPosition: "center",
    quality: 95,
    priority: true,
  },
  {
    id: "cricket-practice",
    src: "/images/slider/cricket-practice.webp",
    alt: "Cricket bowling machine practice area at Elite Courts Lahore",
    label: "Cricket Practice",
    caption: "Bowling machine practice with swing, spin, speed gun, and focused net sessions.",
    objectPosition: "center",
    quality: 95,
  },
  {
    id: "racket-court",
    src: "/images/slider/racket-court.webp",
    alt: "Racket sports court space at Elite Courts Lahore",
    label: "Racket Sports",
    caption: "Pickleball, badminton, table tennis, and court sessions in one facility.",
    objectPosition: "center",
    quality: 95,
  },
  {
    id: "facility-view",
    src: "/images/slider/facility-view.webp",
    alt: "Elite Courts multi-sport facility view in Lahore",
    label: "Facility",
    caption: "Clean courts, useful player amenities, and simple WhatsApp booking.",
    objectPosition: "center",
    quality: 95,
  },
  {
    id: "session-highlight",
    src: "/images/slider/session-highlight.webp",
    alt: "Players enjoying a sports session at Elite Courts Lahore",
    label: "Highlights",
    caption: "Real match moments, training sessions, and everyday play at Elite Courts.",
    objectPosition: "center",
    quality: 95,
  },
];
