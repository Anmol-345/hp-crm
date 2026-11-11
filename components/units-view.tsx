"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Unit, Athlete } from "@/lib/data/types";
import { UnitBadge } from "./unit-badge";
import { MedalBarChart } from "./medal-bar-chart";
import { Trophy, Users, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";

interface UnitsViewProps {
  units: Unit[];
  athletes: Athlete[];
}

export function UnitsView({ units, athletes }: UnitsViewProps) {
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);

  const toggleExpand = (unitId: string) => {
    setExpandedUnitId(expandedUnitId === unitId ? null : unitId);
  };

  const sortedUnits = [...units].sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="space-y-6">
      {/* Chart Section */}
      <div className="rounded-xl border border-border bg-card p-4 md:p-6 shadow-sm space-y-4">
        <div>
          <h3 className="font-heading font-bold text-base text-hp-ink dark:text-white flex items-center gap-2">
            <Trophy className="size-5 text-hp-gold" />
            <span>Medal Tally by Unit / Refinery / Zone</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            Ranked by overall points: Gold = 5 pts, Silver = 3 pts, Bronze = 1 pt
          </p>
        </div>
        <MedalBarChart units={sortedUnits} />
      </div>

      {/* Standings Table with Expandable Athlete Roster */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="py-3 px-3.5 w-12 text-center">Rank</th>
              <th className="py-3 px-3.5">Unit / Refinery Name</th>
              <th className="py-3 px-3.5">Zone</th>
              <th className="py-3 px-3.5 text-center text-amber-600 font-bold">🥇 Gold</th>
              <th className="py-3 px-3.5 text-center text-slate-500 font-bold">🥈 Silver</th>
              <th className="py-3 px-3.5 text-center text-amber-800 font-bold">🥉 Bronze</th>
              <th className="py-3 px-3.5 text-center font-bold">Total</th>
              <th className="py-3 px-3.5 text-center font-bold text-hp-navy dark:text-primary">Points</th>
              <th className="py-3 px-3.5 text-right">Roster</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedUnits.map((unit, index) => {
              const isExpanded = expandedUnitId === unit.id;
              const unitAthletes = athletes.filter((a) => a.unit === unit.name);

              return (
                <React.Fragment key={unit.id}>
                  <tr
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => toggleExpand(unit.id)}
                  >
                    <td className="py-3 px-3.5 text-center font-bold tabular-nums">
                      <span
                        className={`inline-flex size-6 items-center justify-center rounded-full text-xs font-bold ${
                          index === 0
                            ? "bg-hp-gold text-white"
                            : index === 1
                            ? "bg-slate-400 text-white"
                            : index === 2
                            ? "bg-amber-700 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="flex items-center gap-2">
                        <UnitBadge name={unit.name} code={unit.code} />
                      </div>
                    </td>
                    <td className="py-3 px-3.5 text-muted-foreground font-medium">
                      {unit.zone}
                    </td>
                    <td className="py-3 px-3.5 text-center font-mono font-bold tabular-nums text-amber-600">
                      {unit.gold}
                    </td>
                    <td className="py-3 px-3.5 text-center font-mono font-bold tabular-nums text-slate-500">
                      {unit.silver}
                    </td>
                    <td className="py-3 px-3.5 text-center font-mono font-bold tabular-nums text-amber-800">
                      {unit.bronze}
                    </td>
                    <td className="py-3 px-3.5 text-center font-mono font-bold tabular-nums">
                      {unit.totalMedals}
                    </td>
                    <td className="py-3 px-3.5 text-center font-mono font-extrabold text-sm text-hp-navy dark:text-primary tabular-nums">
                      {unit.totalPoints}
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => toggleExpand(unit.id)}
                        className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                        title={isExpanded ? "Collapse athlete list" : "Expand athlete list"}
                      >
                        <Users className="size-3" />
                        <span>{unitAthletes.length}</span>
                        {isExpanded ? (
                          <ChevronUp className="size-3" />
                        ) : (
                          <ChevronDown className="size-3" />
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Athlete Roster */}
                  {isExpanded && (
                    <tr className="bg-muted/30 border-b border-border">
                      <td colSpan={9} className="p-4">
                        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                          <div className="flex items-center justify-between border-b border-border pb-2">
                            <h4 className="text-xs font-bold text-hp-ink dark:text-white uppercase tracking-wider">
                              Athletes from {unit.name} ({unitAthletes.length} Registered)
                            </h4>
                            <span className="text-[11px] text-muted-foreground">
                              Click any athlete to view their meet history
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {unitAthletes.map((a) => (
                              <Link
                                key={a.bib}
                                href={`/athletes/${a.bib}`}
                                className="flex items-center justify-between rounded border border-border/70 p-2 hover:bg-muted/40 transition-colors text-xs"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-hp-navy dark:text-primary">
                                    #{a.bib}
                                  </span>
                                  <span className="font-semibold text-hp-ink dark:text-white truncate">
                                    {a.name}
                                  </span>
                                </div>
                                <span className="text-[10px] text-muted-foreground">
                                  {a.ageCategory}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UnitsView;

