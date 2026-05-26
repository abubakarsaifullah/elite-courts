import { Clock3 } from "lucide-react";
import { businessHours, businessHoursDisplay, weekdayOrder } from "@/data/businessHours";

function formatBusinessTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  const date = new Date(Date.UTC(2026, 0, 1, hour, minute));
  return new Intl.DateTimeFormat("en-PK", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "UTC" }).format(date);
}

function getRows() {
  const entries = weekdayOrder.map((day) => businessHours.weeklyHours[day]);
  const first = entries[0];
  const sameEveryDay = entries.every((item) => item.open === first.open && item.close === first.close && item.closesNextDay === first.closesNextDay && item.closed === first.closed);

  if (sameEveryDay) {
    return [{ label: "Monday - Sunday", value: `${formatBusinessTime(first.open)} - ${formatBusinessTime(first.close)}${first.closesNextDay ? " next day" : ""}` }];
  }

  return weekdayOrder.map((day) => {
    const item = businessHours.weeklyHours[day];
    const label = day.charAt(0).toUpperCase() + day.slice(1);
    return {
      label,
      value: item.closed ? "Closed" : `${formatBusinessTime(item.open)} - ${formatBusinessTime(item.close)}${item.closesNextDay ? " next day" : ""}`,
    };
  });
}

export function BusinessHoursCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-5 shadow-[var(--shadow)] backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]">
          <Clock3 className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-black text-[color:var(--text)]">{businessHoursDisplay.title}</h3>
          <p className="mt-1 text-sm font-medium leading-6 text-[color:var(--muted)]">{businessHoursDisplay.summary}</p>
        </div>
      </div>
      <div className={compact ? "mt-4 space-y-2" : "mt-5 space-y-3"}>
        {getRows().map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 rounded-2xl bg-[color:var(--surface)] px-4 py-3 text-sm">
            <span className="font-bold text-[color:var(--text)]">{row.label}</span>
            <span className="text-right font-black text-[color:var(--accent-strong)]">{row.value}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs font-semibold leading-5 text-[color:var(--muted)]">{businessHoursDisplay.note}</p>
    </div>
  );
}
