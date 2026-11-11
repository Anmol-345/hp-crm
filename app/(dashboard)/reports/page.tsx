import React from "react";
import { getUnits, getEvents, getCashCards } from "@/lib/data";

export const dynamic = "force-dynamic";
import { PageHeader } from "@/components/page-header";
import { ReportsView } from "@/components/reports-view";

export default async function ReportsPage() {
  const [units, events, cashCards] = await Promise.all([
    getUnits(),
    getEvents(),
    getCashCards(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meet Reports & Disbursement Summary"
        description="Comprehensive audit of medal points, delegation standings, and Format 3 prize money records"
      />

      <ReportsView units={units} events={events} cashCards={cashCards} />
    </div>
  );
}

