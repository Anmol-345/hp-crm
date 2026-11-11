import React from "react";
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
  photoUrl?: string;
}

const positionConfig = {
  I: {
    medal: "🥇",
    label: "Winner · Gold",
    badgeBg: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300",
    accent: "bg-amber-400",
    trophyColor: "text-amber-500",
    border: "border-amber-400/60 shadow-md",
    ringColor: "ring-amber-400 border-amber-500",
    prize: "₹5,000",
  },
  II: {
    medal: "🥈",
    label: "Runner-up · Silver",
    badgeBg: "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
    accent: "bg-slate-400",
    trophyColor: "text-slate-400",
    border: "border-slate-300 dark:border-slate-700",
    ringColor: "ring-slate-300 border-slate-400",
    prize: "₹4,000",
  },
  III: {
    medal: "🥉",
    label: "1st Runner-up · Bronze",
    badgeBg: "bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-400",
    accent: "bg-amber-700",
    trophyColor: "text-amber-700",
    border: "border-amber-700/40",
    ringColor: "ring-amber-600 border-amber-700",
    prize: "₹3,000",
  },
} as const;

const MOCK_ATHLETE_PHOTOS: Record<string, string> = {
  "Mannem Sivanageswara": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
  "Abhinav Singh": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
  "Pushparaj": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=300&q=80",
  "Narayana Moolya": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
  "Rajesh K Shetty": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80",
  "Das Biswanath": "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&w=300&q=80",
  "Khuntia P.A. Asitkanta": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80",
  "Potluri Durga Prasad": "https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=300&q=80",
  "Ramath Mallikarjuna Naik": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
  "J Jnapika": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  "Mane Mrunali Vijay": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
  "Kuruba Bharathi": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
  "Amita Bhivgade": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
  "Rashmi Singh": "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80",
  "Manisha": "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=300&q=80",
  "Amit Sharma": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
  "Rajesh Kumar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  "Sunil Verma": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
};

const DEFAULT_PORTRAITS = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
];

export function PodiumCard({
  position,
  athleteName,
  bib,
  unit,
  performance,
  performanceUnit,
  eventName,
  className,
  photoUrl,
}: PodiumCardProps) {
  const config = positionConfig[position];

  // Resolve athlete photo
  const charSum = athleteName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const fallbackIndex = Math.abs((bib && !isNaN(Number(bib)) ? Number(bib) : charSum)) % DEFAULT_PORTRAITS.length;
  const athletePhoto = photoUrl || MOCK_ATHLETE_PHOTOS[athleteName] || DEFAULT_PORTRAITS[fallbackIndex];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card shadow-xs transition-all hover:shadow-md",
        config.border,
        className
      )}
    >
      {/* Accent top stripe */}
      <div className={cn("h-1.5 w-full", config.accent)} />

      <div className="p-4 space-y-3.5">
        {/* Medal & label row */}
        <div className="flex items-center justify-between">
          <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase", config.badgeBg)}>
            <Award className="size-3" />
            <span>{config.label}</span>
          </span>
          <span className="text-xs font-bold font-mono text-[#001375] dark:text-primary">
            {config.prize}
          </span>
        </div>

        {/* Athlete details with Photo Avatar */}
        <div className="flex items-center gap-3">
          <div className={cn("relative size-12 shrink-0 rounded-full overflow-hidden border-2 shadow-xs ring-2", config.ringColor)}>
            <img
              src={athletePhoto}
              alt={athleteName}
              className="size-full object-cover"
              loading="lazy"
            />
            <span className="absolute bottom-0 right-0 size-4 rounded-full bg-background flex items-center justify-center text-[10px] shadow-xs">
              {config.medal}
            </span>
          </div>

          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="rounded bg-muted px-1.5 py-0.2 text-[10px] font-mono font-bold shrink-0">
                #{bib}
              </span>
              <span className="text-sm font-bold text-foreground truncate block">{athleteName}</span>
            </div>
            <p className="text-xs text-muted-foreground truncate">{unit}</p>
          </div>
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
