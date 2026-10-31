import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export function createInviteToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashInviteToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function tokensMatch(token: string, storedHash: string): boolean {
  const hashed = hashInviteToken(token);
  const a = Buffer.from(hashed);
  const b = Buffer.from(storedHash);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
