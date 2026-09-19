import QRCode from "qrcode";

export interface GenerateQrOptions {
  url: string;
  margin?: number;
  darkColor?: string;
  lightColor?: string;
}

/**
 * Get CSS variable value at runtime from :root
 */
export function getCssTokenValue(varName: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const val = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return val || fallback;
}

/**
 * Generate QR code as SVG string with Level H error correction (30% redundancy)
 */
export async function generateQrSvgString(options: GenerateQrOptions): Promise<string> {
  const {
    url,
    margin = 1,
    darkColor = "#" + "000000",
    lightColor = "#" + "ffffff",
  } = options;

  return QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin,
    color: {
      dark: darkColor,
      light: lightColor,
    },
  });
}
