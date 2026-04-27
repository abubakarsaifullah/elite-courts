import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "h-12 w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 text-sm text-[color:var(--text)] placeholder:text-[color:var(--muted)] focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/15",
          className,
        )}
        {...props}
      />
    );
  },
);
