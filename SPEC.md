# SPEC.md — Google Review QR Card Generator

## 1. Project Overview
Web application modern berbasis Next.js App Router untuk merancang, mengustomisasi, dan mengekspor kartu review Google Maps (Google Review Cards) siap cetak dalam berbagai format fisik (kartu PVC, standee akrilik meja, dan stiker kasir) dengan resolusi tinggi (300 DPI PDF & PNG).

## 2. Core User Requirements
1. **Input Metode A**:
   - Pengguna memasukkan URL review Google Maps langsung (misal: `https://g.page/r/.../review` atau `https://search.google.com/local/writereview?placeid=...`).
   - Tersedia generator Place ID mandiri (tanpa API key berbayar) yang memandu pengguna mendapatkan Place ID / direct review link dari Google Maps secara instan.
2. **Preset Ukuran Fisik Standard Percetakan**:
   - **Kartu PVC / Dompet**: Standar ISO/IEC 7810 ID-1 / CR80 (85.6 mm × 54.0 mm, aspect ratio ~1.585:1, horizontal/vertikal).
   - **Standee Akrilik Meja A6**: 105 mm × 148 mm (vertikal).
   - **Standee Akrilik Meja A7**: 74 mm × 105 mm (vertikal).
   - **Stiker Kasir / Meja Persegi**: 70 mm × 70 mm (1:1).
3. **Kustomisasi Desain Realtime**:
   - **Nama Tempat / Usaha**: Input teks bebas, auto-fit font size agar tidak overflow.
   - **Call-to-Action (CTA)**: Pilihan preset (misal: "Review Usaha Kami di Google", "Bantu Kami Naik Kelas", "Puas dengan Layanan Kami? Beri Bintang 5") atau custom text.
   - **Visual Bintang Review**: 5 bintang rating (Google Star Gold `#FBBC04`).
   - **Logo Kustom di Tengah QR**: Unggah gambar logo lokal (PNG/SVG/JPG) yang ditempatkan di tengah QR code dengan background padding bersih.
   - **Pilihan Tema / Style**:
     - *Google Official*: Kartu putih bersih, logo Google resmi, 5 bintang kuning, tombol Google Blue `#1A73E8`.
     - *Dark Acrylic*: Permukaan gelap elegan `#121214`, teks putih, aksen emas/neon subtle, cocok untuk kafe/resto malam.
     - *Minimalist Monochrome*: Tipografi modern serif/sans minimalis, bingkai garis tipis presisi.
4. **Ekspor Siap Cetak (Print-Ready)**:
   - **PDF Vector / 300 DPI**: Ukuran skala 1:1 milimeter dengan margin/bleed mark 2mm untuk percetakan offset/digital print.
   - **PNG Resolusi Tinggi**: 300 DPI rendering tajam tanpa pixelation saat dicetak.
5. **Zero Hardcoded Colors Engine**:
   - Seluruh warna komponen UI workbench dan card template didefinisikan sebagai token CSS variables di `globals.css` / `@theme`.

## 3. Tech Stack
- **Framework**: Next.js 15+ (App Router), TypeScript.
- **Styling**: Tailwind CSS v4, CSS Variables token system.
- **Form & Validation**: React Hook Form + Zod.
- **QR Code Engine**: `qrcode` / SVG QR generator dengan support embedded center logo & error correction level H (30% redundancy).
- **Export Engine**: `jspdf` & `html-to-image` / native canvas 300 DPI rendering.
- **Icons**: Lucide React.
