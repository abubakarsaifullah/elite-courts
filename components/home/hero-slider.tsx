"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl, heroSlides, siteConfig, siteContent } from "@/data/siteContent";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 5200;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (paused || reduceMotion || heroSlides.length < 2) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % heroSlides.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [paused, reduceMotion]);

  const active = heroSlides[index];
  const remote = active.src.startsWith("https://");

  function goTo(nextIndex: number) {
    const total = heroSlides.length;
    setIndex((nextIndex + total) % total);
  }

  return (
    <section
      className="relative isolate overflow-hidden border-b border-[color:var(--border)]"
      aria-label="Featured Elite Courts facilities"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative h-[78svh] min-h-[500px] max-h-[760px] sm:h-[82svh] sm:min-h-[620px] sm:max-h-[920px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.src}
            className="absolute inset-0"
            initial={reduceMotion ? false : { opacity: 0, scale: 1.025 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.01 }}
            transition={{ duration: reduceMotion ? 0 : 0.65, ease: "easeOut" }}
          >
            <Image
              src={active.src}
              alt={active.alt}
              fill
              sizes="100vw"
              unoptimized={remote}
              className="object-cover"
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              quality={82}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.68),rgba(2,6,23,0.28)_42%,rgba(2,6,23,0.12)),linear-gradient(180deg,rgba(2,6,23,0.2),rgba(2,6,23,0.5))]" />
          </motion.div>
        </AnimatePresence>

        <Container className="relative z-10 flex h-full items-center py-8 sm:py-12 lg:py-14">
          <div className="w-full max-w-[19.5rem] rounded-[1.1rem] border border-white/15 bg-slate-950/34 p-3 shadow-[0_24px_80px_-40px_rgba(2,6,23,0.7)] backdrop-blur-md sm:max-w-md sm:rounded-[1.2rem] sm:p-4 lg:max-w-lg lg:p-5">
            <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/90 sm:text-xs">
              {siteContent.hero.eyebrow} · {active.label}
            </div>

            <div className="mt-3.5 space-y-2">
              <h1 className="text-balance text-[1.65rem] font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
                {siteContent.hero.title}
              </h1>
              <p className="max-w-md text-pretty text-[0.82rem] leading-5 text-white/84 sm:text-sm sm:leading-6">
                {siteContent.hero.description}
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/95">{active.caption}</p>
            </div>

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href={buildWhatsAppUrl(siteConfig.primaryWhatsappMessage)} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  {siteContent.hero.primaryButtonLabel}
                </Link>
              </Button>

              <Button asChild variant="secondary" size="lg" className="w-full border-white/15 bg-white/10 text-white hover:bg-white/15 sm:w-auto">
                <Link href="/pricing">
                  {siteContent.hero.secondaryButtonLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-4 hidden gap-2 sm:grid sm:grid-cols-3">
              {siteContent.hero.supportingPoints.map((point) => (
                <div key={point} className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-xs leading-5 text-white/78">
                  {point}
                </div>
              ))}
            </div>
          </div>
        </Container>

        <div className="absolute inset-x-0 bottom-5 z-20">
          <Container className="flex items-center justify-between gap-4">
            <div className="flex gap-2 rounded-full border border-white/12 bg-black/20 px-3 py-2 backdrop-blur-md">
              {heroSlides.map((slide, dotIndex) => (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => goTo(dotIndex)}
                  aria-label={`Go to ${slide.label} slide`}
                  aria-pressed={dotIndex === index}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                    dotIndex === index ? "w-8 bg-white" : "w-2.5 bg-white/45 hover:bg-white/75",
                  )}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                aria-label="Previous slide"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/25 text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => goTo(index + 1)}
                aria-label="Next slide"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/25 text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
