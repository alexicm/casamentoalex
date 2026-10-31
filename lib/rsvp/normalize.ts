const MARK_RE = /\p{M}/gu;
const ALLOWED_RE = /[^\p{L}\p{N}\s'-]/gu;

export function normalizeName(value: string): string {
  return value
    .normalize("NFD")
    .replace(MARK_RE, "")
    .replace(ALLOWED_RE, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function isMononym(value: string): boolean {
  return normalizeName(value).split(" ").filter(Boolean).length === 1;
}

export function nameTokenCount(value: string): number {
  return normalizeName(value).split(" ").filter(Boolean).length;
}

export function firstToken(value: string): string {
  return normalizeName(value).split(" ")[0] ?? "";
}

export function composeSubmittedName(firstName: string, lastName: string): string {
  return [firstName, lastName]
    .map((part) => part.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join(" ");
}

export function needsLastName(firstName: string, singleGivenName: boolean): boolean {
  if (singleGivenName) return false;
  return nameTokenCount(firstName) < 2;
}
