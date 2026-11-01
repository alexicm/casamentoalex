import { NextResponse } from "next/server";
import { DEFAULT_EVENT } from "@/lib/event/defaults";
import { canUseLocalRsvp, saveLocalRsvp } from "@/lib/rsvp/local-store";
import { suggestMatches } from "@/lib/rsvp/matching";
import { normalizeName } from "@/lib/rsvp/normalize";
import { allowRequest, hashIp } from "@/lib/rsvp/rate-limit";
import { createReceiptToken, hashReceiptToken } from "@/lib/rsvp/receipt";
import { hashInviteToken } from "@/lib/rsvp/tokens";
import { createServiceClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured, SETUP_PENDING_MESSAGE } from "@/lib/supabase/env";
import {
  CONSENT_VERSION,
  nameNeedsReview,
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

  const receipt = input.idempotencyKey
    ? input.idempotencyKey.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48) || createReceiptToken()
    : createReceiptToken();
  const receiptHash = hashReceiptToken(receipt);
  const contact = input.contact?.trim() || null;

  if (!supabaseReady) {
    const saved = await saveLocalRsvp({
      fullName: input.fullName.trim(),
      attending: input.attending,
      contact,
      receipt,
      receiptHash,
      idempotencyKey: input.idempotencyKey ?? null,
    });
    return NextResponse.json({
      message: "Recebemos sua resposta com carinho. Obrigado por nos contar!",
      validated: false,
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

  const normalized = normalizeName(input.fullName);
  const token = input.inviteToken?.trim() || "";

  const { data: guests } = await supabase
    .from("guests")
    .select("id, display_name, normalized_name, invite_token_hash")
    .eq("event_id", event.id)
    .is("deleted_at", null);

  const guestList = (guests ?? []).map((guest) => ({
    id: guest.id as string,
    displayName: guest.display_name as string,
    normalizedName: guest.normalized_name as string,
    inviteTokenHash: guest.invite_token_hash as string | null,
  }));

  let guestId: string | null = null;
  let validated = false;
  let matching = suggestMatches(input.fullName, guestList);

  if (token) {
    const hashed = hashInviteToken(token);
    const tokenGuest = guestList.find((guest) => guest.inviteTokenHash === hashed);
    if (tokenGuest) {
      guestId = tokenGuest.id;
      validated = true;
      matching = { state: "suggested", candidates: [tokenGuest], reason: "token" };
    }
  }

  const { data: recent } = await supabase
    .from("rsvp_submissions")
    .select("id")
    .eq("event_id", event.id)
    .eq("normalized_submitted_name", normalized)
    .gte("submitted_at", new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString());

  const duplicate = Boolean(recent && recent.length > 0);
  const reviewStatus = validated
    ? "linked"
    : duplicate || nameNeedsReview(input.fullName)
      ? duplicate
        ? "duplicate_flagged"
        : "pending_review"
      : matching.state === "ambiguous"
        ? "pending_review"
        : "pending_review";

  const matchingState = validated
    ? "linked"
    : matching.state === "ambiguous"
      ? "ambiguous"
      : matching.state === "suggested"
        ? "suggested"
        : "unmatched";

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
        validated: existing.review_status === "linked",
        attending: existing.attendance_choice,
        receipt,
      });
    }
  }

  const { data: submission, error: insertError } = await supabase
    .from("rsvp_submissions")
    .insert({
      event_id: event.id,
      guest_id: guestId,
      submitted_full_name: input.fullName.trim(),
      normalized_submitted_name: normalized,
      attendance_choice: input.attending,
      optional_contact: contact,
      matching_state: matchingState,
      review_status: reviewStatus,
      consent_version: CONSENT_VERSION,
      request_fingerprint_hash: ipHash,
      suggested_guest_ids: matching.candidates.map((candidate) => candidate.id),
      reviewed_at: validated ? new Date().toISOString() : null,
      receipt_token_hash: receiptHash,
      idempotency_key: input.idempotencyKey ?? null,
    })
    .select("id")
    .single();

  if (insertError || !submission) {
    return NextResponse.json(
      { message: "Não foi possível enviar agora. Confira sua conexão e tente novamente." },
      { status: 500 },
    );
  }

  if (validated && guestId) {
    const nextStatus = input.attending ? "confirmed_via_token" : "declined";
    const { data: before } = await supabase.from("guests").select("*").eq("id", guestId).single();
    await supabase
      .from("guests")
      .update({
        official_status: nextStatus,
        confirmation_source: "personal_link",
        preferred_contact: contact ?? before?.preferred_contact,
      })
      .eq("id", guestId);

    await supabase.from("rsvp_audit_log").insert({
      guest_id: guestId,
      submission_id: submission.id,
      actor_type: "guest",
      action: "confirm_via_token",
      before_json: before,
      after_json: { official_status: nextStatus, attendance_choice: input.attending },
    });
  } else {
    await supabase.from("rsvp_audit_log").insert({
      submission_id: submission.id,
      actor_type: "guest",
      action: "public_submission",
      after_json: {
        submitted_full_name: input.fullName.trim(),
        attendance_choice: input.attending,
        matching_state: matchingState,
      },
    });
  }

  return NextResponse.json({
    message: validated
      ? input.attending
        ? "Presença confirmada! Estamos muito felizes em dividir esse dia com você."
        : "Vamos sentir sua falta, mas agradecemos por nos avisar."
      : "Recebemos sua resposta com carinho. Obrigado por nos contar!",
    validated,
    attending: input.attending,
    receipt,
  });
}
