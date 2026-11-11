import React from "react";
import { getHeats, getEvents } from "@/lib/data";
import { HeatsView } from "@/components/heats-view";

export const dynamic = "force-dynamic";

export default async function HeatsPage() {
  const [heats, events] = await Promise.all([getHeats(), getEvents()]);

  return <HeatsView heats={heats} events={events} />;
}
