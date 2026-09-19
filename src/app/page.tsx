"use client";

import * as React from "react";
import { CardConfig } from "@/types/card";
import { SizeSelector } from "@/components/editor/size-selector";
import { ThemeSelector } from "@/components/editor/theme-selector";
import { CardForm } from "@/components/editor/card-form";
import { LogoUploader } from "@/components/editor/logo-uploader";
import { CardCanvas } from "@/components/preview/card-canvas";
import { ExportToolbar } from "@/components/preview/export-toolbar";
import { GoogleLogo } from "@/components/ui/google-icons";
import { Sliders, Eye, Printer, Layers, Compass, Sparkles } from "lucide-react";

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
    isDynamicMode: false,
  });

  const handleConfigChange = (updated: Partial<CardConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-primary pb-44 md:pb-16">
      {/* Google 4-Color Ambient Top Stripe */}
      <div className="h-[2.5px] w-full grid grid-cols-4 sticky top-0 z-40">
        <div className="bg-google-blue h-full" />
        <div className="bg-google-red h-full" />
        <div className="bg-google-yellow h-full" />
        <div className="bg-google-green h-full" />
      </div>

      {/* Top Navbar Header with Google Identity */}
      <header className="h-16 border-b border-border bg-canvas/90 backdrop-blur sticky top-[2.5px] z-30 flex items-center px-4 sm:px-6 lg:px-8 justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center shadow-sm shrink-0">
            <GoogleLogo size={22} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold tracking-tight text-primary">
                Google Review Card Generator
              </h1>
              <span className="hidden sm:inline-flex text-[10px] font-mono text-google-green bg-google-green/10 px-2 py-0.5 rounded border border-google-green/30 font-medium">
                300 DPI CETAK
              </span>
            </div>
            <span className="hidden sm:block text-[11px] text-secondary">
              Alat desain & cetak kartu QR review Google Maps resmi
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
                ? "bg-google-blue text-white shadow-sm font-semibold"
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
                ? "bg-google-blue text-white shadow-sm font-semibold"
                : "text-secondary hover:text-primary"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>

        {/* Desktop Quick Indicator */}
        <div className="hidden md:flex items-center gap-4 text-xs text-secondary font-mono">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border">
            <span className="w-2 h-2 rounded-full bg-google-green animate-pulse" />
            <span>SIAP CETAK FISIK</span>
          </div>
        </div>
      </header>

      {/* Main Dual-Column Workbench */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Editor Controls */}
        <div
          className={`md:col-span-6 lg:col-span-6 space-y-6 sm:space-y-8 ${
            activeMobileTab === "preview" ? "hidden md:block" : "block"
          }`}
        >
          {/* Section 1: Dimensi & Tema Visual */}
          <div className="bg-surface rounded-2xl border border-border p-6 sm:p-7 space-y-6 hover:border-border-hover transition-colors shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-google-blue/10 border border-google-blue/30 flex items-center justify-center text-google-blue text-xs font-bold font-mono">
                    1
                  </div>
                  <h2 className="text-sm font-semibold text-primary">
                    Format & Ukuran Fisik Kartu
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-secondary px-2.5 py-1 rounded-full bg-surface-muted border border-border">
                  {config.sizeId}
                </span>
              </div>
              <SizeSelector
                selectedSize={config.sizeId}
                onSelectSize={(sizeId) => handleConfigChange({ sizeId })}
              />
            </div>

            <div className="pt-5 border-t border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-google-yellow" />
                  <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">
                    Tema Visual
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-secondary px-2.5 py-1 rounded-full bg-surface-muted border border-border">
                  {config.themeId}
                </span>
              </div>
              <ThemeSelector
                selectedTheme={config.themeId}
                onSelectTheme={(themeId) => handleConfigChange({ themeId })}
              />
            </div>
          </div>

          {/* Section 2: Informasi Tempat & Link Review */}
          <div className="bg-surface rounded-2xl border border-border p-6 sm:p-7 space-y-5 hover:border-border-hover transition-colors shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-google-blue/10 border border-google-blue/30 flex items-center justify-center text-google-blue text-xs font-bold font-mono">
                2
              </div>
              <h2 className="text-sm font-semibold text-primary">
                Informasi Bisnis & Tautan Google Maps
              </h2>
            </div>

            <CardForm
              config={config}
              onChange={handleConfigChange}
            />
          </div>

          {/* Section 3: Logo QR Code */}
          <div className="bg-surface rounded-2xl border border-border p-6 sm:p-7 space-y-4 hover:border-border-hover transition-colors shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-google-blue/10 border border-google-blue/30 flex items-center justify-center text-google-blue text-xs font-bold font-mono">
                3
              </div>
              <h2 className="text-sm font-semibold text-primary">
                Logo Tengah QR Code (Opsional)
              </h2>
            </div>

            <LogoUploader
              logoDataUrl={config.logoDataUrl}
              onLogoChange={(logoDataUrl) => handleConfigChange({ logoDataUrl })}
            />
          </div>
        </div>

        {/* Right Column: Live Sticky Preview & Export Panel */}
        <div
          className={`md:col-span-6 lg:col-span-6 md:sticky md:top-24 h-fit space-y-6 ${
            activeMobileTab === "editor" ? "hidden md:block" : "block"
          }`}
        >
          <div className="bg-surface rounded-2xl border border-border p-4 sm:p-8 space-y-5 sm:space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <Printer className="w-4 h-4 text-google-blue" />
                <h2 className="text-xs font-semibold tracking-wider text-primary uppercase">
                  Live Print Preview
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-google-green bg-google-green/10 border border-google-green/30 px-2 py-0.5 rounded font-medium">
                  300 DPI
                </span>
                <span className="text-[10px] font-mono text-secondary bg-surface-muted px-2 py-0.5 rounded border border-border">
                  VEKTOR PDF
                </span>
              </div>
            </div>

            {/* The Live Card Stage */}
            <div className="min-h-[340px] sm:min-h-[420px] flex items-center justify-center bg-canvas rounded-xl border border-border overflow-hidden">
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
          <div className="mx-auto max-w-sm bg-surface/95 backdrop-blur-xl rounded-2xl border border-border p-3 flex items-center justify-between gap-3 shadow-2xl">
            <div className="flex items-center gap-2.5 pl-1">
              <span className="w-2.5 h-2.5 rounded-full bg-google-green animate-pulse" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-primary">Kartu Siap</span>
                <span className="text-[10px] font-mono text-secondary">{config.sizeId}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveMobileTab("preview")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-google-blue text-white text-xs font-semibold shadow-md active:scale-95 transition-all min-h-[44px]"
            >
              <Eye className="w-4 h-4" />
              <span>Lihat & Unduh</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
