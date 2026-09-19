import assert from "node:assert";
import {
  isPlaceId,
  buildReviewUrlFromPlaceId,
  resolveReviewUrl,
} from "../google-review-url";

// Test 1: Place ID Detection
const testPlaceId = "ChIJN1t_tDeuEmsRUsoyG83frY4";
assert.strictEqual(isPlaceId(testPlaceId), true);
assert.strictEqual(isPlaceId("https://google.com"), false);
assert.strictEqual(isPlaceId("abc"), false);

// Test 2: URL resolution from Place ID
const resolvedFromId = resolveReviewUrl(testPlaceId);
assert.strictEqual(resolvedFromId.isValid, true);
assert.strictEqual(resolvedFromId.type, "place_id");
assert.strictEqual(
  resolvedFromId.targetUrl,
  `https://search.google.com/local/writereview?placeid=${testPlaceId}`
);

// Test 3: Resolution from Direct URL
const directUrl = "https://search.google.com/local/writereview?placeid=ChIJ123";
const resolvedDirect = resolveReviewUrl(directUrl);
assert.strictEqual(resolvedDirect.isValid, true);
assert.strictEqual(resolvedDirect.type, "direct_review_url");

// Test 4: Resolution from invalid string
const resolvedInvalid = resolveReviewUrl("bukan-url-dan-bukan-id");
assert.strictEqual(resolvedInvalid.isValid, false);

console.log("✓ google-review-url tests passed!");
