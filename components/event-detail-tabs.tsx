"use client";

import React, { useState } from "react";
import { Event, Heat, Result, CashCard } from "@/lib/data/types";
import { HeatGrid } from "./heat-grid";
import { ResultsTable } from "./results-table";
import { PodiumCard } from "./podium-card";
import { CashCardRow } from "./cash-card-row";
import { EmptyState } from "./empty-state";
import { SignaturePad } from "./signature-pad";
import { updateCashCardStatus } from "@/lib/data/cash-cards";
import { Flame, Trophy, CreditCard, AlertCircle } from "lucide-react";

interface EventDetailTabsProps {
  event: Event;
  heats: Heat[];
  results: Result[];
  cashCards: CashCard[];
}

export function EventDetailTabs({
  event,
  heats,
  results,
  cashCards: initialCashCards,
}: EventDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<"heats" | "results" | "cash-cards">(
    results.length > 0 ? "results" : heats.length > 0 ? "heats" : "heats"
  );
  const [cashCards, setCashCards] = useState<CashCard[]>(initialCashCards);
  const [signingCard, setSigningCard] = useState<CashCard | null>(null);
  const [isSavingSignature, setIsSavingSignature] = useState(false);

  const handleSignatureSave = async (dataUrl: string) => {
    if (!signingCard) return;
    setIsSavingSignature(true);
    const updated = await updateCashCardStatus(signingCard.serialNo, "Signed", dataUrl);
    if (updated) {
      setCashCards((prev) =>
        prev.map((c) => (c.serialNo === updated.serialNo ? updated : c))
      );
    }
    setIsSavingSignature(false);
    setSigningCard(null);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation Buttons */}
      <div className="flex border-b border-border bg-card rounded-t-xl px-4 pt-2 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("heats")}
          className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === "heats"
              ? "border-hp-navy text-hp-navy dark:border-primary dark:text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Flame className="size-4" />
          <span>Heats (Official Records)</span>
          {heats.length > 0 && (
            <span className="rounded-full bg-muted px-1.5 py-0.2 text-[10px]">
              {heats.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("results")}
          className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === "results"
              ? "border-hp-navy text-hp-navy dark:border-primary dark:text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Trophy className="size-4 text-hp-gold" />
          <span>Final Results & Podium</span>
          {results.length > 0 && (
            <span className="rounded-full bg-hp-gold/20 text-amber-800 dark:text-amber-300 px-1.5 py-0.2 text-[10px] font-bold">
              {results.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("cash-cards")}
          className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === "cash-cards"
              ? "border-hp-navy text-hp-navy dark:border-primary dark:text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <CreditCard className="size-4 text-hp-red" />
          <span>Format 3 Cash Card</span>
          {cashCards.length > 0 && (
            <span className="rounded-full bg-hp-red/10 text-hp-red px-1.5 py-0.2 text-[10px] font-bold">
              {cashCards.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Heats */}
      {activeTab === "heats" && (
        <div className="space-y-4">
          {heats.length > 0 ? (
            heats.map((heat) => (
              <HeatGrid
                key={heat.heatNumber}
                heat={heat}
                unit={event.unit}
              />
            ))
          ) : (
            <EmptyState
              icon={Flame}
              title="No Heats Recorded for this Event"
              description={`Heats for Event #${event.eventNo} (${event.name}) have not been uploaded from paper register sheets.`}
            />
          )}
        </div>
      )}

      {/* Tab 2: Results */}
      {activeTab === "results" && (
        <div className="space-y-6">
          {results.length > 0 ? (
            <>
              {/* Podium Display (Top 3) */}
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  Podium Standings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {results.find((r) => r.position === "I") && (
                    <PodiumCard
                      position="I"
                      athleteName={results.find((r) => r.position === "I")!.athleteName}
                      bib={results.find((r) => r.position === "I")!.bib}
                      unit={results.find((r) => r.position === "I")!.unit}
                      performance={results.find((r) => r.position === "I")!.performance}
                      performanceUnit={event.unit}
                      eventName={event.name}
                      className="md:order-2 border-2 border-hp-gold/60"
                    />
                  )}
                  {results.find((r) => r.position === "II") && (
                    <PodiumCard
                      position="II"
                      athleteName={results.find((r) => r.position === "II")!.athleteName}
                      bib={results.find((r) => r.position === "II")!.bib}
                      unit={results.find((r) => r.position === "II")!.unit}
                      performance={results.find((r) => r.position === "II")!.performance}
                      performanceUnit={event.unit}
                      eventName={event.name}
                      className="md:order-1"
                    />
                  )}
                  {results.find((r) => r.position === "III") && (
                    <PodiumCard
                      position="III"
                      athleteName={results.find((r) => r.position === "III")!.athleteName}
                      bib={results.find((r) => r.position === "III")!.bib}
                      unit={results.find((r) => r.position === "III")!.unit}
                      performance={results.find((r) => r.position === "III")!.performance}
                      performanceUnit={event.unit}
                      eventName={event.name}
                      className="md:order-3"
                    />
                  )}
                </div>
              </div>

              {/* Full Results Table */}
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  Official Result Sheet
                </h4>
                <ResultsTable results={results} />
              </div>
            </>
          ) : (
            <EmptyState
              icon={Trophy}
              title="Results Awaited"
              description={`Official final results for Event #${event.eventNo} are pending conclusion of heats/finals.`}
            />
          )}
        </div>
      )}

      {/* Tab 3: Cash Cards */}
      {activeTab === "cash-cards" && (
        <div className="space-y-4">
          {event.isCashCardEvent ? (
            <>
              {signingCard && (
                <div className="p-4 rounded-xl border border-hp-navy/30 bg-muted/30">
                  <SignaturePad
                    athleteName={`${signingCard.athleteName} (Prize ₹${signingCard.prizeAmount})`}
                    onSave={handleSignatureSave}
                    onCancel={() => setSigningCard(null)}
                    isSaving={isSavingSignature}
                  />
                </div>
              )}

              <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      <th className="py-2.5 px-3">S.No</th>
                      <th className="py-2.5 px-3">Event</th>
                      <th className="py-2.5 px-3">Position</th>
                      <th className="py-2.5 px-3">Athlete</th>
                      <th className="py-2.5 px-3">Unit</th>
                      <th className="py-2.5 px-3">Prize (₹)</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {cashCards.map((card) => (
                      <CashCardRow
                        key={card.serialNo}
                        card={card}
                        onSignClick={(c) => setSigningCard(c)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <EmptyState
              icon={CreditCard}
              title="Not a Format 3 Cash Card Event"
              description="Format 3 Prize money applies to official events 01 through 12. This event receives trophies and medals."
            />
          )}
        </div>
      )}
    </div>
  );
}

export default EventDetailTabs;

