import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  actions?: ReactNode;
}

export function SectionHeading({ eyebrow, title, description, align = "left", actions }: SectionHeadingProps) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col gap-4 ${alignment}`}>
      {eyebrow ? <Badge>{eyebrow}</Badge> : null}
      <div className="space-y-3">
        <h2 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight text-[color:var(--text)] sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-pretty text-base leading-7 text-[color:var(--muted)]">{description}</p>
        ) : null}
      </div>
      {actions}
    </div>
  );
}
