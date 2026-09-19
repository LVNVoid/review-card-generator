"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { CardConfig, CARD_SIZES } from "@/types/card";
import { downloadCardAsPdf, downloadCardAsPng } from "@/lib/export-service";
import { FileDown, ImageDown, Loader2 } from "lucide-react";

interface ExportToolbarProps {
  config: CardConfig;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export function ExportToolbar({ config, cardRef }: ExportToolbarProps) {
  const [isExportingPdf, setIsExportingPdf] = React.useState(false);
  const [isExportingPng, setIsExportingPng] = React.useState(false);

  const getSafeFilename = () => {
    const raw = config.businessName || "google-review-card";
    const slug = raw.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return `${slug}-${config.sizeId}`;
  };

  const handleExportPdf = async () => {
    if (!cardRef.current) return;
    setIsExportingPdf(true);
    try {
      const sizeConfig = CARD_SIZES[config.sizeId];
      await downloadCardAsPdf({
        element: cardRef.current,
        size: sizeConfig,
        filename: getSafeFilename(),
      });
    } catch (err) {
      console.error("PDF export error:", err);
      alert("Gagal mengekspor PDF. Pastikan browser mengizinkan unduhan.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportPng = async () => {
    if (!cardRef.current) return;
    setIsExportingPng(true);
    try {
      const sizeConfig = CARD_SIZES[config.sizeId];
      await downloadCardAsPng({
        element: cardRef.current,
        size: sizeConfig,
        filename: getSafeFilename(),
      });
    } catch (err) {
      console.error("PNG export error:", err);
      alert("Gagal mengekspor PNG. Silakan coba lagi.");
    } finally {
      setIsExportingPng(false);
    }
  };

  return (
    <div className="w-full flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-border">
      <Button
        type="button"
        variant="primary"
        size="lg"
        onClick={handleExportPdf}
        disabled={isExportingPdf || isExportingPng}
        className="w-full sm:flex-1 min-h-[48px]"
      >
        {isExportingPdf ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Membuat PDF Siap Cetak...</span>
          </>
        ) : (
          <>
            <FileDown className="w-4 h-4" />
            <span>Download PDF (300 DPI Cetak)</span>
          </>
        )}
      </Button>

      <Button
        type="button"
        variant="secondary"
        size="lg"
        onClick={handleExportPng}
        disabled={isExportingPdf || isExportingPng}
        className="w-full sm:w-auto min-h-[48px]"
      >
        {isExportingPng ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Memproses PNG...</span>
          </>
        ) : (
          <>
            <ImageDown className="w-4 h-4" />
            <span>Download PNG HD</span>
          </>
        )}
      </Button>
    </div>
  );
}
