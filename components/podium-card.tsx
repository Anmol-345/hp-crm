import { cn } from "@/lib/utils";
import { Trophy, Award } from "lucide-react";
import type { PerformanceUnit } from "@/lib/data/types";

interface PodiumCardProps {
  position: "I" | "II" | "III";
  athleteName: string;
  bib: string;
  unit: string;
  performance: number;
  performanceUnit: PerformanceUnit;
  eventName?: string;
  className?: string;
}

const positionConfig = {
  I: {
    medal: "🥇",
    label: "Winner · Gold",
    badgeBg: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300",
    accent: "bg-amber-400",
    trophyColor: "text-amber-500",
    border: "border-amber-400/60",
    prize: "₹5,000",
  },
  II: {
    medal: "🥈",
    label: "Runner-up · Silver",
    badgeBg: "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
    accent: "bg-slate-400",
    trophyColor: "text-slate-400",
    border: "border-slate-300 dark:border-slate-700",
    prize: "₹4,000",
  },
  III: {
    medal: "🥉",
    label: "1st Runner-up · Bronze",
    badgeBg: "bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-400",
    accent: "bg-amber-700",
    trophyColor: "text-amber-700",
    border: "border-amber-700/40",
    prize: "₹3,000",
  },
} as const;

export function PodiumCard({
  position,
  athleteName,
  bib,
  unit,
  performance,
  performanceUnit,
  eventName,
  className,
}: PodiumCardProps) {
  const config = positionConfig[position];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card shadow-xs transition-all",
        config.border,
        className
      )}
    >
      {/* Accent top stripe */}
      <div className={cn("h-1.5 w-full", config.accent)} />

      <div className="p-4 space-y-3">
        {/* Medal & label */}
        <div className="flex items-center justify-between">
          <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase", config.badgeBg)}>
            <Award className="size-3" />
            <span>{config.label}</span>
          </span>
          <span className="text-xs font-bold font-mono text-[#001375] dark:text-primary">
            {config.prize}
          </span>
        </div>

        {/* Athlete details */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded bg-muted px-2 py-0.5 text-xs font-mono font-bold">
              #{bib}
            </span>
            <span className="text-sm font-bold text-foreground truncate">{athleteName}</span>
          </div>
          <p className="text-xs text-muted-foreground">{unit}</p>
        </div>

        {/* Timing / Distance */}
        <div className="flex items-baseline justify-between border-t border-border/60 pt-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Official Performance
          </span>
          <p className="text-xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#001375] dark:text-primary tabular-nums font-mono">
            {performance.toFixed(2)}{" "}
            <span className="text-xs font-normal text-muted-foreground font-sans">
              {performanceUnit}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PodiumCard;
