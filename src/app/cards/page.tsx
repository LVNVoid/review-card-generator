import { listCardsAction } from "@/actions/card-actions";
import { CardsClient } from "./cards-client";

export const dynamic = "force-dynamic";

export default async function CardsPage() {
  const result = await listCardsAction();
  return (
    <CardsClient
      initialCards={result.cards}
      initialMetrics={result.metrics}
    />
  );
}
