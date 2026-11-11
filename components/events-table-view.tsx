"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Event } from "@/lib/data/types";
import { EventFilterBar, EventFilterState } from "./event-filter-bar";
import { StatusBadge } from "./status-badge";
import { ArrowRight, Trophy, CreditCard } from "lucide-react";
import { useDay } from "./day-switcher";

interface EventsTableViewProps {
  initialEvents: Event[];
}

export function EventsTableView({ initialEvents }: EventsTableViewProps) {
  const { selectedDay } = useDay();

  const [filters, setFilters] = useState<EventFilterState>({
    search: "",
    day: selectedDay !== "All" ? selectedDay : "All",
    gender: "All",
    type: "All",
    status: "All",
  });

  // Keep synced with global day switcher if user changes it
  React.useEffect(() => {
    if (selectedDay !== "All") {
      setFilters((prev) => ({ ...prev, day: selectedDay }));
    }
  }, [selectedDay]);

  const filteredEvents = initialEvents.filter((event) => {
    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        event.name.toLowerCase().includes(q) ||
        event.category.toLowerCase().includes(q) ||
        String(event.eventNo).includes(q);
      if (!match) return false;
    }

    // Day
    if (filters.day !== "All" && event.day !== filters.day) {
      return false;
    }

    // Gender
    if (filters.gender !== "All" && event.gender !== filters.gender) {
      return false;
    }

    // Type
    if (filters.type !== "All" && event.type !== filters.type) {
      return false;
    }

    // Status
    if (filters.status !== "All" && event.status !== filters.status) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <EventFilterBar filters={filters} onChange={setFilters} />

      {/* Events Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="py-3 px-3.5 w-16 text-center">Event #</th>
              <th className="py-3 px-3.5">Event Name</th>
              <th className="py-3 px-3.5">Age & Category</th>
              <th className="py-3 px-3.5">Schedule</th>
              <th className="py-3 px-3.5 text-center">Participants</th>
              <th className="py-3 px-3.5">Prize Rule</th>
              <th className="py-3 px-3.5">Status</th>
              <th className="py-3 px-3.5 text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredEvents.map((event) => (
              <tr
                key={event.eventNo}
                className="hover:bg-muted/30 transition-colors group"
              >
                <td className="py-3 px-3.5 text-center font-mono font-bold text-hp-navy dark:text-primary tabular-nums">
                  #{String(event.eventNo).padStart(2, "0")}
                </td>
                <td className="py-3 px-3.5">
                  <Link
                    href={`/events/${event.eventNo}`}
                    className="font-bold text-hp-ink dark:text-white hover:text-hp-red transition-colors text-xs"
                  >
                    {event.name}
                  </Link>
                  <span className="block text-[11px] text-muted-foreground capitalize">
                    {event.type} event ({event.unit})
                  </span>
                </td>
                <td className="py-3 px-3.5">
                  <span className="font-medium text-hp-ink dark:text-slate-200">
                    {event.category}
                  </span>
                </td>
                <td className="py-3 px-3.5 whitespace-nowrap">
                  <span className="font-semibold block">{event.day}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {event.time || "Scheduled on register"}
                  </span>
                </td>
                <td className="py-3 px-3.5 text-center font-bold font-mono tabular-nums">
                  {event.participantCount ?? "—"}
                </td>
                <td className="py-3 px-3.5">
                  {event.isCashCardEvent ? (
                    <span className="inline-flex items-center gap-1 rounded bg-hp-red/10 text-hp-red px-2 py-0.5 text-[10px] font-bold uppercase">
                      <CreditCard className="size-3" />
                      Format 3 (₹12k)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded bg-muted text-muted-foreground px-2 py-0.5 text-[10px] font-medium">
                      Medal Only
                    </span>
                  )}
                </td>
                <td className="py-3 px-3.5">
                  <StatusBadge status={event.status} />
                </td>
                <td className="py-3 px-3.5 text-right">
                  <Link
                    href={`/events/${event.eventNo}`}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold text-hp-navy dark:text-primary hover:bg-hp-navy hover:text-white transition-colors"
                  >
                    <span>Detail</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEvents.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No events match the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}

export default EventsTableView;

