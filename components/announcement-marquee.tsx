"use client";

import { useEffect, useRef, useState } from "react";
import { Megaphone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { announcements, getAnnouncementItems } from "@/data/announcements";
import { cn } from "@/lib/utils";

// Change this value if you want the marquee to pause for longer or shorter.
// 5000 = 5 seconds, 3000 = 3 seconds, 8000 = 8 seconds.
const CLICK_PAUSE_DURATION_MS = 5000;

export function AnnouncementMarquee() {
  const items = getAnnouncementItems();
  const [isClickPaused, setIsClickPaused] = useState(false);
  const pauseTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (pauseTimerRef.current !== null) {
        window.clearTimeout(pauseTimerRef.current);
      }
    };
  }, []);

  if (!announcements.enabled || items.length === 0) {
    return null;
  }

  const repeatedItems = [...items, ...items];
  const screenReaderText = `${announcements.label}: ${items.map((item) => `${item.label}: ${item.message}`).join(". ")}`;

  function handleTemporaryPause() {
    if (pauseTimerRef.current !== null) {
      window.clearTimeout(pauseTimerRef.current);
    }

    setIsClickPaused(true);

    pauseTimerRef.current = window.setTimeout(() => {
      setIsClickPaused(false);
      pauseTimerRef.current = null;
    }, CLICK_PAUSE_DURATION_MS);
  }

  return (
    <section
      className={cn(
        "announcement-marquee border-y border-[color:var(--border)]",
        isClickPaused && "announcement-marquee-click-paused",
      )}
      aria-label="Elite Courts announcements"
    >
      <Container className="py-2 sm:py-2.5">
        <div className="announcement-marquee-shell flex items-center gap-2.5 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-2 py-2 shadow-[0_18px_56px_-38px_rgba(6,182,212,0.6)] backdrop-blur-xl sm:gap-4 sm:px-3">
          <div className="announcement-marquee-badge inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[linear-gradient(135deg,#22d3ee,#10b981)] px-3 py-2 text-[0.66rem] font-black uppercase tracking-[0.14em] text-slate-950 shadow-[0_14px_34px_-22px_rgba(6,182,212,0.95)] sm:px-4 sm:text-xs">
            <Megaphone className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{announcements.label}</span>
          </div>

          <button
            type="button"
            className="announcement-marquee-viewport min-w-0 flex-1 overflow-hidden rounded-full py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
            onClick={handleTemporaryPause}
            aria-label={`${screenReaderText}. Tap to pause temporarily.`}
            title="Tap to pause announcements briefly"
          >
            <span className="sr-only">{screenReaderText}</span>

            <span className="announcement-marquee-track" aria-hidden="true">
              {repeatedItems.map((item, index) => (
                <span
                  key={`${item.id}-${index}`}
                  className={cn(
                    "announcement-marquee-item",
                    `announcement-marquee-item--${item.tone}`,
                    index >= items.length && "announcement-marquee-duplicate",
                  )}
                >
                  <span className="announcement-marquee-dot" aria-hidden="true" />
                  <span className="announcement-marquee-label">{item.label}</span>
                  <span>{item.message}</span>
                </span>
              ))}
            </span>
          </button>
        </div>
      </Container>
    </section>
  );
}
