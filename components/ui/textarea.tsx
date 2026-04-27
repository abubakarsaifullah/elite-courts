import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-36 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/15",
        className,
      )}
      {...props}
    />
  );
});
