import { getBookingStatus } from "@/data/bookingStatuses";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  pending: "border-amber-300/45 bg-amber-400/15 text-amber-700 dark:text-amber-200",
  confirmed: "border-emerald-300/45 bg-emerald-400/15 text-emerald-700 dark:text-emerald-200",
  cancelled: "border-rose-300/45 bg-rose-400/15 text-rose-700 dark:text-rose-200",
  rejected: "border-slate-300/45 bg-slate-400/15 text-slate-600 dark:text-slate-200",
  completed: "border-cyan-300/45 bg-cyan-400/15 text-cyan-700 dark:text-cyan-200",
  no_show: "border-red-300/45 bg-red-400/15 text-red-700 dark:text-red-200",
};

export function BookingStatusBadge({ status }: { status: string }) {
  const details = getBookingStatus(status);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.12em]",
        statusStyles[status] ?? statusStyles.pending,
      )}
    >
      {details.label}
    </span>
  );
}
