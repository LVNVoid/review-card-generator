import { prisma } from "@/lib/prisma";
import { ActivateClient } from "./activate-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aktivasi Kartu Google Review | Review Card Generator",
  description: "Aktivasi dan hubungkan kartu fisik review ulasan Anda ke Google Maps.",
};

export default async function ActivatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const normalizedId = id.toUpperCase().trim();

  const card = await prisma.card.findUnique({
    where: { id: normalizedId },
  });

  return (
    <ActivateClient
      cardId={normalizedId}
      initialStatus={card?.status || "PENDING"}
      existingBusinessName={card?.businessName}
      existingReviewUrl={card?.googleReviewUrl}
    />
  );
}
