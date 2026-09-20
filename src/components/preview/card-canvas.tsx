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
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);

  // Base physical dimensions (scaling 4.8px per mm for 1:1 crisp display)
  const pxPerMm = 4.8;
  const widthPx = Math.round(sizeConfig.widthMm * pxPerMm);
  const heightPx = Math.round(sizeConfig.heightMm * pxPerMm);

  // Calculate dynamic responsive scale to prevent any clipping on small mobile viewports
  React.useEffect(() => {
    if (!stageRef.current) return;

    const updateScale = (containerWidth: number) => {
      const availableWidth = containerWidth - 12; // Safe padding allowance
      if (availableWidth > 0 && availableWidth < widthPx) {
        setScale(Number((availableWidth / widthPx).toFixed(4)));
      } else {
        setScale(1);
      }
    };

    // Use ResizeObserver to reliably detect when mobile tab switches from Editor to Preview
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          updateScale(entry.contentRect.width);
        }
      }
    });

    observer.observe(stageRef.current);

    // Initial check
    if (stageRef.current.clientWidth > 0) {
      updateScale(stageRef.current.clientWidth);
    }

    return () => observer.disconnect();
  }, [widthPx]);

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
    <div ref={stageRef} className="flex items-center justify-center w-full py-4 sm:py-6 overflow-hidden">
      <div
        style={{
          width: `${Math.round(widthPx * scale)}px`,
          height: `${Math.round(heightPx * scale)}px`,
          position: "relative",
          flexShrink: 0,
          transition: "width 0.2s ease, height 0.2s ease",
        }}
      >
        <div
          ref={cardRef}
          style={{
            width: `${widthPx}px`,
            height: `${heightPx}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
          className="rounded-2xl overflow-hidden shadow-2xl transition-shadow"
        >
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}
