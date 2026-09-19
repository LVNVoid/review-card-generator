"use client";

import * as React from "react";
import { CardConfig } from "@/types/card";
import { resolveReviewUrl } from "@/lib/google-review-url";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";

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
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label required>Link Review Google Maps / Place ID</Label>
          <span className="text-[11px] text-accent flex items-center gap-1 font-medium">
            <HelpCircle className="w-3 h-3" />
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
            <span className="text-google-green flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {urlStatus.type === "place_id"
                ? "Google Place ID terdeteksi (Otomatis diarahkan ke halaman write review)"
                : "Format URL review valid"}
            </span>
          ) : (
            <span className="text-secondary">
              Contoh link: <code className="bg-surface-muted px-1.5 py-0.5 rounded font-mono text-[10px]">https://g.page/r/your-business/review</code> atau Place ID: <code className="bg-surface-muted px-1.5 py-0.5 rounded font-mono text-[10px]">ChIJ...</code>
            </span>
          )}
        </div>
      </div>

      {/* Business Name */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label required>Nama Tempat / Usaha</Label>
          <span className="text-[10px] text-secondary">
            {config.businessName.length}/60
          </span>
        </div>
        <Input
          value={config.businessName}
          maxLength={60}
          onChange={(e) => onChange({ businessName: e.target.value })}
          placeholder="Contoh: Kopi Sangkara"
        />
      </div>

      {/* Tagline / Subtitle */}
      <div className="space-y-1.5">
        <Label>Tagline Kartu (Baris Atas)</Label>
        <Input
          value={config.tagline}
          maxLength={80}
          onChange={(e) => onChange({ tagline: e.target.value })}
          placeholder="Review Usaha Kami di Google"
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
      <div className="pt-2 border-t border-border space-y-3">
        <span className="text-xs font-bold text-secondary uppercase tracking-wider block">
          Opsi Tampilan Cetak
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-surface border border-border hover:border-secondary/40 cursor-pointer text-xs font-medium text-primary select-none">
            <input
              type="checkbox"
              checked={config.showRatingStars}
              onChange={(e) => onChange({ showRatingStars: e.target.checked })}
              className="w-4 h-4 rounded text-accent bg-surface border-border focus:ring-accent accent-accent cursor-pointer"
            />
            <span>5 Bintang Emas</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-surface border border-border hover:border-secondary/40 cursor-pointer text-xs font-medium text-primary select-none">
            <input
              type="checkbox"
              checked={config.showNfcIcon}
              onChange={(e) => onChange({ showNfcIcon: e.target.checked })}
              className="w-4 h-4 rounded text-accent bg-surface border-border focus:ring-accent accent-accent cursor-pointer"
            />
            <span>Ikon Tap NFC</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-surface border border-border hover:border-secondary/40 cursor-pointer text-xs font-medium text-primary select-none">
            <input
              type="checkbox"
              checked={config.includeBleedMarks}
              onChange={(e) => onChange({ includeBleedMarks: e.target.checked })}
              className="w-4 h-4 rounded text-accent bg-surface border-border focus:ring-accent accent-accent cursor-pointer"
            />
            <span>Garis Potong (Bleed)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
