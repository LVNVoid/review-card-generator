# tasks/plan.md — Architecture & Engineering Plan

## 1. Architecture Overview
Aplikasi berjalan murni client-side rendering (CSR) untuk generator dan preview real-time, dengan Next.js App Router sebagai scaffolding dan SSR shell.

```
┌─────────────────────────────────────────────────────────────┐
│                      Workbench Page                         │
├──────────────────────────────┬──────────────────────────────┤
│      Configuration Panel     │         Live Preview         │
│  - Input Method (URL/PlaceId)│  - Scaled millimeter canvas  │
│  - Card Presets (PVC/A6/A7/..)│  - Realtime QR SVG with logo │
│  - Store Branding & CTA      │  - Cut/Bleed guidelines      │
│  - Style Preset Selector     │  - Zoom & Orientation toggle │
├──────────────────────────────┴──────────────────────────────┤
│                       Export Engine                         │
│  - PDF Vector/300 DPI Export (jsPDF)                        │
│  - High-Res 300 DPI PNG Export (html-to-image / Canvas)     │
└─────────────────────────────────────────────────────────────┘
```

## 2. Directory Structure (Simple Scalable Architecture)
```
/home/ubuntu/projects/review-card-generator/
├── SPEC.md
├── CONSTRAINTS.md
├── DESIGN.md
├── tasks/
│   ├── plan.md
│   └── todo.md
├── src/
│   ├── app/
│   │   ├── globals.css          # Token CSS variables & @theme mapping
│   │   ├── layout.tsx
│   │   └── page.tsx             # Workbench main page
│   ├── types/
│   │   └── card.ts              # Zod schemas & TypeScript types
│   ├── lib/
│   │   ├── google-review-url.ts # URL builder & Place ID parser
│   │   ├── qr-generator.ts      # QR Code SVG/Canvas engine
│   │   └── export-service.ts    # PDF & PNG 300 DPI generator
│   └── components/
│       ├── ui/                  # Reusable primitives (Button, Input, Slider, Select, Tabs)
│       ├── editor/              # Form controllers & settings
│       │   ├── card-form.tsx
│       │   ├── size-selector.tsx
│       │   ├── theme-selector.tsx
│       │   └── logo-uploader.tsx
│       └── preview/             # Live card preview & templates
│           ├── card-canvas.tsx
│           ├── templates/
│           │   ├── google-official-card.tsx
│           │   ├── dark-acrylic-card.tsx
│           │   └── minimalist-card.tsx
│           └── export-toolbar.tsx
```

## 3. Dependency Graph & Libraries
- `qrcode`: Generator matriks QR code yang handal & performant.
- `jspdf`: Render dokumen PDF milimeter skala 1:1.
- `html-to-image`: Rasterizer DOM node ke PNG 300 DPI.
- `lucide-react`: Ikonografi UI & Google review stars.
- `zod`: Validasi konfigurasi kartu.
- `clsx` + `tailwind-merge`: Utilitas styling primitif `cn`.

## 4. Risks & Mitigations
| Risiko | Mitigasi |
| :--- | :--- |
| **QR Code tidak terbaca jika logo terlalu besar** | Batasi ukuran logo maksimal 22% luas QR code dan kunci Error Correction Level ke `H` (30% recovery capacity). |
| **Hasil cetak buram / pecah** | Gunakan SVG untuk rendering vektor QR dan skala canvas minimum 4x multiplier (setara 300 DPI) saat ekspor PNG. |
| **Ukuran cetak meleset dari standar fisik** | Gunakan unit `mm` eksplisit pada PDF jsPDF (`unit: 'mm'`) sesuai dimensi ISO ID-1 CR80 (85.6 x 54 mm) dan standar ISO A-series. |
| **Hardcoded colors merembes ke template** | Enforce CSS variables token `--color-*` dari `globals.css` untuk semua background, border, dan teks kartu. |
