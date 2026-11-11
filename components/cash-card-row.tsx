"use client";

import React from "react";
import { CashCard } from "@/lib/data/types";
import { formatCurrency, cn } from "@/lib/utils";
import StatusBadge from "./status-badge";
import UnitBadge from "./unit-badge";
import { PenLine, CheckCircle2 } from "lucide-react";

interface CashCardRowProps {
  card: CashCard;
  onSignClick?: (card: CashCard) => void;
  className?: string;
}

export function CashCardRow({ card, onSignClick, className }: CashCardRowProps) {
  const positionBadge = {
    I: { label: "I · Winner", bg: "bg-hp-gold/15 text-amber-800 dark:text-amber-300 border-hp-gold/40" },
    II: { label: "II · Runner-up", bg: "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300" },
    III: { label: "III · 1st Runner-up", bg: "bg-amber-900/15 text-amber-900 dark:text-amber-400 border-amber-800/30" },
  }[card.position];

  return (
    <tr className={cn("border-b border-border hover:bg-muted/40 transition-colors", className)}>
      {/* S.No */}
      <td className="py-3 px-3 text-xs font-mono font-semibold text-muted-foreground tabular-nums">
        {String(card.serialNo).padStart(2, "0")}
      </td>

      {/* Event */}
      <td className="py-3 px-3">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-hp-ink dark:text-white">
            Ev {String(card.eventNo).padStart(2, "0")} · {card.eventName}
          </span>
          <span className="text-[11px] text-muted-foreground">{card.category}</span>
        </div>
      </td>

      {/* Position */}
      <td className="py-3 px-3">
        <span
          className={cn(
            "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium tabular-nums",
            positionBadge.bg
          )}
        >
          {positionBadge.label}
        </span>
      </td>

      {/* Athlete */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono font-bold tabular-nums">
            #{card.bib}
          </span>
          <span className="text-xs font-semibold text-hp-ink dark:text-white">
            {card.athleteName}
          </span>
        </div>
      </td>

      {/* Unit / School */}
      <td className="py-3 px-3">
        <UnitBadge name={card.unit} />
      </td>

      {/* Prize Value */}
      <td className="py-3 px-3 font-semibold text-xs tabular-nums text-hp-navy dark:text-primary">
        {formatCurrency(card.prizeAmount)}
      </td>

      {/* Status */}
      <td className="py-3 px-3">
        <StatusBadge status={card.status} />
      </td>

      {/* Date */}
      <td className="py-3 px-3 text-xs text-muted-foreground tabular-nums">
        {card.dateSigned || "—"}
      </td>

      {/* Action */}
      <td className="py-3 px-3 text-right">
        {card.status === "Signed" ? (
          <button
            type="button"
            onClick={() => onSignClick?.(card)}
            className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors hover:underline cursor-pointer"
            title="Signed · Click to re-open"
          >
            <CheckCircle2 className="size-4" />
            <span className="hidden sm:inline">Signed</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onSignClick?.(card)}
            className="inline-flex items-center gap-1 rounded-md bg-hp-red text-white px-2.5 py-1 text-xs font-medium hover:bg-red-700 transition-colors cursor-pointer"
          >
            <PenLine className="size-3.5" />
            <span>Sign</span>
          </button>
        )}
      </td>
    </tr>
  );
}

export default CashCardRow;

