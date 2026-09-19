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
    description: "Ukuran standar kartu ATM / KTP (CR80 Horizontal)",
    badge: "85.6 × 54 mm",
  },
  "pvc-cr80-v": {
    id: "pvc-cr80-v",
    name: "Kartu PVC Vertikal",
    widthMm: 54.0,
    heightMm: 85.6,
    description: "Ukuran ID Card / Kartu Gantung (CR80 Vertikal)",
    badge: "54 × 85.6 mm",
  },
  "standee-a6": {
    id: "standee-a6",
    name: "Standee Meja A6",
    widthMm: 105.0,
    heightMm: 148.0,
    description: "Ukuran paling populer untuk akrilik meja kafe/resto",
    badge: "105 × 148 mm",
  },
  "standee-a7": {
    id: "standee-a7",
    name: "Standee Meja A7",
    widthMm: 74.0,
    heightMm: 105.0,
    description: "Ukuran kompak hemat ruang untuk kasir & meja kecil",
    badge: "74 × 105 mm",
  },
  "sticker-square": {
    id: "sticker-square",
    name: "Stiker Kasir Persegi",
    widthMm: 70.0,
    heightMm: 70.0,
    description: "Stiker persegi untuk mesin kasir, etalase, atau pintu",
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
    description: "Tampilan resmi Google putih bersih, logo G, dan bintang emas",
    tag: "Clean & Official",
  },
  "dark-acrylic": {
    id: "dark-acrylic",
    name: "Dark Acrylic",
    description: "Nuansa gelap eksklusif untuk resto, kafe malam, dan lounge",
    tag: "Luxury Dark",
  },
  "minimalist": {
    id: "minimalist",
    name: "Minimalist Studio",
    description: "Tipografi elegan modern dengan garis batas presisi",
    tag: "Monochrome Modern",
  },
};

export const CardConfigSchema = z.object({
  businessName: z.string().max(60).default(""),
  tagline: z.string().max(80).default("Review Usaha Kami di Google"),
  callToAction: z.string().max(100).default("Pindai kode QR untuk memberikan rating & ulasan bintang 5"),
  googleReviewUrl: z.string().url("Format URL review tidak valid"),
  placeId: z.string().optional(),
  sizeId: CardSizeIdSchema.default("pvc-cr80-h"),
  themeId: CardThemeIdSchema.default("google-official"),
  logoDataUrl: z.string().optional(), // base64 or URL
  showRatingStars: z.boolean().default(true),
  showNfcIcon: z.boolean().default(true),
  includeBleedMarks: z.boolean().default(false),
  isDynamicMode: z.boolean().optional().default(false),
  cardId: z.string().optional(),
});

export type CardConfig = z.infer<typeof CardConfigSchema>;
