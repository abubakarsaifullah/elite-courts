"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, MessageCircle, Phone, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { NavLink } from "@/components/layout/nav-link";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Logo } from "@/components/brand/logo";
import { buildWhatsAppUrl, navigation, siteConfig } from "@/data/siteContent";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [typedLength, setTypedLength] = useState(0);

  const fullPhoneNumber = siteConfig.phoneDisplay;
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const isComplete = typedLength >= fullPhoneNumber.length;
    const nextDelay = isComplete ? 2600 : 90;

    const timer = window.setTimeout(() => {
      setTypedLength((current) => (current >= fullPhoneNumber.length ? 0 : current + 1));
    }, nextDelay);

    return () => window.clearTimeout(timer);
  }, [typedLength, fullPhoneNumber]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-[color:var(--border)] bg-[color:var(--header-bg)] shadow-[0_18px_60px_-34px_rgba(15,23,42,0.45)] backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <Container>
        <div className="flex h-[4.75rem] items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center" aria-label="Elite Courts home">
            <Logo priority />
          </Link>

          <nav className="hidden items-center gap-1 xl:flex" aria-label="Main navigation">
            {navigation.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 xl:flex">
            <Link
              href={siteConfig.phoneHref}
              className="group inline-flex h-11 items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 text-sm font-semibold text-[color:var(--text)] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/35 hover:bg-[color:var(--surface-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/30"
            >
              <Phone className="h-4 w-4 text-[color:var(--accent-strong)] transition-transform duration-200 group-hover:-rotate-6" />
              <span className="inline-flex items-center font-mono tabular-nums" aria-label={fullPhoneNumber}>
                <span className="inline-block text-left" style={{ width: `${fullPhoneNumber.length}ch` }}>
                  {fullPhoneNumber.slice(0, typedLength)}
                </span>
              </span>
            </Link>

            <Link
              href={buildWhatsAppUrl(siteConfig.primaryWhatsappMessage)}
              target="_blank"
              rel="noreferrer"
              aria-label="Book on WhatsApp"
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-emerald-500 px-4 text-sm font-semibold text-slate-950 shadow-[0_16px_50px_-24px_rgba(16,185,129,0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              data-tooltip="Chat on WhatsApp"
            >
              <span className="whatsapp-icon-wrap whatsapp-icon-attention" aria-hidden="true">
                <MessageCircle className="h-[1.15rem] w-[1.15rem] text-white transition-transform duration-200" />
              </span>
              WhatsApp
            </Link>

            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 xl:hidden">
            <Link
              href={siteConfig.phoneHref}
              aria-label={`Call Elite Courts at ${siteConfig.phoneDisplay}`}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--accent-strong)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[color:var(--surface-strong)] sm:hidden"
            >
              <Phone className="h-4 w-4" />
            </Link>
            <ThemeToggle />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden border-t border-[color:var(--border)] bg-[color:var(--surface-strong)] xl:hidden"
          >
            <Container className="py-4">
              <div className="flex flex-col gap-2">
                {navigation.map((item) => (
                  <NavLink key={item.href} href={item.href} className="justify-start px-4 py-3" onNavigate={() => setOpen(false)}>
                    {item.label}
                  </NavLink>
                ))}
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Link
                    href={siteConfig.phoneHref}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm font-semibold text-[color:var(--text)] transition hover:-translate-y-0.5 hover:border-cyan-400/25"
                    onClick={() => setOpen(false)}
                  >
                    <Phone className="h-4 w-4 text-[color:var(--accent-strong)]" />
                    {siteConfig.phoneDisplay}
                  </Link>
                  <Link
                    href={buildWhatsAppUrl(siteConfig.primaryWhatsappMessage)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-400"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Book on WhatsApp
                  </Link>
                </div>
              </div>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <style jsx>{`
        .whatsapp-icon-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 1.95rem;
          width: 1.95rem;
          border-radius: 9999px;
          background: #25d366;
          border: 1px solid rgba(255, 255, 255, 0.24);
          box-shadow: 0 12px 26px -10px rgba(37, 211, 102, 0.92);
          filter: drop-shadow(0 0 0 rgba(37, 211, 102, 0));
          transition: transform 260ms ease, filter 260ms ease, box-shadow 260ms ease;
        }

        .group:hover .whatsapp-icon-wrap,
        .group:focus-visible .whatsapp-icon-wrap {
          transform: scale(1.12);
          box-shadow: 0 16px 30px -10px rgba(37, 211, 102, 1);
          filter: drop-shadow(0 0 0.9rem rgba(37, 211, 102, 0.68));
        }

        .whatsapp-icon-attention {
          animation: whatsapp-soft-pulse 3.4s ease-in-out infinite;
        }

        .whatsapp-icon-attention::after {
          content: "";
          position: absolute;
          inset: -0.38rem;
          border-radius: 9999px;
          border: 1px solid rgba(37, 211, 102, 0.62);
          opacity: 0;
          transform: scale(0.8);
          pointer-events: none;
          animation: whatsapp-soft-ping 3.4s ease-out infinite;
        }

        .group:hover .whatsapp-icon-attention,
        .group:hover .whatsapp-icon-attention::after,
        .group:focus-visible .whatsapp-icon-attention,
        .group:focus-visible .whatsapp-icon-attention::after {
          animation-play-state: paused;
        }

        @keyframes whatsapp-soft-pulse {
          0%,
          68%,
          100% {
            transform: scale(1);
            filter: drop-shadow(0 0 0 rgba(37, 211, 102, 0));
          }
          80% {
            transform: scale(1.1);
            filter: drop-shadow(0 0 0.78rem rgba(37, 211, 102, 0.62));
          }
        }

        @keyframes whatsapp-soft-ping {
          0%,
          68% {
            opacity: 0;
            transform: scale(0.82);
          }
          80% {
            opacity: 0.62;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.78);
          }
        }

        .group[data-tooltip] {
          position: relative;
        }

        .group[data-tooltip]::after {
          content: attr(data-tooltip);
          position: absolute;
          left: 50%;
          top: calc(100% + 0.45rem);
          transform: translateX(-50%) translateY(-2px);
          border-radius: 9999px;
          background: rgba(2, 6, 23, 0.9);
          color: #f8fafc;
          font-size: 0.69rem;
          line-height: 1;
          padding: 0.42rem 0.58rem;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 220ms ease, transform 220ms ease;
        }

        .group[data-tooltip]:hover::after,
        .group[data-tooltip]:focus-visible::after {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .whatsapp-icon-wrap,
          .whatsapp-icon-attention,
          .whatsapp-icon-attention::after,
          .group[data-tooltip]::after {
            animation: none !important;
            transition: none !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>
    </header>
  );
}
