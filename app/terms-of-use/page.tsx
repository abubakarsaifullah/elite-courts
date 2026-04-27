import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { legalContent } from "@/data/siteContent";

export const metadata = buildMetadata({
  title: legalContent.termsOfUse.metadataTitle,
  description: legalContent.termsOfUse.metadataDescription,
  path: "/terms-of-use",
});

export default function TermsOfUsePage() {
  const page = legalContent.termsOfUse;

  return (
    <>
      <PageHero
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        description={`Effective date: ${page.effectiveDate}. ${page.hero.description}`}
      />

      <section className="py-16 sm:py-20">
        <Container className="space-y-6">
          {page.sections.map((section) => (
            <Card key={section.title}>
              <CardContent className="space-y-4">
                <h2 className="font-display text-2xl font-semibold text-[color:var(--text)]">{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-7 text-[color:var(--muted)]">
                    {paragraph}
                  </p>
                ))}
              </CardContent>
            </Card>
          ))}
        </Container>
      </section>
    </>
  );
}
