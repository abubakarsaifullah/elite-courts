import { buildMetadata } from "@/lib/metadata";
import { ContactDetails } from "@/components/contact-details";
import { ContactForm } from "@/components/contact-form";
import { Container } from "@/components/layout/container";
import { LocationPreview } from "@/components/location-preview";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { pageContent } from "@/data/siteContent";

export const metadata = buildMetadata({
  title: pageContent.contact.metadataTitle,
  description: pageContent.contact.metadataDescription,
  path: "/contact",
});

export default function ContactPage() {
  const page = pageContent.contact;

  return (
    <>
      <PageHero eyebrow={page.hero.eyebrow} title={page.hero.title} description={page.hero.description} />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="space-y-8">
            <SectionHeading eyebrow={page.details.eyebrow} title={page.details.title} description={page.details.description} />
            <ContactDetails />
          </div>
          <div className="space-y-8">
            <SectionHeading eyebrow={page.form.eyebrow} title={page.form.title} description={page.form.description} />
            <ContactForm />
          </div>
        </Container>
      </section>

      <section className="border-y border-[color:var(--border)] bg-[color:var(--surface-soft)] py-16 sm:py-20">
        <Container className="space-y-10">
          <SectionHeading eyebrow={page.location.eyebrow} title={page.location.title} description={page.location.description} />
          <LocationPreview />
        </Container>
      </section>
    </>
  );
}
