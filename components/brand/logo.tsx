import Image from "next/image";

interface LogoProps {
  priority?: boolean;
}

export function Logo({ priority = false }: LogoProps) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="relative h-[3.2rem] w-[3.2rem] shrink-0 overflow-hidden rounded-full border border-white/35 bg-white p-0.5 shadow-[0_18px_38px_-18px_rgba(2,6,23,0.9)] sm:h-[3.7rem] sm:w-[3.7rem]">
        <Image
          src="/brand/elite-courts-logo.webp"
          alt="Elite Courts logo"
          fill
          sizes="(min-width: 640px) 60px, 52px"
          className="rounded-full object-cover object-center"
          priority={priority}
          quality={100}
        />
      </div>
      <div className="hidden min-w-0 leading-none sm:block">
        <p className="font-display text-lg font-semibold tracking-tight text-[color:var(--text)]">Elite Courts</p>
        <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">Lahore</p>
      </div>
    </div>
  );
}
