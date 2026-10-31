import { createClient } from "@supabase/supabase-js";
import { DEFAULT_EVENT } from "../lib/event/defaults";
import { ALL_SEED_GUESTS } from "../lib/rsvp/guest-seed";
import { normalizeName } from "../lib/rsvp/normalize";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Setup pendente: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  const { data: event, error } = await supabase
    .from("events")
    .select("id")
    .eq("slug", DEFAULT_EVENT.slug)
    .single();
  if (error || !event) {
    throw new Error("Evento não encontrado. Rode a migration antes do seed.");
  }

  const { data: existing } = await supabase
    .from("guests")
    .select("id, seed_key")
    .eq("event_id", event.id)
    .not("seed_key", "is", null);

  const byKey = new Map(
    (existing ?? []).map((row) => [row.seed_key as string, row.id as string]),
  );
  let inserted = 0;
  let updated = 0;

  for (const guest of ALL_SEED_GUESTS) {
    const row = {
      event_id: event.id,
      group_owner: guest.groupOwner,
      display_name: guest.displayName,
      normalized_name: normalizeName(guest.displayName),
      seed_key: guest.seedKey,
      official_status: guest.officialStatus,
      confirmation_source: guest.confirmationSource,
      notes: guest.notes ?? null,
    };
    const existingId = byKey.get(guest.seedKey);
    if (existingId) {
      const { error: updateError } = await supabase
        .from("guests")
        .update({
          display_name: row.display_name,
          normalized_name: row.normalized_name,
          notes: row.notes,
        })
        .eq("id", existingId);
      if (updateError) throw updateError;
      updated += 1;
    } else {
      const { error: insertError } = await supabase.from("guests").insert(row);
      if (insertError) throw insertError;
      inserted += 1;
    }
  }

  console.log(
    `Seed concluído: ${ALL_SEED_GUESTS.length} convidados na lista-base, ${inserted} inseridos, ${updated} atualizados.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
