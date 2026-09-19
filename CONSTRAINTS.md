# CONSTRAINTS.md — Quality & Engineering Bar

## 1. Zero Hardcoded Colors
- **Mutlak**: Dilarang keras menulis kode warna hex/rgb/hsl langsung di dalam komponen JSX/TSX.
- Semua warna workbench dan template card wajib terdaftar sebagai CSS variables di `src/app/globals.css` dan dipetakan via Tailwind v4 `@theme`.
- Verifikasi otomatis: `grep -rEn "#[0-9a-fA-F]{3,8}" src/` hanya boleh menghasilkan match di file stylesheet `globals.css`.

## 2. Next.js Simple Scalable Architecture
- Aturan arsitektur Next.js wajib dipatuhi:
  - Zero logic di komponen UI (pisahkan form logic, helper generator, state).
  - Zero `any` di seluruh codebase TypeScript (`npm run typecheck` 100% clean).
  - Primitives UI terpusat di `components/ui/` (Button, Input, Select, Dialog/Modal).
  - Import alias `@/` di seluruh file (tidak menggunakan relative import `../../`).
  - Validasi schema Zod sebagai single source of truth untuk konfigurasi kartu dan form input.

## 3. Print Accuracy & QR Code Reliability
- Error Correction Level QR Code wajib disetel ke level **H (High - 30%)** saat logo di tengah disisipkan, agar QR code tetap terbaca 100% oleh semua kamera HP (iPhone/Android).
- Dimensi cetak PDF wajib akurat dalam satuan milimeter (mm) sesuai standar fisik (85.6x54mm untuk CR80, dsb.) dengan opsi potong (*bleed line*).
- Resolusi raster PNG ekspor minimal 300 DPI (misal CR80: ~1011 × 638 piksel).

## 4. Mobile & Desktop Ergonomics
- Layout generator responsif:
  - Desktop: Split screen (form controller di kiri, live print preview 1:1 di kanan).
  - Mobile: Tab switch atau scrollable editor dengan floating quick preview toggle.
- Touch target di mobile minimal 44x44px.
