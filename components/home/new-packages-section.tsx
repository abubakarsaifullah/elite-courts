import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PricingPackageCard } from "@/components/pricing/package-card";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { getNewPackages } from "@/data/packages";
import { pageContent } from "@/data/siteContent";

export function NewPackagesSection() {
  const items = getNewPackages(4);

  if (!items.length) return null;

  const content = pageContent.home.newPackages;

  return (
    <section className="border-b border-[color:var(--border)] bg-[linear-gradient(135deg,rgba(16,185,129,0.08),rgba(6,182,212,0.06),transparent_70%)] py-14 sm:py-16">
      <Container className="space-y-8">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
          maxWidth="wide"
          actions={
            <Button asChild variant="secondary">
              <Link href="/pricing">
                {content.actionLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          }
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.05}>
              <div className="relative h-full">
                <div className="pointer-events-none absolute -right-2 -top-2 z-10 inline-flex rounded-full bg-emerald-400 p-2 text-slate-950 shadow-[0_16px_42px_-22px_rgba(16,185,129,0.95)]">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </div>
                <PricingPackageCard item={item} compact />
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
