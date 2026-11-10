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

function nameTokens(value: string) {
  return normalizeName(value).split(" ").filter((token) => token.length >= 2);
}

function uniqueTokenIndex(guests: MatchableGuest[]) {
  const index = new Map<string, MatchableGuest[]>();
  for (const guest of guests) {
    for (const token of nameTokens(guest.normalizedName)) {
      const list = index.get(token) ?? [];
      list.push(guest);
      index.set(token, list);
    }
  }
  return index;
}

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

  const contained = guests.filter(
    (guest) =>
      normalized.includes(guest.normalizedName) ||
      guest.normalizedName.includes(normalized),
  );
  if (contained.length === 1) {
    return {
      state: "suggested",
      candidates: contained,
      reason: "contained-name",
    };
  }
  if (contained.length > 1) {
    return {
      state: "ambiguous",
      candidates: contained,
      reason: "contained-homonym",
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

  const tokenIndex = uniqueTokenIndex(guests);
  const scores = new Map<string, { guest: MatchableGuest; score: number }>();
  for (const submittedToken of nameTokens(normalized)) {
    const owners = tokenIndex.get(submittedToken) ?? [];
    if (owners.length !== 1 || !owners[0]) continue;
    const current = scores.get(owners[0].id);
    const nextScore = (current?.score ?? 0) + submittedToken.length;
    scores.set(owners[0].id, { guest: owners[0], score: nextScore });
  }
  const ranked = [...scores.values()].sort((a, b) => b.score - a.score);
  if (ranked.length === 1 && ranked[0]) {
    return {
      state: "suggested",
      candidates: [ranked[0].guest],
      reason: "unique-token",
    };
  }
  if (ranked.length > 1 && ranked[0] && ranked[1] && ranked[0].score > ranked[1].score) {
    return {
      state: "suggested",
      candidates: [ranked[0].guest],
      reason: "unique-token-score",
    };
  }
  if (ranked.length > 1) {
    return {
      state: "ambiguous",
      candidates: ranked.map((row) => row.guest),
      reason: "multi-token-hit",
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
