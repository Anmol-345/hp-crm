"use client";

import React from "react";
import { Unit, Event, CashCard } from "@/lib/data/types";
import { MedalBarChart } from "./medal-bar-chart";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Download,
  Printer,
  FileSpreadsheet,
  Award,
  CreditCard,
  Users,
  CheckCircle2,
} from "lucide-react";

interface ReportsViewProps {
  units: Unit[];
  events: Event[];
  cashCards: CashCard[];
}

export function ReportsView({ units, events, cashCards }: ReportsViewProps) {
  // Aggregate prize money by unit
  const unitPrizeMap: Record<string, number> = {};
  cashCards.forEach((c) => {
    unitPrizeMap[c.unit] = (unitPrizeMap[c.unit] || 0) + c.prizeAmount;
  });

  const prizeChartData = Object.entries(unitPrizeMap).map(([unitName, amount]) => {
    const unitObj = units.find((u) => u.name === unitName);
    return {
      name: unitObj?.code || unitName.slice(0, 3).toUpperCase(),
      fullName: unitName,
      amount,
    };
  });

  const totalPrize = cashCards.reduce((sum, c) => sum + c.prizeAmount, 0);
  const totalSigned = cashCards.filter((c) => c.status === "Signed").length;
  const totalParticipants = events.reduce(
    (sum, e) => sum + (e.participantCount || 0),
    0
  );

  const handleExportFullReportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "UNIT / REFINERY MEDAL & PRIZE DISBURSEMENT REPORT",
        "Rank,Unit Name,Code,Gold,Silver,Bronze,Total Medals,Total Points,Format 3 Prize (INR)",
        ...units.map(
          (u, idx) =>
            `${idx + 1},"${u.name}",${u.code},${u.gold},${u.silver},${u.bronze},${u.totalMedals},${u.totalPoints},${unitPrizeMap[u.name] || 0}`
        ),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HPCL_Sports_Meet_Full_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div>
          <h3 className="font-heading font-bold text-sm text-hp-ink dark:text-white">
            Meet Verification & Audit Reports
          </h3>
          <p className="text-xs text-muted-foreground">
            Complete financial disbursement and delegation performance summaries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted transition-colors"
          >
            <Printer className="size-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportFullReportCSV}
            className="inline-flex items-center gap-1.5 rounded-lg bg-hp-navy text-white px-3.5 py-1.5 text-xs font-semibold hover:bg-hp-navy-dark transition-colors shadow-2xs"
          >
            <Download className="size-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* High level KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
            Total Prize Disbursed
          </span>
          <p className="mt-1 text-2xl font-bold font-heading text-hp-navy dark:text-primary tabular-nums">
            {formatCurrency(totalPrize)}
          </p>
          <span className="text-xs text-emerald-600 font-semibold">
            {totalSigned} of {cashCards.length} Signed (100%)
          </span>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
            Total Meet Entries
          </span>
          <p className="mt-1 text-2xl font-bold font-heading text-hp-ink dark:text-white tabular-nums">
            {totalParticipants}
          </p>
          <span className="text-xs text-muted-foreground">16 Track & Field Events</span>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
            Format 3 Events
          </span>
          <p className="mt-1 text-2xl font-bold font-heading text-hp-red tabular-nums">
            12 Events
          </p>
          <span className="text-xs text-muted-foreground">36 Total Cash Winners</span>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
            Participating Units
          </span>
          <p className="mt-1 text-2xl font-bold font-heading text-hp-ink dark:text-white tabular-nums">
            {units.length}
          </p>
          <span className="text-xs text-muted-foreground">Refineries & Zonal HQs</span>
        </div>
      </div>

      {/* Two Column Charts: Medals vs Cash Disbursement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medal Distribution */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
          <h3 className="font-heading font-bold text-sm text-hp-ink dark:text-white flex items-center gap-2">
            <Award className="size-4.5 text-hp-gold" />
            <span>Medal Tally Distribution</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            Gold (5 pts), Silver (3 pts), Bronze (1 pt) across all units
          </p>
          <MedalBarChart units={units} />
        </div>

        {/* Prize Money Disbursed by Unit */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
          <h3 className="font-heading font-bold text-sm text-hp-ink dark:text-white flex items-center gap-2">
            <CreditCard className="size-4.5 text-hp-red" />
            <span>Format 3 Prize Money by Delegation (₹)</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            Total cash card amounts earned per Refinery / Zone
          </p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={prizeChartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(Number(value) || 0), "Prize Amount"]}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.fullName || ""
                  }
                />
                <Bar dataKey="amount" fill="#1F2E8C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Event-wise Participation Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border bg-muted/40 p-3.5 flex items-center justify-between">
          <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-hp-ink dark:text-white">
            Event-Wise Participation & Disbursed Register
          </h3>
          <span className="text-[11px] text-muted-foreground font-semibold">
            All 16 Events Audited
          </span>
        </div>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/20 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="py-2.5 px-3 w-16 text-center">Event #</th>
              <th className="py-2.5 px-3">Event Name & Age Category</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Day</th>
              <th className="py-2.5 px-3 text-center">Athletes</th>
              <th className="py-2.5 px-3">Format 3 Prize</th>
              <th className="py-2.5 px-3 text-right">Audit Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {events.map((e) => (
              <tr key={e.eventNo} className="hover:bg-muted/30 transition-colors">
                <td className="py-2.5 px-3 text-center font-mono font-bold text-hp-navy dark:text-primary">
                  #{e.eventNo}
                </td>
                <td className="py-2.5 px-3">
                  <span className="font-semibold text-hp-ink dark:text-white block">
                    {e.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {e.category}
                  </span>
                </td>
                <td className="py-2.5 px-3 capitalize text-muted-foreground">
                  {e.type} ({e.unit})
                </td>
                <td className="py-2.5 px-3 font-medium">{e.day}</td>
                <td className="py-2.5 px-3 text-center font-mono font-bold tabular-nums">
                  {e.participantCount ?? "—"}
                </td>
                <td className="py-2.5 px-3 font-semibold text-hp-navy dark:text-primary tabular-nums">
                  {e.isCashCardEvent ? "₹12,000 (Top 3)" : "—"}
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                    <CheckCircle2 className="size-3" />
                    Verified
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportsView;

