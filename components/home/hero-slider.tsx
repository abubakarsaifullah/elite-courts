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

        <Container className="relative z-10 flex h-full items-end justify-center pb-6 sm:pb-8 lg:pb-10">
          <div className="w-full max-w-4xl text-center">
            <h1 className="mx-auto max-w-3xl overflow-hidden text-ellipsis whitespace-nowrap text-base font-semibold tracking-tight text-white drop-shadow-[0_10px_24px_rgba(2,6,23,0.95)] sm:text-xl lg:text-2xl">
              {siteContent.hero.title}
            </h1>
            <p className="mx-auto mt-1 max-w-3xl overflow-hidden text-ellipsis whitespace-nowrap text-xs leading-5 text-white/90 drop-shadow-[0_8px_20px_rgba(2,6,23,0.95)] sm:text-sm">
              {active.caption}
            </p>

            <div className="mt-3 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="h-11 w-full rounded-full shadow-[0_14px_36px_-18px_rgba(16,185,129,0.85)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_18px_42px_-18px_rgba(16,185,129,0.95)] sm:w-auto"
              >
                <Link href={buildWhatsAppUrl(siteConfig.primaryWhatsappMessage)} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  Book a Court
                </Link>
              </Button>

              <Button
                asChild
                variant="secondary"
                size="lg"
                className="h-11 w-full rounded-full border-slate-100/90 bg-slate-50 text-slate-900 shadow-[0_14px_38px_-20px_rgba(248,250,252,0.98)] transition-all duration-300 hover:scale-[1.05] hover:bg-white hover:shadow-[0_24px_50px_-20px_rgba(248,250,252,0.98)] sm:w-auto"
              >
                <Link href="/pricing">
                  <ArrowRight className="h-4 w-4" />
                  View Pricing
                </Link>
              </Button>
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
