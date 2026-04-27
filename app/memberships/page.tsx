import { buildMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/layout/container";
import { MembershipCard } from "@/components/membership-grid";
import { SectionHeading } from "@/components/section-heading";
import { CtaBanner } from "@/components/cta-banner";
import { pageContent } from "@/data/siteContent";
import { memberships } from "@/data/packages";

export const metadata = buildMetadata({
  title: pageContent.memberships.metadataTitle,
  description: pageContent.memberships.metadataDescription,
  path: "/memberships",
});

export default function MembershipsPage() {
  const page = pageContent.memberships;

  return (
    <>
      <PageHero eyebrow={page.hero.eyebrow} title={page.hero.title} description={page.hero.description} />

      <section className="py-16 sm:py-20">
        <Container className="space-y-10">
          <SectionHeading eyebrow={page.section.eyebrow} title={page.section.title} description={page.section.description} />
          <div className="grid gap-6 lg:grid-cols-2">
            {memberships.map((membership) => (
              <MembershipCard key={membership.slug} membership={membership} />
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner title={page.cta.title} description={page.cta.description} />
    </>
  );
}
