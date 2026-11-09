import { getAdminUser } from "@/lib/auth/admin";
import { DEFAULT_EVENT } from "@/lib/event/defaults";
import { computeGuestStats, mergeLocalGuestList, toAdminGuest } from "@/lib/rsvp/admin-view";
import { toCsv } from "@/lib/rsvp/csv";
import { canUseLocalRsvp, listLocalRsvps } from "@/lib/rsvp/local-store";
import { companionLabel, guestConfirmedViaSite } from "@/lib/rsvp/seats";
import { createServiceClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) {
    return Response.json({ message: "Não autorizado." }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    if (!canUseLocalRsvp()) {
      return Response.json({ message: "Setup pendente." }, { status: 503 });
    }
    const guests = mergeLocalGuestList(await listLocalRsvps());
    return csvResponse(guests);
  }

  const service = createServiceClient();
  const { data: event } = await service
    .from("events")
    .select("id")
    .eq("slug", DEFAULT_EVENT.slug)
    .single();
  const { data: guests } = await service
    .from("guests")
    .select(
      "id, display_name, group_owner, official_status, confirmation_source, preferred_contact, notes, updated_at, seed_key, bringing_companion, companion_name, companion_is_child",
    )
    .eq("event_id", event?.id)
    .is("deleted_at", null)
    .order("group_owner")
    .order("display_name");

  return csvResponse(
    (guests ?? []).map((guest) =>
      toAdminGuest({
        id: String(guest.id),
        display_name: String(guest.display_name ?? ""),
        group_owner: guest.group_owner as "Alex" | "Paloma",
        official_status: String(guest.official_status ?? ""),
        confirmation_source: String(guest.confirmation_source ?? ""),
        preferred_contact: (guest.preferred_contact as string | null) ?? null,
        notes: (guest.notes as string | null) ?? null,
        updated_at: String(guest.updated_at ?? ""),
        seed_key: (guest.seed_key as string | null) ?? null,
        bringing_companion: Boolean(guest.bringing_companion),
        companion_name: (guest.companion_name as string | null) ?? null,
        companion_is_child: Boolean(guest.companion_is_child),
      }),
    ),
  );
}

function csvResponse(guests: ReturnType<typeof toAdminGuest>[]) {
  const confirmed = guests.filter((guest) =>
    guestConfirmedViaSite({
      officialStatus: guest.official_status,
      confirmationSource: guest.confirmation_source,
    }),
  );
  const stats = computeGuestStats(guests);
  const csv = toCsv(
    [
      "Nome",
      "Lista",
      "Acompanhante",
      "Acompanhante e crianca",
      "Contato",
      "Atualizado em",
      "Lugares totais",
    ],
    confirmed.map((guest, index) => [
      guest.display_name,
      guest.group_owner,
      companionLabel({
        officialStatus: guest.official_status,
        confirmationSource: guest.confirmation_source,
        bringingCompanion: guest.bringing_companion,
        companionName: guest.companion_name,
        companionIsChild: guest.companion_is_child,
      }),
      guest.companion_is_child ? "sim" : "nao",
      guest.preferred_contact ?? "",
      guest.updated_at,
      index === 0 ? String(stats.seats) : "",
    ]),
  );

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="confirmados-alex-paloma.csv"',
      "Cache-Control": "no-store",
    },
  });
}
