/**
 * Utility to parse, validate, and build Google Review URLs
 */

export function sanitizeReviewInput(input: string): string {
  return input.trim();
}

export function isPlaceId(input: string): boolean {
  const trimmed = sanitizeReviewInput(input);
  // Google Place IDs almost universally begin with "ChIJ", "ChI", "GhI", or "Ei"
  // and are base64-like alphanumeric strings with hyphens and underscores (20 to 50 chars).
  const hasPlaceIdPrefix = /^(ChIJ|ChI|GhI|Ei)/.test(trimmed);
  const isValidChars = /^[A-Za-z0-9_-]{20,50}$/.test(trimmed);
  return hasPlaceIdPrefix && isValidChars && !trimmed.startsWith("http");
}

export function buildReviewUrlFromPlaceId(placeId: string): string {
  const cleanId = sanitizeReviewInput(placeId);
  return `https://search.google.com/local/writereview?placeid=${cleanId}`;
}

export function extractPlaceIdFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const placeIdParam = parsed.searchParams.get("placeid");
    if (placeIdParam) return placeIdParam;
    return null;
  } catch {
    return null;
  }
}

export function resolveReviewUrl(input: string): {
  targetUrl: string;
  isValid: boolean;
  type: "place_id" | "direct_review_url" | "maps_url" | "invalid";
  errorMessage?: string;
} {
  const sanitized = sanitizeReviewInput(input);

  if (!sanitized) {
    return {
      targetUrl: "",
      isValid: false,
      type: "invalid",
      errorMessage: "Input tidak boleh kosong",
    };
  }

  // 1. Check if user directly entered Place ID (e.g., ChIJ...)
  if (isPlaceId(sanitized)) {
    return {
      targetUrl: buildReviewUrlFromPlaceId(sanitized),
      isValid: true,
      type: "place_id",
    };
  }

  // 2. Check if valid URL
  try {
    const parsed = new URL(sanitized);

    // Google review direct write review link
    if (
      parsed.hostname.includes("google.") &&
      (parsed.pathname.includes("writereview") || parsed.pathname.includes("/review"))
    ) {
      return {
        targetUrl: sanitized,
        isValid: true,
        type: "direct_review_url",
      };
    }

    // Short links like g.page/r/.../review or goo.gl/maps/...
    if (
      parsed.hostname === "g.page" ||
      parsed.hostname === "maps.app.goo.gl" ||
      parsed.hostname === "goo.gl" ||
      parsed.hostname.includes("google.com")
    ) {
      return {
        targetUrl: sanitized,
        isValid: true,
        type: "maps_url",
      };
    }

    // Any other standard HTTP/HTTPS URL
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return {
        targetUrl: sanitized,
        isValid: true,
        type: "direct_review_url",
      };
    }

    return {
      targetUrl: sanitized,
      isValid: false,
      type: "invalid",
      errorMessage: "Gunakan URL Google Maps atau Place ID yang valid",
    };
  } catch {
    return {
      targetUrl: sanitized,
      isValid: false,
      type: "invalid",
      errorMessage: "Format link tidak valid. Masukkan URL lengkap (https://...) atau Google Place ID (contoh: ChIJ...).",
    };
  }
}
