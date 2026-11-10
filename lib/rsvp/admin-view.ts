import { ALL_SEED_GUESTS } from "@/lib/rsvp/guest-seed";
import type { LocalSubmission } from "@/lib/rsvp/local-store";
import { companionCounts } from "@/lib/rsvp/matching";
import { guestConfirmedViaSite, guestSeatCount } from "@/lib/rsvp/seats";

export type AdminGuest = {
  id: string;
  display_name: string;
  group_owner: "Alex" | "Paloma";
  official_status: string;
  confirmation_source: string;
  preferred_contact: string | null;
  notes: string | null;
  updated_at: string;
  seed_key: string | null;
  bringing_companion: boolean;
  companion_name: string | null;
  companion_is_child: boolean;
};

export function toAdminGuest(row: {
  id: string;
  display_name: string;
  group_owner: "Alex" | "Paloma";
  official_status: string;
  confirmation_source: string;
  preferred_contact: string | null;
  notes: string | null;
  updated_at: string;
  seed_key: string | null;
  bringing_companion?: boolean | null;
  companion_name?: string | null;
  companion_is_child?: boolean | null;
}): AdminGuest {
  return {
    id: row.id,
    display_name: row.display_name,
    group_owner: row.group_owner,
    official_status: row.official_status,
    confirmation_source: row.confirmation_source,
    preferred_contact: row.preferred_contact,
    notes: row.notes,
    updated_at: row.updated_at,
    seed_key: row.seed_key,
    bringing_companion: Boolean(row.bringing_companion),
    companion_name: row.companion_name ?? null,
    companion_is_child: Boolean(row.companion_is_child),
  };
}

export function mergeLocalGuestList(submissions: LocalSubmission[]): AdminGuest[] {
  const byKey = new Map(submissions.map((row) => [row.guestSeedKey, row]));
  const fromSeed = ALL_SEED_GUESTS.map((guest) => {
    const local = byKey.get(guest.seedKey);
    return {
      id: guest.seedKey,
      display_name: guest.displayName,
      group_owner: guest.groupOwner,
      official_status: local
        ? local.attending
          ? "confirmed_via_token"
          : "declined"
        : guest.officialStatus,
      confirmation_source: local ? "public_form" : guest.confirmationSource,
      preferred_contact: local?.contact ?? null,
      notes: guest.notes ?? null,
      updated_at: local?.createdAt ?? "",
      seed_key: guest.seedKey,
      bringing_companion: local?.bringingCompanion ?? false,
      companion_name: local?.companionName ?? null,
      companion_is_child: local?.companionIsChild ?? false,
    };
  });
  const walkIns = submissions
    .filter((row) => row.guestSeedKey.startsWith("walk-in:"))
    .map((row) => ({
      id: row.guestSeedKey,
      display_name: row.guestDisplayName || row.fullName,
      group_owner: "Alex" as const,
      official_status: row.attending ? "confirmed_via_token" : "declined",
      confirmation_source: "public_form",
      preferred_contact: row.contact,
      notes: "Cadastro pelo formulário",
      updated_at: row.createdAt,
      seed_key: row.guestSeedKey,
      bringing_companion: row.bringingCompanion,
      companion_name: row.companionName,
      companion_is_child: row.companionIsChild,
    }));
  return [...fromSeed, ...walkIns];
}

export function computeGuestStats(list: AdminGuest[]) {
  const historicalConfirmed = list.filter(
    (guest) =>
      guest.official_status === "manually_confirmed" &&
      guest.confirmation_source === "import",
  ).length;
  const siteConfirmedList = list.filter((guest) =>
    guestConfirmedViaSite({
      officialStatus: guest.official_status,
      confirmationSource: guest.confirmation_source,
    }),
  );
  const siteConfirmed = siteConfirmedList.length;
  const declined = list.filter((guest) => guest.official_status === "declined").length;
  const awaiting = list.filter((guest) => guest.official_status === "awaiting_response").length;
  const adultCompanions = siteConfirmedList.filter((guest) =>
    companionCounts(guest.bringing_companion, guest.companion_is_child),
  ).length;
  const children = siteConfirmedList.filter(
    (guest) => guest.bringing_companion && guest.companion_is_child,
  ).length;
  const seats = siteConfirmedList.reduce(
    (sum, guest) =>
      sum +
      guestSeatCount({
        officialStatus: guest.official_status,
        bringingCompanion: guest.bringing_companion,
        companionIsChild: guest.companion_is_child,
      }),
    0,
  );
  const responded = historicalConfirmed + siteConfirmed + declined;

  return {
    total: list.length,
    historicalConfirmed,
    awaiting,
    siteConfirmed,
    declined,
    seats,
    adultCompanions,
    children,
    responseRate: list.length ? Math.round((responded / list.length) * 100) : 0,
  };
}
