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

export function GoogleOfficialCard({ config }: TemplateProps) {
  const metrics = getCardMetrics(config.sizeId);
  const isHorizontal = metrics.isHorizontal;
  const isSquare = config.sizeId === "sticker-square";

  return (
    <div
      className={cn(
        "relative bg-card-white text-zinc-900 shadow-xl overflow-hidden flex flex-col justify-between select-none transition-all box-border font-google-sans",
        config.includeBleedMarks && "ring-1 ring-offset-2 ring-google-red/40"
      )}
      style={{
        width: "100%",
        height: "100%",
        padding: metrics.padding,
      }}
    >
      {/* Bleed Guidelines */}
      {config.includeBleedMarks && (
        <div className="absolute inset-0 pointer-events-none border border-dashed border-google-red/30 m-1 rounded" />
      )}

      {/* Horizontal CR80 Card Layout */}
      {isHorizontal ? (
        <div className="flex items-center justify-between h-full gap-4 w-full">
          {/* Left Column: Branding, Title, Tagline, Stars */}
          <div className="flex-1 flex flex-col justify-between h-full py-0.5 min-w-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <GoogleLogo size={22} />
                <span className="text-[11px] font-bold tracking-wider text-google-blue uppercase font-google-sans">
                  Google Review
                </span>
                {config.showNfcIcon && (
                  <span className="ml-auto inline-flex items-center gap-1 text-[8px] font-google-sans font-bold text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200 shrink-0">
                    <NfcWaveIcon size={10} />
                    <span>NFC</span>
                  </span>
                )}
              </div>

              {config.isDynamicMode ? (
                <div className="space-y-0.5 pt-0.5">
                  <h2 className="text-xs sm:text-[13px] font-black text-zinc-900 leading-snug font-google-sans tracking-tight">
                    {config.tagline || "Beri Ulasan di Google"}
                  </h2>
                  <p className="text-[9.5px] text-zinc-500 font-medium font-google-sans-text leading-tight">
                    Beri rating bintang 5 dan ulasan Anda
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-sm font-black text-zinc-900 leading-snug line-clamp-2 pt-0.5 font-google-sans tracking-tight">
                    {config.businessName || "Nama Tempat Usaha"}
                  </h2>

                  <p className="text-[10px] text-zinc-600 font-medium leading-tight line-clamp-1 font-google-sans-text">
                    {config.tagline}
                  </p>
                </>
              )}
            </div>

            <div className="space-y-1.5 pt-1">
              {config.showRatingStars && (
                <div className="flex items-center gap-1.5">
                  <GoogleReviewStars size={15} />
                  <span className="text-[11px] font-bold text-zinc-800 font-google-sans">5.0</span>
                </div>
              )}

              <p className="text-[9px] text-zinc-500 font-medium leading-tight line-clamp-2 font-google-sans-text">
                {config.callToAction}
              </p>
            </div>
          </div>

          {/* Right Column: QR Code with safe quiet zone */}
          <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-zinc-50 border border-zinc-200 shrink-0 shadow-sm">
            <QrRenderer
              url={config.googleReviewUrl}
              logoDataUrl={config.logoDataUrl}
              size={metrics.qrSize}
            />
            {config.badgeText && (
              <span className="text-[9px] font-bold font-google-sans tracking-wider text-google-blue mt-1.5 text-center">
                {config.badgeText}
              </span>
            )}
            {config.showSerialId && config.cardId && (
              <span className="text-[7.5px] font-google-sans text-zinc-400 -mt-0.5">
                ID: {config.cardId}
              </span>
            )}
          </div>
        </div>
      ) : (
        /* Vertical & Square Layout (Standee A6, A7, PVC Vertical, Square Sticker) */
        <div className="flex flex-col items-center justify-between h-full text-center w-full min-h-0">
          {/* Top Header & Business Info */}
          <div className="space-y-1 w-full flex flex-col items-center shrink-0">
            <div className="flex items-center justify-between w-full mb-0.5 px-0.5">
              <div className="flex items-center gap-1.5">
                <GoogleLogo size={isSquare ? 20 : 24} />
                <span className="text-xs font-bold tracking-wider text-google-blue uppercase font-google-sans">
                  Google Review
                </span>
              </div>
              {config.showNfcIcon && (
                <span className="inline-flex items-center gap-1 text-[9px] font-google-sans font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
                  <NfcWaveIcon size={11} />
                  <span>TAP NFC</span>
                </span>
              )}
            </div>

            {config.isDynamicMode ? (
              <div className="space-y-0.5 px-1 pt-0.5">
                <h2
                  className={cn(
                    "font-black text-zinc-900 leading-tight font-google-sans tracking-tight",
                    isSquare ? "text-xs line-clamp-2" : "text-sm sm:text-base line-clamp-2"
                  )}
                >
                  {config.tagline || "Beri Ulasan di Google"}
                </h2>
                <p className="text-[10px] text-zinc-500 font-medium line-clamp-1 font-google-sans-text">
                  Beri rating bintang 5 dan ulasan Anda
                </p>
              </div>
            ) : (
              <>
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
              </>
            )}

            {config.showRatingStars && (
              <div className="pt-0.5 flex items-center justify-center gap-1.5">
                <GoogleReviewStars size={isSquare ? 14 : 16} />
                <span className="text-[11px] font-bold text-zinc-800 font-google-sans">5.0</span>
              </div>
            )}
          </div>

          {/* Center QR Code Container with guaranteed quiet zone */}
          <div className="my-auto p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-sm flex flex-col items-center justify-center shrink-0">
            <QrRenderer
              url={config.googleReviewUrl}
              logoDataUrl={config.logoDataUrl}
              size={metrics.qrSize}
            />
          </div>

          {/* Bottom Call to Action */}
          <div className="w-full space-y-1 shrink-0 pt-1">
            {config.badgeText && (
              <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-google-blue text-white text-[10px] font-bold font-google-sans tracking-wider shadow-sm">
                <span>{config.badgeText}</span>
              </div>
            )}
            {config.callToAction && (
              <p className="text-[9px] text-zinc-500 font-medium px-2 leading-tight line-clamp-1 font-google-sans-text">
                {config.callToAction}
              </p>
            )}
            {config.showSerialId && config.cardId && (
              <p className="text-[7.5px] font-google-sans font-medium text-zinc-400">
                ID: {config.cardId}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
