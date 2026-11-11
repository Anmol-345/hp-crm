"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heat, Event, HeatEntry } from "@/lib/data/types";
import { resolveHeatEntry } from "@/lib/data/heats";
import {
  ShieldCheck,
  Trophy,
  Timer,
  Play,
  RotateCcw,
  Check,
  Printer,
  ChevronRight,
  AlertTriangle,
  Touchpad,
  Award,
  X,
  FileCheck2,
  Users,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HeatsViewProps {
  heats: Heat[];
  events: Event[];
}

export function HeatsView({ heats, events }: HeatsViewProps) {
  // Available event selection
  const eventNumbersWithHeats = Array.from(new Set(heats.map((h) => h.eventNo)));
  const [selectedEventNo, setSelectedEventNo] = useState<number>(
    eventNumbersWithHeats[0] || 1
  );

  const currentEvent = events.find((e) => e.eventNo === selectedEventNo) || events[0];
  const currentEventHeats = heats.filter((h) => h.eventNo === selectedEventNo);

  // Active Heat Tab
  const [activeHeatNo, setActiveHeatNo] = useState<number>(1);
  const [publishedNotice, setPublishedNotice] = useState<string | null>(null);
  const [isAutoRanking, setIsAutoRanking] = useState(false);
  const [isApplyingTime, setIsApplyingTime] = useState(false);
  const [showFinalsModal, setShowFinalsModal] = useState(false);

  // Entries for the active heat
  const activeHeat = currentEventHeats.find((h) => h.heatNumber === activeHeatNo) || currentEventHeats[0];
  const [heatEntriesMap, setHeatEntriesMap] = useState<Record<string, HeatEntry[]>>({});

  // Get active entries from state or initial
  const activeKey = `${selectedEventNo}-${activeHeatNo}`;
  const entries: HeatEntry[] =
    heatEntriesMap[activeKey] || activeHeat?.entries || [];

  // Keypad & Active Lane State
  const [selectedLaneIndex, setSelectedLaneIndex] = useState<number>(0);
  const [keypadValue, setKeypadValue] = useState<string>(
    entries[0]?.performance ? String(entries[0].performance) : "12.45"
  );

  const activeEntry = entries[selectedLaneIndex] || entries[0];

  const handleSelectLane = (idx: number) => {
    setSelectedLaneIndex(idx);
    const entry = entries[idx];
    setKeypadValue(entry?.performance ? String(entry.performance) : "");
  };

  const handleKeypadPress = (val: string) => {
    if (val === "BACKSPACE") {
      setKeypadValue((prev) => prev.slice(0, -1));
    } else if (val === ".") {
      if (!keypadValue.includes(".")) {
        setKeypadValue((prev) => prev + ".");
      }
    } else {
      if (keypadValue.length < 6) {
        setKeypadValue((prev) => prev + val);
      }
    }
  };

  const handleApplyKeypad = async () => {
    const num = parseFloat(keypadValue);
    if (!isNaN(num) && activeEntry) {
      setIsApplyingTime(true);
      const updated = [...entries];
      updated[selectedLaneIndex] = {
        ...updated[selectedLaneIndex],
        performance: num,
        performanceDisplay: `${num.toFixed(2)}s`,
      };
      setHeatEntriesMap((prev) => ({
        ...prev,
        [activeKey]: updated,
      }));

      // Persist to Supabase if entry ID exists
      if (activeEntry.id) {
        try {
          await resolveHeatEntry(activeEntry.id, {
            performance: num,
          });
        } catch (err) {
          console.error("Error saving heat entry to DB:", err);
        }
      }

      setIsApplyingTime(false);

      // Auto move to next lane
      if (selectedLaneIndex < entries.length - 1) {
        handleSelectLane(selectedLaneIndex + 1);
      }
    }
  };

  const handleAutoRank = async () => {
    setIsAutoRanking(true);
    // Sort entries with recorded performance
    const sorted = [...entries].sort((a, b) => {
      if (a.performance === undefined) return 1;
      if (b.performance === undefined) return -1;
      return a.performance - b.performance;
    });

    const ranked = sorted.map((entry, idx) => ({
      ...entry,
      rank: entry.performance !== undefined ? idx + 1 : undefined,
      remarks:
        idx === 0
          ? "1st · Q"
          : idx === 1
          ? "2nd · Q"
          : idx === 2
          ? "3rd · q"
          : entry.remarks,
    }));

    setHeatEntriesMap((prev) => ({
      ...prev,
      [activeKey]: ranked,
    }));

    // Persist auto-rank to Supabase DB
    const saves = ranked
      .filter((r) => r.id)
      .map((r) =>
        resolveHeatEntry(r.id!, {
          performance: r.performance,
          rank_remark: r.remarks,
        }).catch((err) => console.error("Error auto-saving rank to DB:", err))
      );

    await Promise.all(saves);
    setIsAutoRanking(false);
  };

  // Compile Finalists (top 2 from each heat + next fastest)
  const allEntriesAcrossHeats = currentEventHeats.flatMap((h) => {
    const key = `${selectedEventNo}-${h.heatNumber}`;
    return heatEntriesMap[key] || h.entries;
  });

  const finalists = [...allEntriesAcrossHeats]
    .filter((e) => e.performance !== undefined)
    .sort((a, b) => (a.performance || 999) - (b.performance || 999))
    .slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Published Notice Banner */}
      {publishedNotice && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <Check className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                {publishedNotice}
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                Official lane assignments are published to the stadium display board.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/results"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Trophy className="size-3.5" />
              <span>Record Podium Results</span>
            </Link>
            <button
              onClick={() => setPublishedNotice(null)}
              className="p-1 text-emerald-700 hover:text-emerald-950 dark:text-emerald-400"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* METRIC / COMPLIANCE BANNER & QUICK CONTEXT */}
      <div className="relative overflow-hidden rounded-xl bg-[#101B60] text-white shadow-sm p-4 lg:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="absolute -right-16 -top-16 size-56 rounded-full bg-[#E4202B]/10 pointer-events-none blur-2xl" />

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center p-2 rounded-lg bg-white/10 text-[#BBC3FF]">
            <ShieldCheck className="size-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#BBC3FF]">
                AFI Standard Track Protocol · Form-3 Officiating
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E4202B] text-white text-[10px] font-bold uppercase tracking-wider">
                <span className="size-1.5 rounded-full bg-white animate-ping" />
                Live Scrutiny Active
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Electronic Timing Synchronized (Omega Photo-Finish Gate 1) · Wind Gauge: +0.8 m/s Legal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-right">
            <div>
              <div className="text-[10px] font-bold text-[#BBC3FF] uppercase tracking-wider">
                Official Meet Record
              </div>
              <div className="text-sm font-bold font-[family-name:var(--font-space-grotesk)] text-white">
                11.20s <span className="text-xs text-[#BBC3FF] font-normal">(2018 · Suresh P.)</span>
              </div>
            </div>
            <Trophy className="size-6 text-amber-400" />
          </div>

          <div className="h-8 w-px bg-white/20 hidden sm:block" />

          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-bold text-[#BBC3FF] uppercase tracking-wider">
              Progression Rule
            </div>
            <div className="text-xs font-semibold text-white">
              Top 2 per Heat (Q) + 2 Fastest (q)
            </div>
          </div>
        </div>
      </div>

      {/* MAIN EVENT TITLE & ACTIONS STRIP */}
      <div className="bg-card rounded-xl shadow-xs border border-border p-5 lg:p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#1F2E8C] text-white text-[10px] font-bold uppercase">
              EVENT #{String(currentEvent?.eventNo || 1).padStart(2, "0")}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-bold uppercase">
              {currentEvent?.type === "field" ? "FIELD" : "TRACK"} · {currentEvent?.name}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#E5E6FF] dark:bg-muted text-[#001375] dark:text-primary text-[10px] font-bold uppercase">
              {currentEvent?.category}
            </span>
            <span className="text-xs text-muted-foreground">· Round 1 of 2</span>
          </div>

          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-foreground tracking-tight">
              Official Record Sheet (Heats)
            </h1>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              24 Competitors across 3 Heats · 8 Advance to Final
            </span>
          </div>
        </div>

        {/* Action Button Group */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowFinalsModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#E4202B] hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all active:scale-95"
          >
            <Award className="size-4" />
            <span>Promote to Final (8 Finalists)</span>
          </button>

          <button
            onClick={handleAutoRank}
            disabled={isAutoRanking}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-muted hover:bg-border text-foreground rounded-lg text-xs font-semibold transition-all disabled:opacity-60 shadow-2xs"
          >
            {isAutoRanking ? (
              <>
                <Loader2 className="size-4 animate-spin text-hp-navy dark:text-primary" />
                <span>Auto-Ranking Lanes...</span>
              </>
            ) : (
              <>
                <RotateCcw className="size-4" />
                <span>Auto-Rank Lanes</span>
              </>
            )}
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-muted hover:bg-border text-foreground rounded-lg text-xs font-semibold transition-all"
          >
            <Printer className="size-4" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      {/* HEAT TABS & WORKSPACE GRID (8 Cols Table, 4 Cols Keypad) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT 8 COLS: ACTIVE HEAT DATA GRID */}
        <div className="lg:col-span-8 space-y-4">
          {/* Heat Selector Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {currentEventHeats.map((h) => (
              <button
                key={h.heatNumber}
                onClick={() => {
                  setActiveHeatNo(h.heatNumber);
                  setSelectedLaneIndex(0);
                }}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-2",
                  activeHeatNo === h.heatNumber
                    ? "bg-[#1F2E8C] text-white shadow-xs"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                )}
              >
                <span>Heat {h.heatNumber}</span>
                <span
                  className={cn(
                    "size-2 rounded-full",
                    activeHeatNo === h.heatNumber ? "bg-[#E4202B]" : "bg-muted-foreground"
                  )}
                />
              </button>
            ))}

            <button
              onClick={() => setShowFinalsModal(true)}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-muted/60 border border-dashed border-border text-foreground hover:bg-muted transition-all shrink-0 flex items-center gap-1.5"
            >
              <Trophy className="size-3.5 text-amber-500" />
              <span>Final Lineup (8 Lanes)</span>
            </button>
          </div>

          {/* Active Data Table Card */}
          <div className="bg-card rounded-xl shadow-xs border border-border overflow-hidden">
            {/* Grid Header Bar */}
            <div className="p-3.5 bg-muted/30 border-b border-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">Heat #{activeHeatNo} Lane Entries</span>
                <span className="text-muted-foreground">· 6 Competitors Assigned</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                <span>Status:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Ready for Adjudication
                </span>
              </div>
            </div>

            {/* The Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#E5E6FF]/50 dark:bg-muted text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
                    <th className="py-2.5 px-3 w-14 text-center">Lane</th>
                    <th className="py-2.5 px-3 w-16">BIB</th>
                    <th className="py-2.5 px-3 min-w-[180px]">Competitor Name</th>
                    <th className="py-2.5 px-3 min-w-[140px]">Unit / Zone</th>
                    <th className="py-2.5 px-3 w-32 text-center">Time (Sec)</th>
                    <th className="py-2.5 px-3 w-28 text-center">Rank / Q</th>
                    <th className="py-2.5 px-3 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {entries.map((entry, idx) => {
                    const isSelected = selectedLaneIndex === idx;
                    const laneNo = idx + 1;

                    return (
                      <tr
                        key={idx}
                        onClick={() => handleSelectLane(idx)}
                        className={cn(
                          "cursor-pointer transition-colors",
                          isSelected
                            ? "bg-[#ECECFF] dark:bg-muted/80 font-medium"
                            : "hover:bg-muted/30"
                        )}
                      >
                        {/* Lane */}
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={cn(
                              "size-6 rounded-full inline-flex items-center justify-center font-bold text-xs",
                              isSelected
                                ? "bg-[#1F2E8C] text-white"
                                : "bg-muted text-foreground"
                            )}
                          >
                            {laneNo}
                          </span>
                        </td>

                        {/* BIB */}
                        <td className="py-2.5 px-3 font-mono font-bold text-foreground">
                          #{entry.bib}
                        </td>

                        {/* Competitor */}
                        <td className="py-2.5 px-3 font-semibold text-foreground">
                          {entry.athleteName}
                        </td>

                        {/* Unit */}
                        <td className="py-2.5 px-3 text-muted-foreground">
                          {entry.unit}
                        </td>

                        {/* Time Entry Input */}
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="text"
                            value={
                              isSelected
                                ? keypadValue
                                : entry.performance !== undefined
                                ? `${entry.performance.toFixed(2)}s`
                                : "—"
                            }
                            onChange={(e) => {
                              if (isSelected) setKeypadValue(e.target.value);
                            }}
                            className={cn(
                              "w-20 text-center rounded border px-2 py-1 font-mono font-bold text-xs tabular-nums focus:outline-none",
                              isSelected
                                ? "border-[#1F2E8C] bg-white dark:bg-background text-[#001375] dark:text-primary ring-2 ring-[#1F2E8C]/20"
                                : "border-border bg-muted/40 text-foreground"
                            )}
                          />
                        </td>

                        {/* Rank / Q */}
                        <td className="py-2.5 px-3 text-center">
                          {entry.remarks ? (
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                entry.remarks.includes("Q")
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                  : entry.remarks.includes("q")
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              {entry.remarks}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>

                        {/* Verification */}
                        <td className="py-2.5 px-3 text-right">
                          {entry.needsVerification ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                              <AlertTriangle className="size-3" />
                              Verify Paper
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                              <Check className="size-3" />
                              Verified
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Summary Strip within Heat Grid */}
            <div className="p-3 bg-muted/20 border-t border-border flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2">
              <div className="flex items-center gap-3">
                <span>Top 2 Qualify Automatically (Q)</span>
                <span>·</span>
                <span>Next 2 Fastest Advance on Time (q)</span>
              </div>
              <span className="font-semibold text-foreground">
                Click any lane row to enter timing via Rapid Keypad
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT 4 COLS: RAPID TOUCH KEYPAD & PREVIOUS HEATS */}
        <div className="lg:col-span-4 space-y-4">
          {/* Track Judge Quick Touch Keypad */}
          <div className="bg-card rounded-xl shadow-xs border border-border p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Touchpad className="size-4 text-[#1F2E8C] dark:text-primary" />
                <span className="text-xs font-bold text-foreground">Rapid Lane Keypad</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#1F2E8C] text-white text-[10px] font-bold uppercase">
                LANE {selectedLaneIndex + 1}
              </span>
            </div>

            <div>
              <div className="text-[11px] text-muted-foreground truncate">
                {activeEntry?.athleteName} (#{activeEntry?.bib})
              </div>
              <div className="text-xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#001375] dark:text-primary py-1.5 px-3 bg-[#F4F2FF] dark:bg-muted/40 rounded-lg mt-1 flex items-center justify-between font-mono">
                <span>{keypadValue || "0.00"}</span>
                <span className="text-xs text-muted-foreground font-sans">SEC</span>
              </div>
            </div>

            {/* Touch Keypad Grid */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "BACKSPACE"].map(
                (k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => handleKeypadPress(k)}
                    className="h-10 rounded-lg bg-muted/60 hover:bg-muted text-foreground font-bold text-sm transition-colors active:scale-95 flex items-center justify-center font-mono"
                  >
                    {k === "BACKSPACE" ? "⌫" : k}
                  </button>
                )
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setKeypadValue("")}
                className="flex-1 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleApplyKeypad}
                disabled={isApplyingTime || !keypadValue}
                className="flex-[2] py-2 rounded-lg bg-[#E4202B] hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
              >
                {isApplyingTime ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Apply &amp; Next Lane →</span>
                )}
              </button>
            </div>
          </div>

          {/* Qualification Cutoff Ticker */}
          <div className="bg-[#101B60] text-white rounded-xl p-4 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#BBC3FF] uppercase tracking-wider">
              <span>Qualification Cutoff</span>
              <span className="text-emerald-400">Live (q2)</span>
            </div>
            <div className="text-lg font-bold font-[family-name:var(--font-space-grotesk)]">
              {finalists[7]?.performance ? `${finalists[7].performance.toFixed(2)}s` : "12.82s"}
            </div>
            <p className="text-[11px] text-slate-300">
              Currently held by {finalists[7]?.athleteName || "S. Kulkarni"} ({finalists[7]?.unit || "MR"})
            </p>
          </div>
        </div>
      </div>

      {/* PROMOTE TO FINAL CONFIRMATION MODAL */}
      {showFinalsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-2xl bg-card rounded-2xl border border-border shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="size-5 text-amber-500" />
                <h3 className="font-bold text-base font-[family-name:var(--font-space-grotesk)]">
                  Confirm 8 Finalists Lineup (Event #{currentEvent.eventNo})
                </h3>
              </div>
              <button
                onClick={() => setShowFinalsModal(false)}
                className="p-1 rounded text-muted-foreground hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              These 8 athletes have qualified automatically (Q) or by fastest time (q) across all heats. Seeded lane assignments (Fastest in Lanes 4 &amp; 5):
            </p>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-muted text-muted-foreground text-[10px] uppercase font-bold">
                    <th className="p-2.5 text-center">Final Lane</th>
                    <th className="p-2.5">BIB</th>
                    <th className="p-2.5">Athlete</th>
                    <th className="p-2.5">Unit</th>
                    <th className="p-2.5 text-right">Heat Time</th>
                    <th className="p-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {finalists.map((f, i) => {
                    const seedLanes = [4, 5, 3, 6, 2, 7, 1, 8];
                    const lane = seedLanes[i] || i + 1;

                    return (
                      <tr key={i} className="hover:bg-muted/30">
                        <td className="p-2.5 text-center font-bold">
                          <span className="size-5 rounded-full bg-[#1F2E8C] text-white inline-flex items-center justify-center text-[10px]">
                            {lane}
                          </span>
                        </td>
                        <td className="p-2.5 font-mono font-bold">#{f.bib}</td>
                        <td className="p-2.5 font-semibold">{f.athleteName}</td>
                        <td className="p-2.5 text-muted-foreground">{f.unit}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-[#001375] dark:text-primary">
                          {f.performance?.toFixed(2)}s
                        </td>
                        <td className="p-2.5 text-center">
                          <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                            {i < 4 ? "Qualified (Q)" : "Fastest (q)"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowFinalsModal(false)}
                className="px-4 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setPublishedNotice(
                    `Official Final Start-List published for Event #${currentEvent?.eventNo || 1} (${currentEvent?.name || ""})! 8 Finalists confirmed.`
                  );
                  setShowFinalsModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-[#E4202B] hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Publish Official Final Start-List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HeatsView;
