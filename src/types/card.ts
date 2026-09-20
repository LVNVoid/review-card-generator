import { z } from "zod";

export const CardSizeIdSchema = z.enum([
  "pvc-cr80-h",
  "pvc-cr80-v",
  "standee-a6",
  "standee-a7",
  "sticker-square",
]);

export type CardSizeId = z.infer<typeof CardSizeIdSchema>;

export interface CardSizeConfig {
  id: CardSizeId;
  name: string;
  widthMm: number;
  heightMm: number;
  description: string;
  badge: string;
}

export const CARD_SIZES: Record<CardSizeId, CardSizeConfig> = {
  "pvc-cr80-h": {
    id: "pvc-cr80-h",
    name: "Kartu PVC Horizontal",
    widthMm: 85.6,
    heightMm: 54.0,
    description: "Kartu seukuran ATM atau KTP (horizontal)",
    badge: "85.6 × 54 mm",
  },
  "pvc-cr80-v": {
    id: "pvc-cr80-v",
    name: "Kartu PVC Vertikal",
    widthMm: 54.0,
    heightMm: 85.6,
    description: "Kartu ID vertikal seukuran ATM",
    badge: "54 × 85.6 mm",
  },
  "standee-a6": {
    id: "standee-a6",
    name: "Standee Meja A6",
    widthMm: 105.0,
    heightMm: 148.0,
    description: "Stand meja akrilik ukuran A6",
    badge: "105 × 148 mm",
  },
  "standee-a7": {
    id: "standee-a7",
    name: "Standee Meja A7",
    widthMm: 74.0,
    heightMm: 105.0,
    description: "Stand meja kecil ukuran A7",
    badge: "74 × 105 mm",
  },
  "sticker-square": {
    id: "sticker-square",
    name: "Stiker Kasir Persegi",
    widthMm: 70.0,
    heightMm: 70.0,
    description: "Stiker kotak untuk kasir atau pintu",
    badge: "70 × 70 mm",
  },
};

export const CardThemeIdSchema = z.enum([
  "google-official",
  "dark-acrylic",
  "minimalist",
]);

export type CardThemeId = z.infer<typeof CardThemeIdSchema>;

export interface CardThemeConfig {
  id: CardThemeId;
  name: string;
  description: string;
  tag: string;
}

export const CARD_THEMES: Record<CardThemeId, CardThemeConfig> = {
  "google-official": {
    id: "google-official",
    name: "Google Official",
    description: "Kartu putih standar Google",
    tag: "Putih",
  },
  "dark-acrylic": {
    id: "dark-acrylic",
    name: "Dark Acrylic",
    description: "Latar hitam untuk resto, kafe, atau bar",
    tag: "Hitam",
  },
  "minimalist": {
    id: "minimalist",
    name: "Minimalist Studio",
    description: "Desain monokrom hitam putih sederhana",
    tag: "Monokrom",
  },
};

export const CardConfigSchema = z.object({
  businessName: z.string().max(60).default(""),
  tagline: z.string().max(80).default("Beri Ulasan di Google"),
  callToAction: z.string().max(100).default("Scan QR atau tap kartu untuk beri review"),
  googleReviewUrl: z.string().url("Format link ulasan tidak valid"),
  placeId: z.string().optional(),
  sizeId: CardSizeIdSchema.default("pvc-cr80-h"),
  themeId: CardThemeIdSchema.default("google-official"),
  logoDataUrl: z.string().optional(), // base64 or URL
  showRatingStars: z.boolean().default(true),
  showNfcIcon: z.boolean().default(true),
  includeBleedMarks: z.boolean().default(false),
  isDynamicMode: z.boolean().optional().default(false),
  cardId: z.string().optional(),
  badgeText: z.string().max(40).default("SCAN ATAU TAP DI SINI"),
  showSerialId: z.boolean().default(false),
});

export type CardConfig = z.infer<typeof CardConfigSchema>;
