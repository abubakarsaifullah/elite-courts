import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  actions?: ReactNode;
  maxWidth?: "default" | "wide" | "full";
}

const widthClasses = {
  default: {
    title: "max-w-4xl",
    description: "max-w-3xl",
  },
  wide: {
    title: "max-w-6xl",
    description: "max-w-5xl",
  },
  full: {
    title: "max-w-none",
    description: "max-w-none",
  },
} as const;

export function SectionHeading({ eyebrow, title, description, align = "left", actions, maxWidth = "default" }: SectionHeadingProps) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";
  const widths = widthClasses[maxWidth];

  return (
    <div className={cn("flex flex-col gap-4", alignment)}>
      {eyebrow ? <Badge>{eyebrow}</Badge> : null}
      <div className="space-y-3">
        <h2 className={cn("text-balance text-3xl font-semibold tracking-tight text-[color:var(--text)] sm:text-4xl lg:text-5xl", widths.title)}>
          {title}
        </h2>
        {description ? (
          <p className={cn("text-pretty text-base leading-7 text-[color:var(--muted)]", widths.description)}>{description}</p>
        ) : null}
      </div>
      {actions}
    </div>
  );
}
