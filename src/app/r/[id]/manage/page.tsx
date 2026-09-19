import { prisma } from "@/lib/prisma";
import { ManageClient } from "./manage-client";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kelola Kartu Ulasan Google | Review Card Generator",
  description: "Update link Google Review dan pantau analitik scan kartu ulasan.",
};

export default async function ManagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const normalizedId = id.toUpperCase().trim();

  const card = await prisma.card.findUnique({
    where: { id: normalizedId },
  });

  if (!card) {
    notFound();
  }

  return (
    <ManageClient
      cardId={normalizedId}
      businessName={card.businessName}
      googleReviewUrl={card.googleReviewUrl}
      scanCount={card.scanCount}
      activatedAt={card.activatedAt ? card.activatedAt.toISOString() : null}
    />
  );
}
