import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_CODE_COOKIE = "ap_admin_gate";

function getConfiguredCode() {
  return (process.env.ADMIN_ACCESS_CODE ?? "").trim();
}

export function adminCodeConfigured() {
  return getConfiguredCode().length > 0;
}

export function createAdminSessionToken(code: string) {
  return createHash("sha256").update(`alex-paloma-admin:${code.trim()}`).digest("hex");
}

export function codeMatches(input: string) {
  const expected = getConfiguredCode();
  if (!expected) return false;
  const left = Buffer.from(input.trim());
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export async function hasAdminCodeSession() {
  if (!adminCodeConfigured()) return false;
  const jar = await cookies();
  const token = jar.get(ADMIN_CODE_COOKIE)?.value;
  if (!token) return false;
  const expected = createAdminSessionToken(getConfiguredCode());
  const left = Buffer.from(token);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function adminCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 30) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
