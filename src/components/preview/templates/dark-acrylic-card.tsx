"use client";

import * as React from "react";
import { CardConfig } from "@/types/card";
import { GoogleLogo, GoogleReviewStars, NfcWaveIcon } from "@/components/ui/google-icons";
import { QrRenderer } from "../qr-renderer";
import { cn } from "@/lib/utils";

interface TemplateProps {
  config: CardConfig;
}

export function DarkAcrylicCard({ config }: TemplateProps) {
  const isHorizontal = config.sizeId === "pvc-cr80-h";
  const isSquare = config.sizeId === "sticker-square";
  const qrSize = isHorizontal ? 140 : isSquare ? 170 : 180;

  return (
    <div
      className={cn(
        "relative bg-card-dark text-white shadow-2xl overflow-hidden flex flex-col justify-between select-none transition-all border border-card-border-dark",
        config.includeBleedMarks && "ring-1 ring-offset-2 ring-google-yellow/40"
      )}
      style={{
        width: "100%",
        height: "100%",
        padding: isHorizontal ? "18px 24px" : "24px 20px",
      }}
    >
      {/* Bleed Guidelines */}
      {config.includeBleedMarks && (
        <div className="absolute inset-0 pointer-events-none border border-dashed border-google-yellow/30 m-1 rounded" />
      )}

      {/* Horizontal Layout */}
      {isHorizontal ? (
        <div className="flex items-center justify-between h-full gap-5">
          <div className="flex-1 flex flex-col justify-between h-full py-1">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <GoogleLogo size={24} />
                <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
                  GOOGLE REVIEW
                </span>
                {config.showNfcIcon && (
                  <span className="ml-auto inline-flex items-center gap-1 text-[9px] font-mono text-google-yellow bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700">
                    <NfcWaveIcon size={11} />
                    <span>NFC</span>
                  </span>
                )}
              </div>

              <h2 className="text-base font-black text-white leading-tight line-clamp-2">
                {config.businessName || "Nama Tempat Usaha"}
              </h2>

              <p className="text-[10px] text-zinc-400 font-medium leading-tight">
                {config.tagline}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              {config.showRatingStars && (
                <div className="flex items-center gap-1.5">
                  <GoogleReviewStars size={16} />
                  <span className="text-[11px] font-bold text-google-yellow">5.0</span>
                </div>
              )}

              <p className="text-[9px] text-zinc-400 font-normal leading-snug">
                {config.callToAction}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white shrink-0 shadow-lg">
            <QrRenderer
              url={config.googleReviewUrl}
              logoDataUrl={config.logoDataUrl}
              size={qrSize}
            />
            <span className="text-[9px] font-bold font-mono tracking-wider text-zinc-900 mt-1">
              SCAN TO REVIEW
            </span>
          </div>
        </div>
      ) : (
        /* Vertical & Square Layout */
        <div className="flex flex-col items-center justify-between h-full text-center py-2">
          <div className="space-y-1.5 w-full flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <GoogleLogo size={isSquare ? 22 : 28} />
              <span className="text-xs font-mono font-bold tracking-widest text-zinc-300 uppercase">
                GOOGLE REVIEW
              </span>
              {config.showNfcIcon && (
                <span className="inline-flex items-center gap-1 text-[9px] font-mono text-google-yellow bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-700">
                  <NfcWaveIcon size={12} />
                  <span>NFC</span>
                </span>
              )}
            </div>

            <h2
              className={cn(
                "font-black text-white leading-tight px-2",
                isSquare ? "text-sm line-clamp-1" : "text-lg line-clamp-2"
              )}
            >
              {config.businessName || "Nama Tempat Usaha"}
            </h2>

            <p className="text-[11px] text-zinc-400 font-medium px-4">
              {config.tagline}
            </p>

            {config.showRatingStars && (
              <div className="pt-1 flex items-center justify-center gap-1.5">
                <GoogleReviewStars size={18} />
                <span className="text-xs font-bold text-google-yellow">5.0</span>
              </div>
            )}
          </div>

          <div className="my-auto p-3 rounded-2xl bg-white shadow-xl flex flex-col items-center">
            <QrRenderer
              url={config.googleReviewUrl}
              logoDataUrl={config.logoDataUrl}
              size={qrSize}
            />
          </div>

          <div className="w-full space-y-1 pt-1">
            <div className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-google-yellow text-[10px] font-mono font-bold tracking-wider">
              <span>SCAN QR TO REVIEW</span>
            </div>
            <p className="text-[10px] text-zinc-400 font-medium px-2 leading-tight">
              {config.callToAction}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
