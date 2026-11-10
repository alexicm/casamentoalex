import { firstToken, normalizeName } from "@/lib/rsvp/normalize";

export type MatchableGuest = {
  id: string;
  displayName: string;
  normalizedName: string;
};

export type MatchingState = "unmatched" | "suggested" | "ambiguous";

export type MatchSuggestion = {
  state: MatchingState;
  candidates: MatchableGuest[];
  reason: string;
};

export function suggestMatches(
  submittedName: string,
  guests: MatchableGuest[],
): MatchSuggestion {
  const normalized = normalizeName(submittedName);
  if (!normalized) {
    return { state: "unmatched", candidates: [], reason: "empty" };
  }

  const exact = guests.filter((guest) => guest.normalizedName === normalized);
  if (exact.length > 1) {
    return {
      state: "ambiguous",
      candidates: exact,
      reason: "exact-homonym",
    };
  }
  if (exact.length === 1) {
    return {
      state: "suggested",
      candidates: exact,
      reason: "exact",
    };
  }

  const token = firstToken(submittedName);
  const firstNameMatches = guests.filter(
    (guest) => firstToken(guest.normalizedName) === token,
  );
  if (firstNameMatches.length > 1) {
    return {
      state: "ambiguous",
      candidates: firstNameMatches,
      reason: "first-name-homonym",
    };
  }
  if (firstNameMatches.length === 1) {
    return {
      state: "suggested",
      candidates: firstNameMatches,
      reason: "first-name",
    };
  }

  return { state: "unmatched", candidates: [], reason: "no-match" };
}

export const RESPONDED_STATUSES = new Set([
  "manually_confirmed",
  "confirmed_via_token",
  "declined",
]);

/** Quem ainda pode confirmar pelo formulário (lista histórica importada conta). */
export function guestMayConfirmViaForm(status: string, source: string) {
  if (status === "awaiting_response") return true;
  if (status === "manually_confirmed" && source === "import") return true;
  return false;
}

export function resolveListedGuest(
  submittedName: string,
  guests: MatchableGuest[],
): { ok: true; guest: MatchableGuest } | { ok: false; code: "unmatched" | "ambiguous" } {
  const match = suggestMatches(submittedName, guests);
  if (match.state === "suggested" && match.candidates[0]) {
    return { ok: true, guest: match.candidates[0] };
  }
  if (match.state === "ambiguous") {
    return { ok: false, code: "ambiguous" };
  }
  return { ok: false, code: "unmatched" };
}

export function companionCounts(bringing: boolean, isChild: boolean) {
  return bringing && !isChild;
}
