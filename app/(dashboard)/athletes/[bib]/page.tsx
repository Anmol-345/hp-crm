import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import {
  getAthleteByBib,
  getHeats,
  getResults,
  getCashCards,
  getEvents,
} from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { UnitBadge } from "@/components/unit-badge";
import { StatusBadge } from "@/components/status-badge";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  Trophy,
  CreditCard,
  Flame,
  Award,
  Medal,
  Calendar,
} from "lucide-react";

export default async function AthleteProfilePage({
  params,
}: {
  params: Promise<{ bib: string }>;
}) {
  const { bib } = await params;

  const [athlete, allHeats, allResults, allCashCards, allEvents] =
    await Promise.all([
      getAthleteByBib(bib),
      getHeats(),
      getResults(),
      getCashCards(),
      getEvents(),
    ]);

  if (!athlete) {
    notFound();
  }

  // Find all heat appearances
  const athleteHeats: { eventNo: number; heatNo: number; time?: string; perf?: string; rank?: number }[] = [];
  allHeats.forEach((heat) => {
    heat.entries.forEach((entry) => {
      if (entry.bib === athlete.bib) {
        athleteHeats.push({
          eventNo: heat.eventNo,
          heatNo: heat.heatNumber,
          time: heat.time,
          perf: entry.performanceDisplay,
          rank: entry.rank,
        });
      }
    });
  });

  // Find all podium results
  const athleteResults = allResults.filter((r) => r.bib === athlete.bib);

  // Find all cash cards
  const athleteCashCards = allCashCards.filter(
    (c) =>
      c.bib === athlete.bib ||
      c.athleteName.toLowerCase() === athlete.name.toLowerCase()
  );

  const totalPrizeMoney = athleteCashCards.reduce(
    (sum, c) => sum + c.prizeAmount,
    0
  );

  return (
    <div className="space-y-6">
      {/* Back link */}
      <div>
        <Link
          href="/athletes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-hp-navy dark:hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Athletes</span>
        </Link>
      </div>

      {/* Athlete Profile Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* BIB Avatar */}
            <div className="flex size-16 sm:size-20 flex-shrink-0 items-center justify-center rounded-2xl bg-[#141F63] text-white shadow-md border-2 border-[#1F2E8C]">
              <div className="text-center">
                <span className="block text-[10px] text-slate-300 uppercase tracking-widest font-semibold">
                  BIB
                </span>
                <span className="font-heading font-extrabold text-2xl sm:text-3xl tabular-nums leading-none">
                  {athlete.bib}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <UnitBadge name={athlete.unit} />
                <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {athlete.gender}
                </span>
                <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {athlete.ageCategory}
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-hp-ink dark:text-white">
                {athlete.name}
              </h1>
              <p className="text-xs text-muted-foreground">
                Affiliated Unit: <strong className="text-foreground">{athlete.unit}</strong>
              </p>
            </div>
          </div>

          {/* Quick Prize Banner */}
          {totalPrizeMoney > 0 && (
            <div className="rounded-xl border border-hp-red/30 bg-hp-red/10 p-3 text-right">
              <span className="text-[10px] uppercase font-bold text-hp-red tracking-wider block">
                Total Format 3 Prize Won
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-hp-red tabular-nums">
                {formatCurrency(totalPrizeMoney)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Results & Medals + Cash Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Podium Results */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-heading font-bold text-sm text-hp-ink dark:text-white flex items-center gap-2">
              <Trophy className="size-4 text-hp-gold" />
              <span>Published Podium Results</span>
            </h3>
            <span className="text-xs font-bold text-muted-foreground tabular-nums">
              {athleteResults.length} Medals
            </span>
          </div>

          {athleteResults.length > 0 ? (
            <div className="space-y-3">
              {athleteResults.map((result) => {
                const event = allEvents.find((e) => e.eventNo === result.eventNo);
                return (
                  <div
                    key={result.id}
                    className="flex items-center justify-between rounded-lg border border-border/80 p-3 bg-muted/20"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {result.position === "I"
                          ? "🥇"
                          : result.position === "II"
                          ? "🥈"
                          : "🥉"}
                      </span>
                      <div>
                        <Link
                          href={`/events/${result.eventNo}`}
                          className="text-xs font-bold text-hp-ink dark:text-white hover:text-hp-red transition-colors"
                        >
                          Event #{result.eventNo}: {event?.name || `Event ${result.eventNo}`}
                        </Link>
                        <p className="text-[11px] text-muted-foreground">
                          {event?.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-sm font-bold text-hp-navy dark:text-primary tabular-nums">
                        {result.performanceDisplay}
                      </span>
                      <span className="block text-[10px] text-muted-foreground">
                        Position {result.position}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-6 text-center text-xs text-muted-foreground">
              No published podium finishes recorded for this athlete.
            </p>
          )}
        </div>

        {/* Format 3 Cash Cards */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-heading font-bold text-sm text-hp-ink dark:text-white flex items-center gap-2">
              <CreditCard className="size-4 text-hp-red" />
              <span>Cash Card Control Sheet (Format 3)</span>
            </h3>
            <span className="text-xs font-bold text-hp-red tabular-nums">
              {athleteCashCards.length} Entitlements
            </span>
          </div>

          {athleteCashCards.length > 0 ? (
            <div className="space-y-3">
              {athleteCashCards.map((card) => (
                <div
                  key={card.serialNo}
                  className="flex items-center justify-between rounded-lg border border-border/80 p-3 bg-muted/20"
                >
                  <div>
                    <span className="text-[11px] text-muted-foreground">
                      S.No {String(card.serialNo).padStart(2, "0")} · Event #{card.eventNo}
                    </span>
                    <p className="text-xs font-bold text-hp-ink dark:text-white">
                      {card.eventName} ({card.positionLabel})
                    </p>
                    <span className="text-[11px] text-muted-foreground">
                      Signed: {card.dateSigned || "Pending Signature"}
                    </span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="font-bold text-sm text-hp-navy dark:text-primary tabular-nums block">
                      {formatCurrency(card.prizeAmount)}
                    </span>
                    <StatusBadge status={card.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-xs text-muted-foreground">
              No cash card vouchers issued for this athlete.
            </p>
          )}
        </div>
      </div>

      {/* Heats Registered */}
      {athleteHeats.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
          <h3 className="font-heading font-bold text-sm text-hp-ink dark:text-white flex items-center gap-2">
            <Flame className="size-4 text-hp-navy dark:text-primary" />
            <span>Official Heats Record Sheet Entries</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {athleteHeats.map((h, i) => (
              <div
                key={i}
                className="rounded-lg border border-border p-3 bg-muted/20 space-y-1 text-xs"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-hp-navy dark:text-primary">
                    Event #{h.eventNo} · Heat {h.heatNo}
                  </span>
                  {h.rank && (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold">
                      Heat Rank #{h.rank}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground">{h.time || "Scheduled on register"}</p>
                <p className="font-mono font-bold text-foreground">
                  Performance: {h.perf || "Pending"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

