"use client";

import * as React from "react";
import { CardConfig, CARD_SIZES } from "@/types/card";
import { GoogleLogo, GoogleReviewStars, NfcWaveIcon } from "@/components/ui/google-icons";
import { QrRenderer } from "../qr-renderer";
import { cn } from "@/lib/utils";

interface TemplateProps {
  config: CardConfig;
}

export function GoogleOfficialCard({ config }: TemplateProps) {
  const sizeConfig = CARD_SIZES[config.sizeId];
  const isHorizontal = config.sizeId === "pvc-cr80-h";
  const isSquare = config.sizeId === "sticker-square";

  // Calculate proportional QR size based on card size
  const qrSize = isHorizontal ? 140 : isSquare ? 170 : 180;

  return (
    <div
      className={cn(
        "relative bg-card-white text-zinc-900 shadow-xl overflow-hidden flex flex-col justify-between select-none transition-all",
        config.includeBleedMarks && "ring-1 ring-offset-2 ring-google-red/40"
      )}
      style={{
        width: "100%",
        height: "100%",
        padding: isHorizontal ? "18px 24px" : "24px 20px",
      }}
    >
      {/* Bleed Guidelines (if enabled) */}
      {config.includeBleedMarks && (
        <div className="absolute inset-0 pointer-events-none border border-dashed border-google-red/30 m-1 rounded" />
      )}

      {/* Horizontal CR80 Card Layout */}
      {isHorizontal ? (
        <div className="flex items-center justify-between h-full gap-5">
          {/* Left Column: Branding, Title, Stars, NFC */}
          <div className="flex-1 flex flex-col justify-between h-full py-1">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <GoogleLogo size={24} />
                <span className="text-[11px] font-bold tracking-wider text-google-blue uppercase">
                  Google Review
                </span>
                {config.showNfcIcon && (
                  <span className="ml-auto inline-flex items-center gap-1 text-[9px] font-mono font-bold text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                    <NfcWaveIcon size={11} />
                    <span>NFC</span>
                  </span>
                )}
              </div>

              <h2 className="text-base font-black text-zinc-900 leading-tight line-clamp-2">
                {config.businessName || "Nama Tempat Usaha"}
              </h2>

              <p className="text-[10px] text-zinc-600 font-medium leading-tight">
                {config.tagline}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              {config.showRatingStars && (
                <div className="flex items-center gap-1.5">
                  <GoogleReviewStars size={16} />
                  <span className="text-[11px] font-bold text-zinc-800">5.0</span>
                </div>
              )}

              <p className="text-[9px] text-zinc-500 font-medium leading-snug">
                {config.callToAction}
              </p>
            </div>
          </div>

          {/* Right Column: QR Code with subtle border */}
          <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-zinc-50 border border-zinc-200 shrink-0">
            <QrRenderer
              url={config.googleReviewUrl}
              logoDataUrl={config.logoDataUrl}
              size={qrSize}
            />
            <span className="text-[9px] font-bold font-mono tracking-wider text-google-blue mt-1">
              SCAN TO REVIEW
            </span>
          </div>
        </div>
      ) : (
        /* Vertical & Square Layout (Standee A6, A7, PVC Vertical, Square Sticker) */
        <div className="flex flex-col items-center justify-between h-full text-center py-2">
          {/* Top Header */}
          <div className="space-y-1.5 w-full flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <GoogleLogo size={isSquare ? 22 : 28} />
              <span className="text-xs font-bold tracking-wider text-google-blue uppercase">
                Google Review
              </span>
              {config.showNfcIcon && (
                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
                  <NfcWaveIcon size={12} />
                  <span>TAP NFC</span>
                </span>
              )}
            </div>

            <h2
              className={cn(
                "font-black text-zinc-900 leading-tight px-2",
                isSquare ? "text-sm line-clamp-1" : "text-lg line-clamp-2"
              )}
            >
              {config.businessName || "Nama Tempat Usaha"}
            </h2>

            <p className="text-[11px] text-zinc-600 font-medium px-4">
              {config.tagline}
            </p>

            {config.showRatingStars && (
              <div className="pt-1 flex items-center justify-center gap-1.5">
                <GoogleReviewStars size={18} />
                <span className="text-xs font-bold text-zinc-800">5.0</span>
              </div>
            )}
          </div>

          {/* Center QR Code Container */}
          <div className="my-auto p-3 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-sm flex flex-col items-center">
            <QrRenderer
              url={config.googleReviewUrl}
              logoDataUrl={config.logoDataUrl}
              size={qrSize}
            />
          </div>

          {/* Bottom Call to Action */}
          <div className="w-full space-y-1 pt-1">
            <div className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-google-blue text-white text-[10px] font-bold tracking-wider shadow-sm">
              <span>SCAN KODE QR DI ATAS</span>
            </div>
            <p className="text-[10px] text-zinc-500 font-medium px-2 leading-tight">
              {config.callToAction}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
