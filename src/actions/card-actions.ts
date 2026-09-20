"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPin, verifyPin, generateCardId } from "@/lib/security";

const ActivateSchema = z.object({
  id: z.string().min(2).max(20),
  businessName: z.string().trim().min(2, "Nama usaha minimal 2 karakter").max(100),
  googleReviewUrl: z
    .string()
    .trim()
    .url("Format URL tidak valid")
    .refine(
      (url) => url.startsWith("https://") || url.startsWith("http://"),
      "URL harus diawali dengan https://"
    ),
  pin: z
    .string()
    .trim()
    .regex(/^\d{4,8}$/, "PIN harus berupa 4-8 angka"),
});

export type ActivateResult =
  | { success: true; cardId: string; businessName: string; reviewUrl: string }
  | { success: false; error: string };

export async function activateCardAction(
  formData: z.infer<typeof ActivateSchema>
): Promise<ActivateResult> {
  const parseResult = ActivateSchema.safeParse(formData);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.errors[0]?.message || "Input tidak valid",
    };
  }

  const { id, businessName, googleReviewUrl, pin } = parseResult.data;
  const normalizedId = id.toUpperCase().trim();

  if (!process.env.DATABASE_URL) {
    return {
      success: false,
      error: "Koneksi database belum dikonfigurasi di server (DATABASE_URL missing). Harap atur environment variable di dashboard Vercel.",
    };
  }

  try {
    const existingCard = await prisma.card.findUnique({
      where: { id: normalizedId },
    });

    if (existingCard && existingCard.status === "ACTIVE") {
      return {
        success: false,
        error: "Kartu ini sudah diaktifkan sebelumnya. Silakan gunakan menu Kelola Kartu.",
      };
    }

    const { hash, salt } = hashPin(pin);

    await prisma.card.upsert({
      where: { id: normalizedId },
      update: {
        businessName,
        googleReviewUrl,
        pinHash: hash,
        salt,
        status: "ACTIVE",
        activatedAt: new Date(),
      },
      create: {
        id: normalizedId,
        businessName,
        googleReviewUrl,
        pinHash: hash,
        salt,
        status: "ACTIVE",
        activatedAt: new Date(),
      },
    });

    return {
      success: true,
      cardId: normalizedId,
      businessName,
      reviewUrl: googleReviewUrl,
    };
  } catch (error) {
    console.error("Failed to activate card:", error);
    return {
      success: false,
      error: "Gagal mengaktifkan kartu. Silakan periksa koneksi atau coba lagi.",
    };
  }
}

export async function getCardStatusAction(id: string) {
  const normalizedId = id.toUpperCase().trim();
  try {
    const card = await prisma.card.findUnique({
      where: { id: normalizedId },
      select: {
        id: true,
        status: true,
        businessName: true,
        googleReviewUrl: true,
        scanCount: true,
        activatedAt: true,
        createdAt: true,
      },
    });
    return { success: true, card };
  } catch {
    return { success: false, error: "Gagal memuat data kartu" };
  }
}

export async function createBlankCardAction(batchId?: string) {
  try {
    let id = generateCardId();
    // Check collision
    let exists = await prisma.card.findUnique({ where: { id } });
    let attempts = 0;
    while (exists && attempts < 5) {
      id = generateCardId();
      exists = await prisma.card.findUnique({ where: { id } });
      attempts++;
    }

    const card = await prisma.card.create({
      data: {
        id,
        status: "PENDING",
        batchId: batchId || `BATCH-${new Date().toISOString().slice(0, 10)}`,
      },
    });

    return { success: true, cardId: card.id };
  } catch (error) {
    console.error("Failed to create blank card:", error);
    return { success: false, error: "Gagal membuat kartu kosong" };
  }
}

export async function updateCardUrlAction(data: {
  id: string;
  pin: string;
  newReviewUrl: string;
  newBusinessName?: string;
}) {
  const normalizedId = data.id.toUpperCase().trim();
  try {
    const card = await prisma.card.findUnique({
      where: { id: normalizedId },
    });

    if (!card) {
      return { success: false, error: "Kartu tidak ditemukan" };
    }

    if (!card.pinHash || !card.salt) {
      return { success: false, error: "Kartu belum memiliki PIN pengaman" };
    }

    const isMatch = verifyPin(data.pin, card.pinHash, card.salt);
    if (!isMatch) {
      return { success: false, error: "PIN yang Anda masukkan salah" };
    }

    await prisma.card.update({
      where: { id: normalizedId },
      data: {
        googleReviewUrl: data.newReviewUrl,
        businessName: data.newBusinessName || card.businessName,
      },
    });

    return { success: true };
  } catch {
    return { success: false, error: "Gagal memperbarui kartu" };
  }
}
