"use client";

import * as React from "react";
import { CardConfig } from "@/types/card";
import { SizeSelector } from "@/components/editor/size-selector";
import { ThemeSelector } from "@/components/editor/theme-selector";
import { CardForm } from "@/components/editor/card-form";
import { LogoUploader } from "@/components/editor/logo-uploader";
import { CardCanvas } from "@/components/preview/card-canvas";
import { ExportToolbar } from "@/components/preview/export-toolbar";
import { VercelTriangle } from "@/components/ui/vercel-icon";
import { Sliders, Eye, Printer, Sparkles, Download } from "lucide-react";

export default function WorkbenchPage() {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [activeMobileTab, setActiveMobileTab] = React.useState<"editor" | "preview">("editor");

  const [config, setConfig] = React.useState<CardConfig>({
    businessName: "Nusantara Artisan Bistro",
    tagline: "Beri Ulasan Pengalaman Anda di Google",
    callToAction: "Pindai kode QR untuk memberikan rating & ulasan bintang 5",
    googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4",
    placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
    sizeId: "pvc-cr80-h",
    themeId: "google-official",
    logoDataUrl: undefined,
    showRatingStars: true,
    showNfcIcon: true,
    includeBleedMarks: false,
  });

  const handleConfigChange = (updated: Partial<CardConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-primary pb-32 md:pb-8">
      {/* Top Navbar: Vercel Geist Aesthetic */}
      <header className="h-16 border-b border-border bg-canvas/90 backdrop-blur sticky top-0 z-30 flex items-center px-4 sm:px-6 lg:px-8 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-primary">
            <VercelTriangle size={15} />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xs sm:text-sm font-semibold tracking-tight text-primary">
              Review Card Generator
            </h1>
            <span className="hidden sm:inline-flex text-[10px] font-mono text-secondary bg-surface px-2 py-0.5 rounded border border-border">
              300 DPI • PRINT
            </span>
          </div>
        </div>

        {/* Mobile Tab Segmented Switcher */}
        <div className="flex md:hidden items-center p-1 rounded-xl bg-surface border border-border">
          <button
            type="button"
            onClick={() => setActiveMobileTab("editor")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all min-h-[44px] ${
              activeMobileTab === "editor"
                ? "bg-accent text-canvas shadow-sm font-semibold"
                : "text-secondary hover:text-primary"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMobileTab("preview")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all min-h-[44px] ${
              activeMobileTab === "preview"
                ? "bg-accent text-canvas shadow-sm font-semibold"
                : "text-secondary hover:text-primary"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-3 text-xs font-mono text-secondary">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-google-green animate-pulse" />
            <span>GEIST DESIGN SYSTEM</span>
          </span>
        </div>
      </header>

      {/* Main Dual-Column Workbench */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Editor Controls */}
        <div
          className={`md:col-span-6 lg:col-span-6 space-y-4 ${
            activeMobileTab === "preview" ? "hidden md:block" : "block"
          }`}
        >
          {/* Step 1: Size Preset */}
          <div className="bg-surface rounded-2xl border border-border p-4 sm:p-5 space-y-3 hover:border-border-hover transition-colors">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-semibold tracking-wider text-secondary uppercase flex items-center gap-2">
                <span>// 01. FORMAT & MEDIA FISIK</span>
              </h2>
              <span className="text-[10px] font-mono text-secondary px-2 py-0.5 rounded bg-surface-muted border border-border">
                {config.sizeId}
              </span>
            </div>
            <SizeSelector
              selectedSize={config.sizeId}
              onSelectSize={(sizeId) => handleConfigChange({ sizeId })}
            />
          </div>

          {/* Step 2: Theme / Style */}
          <div className="bg-surface rounded-2xl border border-border p-4 sm:p-5 space-y-3 hover:border-border-hover transition-colors">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-semibold tracking-wider text-secondary uppercase flex items-center gap-2">
                <span>// 02. TEMA VISUAL KARTU</span>
              </h2>
              <span className="text-[10px] font-mono text-secondary px-2 py-0.5 rounded bg-surface-muted border border-border">
                {config.themeId}
              </span>
            </div>
            <ThemeSelector
              selectedTheme={config.themeId}
              onSelectTheme={(themeId) => handleConfigChange({ themeId })}
            />
          </div>

          {/* Step 3: Information & Links */}
          <div className="bg-surface rounded-2xl border border-border p-4 sm:p-5 space-y-3 hover:border-border-hover transition-colors">
            <h2 className="text-xs font-mono font-semibold tracking-wider text-secondary uppercase flex items-center gap-2">
              <span>// 03. DETAIL TEMPAT & REVIEW URL</span>
            </h2>
            <CardForm
              config={config}
              onChange={handleConfigChange}
            />
          </div>

          {/* Step 4: Logo Customization */}
          <div className="bg-surface rounded-2xl border border-border p-4 sm:p-5 space-y-3 hover:border-border-hover transition-colors">
            <h2 className="text-xs font-mono font-semibold tracking-wider text-secondary uppercase flex items-center gap-2">
              <span>// 04. LOGO TENGAH QR (OPSIONAL)</span>
            </h2>
            <LogoUploader
              logoDataUrl={config.logoDataUrl}
              onLogoChange={(logoDataUrl) => handleConfigChange({ logoDataUrl })}
            />
          </div>
        </div>

        {/* Right Column: Live Sticky Preview & Export Panel */}
        <div
          className={`md:col-span-6 lg:col-span-6 md:sticky md:top-20 h-fit space-y-4 ${
            activeMobileTab === "editor" ? "hidden md:block" : "block"
          }`}
        >
          <div className="bg-surface rounded-2xl border border-border p-4 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-mono font-semibold tracking-wider text-primary uppercase">
                  LIVE PRINT PREVIEW (WYSIWYG)
                </h2>
              </div>
              <span className="text-[10px] font-mono text-secondary bg-surface-muted px-2 py-0.5 rounded border border-border">
                300 DPI
              </span>
            </div>

            {/* The Live Canvas */}
            <div className="min-h-[320px] sm:min-h-[380px] flex items-center justify-center bg-canvas rounded-xl border border-border overflow-hidden">
              <CardCanvas config={config} cardRef={cardRef} />
            </div>

            {/* Export Toolbar */}
            <ExportToolbar config={config} cardRef={cardRef} />
          </div>
        </div>
      </main>

      {/* Mobile Sticky Floating Quick Dock */}
      {activeMobileTab === "editor" && (
        <div className="md:hidden fixed bottom-4 inset-x-4 z-40 pb-[env(safe-area-inset-bottom)]">
          <div className="mx-auto max-w-sm bg-surface/95 backdrop-blur-xl rounded-2xl border border-border p-2.5 flex items-center justify-between gap-3 shadow-2xl">
            <div className="flex items-center gap-2 pl-1">
              <span className="w-2 h-2 rounded-full bg-google-green animate-pulse" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-primary">Desain Aktif</span>
                <span className="text-[10px] font-mono text-secondary">{config.sizeId}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveMobileTab("preview")}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent text-canvas text-xs font-semibold shadow-md active:scale-95 transition-all min-h-[44px]"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Lihat & Unduh</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
