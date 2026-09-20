/**
 * Utility to parse, validate, and build Google Review URLs
 * Guarantees direct opening of the Google 5-Star Write Review dialog
 * with standard Google Place ID Protobuf conversion.
 */

function uint8ArrayToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 =
    typeof btoa !== "undefined"
      ? btoa(binary)
      : Buffer.from(binary, "binary").toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Converts Google Hex Feature ID (e.g. 0x2e69f42bedda3f71:0xd6b2a6c7d8e91a9f)
 * into official base64 Google Place ID (e.g. ChIJcT_a7Sv0aS4Rnxrp2MemstY)
 * using Google's 20-byte Protobuf encoding schema:
 * [0x0a, 0x12, 0x09, <8 bytes uint64le>, 0x11, <8 bytes uint64le>]
 */
export function hexFeatureIdToPlaceId(hexFeatureId: string): string | null {
  try {
    const parts = hexFeatureId.trim().split(":");
    if (parts.length !== 2) return null;
    const f1 = BigInt(parts[0]);
    const f2 = BigInt(parts[1]);

    const bytes = new Uint8Array(20);
    const view = new DataView(bytes.buffer);
    bytes[0] = 0x0a; // Field 1 tag (wire type 2, length delimited)
    bytes[1] = 0x12; // Length: 18 bytes (0x12)
    bytes[2] = 0x09; // Subfield 1 tag (wire type 1, fixed64)
    view.setBigUint64(3, f1, true); // little-endian
    bytes[11] = 0x11; // Subfield 2 tag (wire type 1, fixed64)
    view.setBigUint64(12, f2, true); // little-endian

    return uint8ArrayToBase64Url(bytes);
  } catch (err) {
    console.warn("Failed to convert hexFeatureId to placeId:", err);
    return null;
  }
}

export function sanitizeReviewInput(input: string): string {
  return input.trim().replace(/^["']|["']$/g, "");
}

export function isPlaceId(input: string): boolean {
  const trimmed = sanitizeReviewInput(input);
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
      // Reject raw hex format in placeid parameter
      const placeId = parsed.searchParams.get("placeid");
      if (placeId && placeId.startsWith("0x")) {
        return false;
      }
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
  placeId?: string;
} {
  const sanitized = sanitizeReviewInput(input);
  if (!sanitized) {
    return { directUrl: "", isDirectReview: false };
  }

  // 1. Direct standard Place ID (ChIJ...)
  if (isPlaceId(sanitized)) {
    return {
      directUrl: buildReviewUrlFromPlaceId(sanitized),
      isDirectReview: true,
      placeId: sanitized,
    };
  }

  // 2. Direct Hex Feature ID string (0x...:0x...) -> MUST convert to standard base64 ChIJ... Place ID
  if (isHexFeatureId(sanitized)) {
    const convertedPlaceId = hexFeatureIdToPlaceId(sanitized);
    if (convertedPlaceId) {
      return {
        directUrl: buildReviewUrlFromPlaceId(convertedPlaceId),
        isDirectReview: true,
        placeId: convertedPlaceId,
      };
    }
  }

  try {
    const parsed = new URL(sanitized);

    // 3. Already a write-review URL -> check placeid param
    if (
      parsed.hostname.includes("google.") &&
      parsed.pathname.includes("writereview")
    ) {
      const currentPlaceId = parsed.searchParams.get("placeid");
      if (currentPlaceId && isHexFeatureId(currentPlaceId)) {
        const convertedPlaceId = hexFeatureIdToPlaceId(currentPlaceId);
        if (convertedPlaceId) {
          return {
            directUrl: buildReviewUrlFromPlaceId(convertedPlaceId),
            isDirectReview: true,
            placeId: convertedPlaceId,
          };
        }
      }
      return { directUrl: sanitized, isDirectReview: true, placeId: currentPlaceId || undefined };
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
      if (isHexFeatureId(placeIdParam)) {
        const converted = hexFeatureIdToPlaceId(placeIdParam);
        if (converted) {
          return {
            directUrl: buildReviewUrlFromPlaceId(converted),
            isDirectReview: true,
            placeId: converted,
          };
        }
      }
      return {
        directUrl: buildReviewUrlFromPlaceId(placeIdParam),
        isDirectReview: true,
        placeId: placeIdParam,
      };
    }

    // 6. Google Maps URL with !1s0x...:0x... -> convert hex to standard Place ID
    const hexId = extractHexFeatureIdFromUrl(sanitized);
    if (hexId) {
      const convertedPlaceId = hexFeatureIdToPlaceId(hexId);
      if (convertedPlaceId) {
        return {
          directUrl: buildReviewUrlFromPlaceId(convertedPlaceId),
          isDirectReview: true,
          placeId: convertedPlaceId,
        };
      }
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

  // 1. Direct Place ID input (ChIJ...)
  if (isPlaceId(sanitized)) {
    return {
      targetUrl: buildReviewUrlFromPlaceId(sanitized),
      isValid: true,
      type: "place_id",
      isDirectReview: true,
    };
  }

  // 2. Direct Hex Feature ID (0x...:0x...)
  if (isHexFeatureId(sanitized)) {
    const converted = hexFeatureIdToPlaceId(sanitized);
    if (converted) {
      return {
        targetUrl: buildReviewUrlFromPlaceId(converted),
        isValid: true,
        type: "place_id",
        isDirectReview: true,
      };
    }
  }

  // 3. Try to transform
  const transformed = transformToDirectReviewUrl(sanitized);
  if (transformed.isDirectReview) {
    return {
      targetUrl: transformed.directUrl,
      isValid: true,
      type: "direct_review_url",
      isDirectReview: true,
    };
  }

  try {
    const parsed = new URL(sanitized);
    const isGoogleDomain =
      parsed.hostname.includes("google.") ||
      parsed.hostname === "g.page" ||
      parsed.hostname === "goo.gl";

    if (!isGoogleDomain) {
      return {
        targetUrl: sanitized,
        isValid: true,
        type: "maps_url",
        isDirectReview: false,
      };
    }

    return {
      targetUrl: sanitized,
      isValid: true,
      type: "maps_url",
      isDirectReview: false,
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
