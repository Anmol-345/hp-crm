import React from "react";
import { getEvents } from "@/lib/data/events";

export const dynamic = "force-dynamic";
import { PageHeader } from "@/components/page-header";
import { EventsTableView } from "@/components/events-table-view";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Official Events Register"
        description="Filter and manage all 16 track & field events, official heats, and cash card schedules"
      />

      <EventsTableView initialEvents={events} />
    </div>
  );
}

