import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { PricingPackageCard } from "@/components/pricing/package-card";
import { CtaBanner } from "@/components/cta-banner";
import { pageContent } from "@/data/siteContent";
import { getPackagesForSection, packageSections } from "@/data/packages";

export const metadata = buildMetadata({
  title: pageContent.pricing.metadataTitle,
  description: pageContent.pricing.metadataDescription,
  path: "/pricing",
});

export default function PricingPage() {
  const page = pageContent.pricing;

  return (
    <>
      <PageHero eyebrow={page.hero.eyebrow} title={page.hero.title} description={page.hero.description} />

      <section className="py-14 sm:py-16">
        <Container className="space-y-7">
          <SectionHeading eyebrow={page.intro.eyebrow} title={page.intro.title} description={page.intro.description} maxWidth="wide" />
          <div className="flex flex-wrap gap-2">
            {packageSections.map((section) => (
              <Link
                key={section.id}
                href={`#${section.id}`}
                className="group inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-sm font-semibold text-[color:var(--muted-strong)] transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:text-[color:var(--text)]"
              >
                {section.label}
                <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {packageSections.map((section, index) => {
        const items = getPackagesForSection(section);
        const muted = index % 2 === 0;

        return (
          <section
            key={section.id}
            id={section.id}
            className={muted ? "scroll-mt-24 border-y border-[color:var(--border)] bg-[color:var(--surface-soft)] py-16 sm:py-20" : "scroll-mt-24 py-16 sm:py-20"}
          >
            <Container className="space-y-8">
              <SectionHeading eyebrow={section.eyebrow} title={section.title} description={section.description} maxWidth="wide" />
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <PricingPackageCard key={item.id} item={item} />
                ))}
              </div>
              {"note" in section && section.note && (
                <p className="text-sm text-[color:var(--accent-strong)]">
                  {section.note}
                </p>
              )}
            </Container>
          </section>
        );
      })}

      <CtaBanner title={page.cta.title} description={page.cta.description} />
    </>
  );
}
