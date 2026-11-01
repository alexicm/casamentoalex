import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export function createReceiptToken() {
  return randomBytes(16).toString("base64url");
}

export function hashReceiptToken(token: string) {
  return createHash("sha256").update(`receipt:${token}`).digest("hex");
}

export function receiptsMatch(token: string, storedHash: string) {
  const hashed = hashReceiptToken(token);
  const a = Buffer.from(hashed);
  const b = Buffer.from(storedHash);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
