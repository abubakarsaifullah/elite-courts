import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}

export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-[color:var(--border)] py-20 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.16),transparent_28%),linear-gradient(180deg,transparent,rgba(15,23,42,0.04))]" />
      <Container className="relative">
        <div className="max-w-4xl space-y-6">
          <Badge>{eyebrow}</Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-[color:var(--text)] sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="max-w-3xl text-pretty text-lg leading-8 text-[color:var(--muted)]">{description}</p>
          {children}
        </div>
      </Container>
    </section>
  );
}
