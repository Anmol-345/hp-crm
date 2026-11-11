import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

const trendConfig = {
  up: { icon: TrendingUp, color: "text-emerald-600" },
  down: { icon: TrendingDown, color: "text-hp-red" },
  neutral: { icon: Minus, color: "text-muted-foreground" },
} as const;

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  className,
}: StatCardProps) {
  const TrendIcon = trend ? trendConfig[trend].icon : null;
  const trendColor = trend ? trendConfig[trend].color : "";

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex size-10 items-center justify-center rounded-full bg-hp-navy text-white">
          <Icon className="size-5" />
        </div>
        {trend && TrendIcon && (
          <div className={cn("flex items-center gap-1 text-xs font-medium", trendColor)}>
            <TrendIcon className="size-3.5" />
            {trendValue && <span>{trendValue}</span>}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold tabular-nums">{value}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );
}

export default StatCard;
