import { NextResponse } from "next/server";
import { DEFAULT_EVENT, formatRsvpDeadline, rsvpDeadlinePassed } from "@/lib/event/defaults";
import { ALL_SEED_GUESTS } from "@/lib/rsvp/guest-seed";
import { canUseLocalRsvp, listedGuestsForMatching, saveLocalRsvp } from "@/lib/rsvp/local-store";
import {
  companionCounts,
  guestMayConfirmViaForm,
  resolveListedGuest,
} from "@/lib/rsvp/matching";
import { normalizeName } from "@/lib/rsvp/normalize";
import { allowRequest, hashIp } from "@/lib/rsvp/rate-limit";
import { createReceiptToken, hashReceiptToken } from "@/lib/rsvp/receipt";
import { hashInviteToken } from "@/lib/rsvp/tokens";
import { createServiceClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured, SETUP_PENDING_MESSAGE } from "@/lib/supabase/env";
import {
  CONSENT_VERSION,
  RSVP_MESSAGES,
  rsvpInputSchema,
} from "@/lib/validators/rsvp";

export async function POST(request: Request) {
  const supabaseReady = isSupabaseConfigured();
  if (!supabaseReady && !canUseLocalRsvp()) {
    return NextResponse.json(
      { message: SETUP_PENDING_MESSAGE, setupPending: true },
      { status: 503 },
    );
  }

  const forwarded = request.headers.get("x-forwarded-for") ?? "unknown";
  const ipHash = hashIp(forwarded.split(",")[0]?.trim() ?? "unknown");
  if (supabaseReady && !allowRequest(ipHash)) {
    return NextResponse.json(
      { message: "Muitas tentativas em pouco tempo. Espere um pouco e tente de novo." },
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ message: "Não foi possível ler sua resposta." }, { status: 400 });
  }

  const parsed = rsvpInputSchema.safeParse(json);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Confira os campos e tente novamente.";
    return NextResponse.json({ message }, { status: 400 });
  }

  const input = parsed.data;
  if (input.website) {
    return NextResponse.json({ message: "Recebemos sua resposta com carinho." }, { status: 200 });
  }

  const deadline = DEFAULT_EVENT.rsvpDeadline;
  if (rsvpDeadlinePassed(deadline)) {
    const label = formatRsvpDeadline(deadline) ?? "a data limite";
    return NextResponse.json(
      {
        message: `O prazo para confirmar era até ${label}. Se precisar ajustar, fale com a gente.`,
      },
      { status: 403 },
    );
  }

  const receipt = input.idempotencyKey
    ? input.idempotencyKey.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48) || createReceiptToken()
    : createReceiptToken();
  const receiptHash = hashReceiptToken(receipt);
  const contact = input.contact?.trim() || null;
  const bringingCompanion = Boolean(input.attending && input.bringingCompanion);
  const companionIsChild = Boolean(bringingCompanion && input.companionIsChild);
  const companionName = bringingCompanion ? input.companionName?.trim() || null : null;
  const displayName = input.fullName.trim();
  const normalized = normalizeName(displayName);

  if (!supabaseReady) {
    const listed = listedGuestsForMatching();
    const localMatch = resolveListedGuest(input.fullName, listed);
    const seed =
      localMatch.ok
        ? ALL_SEED_GUESTS.find((guest) => guest.seedKey === localMatch.guest.id)
        : undefined;
    if (
      seed &&
      !guestMayConfirmViaForm(seed.officialStatus, seed.confirmationSource)
    ) {
      return NextResponse.json({ message: RSVP_MESSAGES.already }, { status: 409 });
    }
    const saved = await saveLocalRsvp({
      guestSeedKey:
        localMatch.ok && seed
          ? localMatch.guest.id
          : `walk-in:${normalized}`,
      guestDisplayName: displayName,
      fullName: displayName,
      attending: input.attending,
      contact,
      receipt,
      receiptHash,
      idempotencyKey: input.idempotencyKey ?? null,
      bringingCompanion,
      companionName,
      companionIsChild,
    });
    if (saved.alreadyAnswered) {
      return NextResponse.json({ message: RSVP_MESSAGES.already }, { status: 409 });
    }
    return NextResponse.json({
      message: input.attending
        ? "Que alegria ter você com a gente."
        : "Vamos sentir sua falta, mas agradecemos por nos avisar.",
      validated: true,
      attending: saved.attending,
      receipt: saved.receipt,
    });
  }

  const supabase = createServiceClient();
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id")
    .eq("slug", DEFAULT_EVENT.slug)
    .maybeSingle();

  if (eventError || !event) {
    return NextResponse.json(
      { message: "Não foi possível enviar agora. Confira sua conexão e tente novamente." },
      { status: 500 },
    );
  }

  const token = input.inviteToken?.trim() || "";

  const { data: guests } = await supabase
    .from("guests")
    .select(
      "id, display_name, normalized_name, invite_token_hash, official_status, confirmation_source, group_owner",
    )
    .eq("event_id", event.id)
    .is("deleted_at", null);

  const guestList = (guests ?? []).map((guest) => ({
    id: guest.id as string,
    displayName: guest.display_name as string,
    normalizedName: guest.normalized_name as string,
    inviteTokenHash: guest.invite_token_hash as string | null,
    officialStatus: guest.official_status as string,
    confirmationSource: guest.confirmation_source as string,
    groupOwner: guest.group_owner as "Alex" | "Paloma",
  }));

  let matched = resolveListedGuest(input.fullName, guestList);
  if (token) {
    const hashed = hashInviteToken(token);
    const tokenGuest = guestList.find((guest) => guest.inviteTokenHash === hashed);
    if (tokenGuest) {
      matched = { ok: true, guest: tokenGuest };
    }
  }

  // Nome livre: só vincula se o match for único; ambíguo ou desconhecido vira cadastro novo.
  let guest =
    matched.ok
      ? (guestList.find((entry) => entry.id === matched.guest.id) ?? null)
      : null;

  if (guest && !guestMayConfirmViaForm(guest.officialStatus, guest.confirmationSource)) {
    return NextResponse.json({ message: RSVP_MESSAGES.already }, { status: 409 });
  }

  if (input.idempotencyKey) {
    const { data: existing } = await supabase
      .from("rsvp_submissions")
      .select("id, attendance_choice, review_status")
      .eq("event_id", event.id)
      .eq("idempotency_key", input.idempotencyKey)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({
        message: "Recebemos sua resposta com carinho. Obrigado por nos contar!",
        validated: true,
        attending: existing.attendance_choice,
        receipt,
      });
    }
  }

  const { data: priorByName } = await supabase
    .from("rsvp_submissions")
    .select("id")
    .eq("event_id", event.id)
    .eq("normalized_submitted_name", normalized)
    .neq("review_status", "discarded")
    .limit(1);
  if (priorByName && priorByName.length > 0) {
    return NextResponse.json({ message: RSVP_MESSAGES.already }, { status: 409 });
  }

  if (guest) {
    const { data: priorByGuest } = await supabase
      .from("rsvp_submissions")
      .select("id")
      .eq("event_id", event.id)
      .eq("guest_id", guest.id)
      .neq("review_status", "discarded")
      .limit(1);
    if (priorByGuest && priorByGuest.length > 0) {
      return NextResponse.json({ message: RSVP_MESSAGES.already }, { status: 409 });
    }
  }

  const nextStatus = input.attending ? "confirmed_via_token" : "declined";
  const confirmationSource = token ? "personal_link" : "public_form";
  let linkedFromList = Boolean(guest);

  if (!guest) {
    const { data: created, error: createError } = await supabase
      .from("guests")
      .insert({
        event_id: event.id,
        group_owner: "Alex",
        display_name: displayName,
        normalized_name: normalized,
        official_status: nextStatus,
        confirmation_source: confirmationSource,
        preferred_contact: contact,
        bringing_companion: bringingCompanion,
        companion_name: companionName,
        companion_is_child: companionIsChild,
        notes: "Cadastro pelo formulário",
      })
      .select("id, display_name, normalized_name, official_status, confirmation_source, group_owner")
      .single();

    if (createError || !created) {
      return NextResponse.json(
        { message: "Não foi possível enviar agora. Confira sua conexão e tente novamente." },
        { status: 500 },
      );
    }

    guest = {
      id: created.id as string,
      displayName: created.display_name as string,
      normalizedName: created.normalized_name as string,
      inviteTokenHash: null,
      officialStatus: created.official_status as string,
      confirmationSource: created.confirmation_source as string,
      groupOwner: created.group_owner as "Alex" | "Paloma",
    };
    linkedFromList = false;
  }

  const { data: submission, error: insertError } = await supabase
    .from("rsvp_submissions")
    .insert({
      event_id: event.id,
      guest_id: guest.id,
      submitted_full_name: displayName,
      normalized_submitted_name: normalized,
      attendance_choice: input.attending,
      optional_contact: contact,
      matching_state: "linked",
      review_status: "linked",
      consent_version: CONSENT_VERSION,
      request_fingerprint_hash: ipHash,
      suggested_guest_ids: [guest.id],
      reviewed_at: new Date().toISOString(),
      receipt_token_hash: receiptHash,
      idempotency_key: input.idempotencyKey ?? null,
      bringing_companion: bringingCompanion,
      companion_name: companionName,
      companion_is_child: companionIsChild,
    })
    .select("id")
    .single();

  if (insertError || !submission) {
    return NextResponse.json(
      { message: "Não foi possível enviar agora. Confira sua conexão e tente novamente." },
      { status: 500 },
    );
  }

  const { data: before } = await supabase.from("guests").select("*").eq("id", guest.id).single();
  const { error: updateError } = await supabase
    .from("guests")
    .update({
      display_name: displayName,
      normalized_name: normalized,
      official_status: nextStatus,
      confirmation_source: confirmationSource,
      preferred_contact: contact ?? before?.preferred_contact,
      bringing_companion: bringingCompanion,
      companion_name: companionName,
      companion_is_child: companionIsChild,
    })
    .eq("id", guest.id);

  if (updateError) {
    return NextResponse.json(
      { message: "Não foi possível enviar agora. Confira sua conexão e tente novamente." },
      { status: 500 },
    );
  }

  await supabase.from("rsvp_audit_log").insert({
    guest_id: guest.id,
    submission_id: submission.id,
    actor_type: "guest",
    action: token
      ? "confirm_via_token"
      : linkedFromList
        ? "confirm_via_list"
        : "confirm_via_form_open",
    before_json: before,
    after_json: {
      official_status: nextStatus,
      attendance_choice: input.attending,
      bringing_companion: bringingCompanion,
      companion_name: companionName,
      companion_is_child: companionIsChild,
      companion_counts: companionCounts(bringingCompanion, companionIsChild),
    },
  });

  return NextResponse.json({
    message: input.attending
      ? "Que alegria ter você com a gente."
      : "Vamos sentir sua falta, mas agradecemos por nos avisar.",
    validated: true,
    attending: input.attending,
    receipt,
  });
}
