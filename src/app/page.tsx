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
import { Sliders, Eye, Sparkles, Printer } from "lucide-react";

export default function WorkbenchPage() {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [activeMobileTab, setActiveMobileTab] = React.useState<"editor" | "preview">("editor");

  const [config, setConfig] = React.useState<CardConfig>({
    businessName: "Kopi Sangkara",
    tagline: "Review Usaha Kami di Google",
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
    <div className="min-h-screen flex flex-col bg-canvas text-primary">
      {/* Top Navbar */}
      <header className="h-16 border-b border-border bg-surface/80 backdrop-blur sticky top-0 z-30 flex items-center px-4 sm:px-8 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-surface-muted border border-border flex items-center justify-center">
            <GoogleLogo size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-primary">
                Google Review Card Generator
              </h1>
              <span className="hidden sm:inline-flex text-[10px] font-mono font-bold text-google-blue bg-google-blue/10 px-2 py-0.5 rounded-full border border-google-blue/20">
                PRINT READY 300 DPI
              </span>
            </div>
            <p className="text-xs text-secondary hidden sm:block">
              Buat kartu review Google Maps presisi untuk kartu PVC, akrilik meja & stiker
            </p>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex md:hidden items-center p-1 rounded-xl bg-surface-muted border border-border">
          <button
            onClick={() => setActiveMobileTab("editor")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeMobileTab === "editor"
                ? "bg-accent text-primary shadow-sm"
                : "text-secondary hover:text-primary"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            onClick={() => setActiveMobileTab("preview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeMobileTab === "preview"
                ? "bg-accent text-primary shadow-sm"
                : "text-secondary hover:text-primary"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </header>

      {/* Main Dual-Column Workbench */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Editor Controls */}
        <div
          className={`md:col-span-6 lg:col-span-6 space-y-6 ${
            activeMobileTab === "preview" ? "hidden md:block" : "block"
          }`}
        >
          {/* Step 1: Size Preset */}
          <div className="bg-surface rounded-3xl border border-border p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent-subtle text-accent font-mono text-xs font-bold flex items-center justify-center border border-accent/30">
                  1
                </span>
                <h2 className="text-sm font-bold text-primary">
                  Ukuran & Media Fisik Cetak
                </h2>
              </div>
              <span className="text-[11px] text-secondary font-mono">
                {config.sizeId}
              </span>
            </div>
            <SizeSelector
              selectedSize={config.sizeId}
              onSelectSize={(sizeId) => handleConfigChange({ sizeId })}
            />
          </div>

          {/* Step 2: Theme / Style */}
          <div className="bg-surface rounded-3xl border border-border p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent-subtle text-accent font-mono text-xs font-bold flex items-center justify-center border border-accent/30">
                  2
                </span>
                <h2 className="text-sm font-bold text-primary">
                  Pilihan Tema Desain
                </h2>
              </div>
              <span className="text-[11px] text-secondary font-mono">
                {config.themeId}
              </span>
            </div>
            <ThemeSelector
              selectedTheme={config.themeId}
              onSelectTheme={(themeId) => handleConfigChange({ themeId })}
            />
          </div>

          {/* Step 3: Information & Links */}
          <div className="bg-surface rounded-3xl border border-border p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent-subtle text-accent font-mono text-xs font-bold flex items-center justify-center border border-accent/30">
                3
              </span>
              <h2 className="text-sm font-bold text-primary">
                Informasi Bisnis & URL Google Review
              </h2>
            </div>
            <CardForm
              config={config}
              onChange={handleConfigChange}
            />
          </div>

          {/* Step 4: Logo Customization */}
          <div className="bg-surface rounded-3xl border border-border p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent-subtle text-accent font-mono text-xs font-bold flex items-center justify-center border border-accent/30">
                4
              </span>
              <h2 className="text-sm font-bold text-primary">
                Logo Kustom Tengah QR (Opsional)
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
          className={`md:col-span-6 lg:col-span-6 md:sticky md:top-24 h-fit space-y-4 ${
            activeMobileTab === "editor" ? "hidden md:block" : "block"
          }`}
        >
          <div className="bg-surface rounded-3xl border border-border p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-accent" />
                <h2 className="text-sm font-bold text-primary">
                  Live Print Preview
                </h2>
              </div>
              <span className="text-[11px] font-mono text-secondary">
                WYSIWYG 300 DPI
              </span>
            </div>

            {/* The Live Canvas */}
            <div className="min-h-[360px] flex items-center justify-center bg-canvas/60 rounded-2xl border border-border/60">
              <CardCanvas config={config} cardRef={cardRef} />
            </div>

            {/* Export Toolbar */}
            <ExportToolbar config={config} cardRef={cardRef} />
          </div>
        </div>
      </main>
    </div>
  );
}
