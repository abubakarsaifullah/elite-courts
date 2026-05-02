"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type TouchEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl, heroSlides, siteConfig, siteContent } from "@/data/siteContent";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 5200;
const SWIPE_THRESHOLD = 48;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (paused || reduceMotion || heroSlides.length < 2) return;

    const timer = window.setInterval(() => {
      setIndex((current: number) => (current + 1) % heroSlides.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [paused, reduceMotion]);

  const active = heroSlides[index] ?? heroSlides[0];
  const remote = active.src.startsWith("https://");
  const isPriorityImage = Boolean(active.priority) || index === 0;

  function goTo(nextIndex: number) {
    const total = heroSlides.length;
    setIndex((nextIndex + total) % total);
  }

  function handleTouchStart(event: TouchEvent<HTMLElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
    setPaused(true);
  }

  function handleTouchEnd(event: TouchEvent<HTMLElement>) {
    const start = touchStartX.current;
    touchStartX.current = null;
    setPaused(false);

    if (start === null) return;
    const end = event.changedTouches[0]?.clientX ?? start;
    const distance = end - start;

    if (Math.abs(distance) < SWIPE_THRESHOLD) return;
    goTo(distance > 0 ? index - 1 : index + 1);
  }

  if (!active) return null;

  return (
    <section
      className="relative isolate overflow-hidden border-b border-[color:var(--border)]"
      aria-label="Featured Elite Courts facilities"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-[64svh] min-h-[460px] max-h-[820px] bg-slate-950 sm:h-[72svh] sm:min-h-[560px] lg:h-[78svh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.src}
            className="absolute inset-0"
            initial={reduceMotion ? false : { opacity: 0, scale: 1.01 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.004 }}
            transition={{ duration: reduceMotion ? 0 : 0.65, ease: "easeOut" }}
          >
            <Image
              src={active.src}
              alt={active.alt}
              fill
              sizes="100vw"
              unoptimized={remote}
              className="select-none object-cover"
              style={{ objectPosition: active.objectPosition ?? "center", imageRendering: "auto" }}
              priority={isPriorityImage}
              loading={isPriorityImage ? undefined : "lazy"}
              quality={active.quality ?? 95}
            />

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.16)_0%,rgba(2,6,23,0.05)_38%,rgba(2,6,23,0.16)_62%,rgba(2,6,23,0.78)_100%)]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_bottom,rgba(2,6,23,0.82)_0%,rgba(2,6,23,0.42)_45%,transparent_76%)]" />
          </motion.div>
        </AnimatePresence>

        <Container className="pointer-events-none absolute inset-x-0 bottom-20 z-30 flex justify-center px-4 sm:bottom-24 md:bottom-28">
          <div className="w-full max-w-[44rem] text-center text-white">
            <p className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-cyan-100 drop-shadow-[0_4px_14px_rgba(2,6,23,0.95)] sm:text-xs">
              {active.label}
            </p>
            <h1 className="mx-auto max-w-[42rem] text-balance text-3xl font-semibold tracking-tight text-white drop-shadow-[0_8px_24px_rgba(2,6,23,0.98)] sm:text-4xl md:text-5xl lg:text-6xl">
              {siteContent.hero.title}
            </h1>
            <p className="mx-auto mt-3 max-w-[32rem] text-pretty text-sm font-semibold leading-6 text-cyan-50 drop-shadow-[0_6px_18px_rgba(2,6,23,0.98)] sm:text-base">
              {active.caption}
            </p>

            <div className="pointer-events-auto mt-5 flex flex-wrap justify-center gap-2.5 sm:gap-3">
              <Button
                asChild
                size="sm"
                className="min-h-11 min-w-[9.25rem] rounded-full px-4 shadow-[0_16px_42px_-18px_rgba(16,185,129,0.92)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_48px_-18px_rgba(16,185,129,1)] focus-visible:ring-2 focus-visible:ring-emerald-200/90 sm:px-5"
              >
                <Link href={buildWhatsAppUrl(siteConfig.primaryWhatsappMessage)} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  {siteContent.hero.primaryButtonLabel}
                </Link>
              </Button>

              <Button
                asChild
                variant="secondary"
                size="sm"
                className="min-h-11 min-w-[9.25rem] rounded-full border border-white/55 !bg-slate-950/80 px-4 !text-white shadow-[0_16px_44px_-20px_rgba(2,6,23,1)] ring-1 ring-white/20 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-cyan-200/75 hover:!bg-slate-900/90 hover:shadow-[0_22px_56px_-22px_rgba(34,211,238,0.55)] focus-visible:ring-2 focus-visible:ring-white/85 sm:px-5"
              >
                <Link href="/pricing">
                  <span className="text-white">{siteContent.hero.secondaryButtonLabel}</span>
                  <ArrowRight className="h-4 w-4 text-white" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>

        {heroSlides.length > 1 ? (
          <div className="absolute inset-x-0 bottom-5 z-20">
            <Container className="flex items-center justify-between gap-4">
              <div className="flex gap-2 rounded-full border border-white/12 bg-black/24 px-3 py-2 backdrop-blur-md">
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
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/28 text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-black/44 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={() => goTo(index + 1)}
                  aria-label="Next slide"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/28 text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-black/44 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </Container>
          </div>
        ) : null}
      </div>
    </section>
  );
}
