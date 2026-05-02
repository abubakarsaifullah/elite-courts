import Link from "next/link";
import { ExternalLink, Quote, Star } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getReviewSummary } from "@/lib/google-reviews";
import { testimonialsContent, type Testimonial } from "@/data/testimonials";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={index < rating ? "h-4 w-4 fill-amber-400 text-amber-400" : "h-4 w-4 text-[color:var(--border-strong)]"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Testimonial }) {
  return (
    <Card className="group h-full hover:-translate-y-1 hover:border-cyan-400/25 hover:shadow-[0_28px_90px_-45px_rgba(6,182,212,0.25)]">
      <CardContent className="flex h-full flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-[color:var(--text)]">{review.customerName}</p>
            <p className="mt-1 text-xs font-medium text-[color:var(--muted)]">{review.source}</p>
          </div>
          <div className="rounded-2xl bg-[color:var(--accent-soft)] p-2 text-[color:var(--accent-strong)] transition-transform duration-200 group-hover:-translate-y-0.5">
            <Quote className="h-4 w-4" />
          </div>
        </div>
        <Stars rating={review.rating} />
        <p className="text-sm leading-7 text-[color:var(--muted-strong)]">“{review.message}”</p>
        {review.date ? <p className="mt-auto text-xs text-[color:var(--muted)]">{review.date}</p> : null}
      </CardContent>
    </Card>
  );
}

export async function TestimonialsSection() {
  const summary = await getReviewSummary();
  const hasReviews = summary.reviews.length > 0;

  return (
    <section className="border-y border-[color:var(--border)] bg-[color:var(--surface-soft)] py-16 sm:py-20">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow={testimonialsContent.eyebrow}
          title={testimonialsContent.title}
          description={testimonialsContent.description}
          actions={
            summary.googleMapsUri ? (
              <Button asChild variant="secondary">
                <Link href={summary.googleMapsUri} target="_blank" rel="noreferrer">
                  View on Google
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            ) : null
          }
        />

        {hasReviews ? (
          <>
            {summary.rating ? (
              <div className="flex flex-wrap items-center gap-3 rounded-[1.6rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-4 text-sm text-[color:var(--muted-strong)] shadow-[var(--shadow)] backdrop-blur-xl">
                <Stars rating={Math.round(summary.rating)} />
                <span className="font-semibold text-[color:var(--text)]">{summary.rating.toFixed(1)}</span>
                {summary.userRatingCount ? <span>from {summary.userRatingCount.toLocaleString("en-PK")} Google reviews</span> : null}
                {summary.source === "google" ? <span translate="no" className="text-xs text-[color:var(--muted)]">Google Maps</span> : null}
              </div>
            ) : null}

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {summary.reviews.slice(0, 6).map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            {summary.source === "google" ? (
              <p className="text-xs leading-6 text-[color:var(--muted)]">
                {testimonialsContent.googleAttribution} <span translate="no">Google Maps</span>
              </p>
            ) : null}
          </>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col gap-4 p-8 sm:p-10">
              <div className="rounded-2xl bg-[color:var(--accent-soft)] p-3 text-[color:var(--accent-strong)] w-fit">
                <Star className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-[color:var(--text)]">{testimonialsContent.emptyTitle}</h3>
                <p className="max-w-3xl text-sm leading-7 text-[color:var(--muted)]">{testimonialsContent.emptyDescription}</p>
              </div>
              {summary.googleMapsUri ? (
                <Button asChild variant="secondary" className="w-fit">
                  <Link href={summary.googleMapsUri} target="_blank" rel="noreferrer">
                    Open Google Maps
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              ) : null}
            </CardContent>
          </Card>
        )}
      </Container>
    </section>
  );
}
