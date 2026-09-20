"use client";

import * as React from "react";
import { CardConfig } from "@/types/card";
import { resolveReviewUrl } from "@/lib/google-review-url";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createBlankCardAction } from "@/actions/card-actions";
import { LocationFinderModal } from "./location-finder-modal";
import {
  CheckCircle2,
  HelpCircle,
  Star,
  Radio,
  Crop,
  Sparkles,
  QrCode,
  Link as LinkIcon,
  RefreshCw,
  ExternalLink,
  Search,
  Loader2,
  Hash,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { expandAndConvertReviewUrlAction } from "@/actions/card-actions";

interface CardFormProps {
  config: CardConfig;
  onChange: (updated: Partial<CardConfig>) => void;
}

export function CardForm({ config, onChange }: CardFormProps) {
  const [urlInput, setUrlInput] = React.useState(config.googleReviewUrl);
  const [urlStatus, setUrlStatus] = React.useState<{
    isValid: boolean;
    type: string;
    isDirectReview?: boolean;
    message?: string;
  }>({ isValid: true, type: "direct_review_url", isDirectReview: true });

  const [isGeneratingId, setIsGeneratingId] = React.useState(false);
  const [registeredInDb, setRegisteredInDb] = React.useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = React.useState(false);
  const [isConvertingUrl, setIsConvertingUrl] = React.useState(false);
  const [showTextCustomization, setShowTextCustomization] = React.useState(false);

  // Initialize dynamic mode with a card ID if enabled and none exists
  React.useEffect(() => {
    if (config.isDynamicMode && !config.cardId) {
      handleGenerateNewId();
    }
  }, [config.isDynamicMode]);

  const handleModeSwitch = (isDynamic: boolean) => {
    if (isDynamic) {
      const origin = typeof window !== "undefined" ? window.location.origin : "https://review-card-generator-orcin.vercel.app";
      const newId = config.cardId || `G-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      onChange({
        isDynamicMode: true,
        cardId: newId,
        businessName: "",
        tagline: "Beri Ulasan Pengalaman Anda di Google",
        badgeText: "SCAN ATAU TAP DI SINI",
        callToAction: "Dekatkan ponsel atau pindai QR code untuk ulasan bintang 5",
        showSerialId: false,
        googleReviewUrl: `${origin}/r/${newId}`,
      });
    } else {
      onChange({
        isDynamicMode: false,
        businessName: "Nusantara Artisan Bistro",
        tagline: "Beri Ulasan Pengalaman Anda di Google",
        badgeText: "SCAN ATAU TAP DI SINI",
        callToAction: "Dekatkan ponsel atau pindai QR code untuk ulasan bintang 5",
        showSerialId: false,
        googleReviewUrl: urlInput || "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4",
      });
    }
  };

  const handleGenerateNewId = async () => {
    setIsGeneratingId(true);
    setRegisteredInDb(false);
    try {
      const res = await createBlankCardAction();
      const origin = typeof window !== "undefined" ? window.location.origin : "https://review-card-generator-orcin.vercel.app";
      if (res.success && res.cardId) {
        onChange({
          cardId: res.cardId,
          googleReviewUrl: `${origin}/r/${res.cardId}`,
        });
        setRegisteredInDb(true);
      } else {
        const fallbackId = `G-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        onChange({
          cardId: fallbackId,
          googleReviewUrl: `${origin}/r/${fallbackId}`,
        });
      }
    } catch {
      const fallbackId = `G-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const origin = typeof window !== "undefined" ? window.location.origin : "https://review-card-generator-orcin.vercel.app";
      onChange({
        cardId: fallbackId,
        googleReviewUrl: `${origin}/r/${fallbackId}`,
      });
    } finally {
      setIsGeneratingId(false);
    }
  };

  const autoConvertShortlink = async (val: string) => {
    const trimmed = val.trim();
    if (
      trimmed.includes("maps.app.goo.gl") ||
      trimmed.includes("goo.gl/") ||
      (trimmed.includes("g.page/") && !trimmed.includes("/review"))
    ) {
      setIsConvertingUrl(true);
      try {
        const res = await expandAndConvertReviewUrlAction(trimmed);
        if (res.success && res.directUrl && res.directUrl !== trimmed) {
          setUrlInput(res.directUrl);
          const resolved = resolveReviewUrl(res.directUrl);
          setUrlStatus({
            isValid: resolved.isValid,
            type: resolved.type,
            isDirectReview: resolved.isDirectReview,
            message: resolved.errorMessage,
          });
          onChange({
            googleReviewUrl: res.directUrl,
            placeId: resolved.type === "place_id" ? res.directUrl : undefined,
            ...(res.businessName &&
            (!config.businessName || config.businessName === "Nusantara Artisan Bistro")
              ? { businessName: res.businessName }
              : {}),
          });
        }
      } catch (err) {
        console.warn("Auto convert failed:", err);
      } finally {
        setIsConvertingUrl(false);
      }
    }
  };

  const handleUrlChange = (value: string) => {
    setUrlInput(value);
    const resolved = resolveReviewUrl(value);
    setUrlStatus({
      isValid: resolved.isValid,
      type: resolved.type,
      isDirectReview: resolved.isDirectReview,
      message: resolved.errorMessage,
    });

    if (resolved.isValid) {
      onChange({
        googleReviewUrl: resolved.targetUrl,
        placeId: resolved.type === "place_id" ? value.trim() : undefined,
      });
    }

    autoConvertShortlink(value);
  };

  const handleLocationSelect = ({
    businessName,
    reviewUrl,
  }: {
    businessName?: string;
    reviewUrl: string;
  }) => {
    handleUrlChange(reviewUrl);
    if (
      businessName &&
      (!config.businessName || config.businessName === "Nusantara Artisan Bistro")
    ) {
      onChange({ businessName });
    }
  };

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* Mode Switcher: Link Langsung vs Cetak Kosong (Dynamic) */}
      <div className="p-1 rounded-full bg-surface border border-border grid grid-cols-2 gap-1 shadow-xs">
        <button
          type="button"
          onClick={() => handleModeSwitch(false)}
          className={cn(
            "flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-full text-[11px] sm:text-xs font-semibold font-google-sans transition-all cursor-pointer min-h-[34px]",
            !config.isDynamicMode
              ? "bg-canvas text-primary border border-border shadow-xs"
              : "text-secondary hover:text-primary"
          )}
        >
          <LinkIcon size={13} className={!config.isDynamicMode ? "text-m3-primary" : ""} />
          <span className="truncate">Link Ulasan Langsung</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeSwitch(true)}
          className={cn(
            "flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-full text-[11px] sm:text-xs font-semibold font-google-sans transition-all cursor-pointer min-h-[34px]",
            config.isDynamicMode
              ? "bg-canvas text-primary border border-border shadow-xs"
              : "text-secondary hover:text-primary"
          )}
        >
          <QrCode size={13} className={config.isDynamicMode ? "text-google-yellow" : ""} />
          <span className="truncate">Pra-Cetak Kosong</span>
        </button>
      </div>

      {/* Dynamic Blank Card Configuration */}
      {config.isDynamicMode ? (
        <div className="space-y-4 p-4 rounded-2xl bg-surface border border-border">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-google-green animate-pulse" />
                <span className="text-xs font-bold font-google-sans uppercase tracking-wider text-primary">
                  Sistem Kartu Dinamis & Aktivasi
                </span>
              </div>
              <p className="text-[11px] text-secondary font-google-sans-text leading-relaxed">
                Cetak kartu dengan QR code unik ini terlebih dahulu. Saat ada pembeli, mereka cukup scan QR untuk mengaktifkan kartu dan memasukkan link Google Review tokonya.
              </p>
            </div>
          </div>

          {/* Serial ID Display & Action */}
          <div className="p-3 bg-canvas border border-border rounded-xl flex items-center justify-between gap-2">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-mono text-secondary">
                Serial Kartu Cetak:
              </span>
              <div className="font-mono text-sm font-bold text-google-blue">
                {config.cardId || "Membuat ID..."}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={isGeneratingId}
                onClick={handleGenerateNewId}
                className="h-8 text-xs font-google-sans"
              >
                <RefreshCw size={12} className={cn(isGeneratingId && "animate-spin")} />
                <span>ID Baru</span>
              </Button>

              {config.cardId && (
                <a
                  href={`/r/${config.cardId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg border border-border text-[11px] text-secondary hover:text-primary hover:bg-surface transition-colors"
                >
                  <ExternalLink size={12} />
                  <span>Uji Alur</span>
                </a>
              )}
            </div>
          </div>

          {/* Target URL Preview */}
          <div className="space-y-1">
            <Label>Target URL QR Code Fisik</Label>
            <Input
              value={config.googleReviewUrl}
              readOnly
              className="bg-canvas font-mono text-xs text-secondary cursor-not-allowed"
            />
            <p className="text-[10px] text-secondary font-mono">
              Otomatis mengarah ke portal aktivasi bila belum terisi, dan otomatis redirect 307 ke ulasan Google bila sudah aktif.
            </p>
          </div>

          {/* Universal Store Badge */}
          <div className="p-3.5 rounded-xl bg-canvas border border-border space-y-1.5 pt-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-google-yellow font-google-sans uppercase tracking-wider">
              <Sparkles size={14} />
              <span>Kartu Universal Siap Jual</span>
            </div>
            <p className="text-[11px] text-secondary font-google-sans-text leading-relaxed">
              Kartu ini dicetak <strong>tanpa nama toko</strong> agar siap Anda jual atau distribusikan langsung ke toko atau resto mana pun. Toko pembeli akan mengisikan nama tokonya sendiri saat aktivasi kartu via scan QR.
            </p>
          </div>
        </div>
      ) : (
        /* Direct Custom Review URL Mode */
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <Label required>Link Review Google Maps / Place ID</Label>
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="text-xs font-bold font-google-sans text-google-blue hover:underline inline-flex items-center gap-1.5 cursor-pointer bg-google-blue/10 px-2.5 py-1 rounded-lg border border-google-blue/20 transition-colors hover:bg-google-blue/15 self-start sm:self-auto min-h-[32px]"
            >
              <Search size={12} />
              <span>Bantu Cari Lokasi</span>
            </button>
          </div>
          <Input
            value={urlInput}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://g.page/r/.../review atau ChIJ..."
            error={!urlStatus.isValid ? urlStatus.message : undefined}
          />
          <div className="flex items-center gap-1.5 text-[11px] pt-0.5">
            {isConvertingUrl ? (
              <span className="text-google-blue flex items-center gap-1 font-mono animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                Mengonversi shortlink ke form ulasan langsung...
              </span>
            ) : urlStatus.isValid ? (
              <span className="text-google-green flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                {urlStatus.isDirectReview
                  ? "Form ulasan bintang 5 langsung aktif saat di-scan"
                  : urlStatus.type === "place_id"
                  ? "Google Place ID terdeteksi (Form ulasan langsung)"
                  : "Format link review resmi terverifikasi"}
              </span>
            ) : (
              <span className="text-secondary font-mono text-[10px]">
                Contoh: <code className="bg-surface-muted px-1.5 py-0.5 rounded text-primary">https://g.page/r/.../review</code>
              </span>
            )}
          </div>

          {/* Business Name */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <Label required>Nama Tempat / Usaha</Label>
              <span className="text-[10px] font-mono text-secondary">
                {config.businessName.length}/60 karakter
              </span>
            </div>
            <Input
              value={config.businessName}
              maxLength={60}
              onChange={(e) => onChange({ businessName: e.target.value })}
              placeholder="Contoh: Nusantara Artisan Bistro"
            />
          </div>
        </div>
      )}

      {/* Collapsible Section for Secondary Card Text Customization */}
      <div className="border border-border rounded-xl bg-surface/50 overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => setShowTextCustomization(!showTextCustomization)}
          className="w-full flex items-center justify-between p-2.5 sm:p-3 text-left hover:bg-surface-muted/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-primary font-google-sans">
              Kustomisasi Teks Kartu
            </span>
            <span className="text-[9.5px] text-secondary font-mono bg-surface px-1.5 py-0.5 rounded border border-border">
              Tagline, Badge, CTA
            </span>
          </div>
          {showTextCustomization ? (
            <ChevronUp size={15} className="text-secondary" />
          ) : (
            <ChevronDown size={15} className="text-secondary" />
          )}
        </button>

        {showTextCustomization && (
          <div className="p-3 pt-1 border-t border-border space-y-2.5 bg-surface">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="space-y-1">
                <Label>Tagline Kartu (Atas)</Label>
                <Input
                  value={config.tagline}
                  maxLength={80}
                  onChange={(e) => onChange({ tagline: e.target.value })}
                  placeholder="Beri Ulasan Pengalaman Anda di Google"
                />
              </div>

              <div className="space-y-1">
                <Label>Teks Badge Tombol</Label>
                <Input
                  value={config.badgeText ?? "SCAN ATAU TAP DI SINI"}
                  maxLength={40}
                  onChange={(e) => onChange({ badgeText: e.target.value })}
                  placeholder="Kosongkan untuk sembunyikan"
                />
              </div>

              <div className="space-y-1">
                <Label>Call to Action (Bawah)</Label>
                <Input
                  value={config.callToAction}
                  maxLength={100}
                  onChange={(e) => onChange({ callToAction: e.target.value })}
                  placeholder="Pindai QR code untuk ulasan bintang 5"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Toggles */}
      <div className="pt-2 border-t border-border space-y-2">
        <span className="text-[10px] sm:text-[11px] font-mono font-semibold text-secondary uppercase tracking-wider block">
          Opsi Tampilan Cetak
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <label
            className={cn(
              "flex items-center gap-2 p-2 sm:p-2.5 rounded-xl border cursor-pointer select-none transition-all min-h-[38px] font-google-sans",
              config.showRatingStars
                ? "bg-m3-tonal/20 border-google-yellow/50 text-primary shadow-xs"
                : "bg-surface border-border hover:border-border-hover text-secondary hover:text-primary"
            )}
          >
            <input
              type="checkbox"
              checked={config.showRatingStars}
              onChange={(e) => onChange({ showRatingStars: e.target.checked })}
              className="w-3.5 h-3.5 rounded text-google-yellow bg-surface border-border accent-google-yellow cursor-pointer"
            />
            <div className="flex items-center gap-1 text-[11px] sm:text-xs font-medium">
              <Star
                className={cn(
                  "w-3.5 h-3.5 shrink-0",
                  config.showRatingStars ? "text-google-yellow fill-google-yellow" : "text-secondary"
                )}
              />
              <span>5 Bintang</span>
            </div>
          </label>

          <label
            className={cn(
              "flex items-center gap-2 p-2 sm:p-2.5 rounded-xl border cursor-pointer select-none transition-all min-h-[38px] font-google-sans",
              config.showNfcIcon
                ? "bg-m3-tonal/20 border-m3-primary/50 text-primary shadow-xs"
                : "bg-surface border-border hover:border-border-hover text-secondary hover:text-primary"
            )}
          >
            <input
              type="checkbox"
              checked={config.showNfcIcon}
              onChange={(e) => onChange({ showNfcIcon: e.target.checked })}
              className="w-3.5 h-3.5 rounded text-m3-primary bg-surface border-border accent-m3-primary cursor-pointer"
            />
            <div className="flex items-center gap-1 text-[11px] sm:text-xs font-medium">
              <Radio
                className={cn(
                  "w-3.5 h-3.5 shrink-0",
                  config.showNfcIcon ? "text-m3-primary" : "text-secondary"
                )}
              />
              <span>Ikon NFC</span>
            </div>
          </label>

          <label
            className={cn(
              "flex items-center gap-2 p-2 sm:p-2.5 rounded-xl border cursor-pointer select-none transition-all min-h-[38px] font-google-sans",
              config.showSerialId
                ? "bg-m3-tonal/20 border-google-green/50 text-primary shadow-xs"
                : "bg-surface border-border hover:border-border-hover text-secondary hover:text-primary"
            )}
          >
            <input
              type="checkbox"
              checked={config.showSerialId ?? false}
              onChange={(e) => onChange({ showSerialId: e.target.checked })}
              className="w-3.5 h-3.5 rounded text-google-green bg-surface border-border accent-google-green cursor-pointer"
            />
            <div className="flex items-center gap-1 text-[11px] sm:text-xs font-medium">
              <Hash className="w-3.5 h-3.5 shrink-0 text-secondary" />
              <span>Serial ID</span>
            </div>
          </label>

          <label
            className={cn(
              "flex items-center gap-2 p-2 sm:p-2.5 rounded-xl border cursor-pointer select-none transition-all min-h-[38px] font-google-sans",
              config.includeBleedMarks
                ? "bg-m3-tonal/20 border-primary/40 text-primary shadow-xs"
                : "bg-surface border-border hover:border-border-hover text-secondary hover:text-primary"
            )}
          >
            <input
              type="checkbox"
              checked={config.includeBleedMarks}
              onChange={(e) => onChange({ includeBleedMarks: e.target.checked })}
              className="w-3.5 h-3.5 rounded text-primary bg-surface border-border accent-primary cursor-pointer"
            />
            <div className="flex items-center gap-1 text-[11px] sm:text-xs font-medium">
              <Crop className="w-3.5 h-3.5 shrink-0 text-secondary" />
              <span>Bleed</span>
            </div>
          </label>
        </div>
      </div>

      <LocationFinderModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelect={handleLocationSelect}
        initialQuery={config.businessName}
      />
    </div>
  );
}
