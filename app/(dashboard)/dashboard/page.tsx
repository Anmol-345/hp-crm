import React from "react";
import Link from "next/link";
import {
  getEvents,
  getAthletes,
  getUnits,
  getResults,
  getCashCardSummary,
} from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import {
  Calendar,
  Users,
  Building2,
  CreditCard,
  CheckCircle2,
  Flame,
  Printer,
  Receipt,
  Download,
  Clock,
  ArrowRight,
  ShieldCheck,
  Trophy,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [events, athletes, units, results, cashSummary] = await Promise.all([
    getEvents(),
    getAthletes(),
    getUnits(),
    getResults(),
    getCashCardSummary(),
  ]);

  // Sort units by total points descending
  const sortedUnits = [...units].sort((a, b) => b.totalPoints - a.totalPoints || b.gold - a.gold);
  const top3Units = sortedUnits.slice(0, 3);

  // Financial calculations
  const totalBudget = cashSummary.totalAmount || 144000;
  const disbursedAmount = cashSummary.disbursed;
  const pendingAmount = totalBudget - disbursedAmount;
  const disbursedPercent = totalBudget > 0 ? (disbursedAmount / totalBudget) * 100 : 0;
  const signedCardsPercent = cashSummary.total > 0 ? (cashSummary.signed / cashSummary.total) * 100 : 0;

  // Circumference for r=40 is 251.2
  const strokeDash = (disbursedPercent / 100) * 251.2;

  // Selected schedule events (Events 1, 2, 8, 18, 48, etc.)
  const featuredScheduleEvents = events.slice(0, 5);

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* ── TOP WELCOME BANNER ─────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#101B60] via-[#001375] to-[#1F2E8C] p-7 lg:p-10 text-white shadow-lg">
        {/* Decorative blobs */}
        <div className="absolute -right-12 -top-24 w-96 h-96 rounded-full bg-[#E4202B]/15 blur-3xl pointer-events-none" />
        <div className="absolute right-36 bottom-0 w-80 h-32 bg-[#DFE0FF]/10 skew-x-12 pointer-events-none" />
        <svg
          className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none"
          fill="none"
          viewBox="0 0 400 200"
        >
          <path d="M0 160 C 120 160, 180 40, 400 20" stroke="currentColor" strokeLinecap="round" strokeWidth="12" />
          <path d="M0 190 C 140 190, 200 70, 400 50" stroke="currentColor" strokeLinecap="round" strokeWidth="8" />
          <path d="M0 220 C 160 220, 220 100, 400 80" stroke="currentColor" strokeLinecap="round" strokeWidth="4" />
        </svg>

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex flex-col gap-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E4202B] text-white text-[11px] font-bold uppercase tracking-wider shadow-xs">
                <span className="size-2 rounded-full bg-white animate-ping" />
                Live Operational Control
              </span>
              <span className="px-3 py-1 rounded-full bg-[#293376]/80 text-[#DFE0FF] text-[11px] font-bold">
                Day 1 Live · Session 2 in Progress (Chembur Complex)
              </span>
              <span className="text-xs text-[#BBC3FF] font-medium hidden sm:inline">
                Official Track System Synced
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-[family-name:var(--font-space-grotesk)] text-white leading-tight">
              19th All India HP Annual Sports Meet 2024-25
            </h1>
            <p className="text-xs md:text-sm text-[#BBC3FF] max-w-2xl leading-relaxed">
              Real-time track adjudication, photo-finish validation, cash card disbursement (Format 3),
              and Zonal &amp; Refinery Championship points audit.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/heats"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#E4202B] hover:bg-red-700 text-white text-xs font-bold transition-all active:scale-95 shadow-sm"
            >
              <Flame className="size-4" />
              <span>+ Record Heat</span>
            </Link>
            <Link
              href="/cash-cards"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-[#001375] hover:bg-slate-100 text-xs font-bold transition-all shadow-sm"
            >
              <Receipt className="size-4" />
              <span>+ Disburse Cash Card</span>
            </Link>
            <Link
              href="/cash-cards"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#293376]/90 hover:bg-[#293376] text-white text-xs font-medium transition-all"
            >
              <Printer className="size-4" />
              <span>Print Format 3</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── KPI CARDS ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Meet Program */}
        <div className="bg-card rounded-xl p-5 shadow-xs border border-border flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Meet Program
            </span>
            <div className="size-9 rounded-lg bg-[#ECECFF] dark:bg-muted flex items-center justify-center text-[#1F2E8C] dark:text-primary">
              <Calendar className="size-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-foreground">
              {events.length}
            </span>
            <span className="text-xs text-muted-foreground font-normal ml-1.5">Events</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/60 pt-3">
            <span>12 Track · 4 Field</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">100% Synced</span>
          </div>
        </div>

        {/* Athletes */}
        <div className="bg-card rounded-xl p-5 shadow-xs border border-border flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Athletes Field
            </span>
            <div className="size-9 rounded-lg bg-[#ECECFF] dark:bg-muted flex items-center justify-center text-[#1F2E8C] dark:text-primary">
              <Users className="size-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-foreground">
              {athletes.length}
            </span>
            <span className="text-xs text-muted-foreground font-normal ml-1.5">Registered</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/60 pt-3">
            <span>7 Pan-India Delegations</span>
            <span className="font-semibold text-foreground">Verified</span>
          </div>
        </div>

        {/* Units */}
        <div className="bg-card rounded-xl p-5 shadow-xs border border-border flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Units &amp; Zones
            </span>
            <div className="size-9 rounded-lg bg-[#ECECFF] dark:bg-muted flex items-center justify-center text-[#1F2E8C] dark:text-primary">
              <Building2 className="size-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-foreground">
              {units.length}
            </span>
            <span className="text-xs text-muted-foreground font-normal ml-1.5">Units</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/60 pt-3">
            <span>2 Refineries · 4 Zones · 1 HQ</span>
            <span className="text-hp-navy dark:text-primary font-semibold">All Active</span>
          </div>
        </div>

        {/* Prize Disbursal */}
        <div className="bg-card rounded-xl p-5 shadow-xs border border-border flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Prize Disbursal
            </span>
            <div className="size-9 rounded-lg bg-[#ECECFF] dark:bg-muted flex items-center justify-center text-[#1F2E8C] dark:text-primary">
              <CreditCard className="size-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#001375] dark:text-primary">
              {formatCurrency(disbursedAmount)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/60 pt-3">
            <span>Budget: {formatCurrency(totalBudget)}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              {Math.round(disbursedPercent)}% Paid
            </span>
          </div>
        </div>

        {/* Cash Cards Signed */}
        <div className="bg-card rounded-xl p-5 shadow-xs border border-border flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Cash Cards Signed
            </span>
            <div className="size-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-foreground">
              {cashSummary.signed}
              <span className="text-lg text-muted-foreground font-semibold"> / {cashSummary.total}</span>
            </span>
            <span className="text-xs text-muted-foreground font-semibold">
              ({Math.round(signedCardsPercent)}%)
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${signedCardsPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">
              {cashSummary.pending} pending signature
            </span>
          </div>
        </div>
      </div>

      {/* ── MAIN OPERATIONS GRID ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── LEFT: Championship Standings ── */}
        <div className="lg:col-span-7 bg-card rounded-xl shadow-xs border border-border flex flex-col">

          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 lg:p-6 pb-4 border-b border-border/60 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="size-2.5 rounded-full bg-[#001375]" />
                <h2 className="text-base font-bold font-[family-name:var(--font-space-grotesk)] text-foreground">
                  Unit Championship Standings
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Aggregate points across all Track, Field &amp; Corporate Veteran fixtures
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-muted px-2.5 py-1.5 rounded-md text-foreground">
                Format 1 Medals
              </span>
              <Link
                href="/reports"
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Export Medal Report"
              >
                <Download className="size-4" />
              </Link>
            </div>
          </div>

          {/* Medal Distribution Bars */}
          <div className="px-5 lg:px-6 py-4 border-b border-border/40 bg-[#F4F2FF]/60 dark:bg-muted/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Medal Distribution — Top 3 Units
              </span>
              <div className="flex items-center gap-4 text-[11px] font-semibold text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-amber-400" /> Gold</span>
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-slate-400" /> Silver</span>
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-amber-700" /> Bronze</span>
              </div>
            </div>
            <div className="space-y-3">
              {top3Units.map((u) => {
                const total = u.totalMedals || (u.gold + u.silver + u.bronze) || 1;
                const goldPct = Math.round((u.gold / total) * 100);
                const silverPct = Math.round((u.silver / total) * 100);
                const bronzePct = Math.max(0, 100 - goldPct - silverPct);
                return (
                  <div key={u.id}>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-foreground">{u.name} <span className="text-muted-foreground font-normal">({u.code})</span></span>
                      <span className="text-muted-foreground font-mono text-[11px]">
                        {u.totalMedals} total · {u.gold}G / {u.silver}S / {u.bronze}B
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-muted/70 overflow-hidden flex shadow-inner">
                      <div className="bg-amber-400 h-full" style={{ width: `${goldPct}%` }} title={`${u.gold} Gold`} />
                      <div className="bg-slate-300 dark:bg-slate-500 h-full" style={{ width: `${silverPct}%` }} title={`${u.silver} Silver`} />
                      <div className="bg-amber-700 h-full" style={{ width: `${bronzePct}%` }} title={`${u.bronze} Bronze`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Standings Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#E5E6FF]/50 dark:bg-muted text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
                  <th className="py-3 px-4 rounded-tl-none">Rank &amp; Unit</th>
                  <th className="py-3 px-4 text-center">Gold</th>
                  <th className="py-3 px-4 text-center">Silver</th>
                  <th className="py-3 px-4 text-center">Bronze</th>
                  <th className="py-3 px-4 text-right">Medals</th>
                  <th className="py-3 px-4 text-right">Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {sortedUnits.map((u, idx) => (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`size-7 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                            idx === 0
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                              : idx === 1
                              ? "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                              : idx === 2
                              ? "bg-orange-50 text-orange-800 dark:bg-orange-950/60 dark:text-orange-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-semibold text-foreground block leading-tight">{u.name}</span>
                          <span className="text-[10px] text-muted-foreground leading-tight">{u.zone || "Pan-India Delegation"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-amber-600 dark:text-amber-400">{u.gold}</td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-600 dark:text-slate-300">{u.silver}</td>
                    <td className="py-3 px-4 text-center font-semibold text-orange-700 dark:text-orange-400">{u.bronze}</td>
                    <td className="py-3 px-4 text-right font-bold text-foreground tabular-nums">{u.totalMedals}</td>
                    <td className="py-3 px-4 text-right font-bold text-[#001375] dark:text-primary text-sm tabular-nums">{u.totalPoints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Link */}
          <div className="px-5 lg:px-6 py-3 border-t border-border/40 flex justify-end">
            <Link
              href="/reports"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-hp-navy dark:text-primary hover:underline"
            >
              <Trophy className="size-3.5" />
              Full Medal Report
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>

        {/* ── RIGHT: Finance + Schedule ── */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* Prize Money Audit */}
          <div className="bg-card rounded-xl shadow-xs border border-border">
            <div className="flex items-start justify-between p-5 pb-4 border-b border-border/60">
              <div>
                <h2 className="text-base font-bold font-[family-name:var(--font-space-grotesk)] text-foreground">
                  Prize Money Audit
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Format 3 Cash Cards &amp; Finance Clearing
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-[#FFDAD6] text-[#BB001A] text-[10px] font-bold uppercase tracking-wider shrink-0">
                Live Finance Desk
              </span>
            </div>

            <div className="p-5 flex flex-col sm:flex-row items-center gap-5">
              {/* Donut */}
              <div className="relative size-32 shrink-0 flex items-center justify-center">
                <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                  <circle className="text-[#E5E6FF] dark:text-muted" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="12" />
                  <circle
                    className="text-[#E4202B]"
                    cx="50" cy="50" fill="transparent" r="40"
                    stroke="currentColor"
                    strokeDasharray={`${strokeDash} 251.2`}
                    strokeLinecap="round"
                    strokeWidth="12"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-bold font-[family-name:var(--font-space-grotesk)] text-foreground leading-none">
                    {Math.round(disbursedPercent)}%
                  </span>
                  <span className="text-[9px] uppercase font-bold text-muted-foreground mt-1 tracking-wider">
                    Disbursed
                  </span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-2.5 w-full text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F4F2FF] dark:bg-muted/40">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-[#E4202B] shrink-0" />
                    <span className="font-medium text-foreground">Disbursed to Athletes</span>
                  </div>
                  <span className="font-bold font-mono text-foreground ml-2">{formatCurrency(disbursedAmount)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F4F2FF] dark:bg-muted/40">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-[#1F2E8C] shrink-0" />
                    <span className="font-medium text-foreground">Signed (Clearing Desk)</span>
                  </div>
                  <span className="font-bold font-mono text-foreground ml-2">{cashSummary.signed} Cards</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F4F2FF] dark:bg-muted/40">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-[#C6C5D4] shrink-0" />
                    <span className="font-medium text-foreground">Awaiting Signature</span>
                  </div>
                  <span className="font-bold font-mono text-foreground ml-2 text-right">{cashSummary.pending} ({formatCurrency(pendingAmount)})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Track & Field Schedule */}
          <div className="bg-card rounded-xl shadow-xs border border-border">
            <div className="flex items-start justify-between p-5 pb-4 border-b border-border/60">
              <div>
                <h2 className="text-base font-bold font-[family-name:var(--font-space-grotesk)] text-foreground flex items-center gap-2">
                  <Clock className="size-4 text-[#1F2E8C] dark:text-primary shrink-0" />
                  Track &amp; Field Schedule
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Today&apos;s line-up and live heat progression
                </p>
              </div>
              <Link
                href="/events"
                className="text-xs font-semibold text-hp-navy dark:text-primary hover:underline flex items-center gap-1 shrink-0"
              >
                All Events
                <ArrowRight className="size-3" />
              </Link>
            </div>

            <div className="p-5 space-y-2.5">
              {featuredScheduleEvents.map((evt, idx) => {
                const isCompleted = evt.status === "Completed";
                const isInProgress = evt.status === "In Progress" || idx === 1;
                return (
                  <div
                    key={evt.eventNo}
                    className="p-3.5 rounded-xl bg-[#F4F2FF] dark:bg-muted/40 hover:bg-[#ECECFF] dark:hover:bg-muted transition-colors flex items-center justify-between gap-3 relative overflow-hidden"
                  >
                    {/* Status stripe */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${
                      isCompleted ? "bg-emerald-500" : isInProgress ? "bg-[#E4202B]" : "bg-[#1F2E8C]"
                    }`} />
                    <div className="flex items-center gap-3 pl-2 min-w-0">
                      <div className="size-10 rounded-lg bg-[#DFE0FF] dark:bg-muted flex flex-col items-center justify-center text-[#000D5F] dark:text-white shrink-0 font-[family-name:var(--font-space-grotesk)]">
                        <span className="text-[9px] font-bold uppercase leading-none">EVT</span>
                        <span className="text-sm font-bold leading-none mt-0.5">{String(evt.eventNo).padStart(2, "0")}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1">
                          <Link href={`/events/${evt.eventNo}`} className="text-xs font-bold text-foreground hover:text-[#E4202B] transition-colors truncate">
                            {evt.name}
                          </Link>
                          <span className="text-[10px] font-semibold text-muted-foreground truncate">· {evt.category}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {evt.day}{evt.time ? ` · ${evt.time}` : ""}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                      isCompleted
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : isInProgress
                        ? "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}>
                      {isCompleted ? "Done" : isInProgress ? "Live" : "Sched."}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
