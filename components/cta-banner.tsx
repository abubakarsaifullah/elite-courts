import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl, siteConfig } from "@/data/siteContent";

interface CtaBannerProps {
  title: string;
  description: string;
  message?: string;
}

export function CtaBanner({ title, description, message }: CtaBannerProps) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="rounded-[2rem] border border-[color:var(--border)] bg-[linear-gradient(135deg,rgba(6,182,212,0.12),rgba(255,255,255,0.02))] p-8 shadow-[0_28px_90px_-40px_rgba(6,182,212,0.24)] backdrop-blur-xl sm:p-10 lg:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[color:var(--accent-strong)]">Ready to play?</p>
              <h2 className="text-balance text-3xl font-semibold text-[color:var(--text)] sm:text-4xl lg:text-5xl">{title}</h2>
              <p className="max-w-2xl text-base leading-7 text-[color:var(--muted)]">{description}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={buildWhatsAppUrl(message || siteConfig.primaryWhatsappMessage)} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  Book now
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/contact">
                  Contact Elite Courts
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
