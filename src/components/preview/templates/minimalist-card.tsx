"use client";

import * as React from "react";
import { CardConfig, CardSizeId } from "@/types/card";
import { GoogleLogo, GoogleReviewStars, NfcWaveIcon } from "@/components/ui/google-icons";
import { QrRenderer } from "../qr-renderer";
import { cn } from "@/lib/utils";

interface TemplateProps {
  config: CardConfig;
}

function getCardMetrics(sizeId: CardSizeId) {
  switch (sizeId) {
    case "pvc-cr80-h":
      return { qrSize: 112, isHorizontal: true, padding: "14px 18px" };
    case "pvc-cr80-v":
      return { qrSize: 120, isHorizontal: false, padding: "16px 14px" };
    case "standee-a6":
      return { qrSize: 210, isHorizontal: false, padding: "28px 24px" };
    case "standee-a7":
      return { qrSize: 150, isHorizontal: false, padding: "20px 18px" };
    case "sticker-square":
      return { qrSize: 125, isHorizontal: false, padding: "14px 14px" };
    default:
      return { qrSize: 120, isHorizontal: false, padding: "16px 16px" };
  }
}

export function MinimalistCard({ config }: TemplateProps) {
  const metrics = getCardMetrics(config.sizeId);
  const isHorizontal = metrics.isHorizontal;
  const isSquare = config.sizeId === "sticker-square";

  return (
    <div
      className={cn(
        "relative bg-card-white text-zinc-900 shadow-xl overflow-hidden flex flex-col justify-between select-none transition-all border-2 border-zinc-900 box-border font-google-sans",
        config.includeBleedMarks && "ring-1 ring-offset-2 ring-zinc-900/40"
      )}
      style={{
        width: "100%",
        height: "100%",
        padding: metrics.padding,
      }}
    >
      {/* Bleed Guidelines */}
      {config.includeBleedMarks && (
        <div className="absolute inset-0 pointer-events-none border border-dashed border-zinc-400 m-1 rounded" />
      )}

      {/* Horizontal Layout */}
      {isHorizontal ? (
        <div className="flex items-center justify-between h-full gap-4 w-full">
          <div className="flex-1 flex flex-col justify-between h-full py-0.5 min-w-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <GoogleLogo size={22} />
                <span className="text-[10px] font-bold tracking-widest text-zinc-900 uppercase font-google-sans">
                  RATE & REVIEW
                </span>
                {config.showNfcIcon && (
                  <span className="ml-auto inline-flex items-center gap-1 text-[8px] font-mono font-bold text-zinc-900 bg-zinc-100 px-1.5 py-0.5 border border-zinc-900 shrink-0">
                    <NfcWaveIcon size={10} />
                    <span>NFC</span>
                  </span>
                )}
              </div>

              <h2 className="text-sm font-black text-zinc-900 leading-snug line-clamp-2 pt-0.5 font-google-sans tracking-tight">
                {config.businessName || "Nama Tempat Usaha"}
              </h2>

              <p className="text-[10px] text-zinc-600 font-medium leading-tight line-clamp-1 font-google-sans-text">
                {config.tagline}
              </p>
            </div>

            <div className="space-y-1.5 pt-1 border-t border-zinc-200">
              {config.showRatingStars && (
                <div className="flex items-center gap-1.5">
                  <GoogleReviewStars size={15} />
                  <span className="text-[11px] font-black text-zinc-900 font-google-sans">5.0</span>
                </div>
              )}

              <p className="text-[9px] text-zinc-600 font-normal leading-tight line-clamp-2 font-google-sans-text">
                {config.callToAction}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-2 rounded-xl border border-zinc-900 shrink-0">
            <QrRenderer
              url={config.googleReviewUrl}
              logoDataUrl={config.logoDataUrl}
              size={metrics.qrSize}
            />
            <span className="text-[9px] font-bold tracking-widest text-zinc-900 mt-1.5 text-center font-google-sans">
              {config.isDynamicMode ? "SCAN AKTIVASI" : "SCAN QR"}
            </span>
            {config.isDynamicMode && config.cardId && (
              <span className="text-[7.5px] font-mono text-zinc-500 -mt-0.5">
                ID: {config.cardId}
              </span>
            )}
          </div>
        </div>
      ) : (
        /* Vertical & Square Layout */
        <div className="flex flex-col items-center justify-between h-full text-center w-full min-h-0">
          <div className="space-y-1 w-full flex flex-col items-center shrink-0">
            <div className="flex items-center justify-between w-full mb-0.5 px-0.5">
              <div className="flex items-center gap-1.5">
                <GoogleLogo size={isSquare ? 20 : 24} />
                <span className="text-xs font-bold tracking-widest text-zinc-900 uppercase font-google-sans">
                  RATE & REVIEW
                </span>
              </div>
              {config.showNfcIcon && (
                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 border border-zinc-900">
                  <NfcWaveIcon size={11} />
                  <span>NFC</span>
                </span>
              )}
            </div>

            <h2
              className={cn(
                "font-black text-zinc-900 leading-tight px-1 font-google-sans tracking-tight",
                isSquare ? "text-xs line-clamp-1" : "text-sm sm:text-base line-clamp-2"
              )}
            >
              {config.businessName || "Nama Tempat Usaha"}
            </h2>

            <p className="text-[10px] sm:text-[11px] text-zinc-600 font-medium px-2 line-clamp-1 font-google-sans-text">
              {config.tagline}
            </p>

            {config.showRatingStars && (
              <div className="pt-0.5 flex items-center justify-center gap-1.5">
                <GoogleReviewStars size={isSquare ? 14 : 16} />
                <span className="text-[11px] font-black text-zinc-900 font-google-sans">5.0</span>
              </div>
            )}
          </div>

          <div className="my-auto p-2 rounded-xl border-2 border-zinc-900 flex flex-col items-center justify-center shrink-0">
            <QrRenderer
              url={config.googleReviewUrl}
              logoDataUrl={config.logoDataUrl}
              size={metrics.qrSize}
            />
          </div>

          <div className="w-full space-y-1 shrink-0 pt-1 border-t border-zinc-200">
            <div className="inline-flex items-center justify-center px-4 py-1.5 border border-zinc-900 text-zinc-900 text-[10px] font-bold tracking-wider font-google-sans">
              <span>{config.isDynamicMode ? "SCAN UNTUK AKTIVASI" : "SCAN KODE QR DI ATAS"}</span>
            </div>
            <p className="text-[9px] text-zinc-600 font-medium px-2 leading-tight line-clamp-1 font-google-sans-text">
              {config.callToAction}
            </p>
            {config.isDynamicMode && config.cardId && (
              <p className="text-[7.5px] font-mono font-bold text-zinc-500">
                SERIAL: {config.cardId}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
