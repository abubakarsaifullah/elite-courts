import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/brand/logo";
import { navigation, siteConfig, siteContent } from "@/data/siteContent";

function getIcon(label: string) {
  const baseClass = "h-4 w-4";

  if (label === "Facebook") {
    return (
      <svg viewBox="0 0 24 24" className={baseClass} aria-hidden="true">
        <path
          fill="#1877F2"
          d="M24 12a12 12 0 1 0-13.88 11.85v-8.39h-3.03V12h3.03V9.36c0-2.99 1.79-4.64 4.53-4.64 1.31 0 2.68.23 2.68.23v2.94h-1.51c-1.49 0-1.95.93-1.95 1.87V12h3.32l-.53 3.46h-2.79v8.39A12 12 0 0 0 24 12Z"
        />
      </svg>
    );
  }

  if (label === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" className={baseClass} aria-hidden="true">
        <path
          fill="#E4405F"
          d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.65 1.5a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
        />
      </svg>
    );
  }

  if (label === "YouTube") {
    return (
      <svg viewBox="0 0 24 24" className={baseClass} aria-hidden="true">
        <path
          fill="#FF0000"
          d="M23.5 7.2a3 3 0 0 0-2.1-2.1C19.5 4.5 12 4.5 12 4.5s-7.5 0-9.4.6A3 3 0 0 0 .5 7.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-4.8ZM9.6 15.3V8.7L15.8 12l-6.2 3.3Z"
        />
      </svg>
    );
  }

  if (label === "TikTok") {
    return (
      <svg viewBox="0 0 24 24" className={`${baseClass} text-[#010101] dark:text-white`} aria-hidden="true">
        <path
          fill="currentColor"
          d="M19.6 6.7c-1.3.9-2.7 1.5-4.1 1.8v8.6c0 2.5-2.2 4.6-5 4.6s-5-2-5-4.6 2.2-4.6 5-4.6c.5 0 1 .1 1.5.2v2.7a2.1 2.1 0 0 0-1.5-.6c-1.2 0-2.2 1-2.2 2.2s1 2.2 2.2 2.2 2.2-1 2.2-2.2V2h2.8c.2 1.8 1.2 3.5 2.8 4.5.9.6 1.9 1 2.9 1.1v3.1a8.1 8.1 0 0 1-1.6-.4Z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={baseClass} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.2 10.7-5.8 3.5A.8.8 0 0 1 9.2 15.5v-7a.8.8 0 0 1 1.2-.7l5.8 3.5a.82.82 0 0 1 0 1.4Z"
      />
    </svg>
  );
}

function getIconHoverClass(label: string) {
  if (label === "Facebook") return "hover:border-[#1877F2]/45";
  if (label === "Instagram") return "hover:border-[#E4405F]/45";
  if (label === "YouTube") return "hover:border-[#FF0000]/45";
  return "hover:border-[#000000]/35 dark:hover:border-white/45";
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--border)] bg-[color:var(--surface-soft)] py-12 backdrop-blur-xl">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.85fr_1fr]">
          <div className="space-y-5">
            <Logo />
            <p className="max-w-xl text-sm leading-7 text-[color:var(--muted)]">{siteConfig.locationSummary}</p>
            <div className="space-y-3 text-sm text-[color:var(--muted-strong)]">
              <Link href={`mailto:${siteConfig.email}`} className="group flex items-center gap-3 transition hover:text-[color:var(--text)]">
                <Mail className="h-4 w-4 text-[color:var(--accent-strong)] transition-transform group-hover:-translate-y-0.5" />
                {siteConfig.email}
              </Link>
              <Link href={siteConfig.phoneHref} className="group flex items-center gap-3 transition hover:text-[color:var(--text)]">
                <Phone className="h-4 w-4 text-[color:var(--accent-strong)] transition-transform group-hover:-rotate-6" />
                {siteConfig.phoneDisplay}
              </Link>
              <p className="flex items-start gap-3 leading-7">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-[color:var(--accent-strong)]" />
                {siteConfig.address}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--text)]">{siteContent.footer.quickLinksTitle}</h3>
            <ul className="mt-4 space-y-3 text-sm text-[color:var(--muted)]">
              {navigation.slice(1).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="group inline-flex items-center gap-2 transition hover:text-[color:var(--text)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)] opacity-50 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--text)]">{siteContent.footer.connectTitle}</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {siteConfig.socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_18px_50px_-34px_rgba(6,182,212,0.6)] ${getIconHoverClass(link.label)}`}
                  aria-label={`Open Elite Courts on ${link.label}`}
                >
                  {getIcon(link.label)}
                </Link>
              ))}
            </div>
            <div className="mt-6 space-y-2 text-sm text-[color:var(--muted)]">
              <p>
                <Link href="/privacy-policy" className="transition hover:text-[color:var(--text)]">
                  Privacy Policy
                </Link>
              </p>
              <p>
                <Link href="/terms-of-use" className="transition hover:text-[color:var(--text)]">
                  Terms of Use
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[color:var(--border)] pt-6 text-xs text-[color:var(--muted)]">
          <p>
            {siteContent.footer.copyrightPrefix} {new Date().getFullYear()} {siteConfig.name}. {siteContent.footer.rightsText}
          </p>
        </div>
      </Container>
    </footer>
  );
}
