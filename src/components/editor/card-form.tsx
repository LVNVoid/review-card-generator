"use client";

import * as React from "react";
import { CardConfig } from "@/types/card";
import { resolveReviewUrl } from "@/lib/google-review-url";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, HelpCircle } from "lucide-react";

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
    <div className="space-y-4">
      {/* Google Review URL / Place ID Input */}
      <div className="space-y-1.5">
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
        <div className="flex items-center gap-1.5 text-[11px]">
          {urlStatus.isValid ? (
            <span className="text-google-green flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {urlStatus.type === "place_id"
                ? "Google Place ID terdeteksi (Otomatis diarahkan ke write review)"
                : "Format URL review terverifikasi"}
            </span>
          ) : (
            <span className="text-secondary font-mono text-[10px]">
              Contoh: <code className="bg-surface-muted px-1.5 py-0.5 rounded text-primary">https://g.page/r/.../review</code> atau Place ID: <code className="bg-surface-muted px-1.5 py-0.5 rounded text-primary">ChIJ...</code>
            </span>
          )}
        </div>
      </div>

      {/* Business Name */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label required>Nama Tempat / Usaha</Label>
          <span className="text-[10px] font-mono text-secondary">
            {config.businessName.length}/60
          </span>
        </div>
        <Input
          value={config.businessName}
          maxLength={60}
          onChange={(e) => onChange({ businessName: e.target.value })}
          placeholder="Contoh: Nusantara Artisan Bistro"
        />
      </div>

      {/* Tagline / Subtitle */}
      <div className="space-y-1.5">
        <Label>Tagline Kartu (Baris Atas)</Label>
        <Input
          value={config.tagline}
          maxLength={80}
          onChange={(e) => onChange({ tagline: e.target.value })}
          placeholder="Beri Ulasan Pengalaman Anda di Google"
        />
      </div>

      {/* Call to Action Text */}
      <div className="space-y-1.5">
        <Label>Petunjuk / Call to Action (Baris Bawah)</Label>
        <Input
          value={config.callToAction}
          maxLength={100}
          onChange={(e) => onChange({ callToAction: e.target.value })}
          placeholder="Pindai QR code untuk beri ulasan & rating bintang 5"
        />
      </div>

      {/* Quick Toggles */}
      <div className="pt-2 border-t border-border space-y-2.5">
        <span className="text-[11px] font-mono font-semibold text-secondary uppercase tracking-wider block">
          Opsi Tampilan Cetak
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-surface border border-border hover:border-border-hover cursor-pointer text-xs font-medium text-primary select-none transition-colors min-h-[44px]">
            <input
              type="checkbox"
              checked={config.showRatingStars}
              onChange={(e) => onChange({ showRatingStars: e.target.checked })}
              className="w-4 h-4 rounded text-primary bg-surface border-border focus:ring-primary accent-primary cursor-pointer"
            />
            <span>5 Bintang Emas</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-surface border border-border hover:border-border-hover cursor-pointer text-xs font-medium text-primary select-none transition-colors min-h-[44px]">
            <input
              type="checkbox"
              checked={config.showNfcIcon}
              onChange={(e) => onChange({ showNfcIcon: e.target.checked })}
              className="w-4 h-4 rounded text-primary bg-surface border-border focus:ring-primary accent-primary cursor-pointer"
            />
            <span>Ikon Tap NFC</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-surface border border-border hover:border-border-hover cursor-pointer text-xs font-medium text-primary select-none transition-colors min-h-[44px]">
            <input
              type="checkbox"
              checked={config.includeBleedMarks}
              onChange={(e) => onChange({ includeBleedMarks: e.target.checked })}
              className="w-4 h-4 rounded text-primary bg-surface border-border focus:ring-primary accent-primary cursor-pointer"
            />
            <span>Garis Potong (Bleed)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
