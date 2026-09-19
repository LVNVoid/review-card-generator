import assert from "node:assert";
import { generateQrSvgString } from "../qr-generator";

async function testQr() {
  const testUrl = "https://search.google.com/local/writereview?placeid=ChIJ123";
  const svg = await generateQrSvgString({ url: testUrl });
  assert.ok(svg.includes("<svg"), "QR SVG should contain svg tag");
  assert.ok(svg.includes("<path"), "QR SVG should contain path elements");

  console.log("✓ qr-generator SVG tests passed!");
}

testQr().catch((err) => {
  console.error("QR test failed:", err);
  process.exit(1);
});
