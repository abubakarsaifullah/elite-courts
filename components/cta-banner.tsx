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
        <div className="ready-to-play-card group/ready relative overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-[linear-gradient(135deg,rgba(6,182,212,0.14),rgba(255,255,255,0.025)_48%,rgba(16,185,129,0.1))] p-8 shadow-[0_28px_90px_-40px_rgba(6,182,212,0.24)] backdrop-blur-xl transition-all duration-300 sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_88%_78%,rgba(16,185,129,0.14),transparent_34%)] opacity-80" />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[color:var(--accent-strong)]">Ready to play?</p>
              <h2 className="text-balance text-3xl font-semibold text-[color:var(--text)] sm:text-4xl lg:text-5xl">{title}</h2>
              <p className="max-w-2xl text-base leading-7 text-[color:var(--muted)]">{description}</p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
              <Button
                asChild
                size="lg"
                className="ready-to-play-primary group/primary relative isolate min-h-12 overflow-hidden rounded-full bg-[linear-gradient(135deg,#22d3ee,#10b981)] px-6 text-slate-950 shadow-[0_20px_56px_-24px_rgba(16,185,129,0.95)] ring-1 ring-white/25 transition-all duration-300 hover:-translate-y-1 hover:brightness-105 hover:shadow-[0_28px_72px_-26px_rgba(34,211,238,0.85)] focus-visible:ring-2 focus-visible:ring-cyan-200/90 sm:min-w-[10.5rem]"
              >
                <Link href={buildWhatsAppUrl(message || siteConfig.primaryWhatsappMessage)} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4 transition-transform duration-300 group-hover/primary:-translate-y-0.5 group-hover/primary:scale-110" />
                  Book now
                </Link>
              </Button>

              <Button
                asChild
                variant="secondary"
                size="lg"
                className="group/secondary min-h-12 rounded-full border border-[color:var(--border-strong)] bg-[color:var(--surface)] px-6 text-[color:var(--text)] shadow-[0_18px_50px_-30px_rgba(2,6,23,0.72)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/35 hover:bg-[color:var(--surface-strong)] hover:shadow-[0_24px_64px_-34px_rgba(6,182,212,0.42)] focus-visible:ring-2 focus-visible:ring-cyan-400/40 sm:min-w-[13rem]"
              >
                <Link href="/contact">
                  Contact Elite Courts
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/secondary:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
