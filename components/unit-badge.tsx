import { cn } from "@/lib/utils";

interface UnitBadgeProps {
  name: string;
  code?: string;
  className?: string;
}

export function UnitBadge({ name, code, className }: UnitBadgeProps) {
  const abbreviation = code ?? name.slice(0, 2).toUpperCase();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-card py-0.5 pr-2.5 pl-0.5 text-xs font-medium",
        className
      )}
    >
      <span className="flex size-5 items-center justify-center rounded-full bg-hp-navy text-[10px] font-bold text-white">
        {abbreviation}
      </span>
      <span className="truncate">{name}</span>
    </span>
  );
}

export default UnitBadge;
