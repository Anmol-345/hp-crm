import React from "react";
import { getAthletes } from "@/lib/data/athletes";

export const dynamic = "force-dynamic";
import { PageHeader } from "@/components/page-header";
import { AthletesTableView } from "@/components/athletes-table-view";

export default async function AthletesPage() {
  const athletes = await getAthletes();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Athletes Directory"
        description="Search participating athletes by BIB number, unit delegation, or competition category"
      />

      <AthletesTableView initialAthletes={athletes} />
    </div>
  );
}

