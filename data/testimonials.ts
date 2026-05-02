// Testimonials and review fallbacks
//
// Do not add fake reviews. Add only real customer comments you have permission to use,
// or enable the Google Places API settings in .env.local so the site can fetch Google
// review data on the server.

export interface Testimonial {
  id: string;
  customerName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  message: string;
  source: "Google Review" | "Customer Feedback";
  date?: string;
}

export const testimonials: readonly Testimonial[] = [
  // Example format for a real review you can add later:
  // {
  //   id: "customer-review-1",
  //   customerName: "Customer Name",
  //   rating: 5,
  //   message: "Paste the real customer review here.",
  //   source: "Google Review",
  //   date: "2026-05-01",
  // },
];

export const testimonialsContent = {
  eyebrow: "Customer reviews",
  title: "Real reviews, connected the right way.",
  description:
    "This section is ready for live Google reviews through the official Places API or for manually approved real customer feedback.",
  emptyTitle: "Google reviews can appear here after setup.",
  emptyDescription:
    "Add GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID in your environment variables, or add real approved reviews to data/testimonials.ts. No placeholder or fake reviews are shown.",
  googleAttribution: "Reviews provided by Google Maps when API credentials are configured.",
} as const;
