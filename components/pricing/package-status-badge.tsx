import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PackageBadgeValue = string | null | undefined;

export function getPackageBadgeDisplayLabel(label: PackageBadgeValue) {
  if (!label) return null;
  return label === "New" ? "Just Added" : label;
}

export function isAttentionPackageBadge(label: PackageBadgeValue) {
  const displayLabel = getPackageBadgeDisplayLabel(label);
  return displayLabel === "Popular" || displayLabel === "Best Value" || displayLabel === "Recommended";
}

export function isNewPackageBadge(label: PackageBadgeValue) {
  return label === "New" || label === "New Package" || label === "Just Added";
}

interface PackageStatusBadgeProps {
  label: PackageBadgeValue;
  className?: string;
}

export function PackageStatusBadge({ label, className }: PackageStatusBadgeProps) {
  const displayLabel = getPackageBadgeDisplayLabel(label);

  if (!displayLabel) return null;

  const isAttentionBadge = isAttentionPackageBadge(displayLabel);
  const isNewBadge = isNewPackageBadge(displayLabel);

  return (
    <Badge
      className={cn(
        "px-2 py-0.5 text-[10px] font-extrabold",
        className,
        isAttentionBadge &&
          "vibrate-1 border-cyan-300/55 bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]",
        isNewBadge && "package-badge-new",
      )}
    >
      {displayLabel}
    </Badge>
  );
}