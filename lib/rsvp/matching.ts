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
