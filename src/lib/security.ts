import crypto from "crypto";

export function generateCardId(): string {
  // Generate a clean, human-readable 6-character short ID (e.g., G-8K2A, G-7M9X)
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // base32 without easily confused chars (0, O, 1, I)
  const bytes = crypto.randomBytes(4);
  let id = "G-";
  for (let i = 0; i < 4; i++) {
    id += chars[bytes[i] % chars.length];
  }
  return id;
}

export function hashPin(pin: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(pin, salt, 1000, 32, "sha256").toString("hex");
  return { hash, salt };
}

export function verifyPin(pin: string, hash: string, salt: string): boolean {
  const computed = crypto.pbkdf2Sync(pin, salt, 1000, 32, "sha256").toString("hex");
  return computed === hash;
}
