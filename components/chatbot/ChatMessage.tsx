import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "bot" | "user";
  children: ReactNode;
}

export function ChatMessage({ role, children }: ChatMessageProps) {
  return (
    <div className={cn("flex", role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[86%] rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-[0_14px_38px_-28px_rgba(2,6,23,0.8)]",
          role === "user"
            ? "bg-[color:var(--accent)] text-slate-950"
            : "border border-[color:var(--border)] bg-[color:var(--surface-strong)] text-[color:var(--text)]",
        )}
      >
        {children}
      </div>
    </div>
  );
}
