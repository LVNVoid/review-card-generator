# tasks/todo.md — Execution Checklist

## Phase 1: Project Scaffolding & Design System
- [ ] Initialize Next.js project with TypeScript and Tailwind CSS v4 in `/home/ubuntu/projects/review-card-generator`
- [ ] Install core dependencies: `qrcode`, `@types/qrcode`, `jspdf`, `html-to-image`, `lucide-react`, `zod`, `clsx`, `tailwind-merge`
- [ ] Configure `src/app/globals.css` with zero hardcoded colors: CSS variables `:root` + `@theme` mapping from `DESIGN.md`

## Phase 2: Schema & Core Utilities (TDD / Pure Functions)
- [ ] Define Zod schemas and TypeScript types in `src/types/card.ts` (CardSize, CardTheme, CardConfig)
- [ ] Implement `src/lib/google-review-url.ts` (format URL generator & Place ID resolver) + unit tests
- [ ] Implement `src/lib/qr-generator.ts` (QR code SVG builder with Level H ECC and center logo placeholder)
- [ ] Implement `src/lib/export-service.ts` (300 DPI PNG & millimeter 1:1 PDF generator)

## Phase 3: UI Primitives & Components
- [ ] Build reusable UI primitives in `src/components/ui/` (`button.tsx`, `input.tsx`, `select.tsx`, `tabs.tsx`, `badge.tsx`)
- [ ] Build editor controls in `src/components/editor/`:
  - [ ] `card-form.tsx`: Place URL/ID input, business name, custom CTA
  - [ ] `size-selector.tsx`: CR80 PVC, Standee A6, Standee A7, Square Sticker
  - [ ] `theme-selector.tsx`: Google Official, Dark Acrylic, Minimalist Monochrome
  - [ ] `logo-uploader.tsx`: Upload & preview logo inside QR code
- [ ] Build card template previews in `src/components/preview/templates/`:
  - [ ] `google-official-card.tsx` (Official Google Brand colors & 5 stars)
  - [ ] `dark-acrylic-card.tsx` (Dark luxury theme)
  - [ ] `minimalist-card.tsx` (Clean modern typography)
- [ ] Build `src/components/preview/card-canvas.tsx` (WYSIWYG container with millimeter aspect ratio and bleed guidelines)
- [ ] Build `src/components/preview/export-toolbar.tsx` (Download PDF & Download PNG buttons)

## Phase 4: Integration & Verification
- [ ] Assemble Workbench in `src/app/page.tsx`
- [ ] Run zero hardcoded colors audit (`grep -rEn "#[0-9a-fA-F]{3,8}" src/`)
- [ ] Verify build (`npm run typecheck && npm run build`)
- [ ] Test end-to-end flow with Playwright (Desktop & Mobile viewports, PDF & PNG download trigger)

## Phase 5: Documentation & Vault Sync
- [ ] Register project path in `/home/ubuntu/obsidian-vault/01 - Projects/Active Projects.md`
- [ ] Write session log in `/home/ubuntu/obsidian-vault/01 - Projects/Review-Card-Generator/Logs/`
- [ ] Commit & push project repo & Obsidian vault
