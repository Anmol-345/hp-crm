"use client";

import React, { useState } from "react";
import { Heat, HeatEntry } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import UnitBadge from "./unit-badge";
import { AlertTriangle, ArrowUpDown, Plus, Check } from "lucide-react";

interface HeatGridProps {
  heat: Heat;
  unit?: "sec" | "m";
  onUpdateEntries?: (entries: HeatEntry[]) => void;
  className?: string;
}

export function HeatGrid({ heat, unit = "sec", onUpdateEntries, className }: HeatGridProps) {
  const [entries, setEntries] = useState<HeatEntry[]>(heat.entries);
  const [newBib, setNewBib] = useState("");
  const [newName, setNewName] = useState("");
  const [newUnit, setNewUnit] = useState("Mumbai Refinery");
  const [newPerf, setNewPerf] = useState("");
  const [isSorted, setIsSorted] = useState(false);

  const handleSort = () => {
    // For races (sec), lower is better. For throws (m), higher is better.
    const sorted = [...entries].sort((a, b) => {
      const pA = a.performance ?? 999999;
      const pB = b.performance ?? 999999;
      return unit === "sec" ? pA - pB : pB - pA;
    });

    const ranked = sorted.map((entry, idx) => ({
      ...entry,
      rank: entry.performance ? idx + 1 : undefined,
    }));

    setEntries(ranked);
    setIsSorted(true);
    onUpdateEntries?.(ranked);
  };

  const handleAddQuickEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBib || !newPerf) return;

    const perfNumber = parseFloat(newPerf);
    const newEntry: HeatEntry = {
      bib: newBib,
      athleteName: newName || `Athlete #${newBib}`,
      unit: newUnit,
      performance: isNaN(perfNumber) ? undefined : perfNumber,
      performanceDisplay: isNaN(perfNumber) ? newPerf : `${perfNumber} ${unit}`,
      rank: entries.length + 1,
    };

    const updated = [...entries, newEntry];
    setEntries(updated);
    setNewBib("");
    setNewName("");
    setNewPerf("");
    onUpdateEntries?.(updated);
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card shadow-sm overflow-hidden",
        heat.status === "Needs Verification" && "border-amber-400 dark:border-amber-600",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-hp-navy text-xs font-bold text-white">
            H{heat.heatNumber}
          </span>
          <div>
            <h4 className="text-sm font-bold text-hp-ink dark:text-white">
              Heat {heat.heatNumber}
            </h4>
            {heat.time && (
              <span className="text-xs text-muted-foreground">{heat.time}</span>
            )}
          </div>
          {heat.status === "Needs Verification" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 text-[11px] font-medium border border-amber-300 dark:border-amber-800">
              <AlertTriangle className="size-3" />
              Needs Verification
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleSort}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-hp-navy dark:text-primary hover:bg-muted transition-colors shadow-2xs"
        >
          <ArrowUpDown className="size-3.5" />
          Auto-Sort & Rank ({unit === "sec" ? "Ascending" : "Descending"})
        </button>
      </div>

      {/* Official Record Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/20 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="py-2.5 px-3 w-12 text-center">Rank</th>
              <th className="py-2.5 px-3">BIB No.</th>
              <th className="py-2.5 px-3">Athlete Name</th>
              <th className="py-2.5 px-3">Unit / School</th>
              <th className="py-2.5 px-3">Performance ({unit})</th>
              <th className="py-2.5 px-3">Remarks / Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {entries.map((entry, index) => (
              <tr
                key={`${entry.bib}-${index}`}
                className={cn(
                  "hover:bg-muted/30 transition-colors",
                  entry.needsVerification && "bg-amber-50/60 dark:bg-amber-950/20"
                )}
              >
                <td className="py-2.5 px-3 text-center font-bold tabular-nums">
                  {entry.rank ?? index + 1}
                </td>
                <td className="py-2.5 px-3 font-mono font-semibold tabular-nums text-hp-navy dark:text-primary">
                  #{entry.bib}
                </td>
                <td className="py-2.5 px-3 font-semibold text-hp-ink dark:text-white">
                  {entry.athleteName}
                </td>
                <td className="py-2.5 px-3">
                  <UnitBadge name={entry.unit} />
                </td>
                <td className="py-2.5 px-3 font-mono font-bold tabular-nums">
                  {entry.performanceDisplay ??
                    (entry.performance ? `${entry.performance} ${unit}` : "—")}
                </td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {entry.remarks && (
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {entry.remarks}
                      </span>
                    )}
                    {entry.overallRank && (
                      <span className="rounded bg-hp-navy/10 text-hp-navy dark:text-primary px-1.5 py-0.5 text-[10px] font-bold">
                        Overall {entry.remarks || entry.overallRank}
                      </span>
                    )}
                    {entry.needsVerification && (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 px-1.5 py-0.5 text-[10px] font-semibold border border-amber-300">
                        <AlertTriangle className="size-2.5" />
                        Verify
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fast numeric entry bar */}
      <form
        onSubmit={handleAddQuickEntry}
        className="border-t border-border bg-muted/20 p-2.5 flex flex-wrap items-center gap-2 text-xs"
      >
        <span className="font-semibold text-muted-foreground text-[11px] uppercase mr-1">
          + Quick Entry:
        </span>
        <input
          type="text"
          placeholder="BIB (e.g. 424)"
          value={newBib}
          onChange={(e) => setNewBib(e.target.value)}
          className="w-24 rounded border border-border bg-background px-2 py-1 text-xs font-mono focus:border-hp-navy focus:outline-none"
        />
        <input
          type="text"
          placeholder="Athlete Name (optional)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 min-w-[120px] rounded border border-border bg-background px-2 py-1 text-xs focus:border-hp-navy focus:outline-none"
        />
        <select
          value={newUnit}
          onChange={(e) => setNewUnit(e.target.value)}
          className="rounded border border-border bg-background px-2 py-1 text-xs focus:border-hp-navy focus:outline-none"
        >
          <option value="Mumbai Refinery">Mumbai Refinery</option>
          <option value="South Central Zone">South Central Zone</option>
          <option value="Visakh Refinery">Visakh Refinery</option>
          <option value="Petroleum House">Petroleum House</option>
          <option value="East Zone">East Zone</option>
          <option value="North West Zone">North West Zone</option>
          <option value="Hindustan Bhawan">Hindustan Bhawan</option>
        </select>
        <input
          type="text"
          placeholder={`Time/Dist (${unit})`}
          value={newPerf}
          onChange={(e) => setNewPerf(e.target.value)}
          className="w-28 rounded border border-border bg-background px-2 py-1 text-xs font-mono tabular-nums focus:border-hp-navy focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1 rounded bg-hp-navy text-white px-3 py-1 font-semibold text-xs hover:bg-hp-navy-dark transition-colors"
        >
          <Plus className="size-3.5" />
          Add
        </button>
      </form>
    </div>
  );
}

export default HeatGrid;

