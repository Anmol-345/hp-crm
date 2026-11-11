import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import {
  getEventByNo,
  getHeatsByEvent,
  getResultsByEvent,
  getCashCardsByEvent,
} from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { EventDetailTabs } from "@/components/event-detail-tabs";
import { ArrowLeft, Calendar, Users, Award, CreditCard } from "lucide-react";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventNo: string }>;
}) {
  const { eventNo: rawEventNo } = await params;
  const eventNo = parseInt(rawEventNo, 10);

  if (isNaN(eventNo)) {
    notFound();
  }

  const [event, heats, results, cashCards] = await Promise.all([
    getEventByNo(eventNo),
    getHeatsByEvent(eventNo),
    getResultsByEvent(eventNo),
    getCashCardsByEvent(eventNo),
  ]);

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <div>
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-hp-navy dark:hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to All Events</span>
        </Link>
      </div>

      {/* Event Header Banner */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded bg-hp-navy text-white px-2.5 py-0.5 text-xs font-mono font-bold">
                Event #{event.eventNo}
              </span>
              <span className="rounded bg-muted px-2 py-0.5 text-xs font-semibold uppercase text-muted-foreground">
                {event.type} ({event.unit})
              </span>
              <StatusBadge status={event.status} />
              {event.isCashCardEvent && (
                <span className="rounded bg-hp-red/10 text-hp-red px-2 py-0.5 text-xs font-bold uppercase">
                  Format 3 Prize
                </span>
              )}
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-hp-ink dark:text-white">
              {event.name}
            </h1>
            <p className="text-sm font-medium text-muted-foreground">
              Category: <span className="text-foreground">{event.category}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-lg border border-border p-2.5 bg-muted/20">
              <span className="text-[10px] text-muted-foreground block uppercase font-bold">
                Day & Time
              </span>
              <span className="font-semibold text-hp-ink dark:text-white mt-0.5 block">
                {event.day}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {event.time || "Time TBD"}
              </span>
            </div>

            <div className="rounded-lg border border-border p-2.5 bg-muted/20">
              <span className="text-[10px] text-muted-foreground block uppercase font-bold">
                Participants
              </span>
              <span className="font-bold text-base text-hp-navy dark:text-primary mt-0.5 block tabular-nums">
                {event.participantCount ?? "—"}
              </span>
              <span className="text-[11px] text-muted-foreground">Athletes</span>
            </div>

            <div className="rounded-lg border border-border p-2.5 bg-muted/20 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-muted-foreground block uppercase font-bold">
                Prize Pool
              </span>
              <span className="font-bold text-base text-hp-red mt-0.5 block tabular-nums">
                {event.isCashCardEvent ? "₹12,000" : "Medals"}
              </span>
              <span className="text-[11px] text-muted-foreground">Top 3 Podium</span>
            </div>
          </div>
        </div>

        {event.notes && (
          <div className="rounded-lg bg-hp-mist dark:bg-muted/40 p-3 text-xs text-muted-foreground border border-border">
            <span className="font-semibold text-hp-ink dark:text-white mr-1">
              Register Note:
            </span>
            {event.notes}
          </div>
        )}
      </div>

      {/* Tabs for Heats, Results, Cash Cards */}
      <EventDetailTabs
        event={event}
        heats={heats}
        results={results}
        cashCards={cashCards}
      />
    </div>
  );
}

