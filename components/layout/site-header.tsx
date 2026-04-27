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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            <Logo />
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
              {siteConfig.phoneDisplay}
            </Link>

            <Link
              href={buildWhatsAppUrl(siteConfig.primaryWhatsappMessage)}
              target="_blank"
              rel="noreferrer"
              aria-label="Book on WhatsApp"
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-emerald-500 px-4 text-sm font-semibold text-slate-950 shadow-[0_16px_50px_-24px_rgba(16,185,129,0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              <MessageCircle className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
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
    </header>
  );
}
