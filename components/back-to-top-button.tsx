"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SHOW_AFTER_PX = 420;

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches);
    const updateVisibility = () => setIsVisible(window.scrollY > SHOW_AFTER_PX);

    updateMotionPreference();
    updateVisibility();

    mediaQuery.addEventListener("change", updateMotionPreference);
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
      window.removeEventListener("scroll", updateVisibility);
    };
  }, []);

  function handleClick() {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      aria-label="Back to top"
      data-back-to-top
      onClick={handleClick}
      className={cn(
        "fixed bottom-24 right-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-slate-950/80 text-white shadow-[0_18px_54px_-22px_rgba(2,6,23,0.95)] backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:border-cyan-300/50 hover:bg-slate-900/90 hover:text-cyan-100 hover:shadow-[0_22px_64px_-24px_rgba(34,211,238,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/80 active:scale-95 sm:bottom-24 sm:right-6",
        isVisible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
