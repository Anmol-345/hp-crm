import React from "react";
import { getResults, getEvents } from "@/lib/data";

export const dynamic = "force-dynamic";
import { PageHeader } from "@/components/page-header";
import { ResultsView } from "@/components/results-view";

export default async function ResultsPage() {
  const [results, events] = await Promise.all([getResults(), getEvents()]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Official Podium & Results"
        description="Verified podium finishers, timings, distances, and point allocations from track registers"
      />

      <ResultsView initialResults={results} events={events} />
    </div>
  );
}

