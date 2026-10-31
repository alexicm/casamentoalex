import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import { DEFAULT_EVENT } from "@/lib/event/defaults";
import { toCsv } from "@/lib/rsvp/csv";
import { createServiceClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ message: "Setup pendente." }, { status: 503 });
  }
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
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
      "display_name, group_owner, official_status, confirmation_source, preferred_contact, notes, updated_at",
    )
    .eq("event_id", event?.id)
    .is("deleted_at", null)
    .order("group_owner")
    .order("display_name");

  const csv = toCsv(
    ["Nome", "Lista", "Status", "Origem", "Contato", "Observacoes", "Atualizado em"],
    (guests ?? []).map((guest) => [
      String(guest.display_name ?? ""),
      String(guest.group_owner ?? ""),
      String(guest.official_status ?? ""),
      String(guest.confirmation_source ?? ""),
      String(guest.preferred_contact ?? ""),
      String(guest.notes ?? ""),
      String(guest.updated_at ?? ""),
    ]),
  );

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="convidados-alex-paloma.csv"',
      "Cache-Control": "no-store",
    },
  });
}
