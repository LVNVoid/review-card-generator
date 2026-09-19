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
  // Ensure all custom fonts (Google Sans, etc.) are fully loaded before rasterization
  if (typeof document !== "undefined" && document.fonts) {
    await document.fonts.ready;
  }

  // Temporarily reset CSS scale transform to guarantee 1:1 crisp 300+ DPI physical export
  const originalTransform = element.style.transform;
  const originalTransformOrigin = element.style.transformOrigin;
  element.style.transform = "none";

  try {
    return await toPng(element, {
      pixelRatio: 4,
      cacheBust: true,
      quality: 1.0,
      backgroundColor: "transparent",
    });
  } finally {
    element.style.transform = originalTransform;
    element.style.transformOrigin = originalTransformOrigin;
  }
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
