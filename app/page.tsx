import Link from "next/link";
import { ArrowRight, ShieldCheck, Star, Users } from "lucide-react";
import { HeroSlider } from "@/components/hero-slider";
import { AmenitiesGrid } from "@/components/amenities-grid";
import { Container } from "@/components/layout/container";
import { LocationPreview } from "@/components/location-preview";
import { MembershipCard } from "@/components/membership-grid";
import { PricingPackageCard } from "@/components/pricing/package-card";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SportCard } from "@/components/sport-card";
import { CtaBanner } from "@/components/cta-banner";
import { NewPackagesSection } from "@/components/home/new-packages-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/json-ld";
import { pageContent, reasonsToChoose, siteConfig, sports } from "@/data/siteContent";
import { businessHours, weekdayOrder } from "@/data/businessHours";
import { featuredHomePackages, memberships, packagePriceRange, quickPricingHighlights, visiblePackages } from "@/data/packages";

const schema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "SportsActivityLocation"],
  name: siteConfig.name,
  url: siteConfig.siteUrl,
  description: siteConfig.locationSummary,
  telephone: "+92 308 4708858",
  email: siteConfig.email,
  priceRange: packagePriceRange,
  address: {
    "@type": "PostalAddress",
    streetAddress: "23-A, P&D Cooperative Housing Society, Main Canal Road",
    addressLocality: "Lahore",
    addressCountry: "PK",
  },
  areaServed: "Lahore",
  openingHoursSpecification: weekdayOrder.map((day) => {
    const hours = businessHours.weeklyHours[day];
    return {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
      opens: hours.open,
      closes: hours.close,
    };
  }),
  sameAs: siteConfig.socialLinks.map((item) => item.href),
  makesOffer: visiblePackages.slice(0, 12).map((item) => ({
    "@type": "Offer",
    name: item.title,
    price: item.discountedPrice,
    priceCurrency: "PKR",
    availability: "https://schema.org/InStock",
  })),
};

export default function HomePage() {
  const home = pageContent.home;

  return (
    <>
      <JsonLd data={schema} />
      <HeroSlider />
      <NewPackagesSection />

      <section className="py-16 sm:py-20">
        <Container className="space-y-10">
          <SectionHeading
            eyebrow={home.sports.eyebrow}
            title={home.sports.title}
            description={home.sports.description}
            maxWidth="wide"
            actions={
              <Button asChild variant="secondary">
                <Link href="/sports">
                  {home.sports.actionLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            }
          />
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {sports.map((sport, index) => (
              <Reveal key={sport.slug} delay={index * 0.05}>
                <SportCard sport={sport} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-[color:var(--border)] bg-[color:var(--surface-soft)] py-16 sm:py-20">
        <Container className="space-y-10">
          <SectionHeading eyebrow={home.why.eyebrow} title={home.why.title} description={home.why.description} maxWidth="wide" />
          <div className="grid gap-6 lg:grid-cols-3">
            {reasonsToChoose.map((reason, index) => {
              const icons = [ShieldCheck, Users, Star] as const;
              const Icon = icons[index] || Star;
              return (
                <Reveal key={reason.title} delay={index * 0.05}>
                  <Card className="group h-full hover:-translate-y-1 hover:shadow-[0_28px_70px_-40px_rgba(8,145,178,0.22)]">
                    <CardContent className="space-y-4">
                      <div className="inline-flex rounded-2xl bg-[color:var(--accent-soft)] p-3 text-[color:var(--accent-strong)] transition-transform duration-200 group-hover:-translate-y-0.5">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-display text-2xl font-semibold text-[color:var(--text)]">{reason.title}</h3>
                        <p className="text-sm leading-7 text-[color:var(--muted)]">{reason.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-6">
            <SectionHeading eyebrow={home.pricing.eyebrow} title={home.pricing.title} description={home.pricing.description} />
            <div className="space-y-4">
              {quickPricingHighlights.map((item) => (
                <Card key={item} className="hover:-translate-y-0.5 hover:border-cyan-400/20">
                  <CardContent className="p-5 text-sm leading-7 text-[color:var(--text)]">{item}</CardContent>
                </Card>
              ))}
            </div>
            <Button asChild variant="secondary">
              <Link href="/pricing">
                {home.pricing.actionLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {featuredHomePackages.map((item) => (
              <PricingPackageCard key={item.id} item={item} compact />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-[color:var(--border)] bg-[color:var(--surface-soft)] py-16 sm:py-20">
        <Container className="space-y-10">
          <SectionHeading
            eyebrow={home.memberships.eyebrow}
            title={home.memberships.title}
            description={home.memberships.description}
            actions={
              <Button asChild variant="secondary">
                <Link href="/memberships">
                  {home.memberships.actionLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            }
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {memberships.map((membership, index) => (
              <Reveal key={membership.slug} delay={index * 0.05}>
                <MembershipCard membership={membership} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>


      {siteConfig.showCustomerReviews && <TestimonialsSection />}

      <section className="py-16 sm:py-20">
        <Container className="space-y-10">
          <SectionHeading eyebrow={home.amenities.eyebrow} title={home.amenities.title} description={home.amenities.description} maxWidth="wide" />
          <AmenitiesGrid />
        </Container>
      </section>

      <section className="border-y border-[color:var(--border)] bg-[color:var(--surface-soft)] py-16 sm:py-20">
        <Container className="space-y-10">
          <SectionHeading eyebrow={home.location.eyebrow} title={home.location.title} description={home.location.description} maxWidth="wide" />
          <LocationPreview />
        </Container>
      </section>

      <CtaBanner title={home.cta.title} description={home.cta.description} />
    </>
  );
}
