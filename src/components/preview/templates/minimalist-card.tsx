"use client";

import * as React from "react";
import { CardConfig } from "@/types/card";
import { GoogleLogo, GoogleReviewStars, NfcWaveIcon } from "@/components/ui/google-icons";
import { QrRenderer } from "../qr-renderer";
import { cn } from "@/lib/utils";

interface TemplateProps {
  config: CardConfig;
}

export function MinimalistCard({ config }: TemplateProps) {
  const isHorizontal = config.sizeId === "pvc-cr80-h";
  const isSquare = config.sizeId === "sticker-square";
  const qrSize = isHorizontal ? 140 : isSquare ? 170 : 180;

  return (
    <div
      className={cn(
        "relative bg-card-white text-zinc-900 shadow-xl overflow-hidden flex flex-col justify-between select-none transition-all border-2 border-zinc-900",
        config.includeBleedMarks && "ring-1 ring-offset-2 ring-zinc-900/40"
      )}
      style={{
        width: "100%",
        height: "100%",
        padding: isHorizontal ? "18px 24px" : "24px 20px",
      }}
    >
      {/* Bleed Guidelines */}
      {config.includeBleedMarks && (
        <div className="absolute inset-0 pointer-events-none border border-dashed border-zinc-400 m-1 rounded" />
      )}

      {/* Horizontal Layout */}
      {isHorizontal ? (
        <div className="flex items-center justify-between h-full gap-5">
          <div className="flex-1 flex flex-col justify-between h-full py-1">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <GoogleLogo size={22} />
                <span className="text-[10px] font-mono font-black tracking-widest text-zinc-900 uppercase">
                  RATE & REVIEW
                </span>
                {config.showNfcIcon && (
                  <span className="ml-auto inline-flex items-center gap-1 text-[9px] font-mono font-bold text-zinc-900 bg-zinc-100 px-1.5 py-0.5 border border-zinc-900">
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

            <div className="space-y-2 pt-2 border-t border-zinc-200">
              {config.showRatingStars && (
                <div className="flex items-center gap-1.5">
                  <GoogleReviewStars size={16} />
                  <span className="text-[11px] font-black text-zinc-900">5.0</span>
                </div>
              )}

              <p className="text-[9px] text-zinc-600 font-normal leading-snug">
                {config.callToAction}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-2 rounded-xl border border-zinc-900 shrink-0">
            <QrRenderer
              url={config.googleReviewUrl}
              logoDataUrl={config.logoDataUrl}
              size={qrSize}
            />
            <span className="text-[9px] font-mono font-black tracking-widest text-zinc-900 mt-1">
              SCAN QR
            </span>
          </div>
        </div>
      ) : (
        /* Vertical & Square Layout */
        <div className="flex flex-col items-center justify-between h-full text-center py-2">
          <div className="space-y-1.5 w-full flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <GoogleLogo size={isSquare ? 20 : 26} />
              <span className="text-xs font-mono font-black tracking-widest text-zinc-900 uppercase">
                RATE & REVIEW
              </span>
              {config.showNfcIcon && (
                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 border border-zinc-900">
                  <NfcWaveIcon size={12} />
                  <span>NFC</span>
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
                <span className="text-xs font-black text-zinc-900">5.0</span>
              </div>
            )}
          </div>

          <div className="my-auto p-3 rounded-xl border-2 border-zinc-900 flex flex-col items-center">
            <QrRenderer
              url={config.googleReviewUrl}
              logoDataUrl={config.logoDataUrl}
              size={qrSize}
            />
          </div>

          <div className="w-full space-y-1 pt-1 border-t border-zinc-200">
            <div className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 border border-zinc-900 text-zinc-900 text-[10px] font-mono font-bold tracking-wider">
              <span>SCAN KODE QR DI ATAS</span>
            </div>
            <p className="text-[10px] text-zinc-600 font-medium px-2 leading-tight">
              {config.callToAction}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
