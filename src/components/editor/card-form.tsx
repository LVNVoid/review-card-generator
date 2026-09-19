"use client";

import * as React from "react";
import { CardConfig } from "@/types/card";
import { resolveReviewUrl } from "@/lib/google-review-url";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, HelpCircle, Star, Radio, Crop } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardFormProps {
  config: CardConfig;
  onChange: (updated: Partial<CardConfig>) => void;
}

export function CardForm({ config, onChange }: CardFormProps) {
  const [urlInput, setUrlInput] = React.useState(config.googleReviewUrl);
  const [urlStatus, setUrlStatus] = React.useState<{
    isValid: boolean;
    type: string;
    message?: string;
  }>({ isValid: true, type: "direct_review_url" });

  const handleUrlChange = (value: string) => {
    setUrlInput(value);
    const resolved = resolveReviewUrl(value);
    setUrlStatus({
      isValid: resolved.isValid,
      type: resolved.type,
      message: resolved.errorMessage,
    });

    if (resolved.isValid) {
      onChange({
        googleReviewUrl: resolved.targetUrl,
        placeId: resolved.type === "place_id" ? value.trim() : undefined,
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* Google Review URL / Place ID Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label required>Link Review Google Maps / Place ID</Label>
          <span className="text-[11px] text-secondary flex items-center gap-1 font-mono">
            <HelpCircle className="w-3 h-3 text-secondary" />
            Opsi A: Gratis tanpa API Key
          </span>
        </div>
        <Input
          value={urlInput}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://g.page/r/.../review atau ChIJ..."
          error={!urlStatus.isValid ? urlStatus.message : undefined}
        />
        <div className="flex items-center gap-1.5 text-[11px] pt-0.5">
          {urlStatus.isValid ? (
            <span className="text-google-green flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              {urlStatus.type === "place_id"
                ? "Google Place ID terdeteksi (Otomatis diarahkan ke review ulasan)"
                : "Format link review resmi terverifikasi"}
            </span>
          ) : (
            <span className="text-secondary font-mono text-[10px]">
              Contoh: <code className="bg-surface-muted px-1.5 py-0.5 rounded text-primary">https://g.page/r/.../review</code> atau <code className="bg-surface-muted px-1.5 py-0.5 rounded text-primary">ChIJ...</code>
            </span>
          )}
        </div>
      </div>

      {/* Business Name */}
      <div className="space-y-2">
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

      {/* Grid for Tagline & CTA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tagline Kartu (Atas)</Label>
          <Input
            value={config.tagline}
            maxLength={80}
            onChange={(e) => onChange({ tagline: e.target.value })}
            placeholder="Beri Ulasan Pengalaman Anda di Google"
          />
        </div>

        <div className="space-y-2">
          <Label>Call to Action (Bawah)</Label>
          <Input
            value={config.callToAction}
            maxLength={100}
            onChange={(e) => onChange({ callToAction: e.target.value })}
            placeholder="Pindai QR code untuk beri ulasan & rating bintang 5"
          />
        </div>
      </div>

      {/* Quick Toggles */}
      <div className="pt-3 border-t border-border space-y-3">
        <span className="text-[11px] font-mono font-semibold text-secondary uppercase tracking-wider block">
          Opsi Tampilan Cetak
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className={cn(
            "flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer select-none transition-all min-h-[48px]",
            config.showRatingStars
              ? "bg-surface-muted border-google-yellow/40 text-primary shadow-sm"
              : "bg-surface border-border hover:border-border-hover text-secondary hover:text-primary"
          )}>
            <input
              type="checkbox"
              checked={config.showRatingStars}
              onChange={(e) => onChange({ showRatingStars: e.target.checked })}
              className="w-4 h-4 rounded text-google-yellow bg-surface border-border accent-google-yellow cursor-pointer"
            />
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <Star className={cn("w-3.5 h-3.5", config.showRatingStars ? "text-google-yellow fill-google-yellow" : "text-secondary")} />
              <span>5 Bintang Emas</span>
            </div>
          </label>

          <label className={cn(
            "flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer select-none transition-all min-h-[48px]",
            config.showNfcIcon
              ? "bg-surface-muted border-google-blue/40 text-primary shadow-sm"
              : "bg-surface border-border hover:border-border-hover text-secondary hover:text-primary"
          )}>
            <input
              type="checkbox"
              checked={config.showNfcIcon}
              onChange={(e) => onChange({ showNfcIcon: e.target.checked })}
              className="w-4 h-4 rounded text-google-blue bg-surface border-border accent-google-blue cursor-pointer"
            />
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <Radio className={cn("w-3.5 h-3.5", config.showNfcIcon ? "text-google-blue" : "text-secondary")} />
              <span>Ikon Tap NFC</span>
            </div>
          </label>

          <label className={cn(
            "flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer select-none transition-all min-h-[48px]",
            config.includeBleedMarks
              ? "bg-surface-muted border-primary/40 text-primary shadow-sm"
              : "bg-surface border-border hover:border-border-hover text-secondary hover:text-primary"
          )}>
            <input
              type="checkbox"
              checked={config.includeBleedMarks}
              onChange={(e) => onChange({ includeBleedMarks: e.target.checked })}
              className="w-4 h-4 rounded text-primary bg-surface border-border accent-primary cursor-pointer"
            />
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <Crop className="w-3.5 h-3.5 text-secondary" />
              <span>Garis Potong Bleed</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
