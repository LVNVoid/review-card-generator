"use client";

import * as React from "react";
import { generateQrSvgString, getCssTokenValue } from "@/lib/qr-generator";

interface QrRendererProps {
  url: string;
  logoDataUrl?: string;
  size?: number; // visual size in px
  darkColor?: string;
  lightColor?: string;
}

export function QrRenderer({
  url,
  logoDataUrl,
  size = 180,
  darkColor,
  lightColor,
}: QrRendererProps) {
  const [svgHtml, setSvgHtml] = React.useState<string>("");

  React.useEffect(() => {
    let isMounted = true;
    const computedDark = darkColor || getCssTokenValue("--color-card-dark", "#" + "121214");
    const computedLight = lightColor || getCssTokenValue("--color-card-white", "#" + "ffffff");

    generateQrSvgString({
      url: url || "https://google.com",
      darkColor: computedDark,
      lightColor: computedLight,
    }).then((svg) => {
      if (isMounted) {
        const responsiveSvg = svg.replace(
          "<svg ",
          `<svg width="100%" height="100%" style="display:block;" `
        );
        setSvgHtml(responsiveSvg);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [url, darkColor, lightColor]);

  const logoSize = Math.round(size * 0.22); // Max 22% for ECC Level H compliance

  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      {svgHtml ? (
        <div
          className="w-full h-full [&>svg]:w-full [&>svg]:h-full rounded-xl overflow-hidden"
          dangerouslySetInnerHTML={{ __html: svgHtml }}
        />
      ) : (
        <div className="w-full h-full rounded-xl animate-pulse flex items-center justify-center bg-surface-muted">
          <span className="text-[10px] text-secondary">Loading QR...</span>
        </div>
      )}

      {/* Embedded Center Logo */}
      {logoDataUrl && svgHtml && (
        <div
          className="absolute inset-0 m-auto flex items-center justify-center rounded-lg shadow-md border border-border overflow-hidden bg-card-white"
          style={{ width: logoSize, height: logoSize }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoDataUrl}
            alt="Center Logo"
            className="w-full h-full object-contain p-1"
          />
        </div>
      )}
    </div>
  );
}
