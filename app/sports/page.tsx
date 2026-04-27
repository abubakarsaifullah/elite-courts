import { buildMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/section-heading";
import { SportCard } from "@/components/sport-card";
import { CtaBanner } from "@/components/cta-banner";
import { pageContent, sports } from "@/data/siteContent";

export const metadata = buildMetadata({
  title: pageContent.sports.metadataTitle,
  description: pageContent.sports.metadataDescription,
  path: "/sports",
});

export default function SportsPage() {
  const page = pageContent.sports;

  return (
    <>
      <PageHero eyebrow={page.hero.eyebrow} title={page.hero.title} description={page.hero.description} />

      <section className="py-16 sm:py-20">
        <Container className="space-y-10">
          <SectionHeading eyebrow={page.section.eyebrow} title={page.section.title} description={page.section.description} />
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {sports.map((sport) => (
              <SportCard key={sport.slug} sport={sport} />
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner title={page.cta.title} description={page.cta.description} />
    </>
  );
}
