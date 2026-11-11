import React from "react";
import { Result } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import UnitBadge from "./unit-badge";

interface ResultsTableProps {
  results: Result[];
  className?: string;
}

const medalConfig = {
  I: { medal: "🥇", label: "I", bg: "bg-hp-gold/15 text-amber-900 dark:text-amber-300" },
  II: { medal: "🥈", label: "II", bg: "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200" },
  III: { medal: "🥉", label: "III", bg: "bg-amber-900/15 text-amber-900 dark:text-amber-400" },
  IV: { medal: "4", label: "IV", bg: "bg-muted text-muted-foreground" },
  V: { medal: "5", label: "V", bg: "bg-muted text-muted-foreground" },
  VI: { medal: "6", label: "VI", bg: "bg-muted text-muted-foreground" },
  VII: { medal: "7", label: "VII", bg: "bg-muted text-muted-foreground" },
  VIII: { medal: "8", label: "VIII", bg: "bg-muted text-muted-foreground" },
};

export function ResultsTable({ results, className }: ResultsTableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border border-border bg-card shadow-sm", className)}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <th className="py-2.5 px-3">Pos</th>
            <th className="py-2.5 px-3">BIB</th>
            <th className="py-2.5 px-3">Athlete</th>
            <th className="py-2.5 px-3">Unit / Zone</th>
            <th className="py-2.5 px-3">Performance</th>
            <th className="py-2.5 px-3 text-right">Points</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-xs">
          {results.map((r) => {
            const pos = medalConfig[r.position] || medalConfig.IV;
            return (
              <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-bold", pos.bg)}>
                    <span>{pos.medal}</span>
                    <span className="font-mono">{r.position}</span>
                  </span>
                </td>
                <td className="py-2.5 px-3 font-mono font-semibold tabular-nums whitespace-nowrap">
                  #{r.bib}
                </td>
                <td className="py-2.5 px-3 font-semibold text-hp-ink dark:text-white whitespace-nowrap">
                  {r.athleteName}
                </td>
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <UnitBadge name={r.unit} />
                </td>
                <td className="py-2.5 px-3 font-bold tabular-nums text-hp-navy dark:text-primary whitespace-nowrap">
                  {r.performanceDisplay}
                </td>
                <td className="py-2.5 px-3 font-bold tabular-nums text-right text-muted-foreground whitespace-nowrap">
                  {r.points ?? "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ResultsTable;

