import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/brand/logo";
import { navigation, siteConfig, siteContent } from "@/data/siteContent";

function getIcon(label: string) {
  if (label === "Facebook") return <Facebook className="h-4 w-4" />;
  if (label === "Instagram") return <Instagram className="h-4 w-4" />;
  if (label === "YouTube") return <Youtube className="h-4 w-4" />;
  return <span className="text-xs font-semibold">TT</span>;
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
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)] opacity-50 transition group-hover:opacity-100" />
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
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--muted-strong)] transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/35 hover:text-[color:var(--text)] hover:shadow-[0_18px_50px_-34px_rgba(6,182,212,0.6)]"
                  aria-label={link.label}
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
