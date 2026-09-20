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
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";
import { Sliders, Eye, Printer, Layers, Compass, Sparkles, QrCode } from "lucide-react";

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
    badgeText: "SCAN ATAU TAP DI SINI",
    showSerialId: false,
  });

  const handleConfigChange = (updated: Partial<CardConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-primary pb-28 md:pb-16">
      {/* Top Navbar Header with Google Identity */}
      <header className="h-16 border-b border-border bg-canvas/90 backdrop-blur sticky top-0 z-30 flex items-center px-3.5 sm:px-6 lg:px-8 justify-between">
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-surface border border-border flex items-center justify-center shadow-sm shrink-0">
            <GoogleLogo size={20} />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-primary font-google-sans">
                Google Review Card
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

        {/* Mobile Action Controls (Spacious & Clean) */}
        <div className="flex md:hidden items-center gap-2 shrink-0">
          <ThemeToggle />

          <Link
            href="/cards"
            className="flex items-center justify-center w-[38px] h-[38px] rounded-full bg-surface border border-border text-secondary hover:text-primary transition-colors cursor-pointer shadow-xs"
            title="Daftar Kartu QR"
          >
            <QrCode size={16} />
          </Link>
        </div>

        {/* Desktop Quick Indicator */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="/cards"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface border border-border text-xs font-semibold text-primary hover:border-google-blue hover:text-google-blue transition-all cursor-pointer shadow-xs"
          >
            <QrCode size={14} className="text-google-blue" />
            <span>Daftar Kartu QR</span>
          </Link>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-border text-xs text-secondary font-mono">
            <span className="w-2 h-2 rounded-full bg-google-green animate-pulse" />
            <span>SIAP CETAK FISIK</span>
          </div>
        </div>
      </header>

      {/* Main Dual-Column Workbench */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 py-4 sm:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-8 lg:gap-10 pb-24 md:pb-0">
        {/* Left Column: Editor Controls */}
        <div
          className={`md:col-span-6 lg:col-span-6 space-y-4 sm:space-y-6 ${
            activeMobileTab === "preview" ? "hidden md:block" : "block"
          }`}
        >
          {/* Section 1: Dimensi & Tema Visual */}
          <div className="bg-surface rounded-2xl sm:rounded-3xl border border-border p-3.5 sm:p-6 space-y-4 sm:space-y-5 hover:border-border-hover transition-colors shadow-sm">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-google-blue/10 border border-google-blue/30 flex items-center justify-center text-google-blue text-[11px] sm:text-xs font-bold font-mono">
                    1
                  </div>
                  <h2 className="text-xs sm:text-sm font-semibold text-primary">
                    Format & Ukuran Fisik Kartu
                  </h2>
                </div>
                <span className="text-[9.5px] sm:text-[10px] font-mono text-secondary px-2 py-0.5 rounded-full bg-surface-muted border border-border">
                  {config.sizeId}
                </span>
              </div>
              <SizeSelector
                selectedSize={config.sizeId}
                onSelectSize={(sizeId) => handleConfigChange({ sizeId })}
              />
            </div>

            <div className="pt-3.5 sm:pt-4 border-t border-border space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-google-yellow" />
                  <h3 className="text-[11px] sm:text-xs font-semibold text-primary uppercase tracking-wider">
                    Tema Visual
                  </h3>
                </div>
                <span className="text-[9.5px] sm:text-[10px] font-mono text-secondary px-2 py-0.5 rounded-full bg-surface-muted border border-border">
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
          <div className="bg-surface rounded-2xl sm:rounded-3xl border border-border p-3.5 sm:p-6 space-y-3.5 sm:space-y-5 hover:border-border-hover transition-colors shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-google-blue/10 border border-google-blue/30 flex items-center justify-center text-google-blue text-[11px] sm:text-xs font-bold font-mono">
                2
              </div>
              <h2 className="text-xs sm:text-sm font-semibold text-primary">
                Informasi Bisnis & Tautan Google Maps
              </h2>
            </div>

            <CardForm
              config={config}
              onChange={handleConfigChange}
            />
          </div>

          {/* Section 3: Logo QR Code */}
          <div className="bg-surface rounded-2xl sm:rounded-3xl border border-border p-3.5 sm:p-6 space-y-3 sm:space-y-4 hover:border-border-hover transition-colors shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-google-blue/10 border border-google-blue/30 flex items-center justify-center text-google-blue text-[11px] sm:text-xs font-bold font-mono">
                3
              </div>
              <h2 className="text-xs sm:text-sm font-semibold text-primary">
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
          <div className="bg-surface rounded-2xl sm:rounded-3xl border border-border p-4 sm:p-8 space-y-5 sm:space-y-6 shadow-2xl">
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

      {/* Mobile Fixed Bottom Dock */}
      {activeMobileTab === "editor" ? (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-border px-4 py-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl">
          <div className="max-w-md mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-google-green animate-pulse shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-primary truncate">
                  {config.businessName || "Review Card"}
                </span>
                <span className="text-[10px] font-mono text-secondary truncate">
                  {config.sizeId} • 300 DPI
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveMobileTab("preview");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-google-blue text-white text-xs font-semibold shadow-md active:scale-95 transition-all min-h-[44px] shrink-0 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Preview & Unduh</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-border px-4 py-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl">
          <div className="max-w-md mx-auto flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setActiveMobileTab("editor");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border text-primary text-xs font-semibold shadow-xs active:scale-95 transition-all min-h-[44px] cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-google-blue" />
              <span>Kembali ke Editor</span>
            </button>
            <span className="text-[10px] font-mono text-secondary">
              Skala Cetak 1:1
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
