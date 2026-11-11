import React from "react";
import { getVerificationQueue } from "@/lib/data/heats";
import { DataQualityView } from "@/components/data-quality-view";

export const dynamic = "force-dynamic";

export default async function DataQualityPage() {
  const initialEntries = await getVerificationQueue();

  return <DataQualityView initialEntries={initialEntries} />;
}

