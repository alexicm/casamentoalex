import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/admin/DashboardClient";
import { getAdminUser } from "@/lib/auth/admin";
import { DEFAULT_EVENT } from "@/lib/event/defaults";
import { createServiceClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="admin-shell paper-bg min-h-svh px-5 py-16">
        <div className="mx-auto max-w-xl rounded-[28px] border border-olive/10 bg-paper-light p-8">
          <h1 className="font-serif text-3xl text-olive">Painel administrativo</h1>
          <p className="mt-4 text-sm leading-relaxed text-ink/80">
            O Supabase ainda não está configurado. Preencha `.env.local`, rode a
            migration e o seed, crie um usuário Auth e registre o `user_id` em
            `admin_profiles`.
          </p>
        </div>
      </main>
    );
  }

  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");

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

  const list = guests ?? [];
  const historicalConfirmed = list.filter(
    (guest) =>
      guest.official_status === "manually_confirmed" &&
      guest.confirmation_source === "import",
  ).length;
  const siteConfirmed = list.filter(
    (guest) =>
      guest.official_status === "confirmed_via_token" ||
      (guest.official_status === "manually_confirmed" &&
        guest.confirmation_source !== "import"),
  ).length;
  const declined = list.filter((guest) => guest.official_status === "declined").length;
  const awaiting = list.filter((guest) => guest.official_status === "awaiting_response").length;
  const pendingReview = (submissions ?? []).filter(
    (item) => item.review_status === "pending_review" || item.review_status === "duplicate_flagged",
  ).length;
  const responded = historicalConfirmed + siteConfirmed + declined;

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
      stats={{
        total: list.length,
        historicalConfirmed,
        awaiting,
        siteConfirmed,
        declined,
        pendingReview,
        responseRate: list.length ? Math.round((responded / list.length) * 100) : 0,
      }}
    />
  );
}
