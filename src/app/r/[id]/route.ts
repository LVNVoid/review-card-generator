import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const normalizedId = id.toUpperCase().trim();

  try {
    const card = await prisma.card.findUnique({
      where: { id: normalizedId },
    });

    // If card doesn't exist yet, redirect to activation with pre-populated ID
    if (!card) {
      const url = new URL(`/r/${normalizedId}/activate`, request.url);
      url.searchParams.set("isNew", "true");
      return NextResponse.redirect(url, { status: 307 });
    }

    // If card is pending activation, redirect to activation page
    if (card.status === "PENDING" || !card.googleReviewUrl) {
      return NextResponse.redirect(new URL(`/r/${normalizedId}/activate`, request.url), {
        status: 307,
      });
    }

    // Card is ACTIVE -> Log scan telemetry and redirect to Google Maps / Review
    try {
      await prisma.card.update({
        where: { id: normalizedId },
        data: {
          scanCount: { increment: 1 },
          lastScannedAt: new Date(),
        },
      });
    } catch (telemetryErr) {
      console.warn("Telemetry log failed:", telemetryErr);
    }

    return NextResponse.redirect(card.googleReviewUrl, { status: 307 });
  } catch (error) {
    console.error("Dynamic redirect error:", error);
    // Fallback directly to activation page so customer can activate, never bounce to homepage
    const url = new URL(`/r/${normalizedId}/activate`, request.url);
    url.searchParams.set("isNew", "true");
    return NextResponse.redirect(url, { status: 307 });
  }
}
