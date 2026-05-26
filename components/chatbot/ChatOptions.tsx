import { cn } from "@/lib/utils";

interface ChatOption {
  label: string;
  value: string;
}

interface ChatOptionsProps {
  options: readonly ChatOption[];
  onSelect: (value: string, label: string) => void;
  disabled?: boolean;
}

export function ChatOptions({ options, onSelect, disabled }: ChatOptionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(option.value, option.label)}
          className={cn(
            "rounded-full border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-3.5 py-2 text-xs font-extrabold text-[color:var(--text)] transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-300/45 hover:bg-[color:var(--accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35 disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
