import React from "react";
import { getUnits, getAthletes } from "@/lib/data";

export const dynamic = "force-dynamic";
import { PageHeader } from "@/components/page-header";
import { UnitsView } from "@/components/units-view";

export default async function UnitsPage() {
  const [units, athletes] = await Promise.all([getUnits(), getAthletes()]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Units & Zones Standings"
        description="Medal tally and athlete delegations across HPCL Refineries and Regional Zones"
      />

      <UnitsView units={units} athletes={athletes} />
    </div>
  );
}

