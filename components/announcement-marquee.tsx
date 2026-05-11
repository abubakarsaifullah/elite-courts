import { Megaphone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { announcements, getAnnouncementItems } from "@/data/announcements";

export function AnnouncementMarquee() {
  const items = getAnnouncementItems();

  if (!announcements.enabled || items.length === 0) return null;

  const repeatedItems = [...items, ...items];
  const screenReaderText = `${announcements.label}: ${items.join(". ")}`;

  return (
    <section className="announcement-marquee border-y border-[color:var(--border)]" aria-label="Elite Courts announcements">
      <Container className="py-2 sm:py-2.5">
        <div className="announcement-marquee-shell flex items-center gap-3 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-2 py-2 shadow-[0_18px_56px_-38px_rgba(6,182,212,0.6)] backdrop-blur-xl sm:gap-4 sm:px-3">
          <div className="announcement-marquee-badge inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[color:var(--accent)] px-3 py-2 text-[0.68rem] font-black uppercase tracking-[0.16em] text-slate-950 shadow-[0_14px_34px_-22px_rgba(6,182,212,0.95)] sm:px-4 sm:text-xs">
            <Megaphone className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{announcements.label}</span>
          </div>

          <div
            className="announcement-marquee-viewport min-w-0 flex-1 overflow-hidden rounded-full py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
            tabIndex={0}
            aria-label={screenReaderText}
          >
            <p className="sr-only">{screenReaderText}</p>
            <div className="announcement-marquee-track" aria-hidden="true">
              {repeatedItems.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className={index >= items.length ? "announcement-marquee-item announcement-marquee-duplicate" : "announcement-marquee-item"}
                >
                  <span className="announcement-marquee-dot" aria-hidden="true" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
