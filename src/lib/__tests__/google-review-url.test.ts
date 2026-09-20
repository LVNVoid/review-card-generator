import assert from "node:assert";
import {
  isPlaceId,
  isHexFeatureId,
  hexFeatureIdToPlaceId,
  buildReviewUrlFromPlaceId,
  transformToDirectReviewUrl,
  resolveReviewUrl,
} from "../google-review-url";

// Test 1: Place ID Detection
const testPlaceId = "ChIJN1t_tDeuEmsRUsoyG83frY4";
assert.strictEqual(isPlaceId(testPlaceId), true);
assert.strictEqual(isPlaceId("https://google.com"), false);
assert.strictEqual(isPlaceId("abc"), false);

// Test 2: Hex Feature ID Detection
const hexId = "0x2e69f5d2e764b12d:0x3ee620aa44b7faaa";
assert.strictEqual(isHexFeatureId(hexId), true);

// Test 3: Hex Feature ID to Google Place ID conversion (Protobuf)
const convertedSydney = hexFeatureIdToPlaceId("0x6b12ae37b47f5b37:0x8eaddfcd1b32ca52");
assert.strictEqual(convertedSydney, "ChIJN1t_tDeuEmsRUsoyG83frY4");

const convertedThamrin = hexFeatureIdToPlaceId("0x2e69f42bedda3f71:0xd6b2a6c7d8e91a9f");
assert.strictEqual(convertedThamrin, "ChIJcT_a7Sv0aS4Rnxrp2MemstY");

// Test 4: URL resolution from Place ID
const resolvedFromId = resolveReviewUrl(testPlaceId);
assert.strictEqual(resolvedFromId.isValid, true);
assert.strictEqual(resolvedFromId.isDirectReview, true);
assert.strictEqual(
  resolvedFromId.targetUrl,
  `https://search.google.com/local/writereview?placeid=${testPlaceId}`
);

// Test 5: Transformation from Google Maps full URL with !1s hex id -> converted to base64 Place ID
const mapsUrl =
  "https://www.google.com/maps/place/Monumen+Nasional/@-6.1753924,106.8271528,17z/data=!3m1!4b1!4m6!3m5!1s0x2e69f5d2e764b12d:0x3ee620aa44b7faaa!8m2!3d-6.1753924!4d106.8271528!16zL20vMDJ2MTVy?entry=ttu";
const transformedMaps = transformToDirectReviewUrl(mapsUrl);
assert.strictEqual(transformedMaps.isDirectReview, true);
assert.strictEqual(
  transformedMaps.directUrl,
  "https://search.google.com/local/writereview?placeid=ChIJLbFk59L1aS4Rqvq3RKog5j4"
);

// Test 6: Transformation from g.page URL (auto-append /review)
const gPageUrl = "https://g.page/r/CbXxXxXxXxXxEB0";
const transformedGPage = transformToDirectReviewUrl(gPageUrl);
assert.strictEqual(transformedGPage.isDirectReview, true);
assert.strictEqual(
  transformedGPage.directUrl,
  "https://g.page/r/CbXxXxXxXxXxEB0/review"
);

// Test 7: Auto-healing existing URL with hex placeid in query
const hexQueryUrl = "https://search.google.com/local/writereview?placeid=0x2e69f42bedda3f71:0xd6b2a6c7d8e91a9f";
const healed = transformToDirectReviewUrl(hexQueryUrl);
assert.strictEqual(healed.isDirectReview, true);
assert.strictEqual(
  healed.directUrl,
  "https://search.google.com/local/writereview?placeid=ChIJcT_a7Sv0aS4Rnxrp2MemstY"
);

// Test 8: Resolution from invalid string
const resolvedInvalid = resolveReviewUrl("bukan-url-dan-bukan-id");
assert.strictEqual(resolvedInvalid.isValid, false);
assert.strictEqual(resolvedInvalid.isDirectReview, false);

console.log("✓ All direct review URL and Protobuf Place ID tests passed!");
