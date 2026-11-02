import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/admin/DashboardClient";
import { getAdminUser } from "@/lib/auth/admin";
import { DEFAULT_EVENT } from "@/lib/event/defaults";
import { computeGuestStats, mergeLocalGuestList, toAdminGuest } from "@/lib/rsvp/admin-view";
import { canUseLocalRsvp, listLocalRsvps } from "@/lib/rsvp/local-store";
import { createServiceClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");

  if (!isSupabaseConfigured()) {
    if (!canUseLocalRsvp()) {
      return (
        <main className="admin-shell paper-bg min-h-svh px-5 py-16">
          <div className="mx-auto max-w-xl rounded-[28px] border border-olive/10 bg-paper-light p-8">
            <h1 className="font-serif text-3xl text-olive">Painel administrativo</h1>
            <p className="mt-4 text-sm leading-relaxed text-ink/80">
              O Supabase ainda não está configurado. Preencha `.env.local`, rode a
              migration e o seed.
            </p>
          </div>
        </main>
      );
    }

    const guests = mergeLocalGuestList(await listLocalRsvps());
    return (
      <DashboardClient
        localMode
        event={{
          venue_name: DEFAULT_EVENT.venueName,
          venue_address: DEFAULT_EVENT.venueAddress,
          maps_url: DEFAULT_EVENT.mapsUrl,
          starts_at_local: DEFAULT_EVENT.startsAtLocal,
          dress_code_json: DEFAULT_EVENT.dressCode,
        }}
        guests={guests}
        submissions={[]}
        audit={[]}
        stats={{ ...computeGuestStats(guests), pendingReview: 0 }}
      />
    );
  }

  const service = createServiceClient();
  const { data: event } = await service
    .from("events")
    .select("*")
    .eq("slug", DEFAULT_EVENT.slug)
    .single();

  const [{ data: guests }, { data: submissions }, { data: audit }] = await Promise.all([
    service
      .from("guests")
      .select("*")
      .eq("event_id", event?.id)
      .is("deleted_at", null)
      .order("group_owner")
      .order("display_name"),
    service
      .from("rsvp_submissions")
      .select("*")
      .eq("event_id", event?.id)
      .order("submitted_at", { ascending: false }),
    service
      .from("rsvp_audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(40),
  ]);

  const list = (guests ?? []).map((guest) =>
    toAdminGuest({
      id: String(guest.id),
      display_name: String(guest.display_name),
      group_owner: guest.group_owner as "Alex" | "Paloma",
      official_status: String(guest.official_status),
      confirmation_source: String(guest.confirmation_source),
      preferred_contact: (guest.preferred_contact as string | null) ?? null,
      notes: (guest.notes as string | null) ?? null,
      updated_at: String(guest.updated_at ?? ""),
      seed_key: (guest.seed_key as string | null) ?? null,
      bringing_companion: Boolean(guest.bringing_companion),
      companion_name: (guest.companion_name as string | null) ?? null,
      companion_is_child: Boolean(guest.companion_is_child),
    }),
  );
  const pendingReview = (submissions ?? []).filter(
    (item) => item.review_status === "pending_review" || item.review_status === "duplicate_flagged",
  ).length;

  if (!event) {
    return (
      <main className="admin-shell paper-bg min-h-svh px-5 py-16">
        <p>Evento não encontrado. Rode a migration e o seed.</p>
      </main>
    );
  }

  return (
    <DashboardClient
      event={event}
      guests={list}
      submissions={submissions ?? []}
      audit={audit ?? []}
      stats={{ ...computeGuestStats(list), pendingReview }}
    />
  );
}
