import React from "react";
import { getSportsRecords } from "@/lib/data/records";
import { getEvents } from "@/lib/data/events";
import { getResults } from "@/lib/data/results";
import { RecordsView } from "@/components/records-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sports Records & NMR Management | HP Sports Meet CRM",
  description: "Official All-Time Meet Records (MR), New Meet Record (NMR) ratifications, and historical benchmarks for HPCL 19th All India Annual Sports Meet 2024-25",
};

export default async function RecordsPage() {
  const [records, events, results] = await Promise.all([
    getSportsRecords(),
    getEvents(),
    getResults(),
  ]);

  return (
    <RecordsView
      initialRecords={records}
      events={events}
      results={results}
    />
  );
}
