import React from "react";
import { getCashCards } from "@/lib/data";
import { CashCardsView } from "@/components/cash-cards-view";

export const dynamic = "force-dynamic";

export default async function CashCardsPage() {
  const cards = await getCashCards();

  return <CashCardsView initialCards={cards} />;
}
