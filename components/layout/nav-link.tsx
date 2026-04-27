"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLink({
  href,
  children,
  className,
  onNavigate,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isActiveRoute(pathname, href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative inline-flex items-center overflow-hidden rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200",
        active
          ? "bg-[color:var(--surface)] text-[color:var(--text)] shadow-sm ring-1 ring-[color:var(--border)]"
          : "text-[color:var(--muted-strong)] hover:bg-[color:var(--surface)] hover:text-[color:var(--text)]",
        className,
      )}
    >
      <span className="relative z-10">{children}</span>
      <span
        className={cn(
          "pointer-events-none absolute inset-x-4 bottom-1.5 h-0.5 origin-left rounded-full bg-[color:var(--accent)] transition-transform duration-200",
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
        )}
      />
    </Link>
  );
}
