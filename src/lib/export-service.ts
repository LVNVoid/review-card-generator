import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { CardSizeConfig } from "@/types/card";

export interface ExportOptions {
  element: HTMLElement;
  size: CardSizeConfig;
  filename: string;
}

/**
 * Capture DOM element to 300 DPI PNG Data URL
 */
export async function captureCardToPng(element: HTMLElement): Promise<string> {
  // Use pixel ratio 4 for crisp 300+ DPI print quality
  return toPng(element, {
    pixelRatio: 4,
    cacheBust: true,
    quality: 1.0,
    backgroundColor: "transparent",
  });
}

/**
 * Download High-Res 300 DPI PNG directly
 */
export async function downloadCardAsPng(options: ExportOptions): Promise<void> {
  const { element, filename } = options;
  const dataUrl = await captureCardToPng(element);

  const link = document.createElement("a");
  link.download = `${filename}.png`;
  link.href = dataUrl;
  link.click();
}

/**
 * Export Card as 1:1 Millimeter Print-Ready PDF
 */
export async function downloadCardAsPdf(options: ExportOptions): Promise<void> {
  const { element, size, filename } = options;
  const dataUrl = await captureCardToPng(element);

  const isLandscape = size.widthMm > size.heightMm;
  const orientation = isLandscape ? "landscape" : "portrait";

  const pdf = new jsPDF({
    orientation,
    unit: "mm",
    format: [size.widthMm, size.heightMm],
    compress: true,
  });

  pdf.addImage(dataUrl, "PNG", 0, 0, size.widthMm, size.heightMm);
  pdf.save(`${filename}.pdf`);
}
