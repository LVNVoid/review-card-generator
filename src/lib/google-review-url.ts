/**
 * Utility to parse, validate, and build Google Review URLs
 * Guarantees direct opening of the Google 5-Star Write Review dialog
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

export function isHexFeatureId(input: string): boolean {
  const trimmed = sanitizeReviewInput(input);
  return /^0x[0-9a-fA-F]+:0x[0-9a-fA-F]+$/.test(trimmed);
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

export function extractHexFeatureIdFromUrl(url: string): string | null {
  const match = url.match(/!1s(0x[0-9a-fA-F]+:0x[0-9a-fA-F]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}

export function isDirectReviewUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (
      parsed.hostname.includes("google.") &&
      (parsed.pathname.includes("writereview") || parsed.pathname.includes("/review"))
    ) {
      return true;
    }
    if (
      parsed.hostname === "g.page" &&
      (parsed.pathname.endsWith("/review") || parsed.pathname.endsWith("/review/"))
    ) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Transforms any Google Maps place URL, Place ID, Hex ID, or g.page link into a direct write-review URL.
 */
export function transformToDirectReviewUrl(input: string): {
  directUrl: string;
  isDirectReview: boolean;
} {
  const sanitized = sanitizeReviewInput(input);
  if (!sanitized) {
    return { directUrl: "", isDirectReview: false };
  }

  // 1. Direct Place ID
  if (isPlaceId(sanitized)) {
    return {
      directUrl: buildReviewUrlFromPlaceId(sanitized),
      isDirectReview: true,
    };
  }

  // 2. Direct Hex Feature ID string (0x...:0x...)
  if (isHexFeatureId(sanitized)) {
    return {
      directUrl: buildReviewUrlFromPlaceId(sanitized),
      isDirectReview: true,
    };
  }

  try {
    const parsed = new URL(sanitized);

    // 3. Already a write-review URL
    if (
      parsed.hostname.includes("google.") &&
      (parsed.pathname.includes("writereview") || parsed.pathname.includes("/review"))
    ) {
      return { directUrl: sanitized, isDirectReview: true };
    }

    // 4. g.page short link (append /review)
    if (parsed.hostname === "g.page") {
      if (parsed.pathname.endsWith("/review") || parsed.pathname.endsWith("/review/")) {
        return { directUrl: sanitized, isDirectReview: true };
      }
      const cleanPath = parsed.pathname.replace(/\/+$/, "");
      return {
        directUrl: `https://g.page${cleanPath}/review`,
        isDirectReview: true,
      };
    }

    // 5. URL with placeid param
    const placeIdParam = parsed.searchParams.get("placeid");
    if (placeIdParam) {
      return {
        directUrl: buildReviewUrlFromPlaceId(placeIdParam),
        isDirectReview: true,
      };
    }

    // 6. Google Maps URL with !1s0x...:0x...
    const hexId = extractHexFeatureIdFromUrl(sanitized);
    if (hexId) {
      return {
        directUrl: buildReviewUrlFromPlaceId(hexId),
        isDirectReview: true,
      };
    }

    // 7. General maps or other URL
    return { directUrl: sanitized, isDirectReview: false };
  } catch {
    return { directUrl: sanitized, isDirectReview: false };
  }
}

export function resolveReviewUrl(input: string): {
  targetUrl: string;
  isValid: boolean;
  type: "place_id" | "direct_review_url" | "maps_url" | "invalid";
  isDirectReview: boolean;
  errorMessage?: string;
} {
  const sanitized = sanitizeReviewInput(input);

  if (!sanitized) {
    return {
      targetUrl: "",
      isValid: false,
      type: "invalid",
      isDirectReview: false,
      errorMessage: "Input tidak boleh kosong",
    };
  }

  // 1. Direct Place ID
  if (isPlaceId(sanitized) || isHexFeatureId(sanitized)) {
    const direct = buildReviewUrlFromPlaceId(sanitized);
    return {
      targetUrl: direct,
      isValid: true,
      type: "place_id",
      isDirectReview: true,
    };
  }

  // 2. URL parsing & transformation
  try {
    const parsed = new URL(sanitized);

    // Try direct transformation first
    const transformed = transformToDirectReviewUrl(sanitized);
    if (transformed.isDirectReview) {
      return {
        targetUrl: transformed.directUrl,
        isValid: true,
        type: "direct_review_url",
        isDirectReview: true,
      };
    }

    // Short links like g.page/r/... or maps.app.goo.gl/...
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
        isDirectReview: false,
      };
    }

    // Standard HTTP/HTTPS URL
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return {
        targetUrl: sanitized,
        isValid: true,
        type: "direct_review_url",
        isDirectReview: false,
      };
    }

    return {
      targetUrl: sanitized,
      isValid: false,
      type: "invalid",
      isDirectReview: false,
      errorMessage: "Gunakan URL Google Maps atau Place ID yang valid",
    };
  } catch {
    return {
      targetUrl: sanitized,
      isValid: false,
      type: "invalid",
      isDirectReview: false,
      errorMessage: "Format link tidak valid. Masukkan URL lengkap (https://...) atau Google Place ID.",
    };
  }
}
