import { testimonials, type Testimonial } from "@/data/testimonials";

export interface GoogleReviewSummary {
  name: string;
  rating: number | null;
  userRatingCount: number | null;
  googleMapsUri: string | null;
  reviews: Testimonial[];
  source: "google" | "manual" | "empty";
}

interface GooglePlacesReview {
  rating?: number;
  publishTime?: string;
  relativePublishTimeDescription?: string;
  text?: { text?: string; languageCode?: string };
  originalText?: { text?: string; languageCode?: string };
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
}

interface GooglePlacesResponse {
  displayName?: { text?: string; languageCode?: string };
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: GooglePlacesReview[];
}

function normalizeRating(value: unknown): 1 | 2 | 3 | 4 | 5 {
  const numeric = typeof value === "number" ? Math.round(value) : 5;
  if (numeric <= 1) return 1;
  if (numeric === 2) return 2;
  if (numeric === 3) return 3;
  if (numeric === 4) return 4;
  return 5;
}

function getMapsSearchUrl() {
  return "https://www.google.com/maps/search/?api=1&query=Elite%20Courts%20Main%20Canal%20Road%20Lahore";
}

export async function getReviewSummary(): Promise<GoogleReviewSummary> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return {
      name: "Elite Courts",
      rating: null,
      userRatingCount: null,
      googleMapsUri: getMapsSearchUrl(),
      reviews: [...testimonials],
      source: testimonials.length ? "manual" : "empty",
    };
  }

  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "displayName,rating,userRatingCount,googleMapsUri,reviews",
      },
      next: { revalidate: 60 * 60 * 12 },
    });

    if (!response.ok) throw new Error(`Google Places request failed with ${response.status}`);

    const data = (await response.json()) as GooglePlacesResponse;
    const reviews = (data.reviews ?? [])
      .map((review, index): Testimonial | null => {
        const message = review.text?.text || review.originalText?.text || "";
        if (!message.trim()) return null;

        return {
          id: `google-review-${index}-${review.publishTime ?? "latest"}`,
          customerName: review.authorAttribution?.displayName || "Google reviewer",
          rating: normalizeRating(review.rating),
          message,
          source: "Google Review",
          date: review.relativePublishTimeDescription || review.publishTime,
        };
      })
      .filter((review): review is Testimonial => Boolean(review));

    return {
      name: data.displayName?.text || "Elite Courts",
      rating: data.rating ?? null,
      userRatingCount: data.userRatingCount ?? null,
      googleMapsUri: data.googleMapsUri || getMapsSearchUrl(),
      reviews: reviews.length ? reviews : [...testimonials],
      source: reviews.length ? "google" : testimonials.length ? "manual" : "empty",
    };
  } catch (error) {
    console.error("[google-reviews]", error);
    return {
      name: "Elite Courts",
      rating: null,
      userRatingCount: null,
      googleMapsUri: getMapsSearchUrl(),
      reviews: [...testimonials],
      source: testimonials.length ? "manual" : "empty",
    };
  }
}
