"use client";

import * as React from "react";
import { CardConfig, CARD_SIZES } from "@/types/card";
import { GoogleOfficialCard } from "./templates/google-official-card";
import { DarkAcrylicCard } from "./templates/dark-acrylic-card";
import { MinimalistCard } from "./templates/minimalist-card";

interface CardCanvasProps {
  config: CardConfig;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export function CardCanvas({ config, cardRef }: CardCanvasProps) {
  const sizeConfig = CARD_SIZES[config.sizeId];

  // Base canvas pixel dimensions (scaling 4.8px per mm for crisp on-screen preview)
  const pxPerMm = 4.8;
  const widthPx = Math.round(sizeConfig.widthMm * pxPerMm);
  const heightPx = Math.round(sizeConfig.heightMm * pxPerMm);

  const renderTemplate = () => {
    switch (config.themeId) {
      case "dark-acrylic":
        return <DarkAcrylicCard config={config} />;
      case "minimalist":
        return <MinimalistCard config={config} />;
      case "google-official":
      default:
        return <GoogleOfficialCard config={config} />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 sm:p-10 lg:p-12">
      {/* Physical Dimension Indicators */}
      <div className="flex items-center justify-between w-full max-w-[500px] mb-4 text-xs font-mono text-secondary">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-google-green animate-pulse" />
          <span className="text-primary font-medium">SKALA CETAK AKTUAL</span>
        </span>
        <span className="bg-surface px-3 py-1 rounded-full border border-border text-secondary">
          {sizeConfig.widthMm} × {sizeConfig.heightMm} mm
        </span>
      </div>

      {/* Live Card Container Studio Stage */}
      <div
        className="relative flex items-center justify-center p-4 sm:p-6 rounded-3xl bg-surface/60 border border-border/70 shadow-2xl backdrop-blur max-w-full overflow-auto"
      >
        <div
          ref={cardRef}
          style={{
            width: `${widthPx}px`,
            height: `${heightPx}px`,
            maxWidth: "100%",
          }}
          className="rounded-2xl overflow-hidden shadow-2xl transition-all"
        >
          {renderTemplate()}
        </div>
      </div>

      {/* Print Notes Guide */}
      <p className="mt-5 text-center text-xs text-secondary max-w-md leading-relaxed">
        Format PDF diekspor dalam rasio fisik 1:1 vektor tajam (300 DPI), siap dicetak langsung di bahan PVC, akrilik standee, atau stiker etalase.
      </p>
    </div>
  );
}
