"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { requireAdmin } from "@/lib/auth/admin";
import {
  ADMIN_CODE_COOKIE,
  adminCookieOptions,
  codeMatches,
  createAdminSessionToken,
} from "@/lib/auth/admin-code";
import { DEFAULT_EVENT } from "@/lib/event/defaults";
import { suggestMatches } from "@/lib/rsvp/matching";
import { normalizeName } from "@/lib/rsvp/normalize";
import { createInviteToken, hashInviteToken } from "@/lib/rsvp/tokens";
import { createServiceClient } from "@/lib/supabase/admin";
import { isSupabaseAuthConfigured } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function eventId(service: ReturnType<typeof createServiceClient>) {
  const { data } = await service
    .from("events")
    .select("id")
    .eq("slug", DEFAULT_EVENT.slug)
    .single();
  if (!data) throw new Error("EVENT_NOT_FOUND");
  return data.id as string;
}

export async function updateGuestStatus(guestId: string, status: "manually_confirmed" | "declined" | "awaiting_response") {
  const admin = await requireAdmin();
  const service = createServiceClient();
  const { data: before } = await service.from("guests").select("*").eq("id", guestId).single();
  const { error } = await service
    .from("guests")
    .update({
      official_status: status,
      confirmation_source: status === "awaiting_response" ? before?.confirmation_source : "manual",
    })
    .eq("id", guestId);
  if (error) throw new Error(error.message);
  await service.from("rsvp_audit_log").insert({
    guest_id: guestId,
    actor_type: "admin",
    actor_id: admin.id || null,
    action: `set_status:${status}`,
    before_json: before,
    after_json: { official_status: status },
  });
  revalidatePath("/admin/dashboard");
}

export async function updateGuestListOwner(
  guestId: string,
  groupOwner: "Alex" | "Paloma",
) {
  const admin = await requireAdmin();
  const service = createServiceClient();
  const { data: before } = await service.from("guests").select("*").eq("id", guestId).single();
  if (!before) throw new Error("GUEST_NOT_FOUND");
  const { error } = await service
    .from("guests")
    .update({ group_owner: groupOwner })
    .eq("id", guestId);
  if (error) throw new Error(error.message);
  await service.from("rsvp_audit_log").insert({
    guest_id: guestId,
    actor_type: "admin",
    actor_id: admin.id || null,
    action: "set_list_owner",
    before_json: { group_owner: before.group_owner },
    after_json: { group_owner: groupOwner },
  });
  revalidatePath("/admin/dashboard");
}

export async function updateConfirmedGuest(input: {
  guestId: string;
  displayName: string;
  groupOwner: "Alex" | "Paloma";
  preferredContact: string;
  bringingCompanion: boolean;
  companionName: string;
  companionIsChild: boolean;
}) {
  const admin = await requireAdmin();
  const service = createServiceClient();
  const displayName = input.displayName.trim();
  if (displayName.length < 2) throw new Error("NAME_REQUIRED");

  const bringingCompanion = Boolean(input.bringingCompanion);
  const companionIsChild = Boolean(bringingCompanion && input.companionIsChild);
  const companionName = bringingCompanion ? input.companionName.trim() || null : null;
  if (bringingCompanion && (!companionName || companionName.length < 2)) {
    throw new Error("COMPANION_REQUIRED");
  }

  const { data: before } = await service.from("guests").select("*").eq("id", input.guestId).single();
  if (!before) throw new Error("GUEST_NOT_FOUND");

  const after = {
    display_name: displayName,
    normalized_name: normalizeName(displayName),
    group_owner: input.groupOwner,
    preferred_contact: input.preferredContact.trim() || null,
    bringing_companion: bringingCompanion,
    companion_name: companionName,
    companion_is_child: companionIsChild,
    notes: "Editado no painel",
  };

  const { error } = await service.from("guests").update(after).eq("id", input.guestId);
  if (error) throw new Error(error.message);

  await service.from("rsvp_audit_log").insert({
    guest_id: input.guestId,
    actor_type: "admin",
    actor_id: admin.id || null,
    action: "edit_confirmed_guest",
    before_json: before,
    after_json: after,
  });
  revalidatePath("/admin/dashboard");
}

export async function deleteConfirmedGuest(guestId: string) {
  const admin = await requireAdmin();
  const service = createServiceClient();
  const { data: before } = await service.from("guests").select("*").eq("id", guestId).single();
  if (!before) throw new Error("GUEST_NOT_FOUND");

  const { error } = await service
    .from("guests")
    .update({
      deleted_at: new Date().toISOString(),
      notes: "Removido da lista confirmada no painel",
    })
    .eq("id", guestId);
  if (error) throw new Error(error.message);

  await service
    .from("rsvp_submissions")
    .update({
      review_status: "discarded",
      reviewed_at: new Date().toISOString(),
      reviewer_id: admin.id || null,
    })
    .eq("guest_id", guestId)
    .neq("review_status", "discarded");

  await service.from("rsvp_audit_log").insert({
    guest_id: guestId,
    actor_type: "admin",
    actor_id: admin.id || null,
    action: "delete_confirmed_guest",
    before_json: before,
    after_json: { deleted: true },
  });
  revalidatePath("/admin/dashboard");
}

export async function approveSubmission(
  submissionId: string,
  groupOwner: "Alex" | "Paloma" = "Alex",
) {
  const admin = await requireAdmin();
  const service = createServiceClient();
  const { data: submission } = await service
    .from("rsvp_submissions")
    .select("*")
    .eq("id", submissionId)
    .single();
  if (!submission) throw new Error("SUBMISSION_NOT_FOUND");
  if (submission.review_status !== "pending_review" && submission.review_status !== "duplicate_flagged") {
    throw new Error("ALREADY_REVIEWED");
  }

  const nextStatus = submission.attendance_choice ? "confirmed_via_token" : "declined";
  let guestId = submission.guest_id as string | null;
  let before = null as Record<string, unknown> | null;

  if (guestId) {
    const { data } = await service.from("guests").select("*").eq("id", guestId).single();
    before = data;
    await service
      .from("guests")
      .update({
        display_name: submission.submitted_full_name,
        normalized_name: normalizeName(String(submission.submitted_full_name)),
        group_owner: groupOwner,
        official_status: nextStatus,
        confirmation_source: "public_form",
        preferred_contact: submission.optional_contact ?? data?.preferred_contact,
        bringing_companion: Boolean(submission.bringing_companion),
        companion_name: (submission.companion_name as string | null) ?? null,
        companion_is_child: Boolean(submission.companion_is_child),
        notes: "Validado no painel",
        deleted_at: null,
      })
      .eq("id", guestId);
  } else {
    const event = await eventId(service);
    const { data: guest, error } = await service
      .from("guests")
      .insert({
        event_id: event,
        group_owner: groupOwner,
        display_name: submission.submitted_full_name,
        normalized_name: normalizeName(String(submission.submitted_full_name)),
        official_status: nextStatus,
        confirmation_source: "public_form",
        preferred_contact: submission.optional_contact,
        bringing_companion: Boolean(submission.bringing_companion),
        companion_name: (submission.companion_name as string | null) ?? null,
        companion_is_child: Boolean(submission.companion_is_child),
        notes: "Validado no painel",
      })
      .select("id")
      .single();
    if (error || !guest) throw new Error(error?.message ?? "CREATE_FAILED");
    guestId = guest.id as string;
  }

  await service
    .from("rsvp_submissions")
    .update({
      guest_id: guestId,
      matching_state: "linked",
      review_status: "linked",
      reviewed_at: new Date().toISOString(),
      reviewer_id: admin.id || null,
    })
    .eq("id", submissionId);

  await service.from("rsvp_audit_log").insert({
    guest_id: guestId,
    submission_id: submissionId,
    actor_type: "admin",
    actor_id: admin.id || null,
    action: "approve_submission",
    before_json: before,
    after_json: { official_status: nextStatus, group_owner: groupOwner },
  });
  revalidatePath("/admin/dashboard");
}

export async function linkSubmission(submissionId: string, guestId: string) {
  const admin = await requireAdmin();
  const service = createServiceClient();
  const { data: submission } = await service
    .from("rsvp_submissions")
    .select("*")
    .eq("id", submissionId)
    .single();
  if (!submission) throw new Error("SUBMISSION_NOT_FOUND");
  const { data: before } = await service.from("guests").select("*").eq("id", guestId).single();
  const nextStatus = submission.attendance_choice ? "confirmed_via_token" : "declined";
  await service
    .from("guests")
    .update({
      official_status: nextStatus,
      confirmation_source: "public_form",
      preferred_contact: submission.optional_contact ?? before?.preferred_contact,
      bringing_companion: Boolean(submission.bringing_companion),
      companion_name: (submission.companion_name as string | null) ?? null,
      companion_is_child: Boolean(submission.companion_is_child),
      notes: "Validado no painel",
    })
    .eq("id", guestId);
  await service
    .from("rsvp_submissions")
    .update({
      guest_id: guestId,
      matching_state: "linked",
      review_status: "linked",
      reviewed_at: new Date().toISOString(),
      reviewer_id: admin.id,
    })
    .eq("id", submissionId);
  await service.from("rsvp_audit_log").insert({
    guest_id: guestId,
    submission_id: submissionId,
    actor_type: "admin",
    actor_id: admin.id,
    action: "link_submission",
    before_json: before,
    after_json: { official_status: nextStatus },
  });
  revalidatePath("/admin/dashboard");
}

export async function createGuestFromSubmission(submissionId: string, groupOwner: "Alex" | "Paloma") {
  const admin = await requireAdmin();
  const service = createServiceClient();
  const event = await eventId(service);
  const { data: submission } = await service
    .from("rsvp_submissions")
    .select("*")
    .eq("id", submissionId)
    .single();
  if (!submission) throw new Error("SUBMISSION_NOT_FOUND");

  const { data: guest, error } = await service
    .from("guests")
    .insert({
      event_id: event,
      group_owner: groupOwner,
      display_name: submission.submitted_full_name,
      normalized_name: normalizeName(submission.submitted_full_name),
      official_status: submission.attendance_choice ? "manually_confirmed" : "declined",
      confirmation_source: "public_form",
      preferred_contact: submission.optional_contact,
      notes: "Criado a partir de resposta pública, com decisão explícita do admin.",
    })
    .select("id")
    .single();
  if (error || !guest) throw new Error(error?.message ?? "CREATE_FAILED");

  await service
    .from("rsvp_submissions")
    .update({
      guest_id: guest.id,
      matching_state: "linked",
      review_status: "linked",
      reviewed_at: new Date().toISOString(),
      reviewer_id: admin.id,
    })
    .eq("id", submissionId);

  await service.from("rsvp_audit_log").insert({
    guest_id: guest.id,
    submission_id: submissionId,
    actor_type: "admin",
    actor_id: admin.id,
    action: "create_guest_from_submission",
    after_json: guest,
  });
  revalidatePath("/admin/dashboard");
}

export async function discardSubmission(submissionId: string) {
  const admin = await requireAdmin();
  const service = createServiceClient();
  const { data: submission } = await service
    .from("rsvp_submissions")
    .select("*")
    .eq("id", submissionId)
    .single();
  if (!submission) throw new Error("SUBMISSION_NOT_FOUND");

  await service
    .from("rsvp_submissions")
    .update({
      review_status: "discarded",
      reviewed_at: new Date().toISOString(),
      reviewer_id: admin.id || null,
    })
    .eq("id", submissionId);

  if (submission.guest_id) {
    const { data: guest } = await service
      .from("guests")
      .select("id, seed_key, confirmation_source, official_status, notes")
      .eq("id", submission.guest_id)
      .single();
    // Remove cadastros novos do formulário que ainda não foram validados.
    if (
      guest &&
      !guest.seed_key &&
      guest.confirmation_source === "public_form" &&
      guest.official_status === "awaiting_response"
    ) {
      await service
        .from("guests")
        .update({
          deleted_at: new Date().toISOString(),
          notes: "Recusado na validação do painel",
        })
        .eq("id", guest.id);
    } else if (guest) {
      await service
        .from("guests")
        .update({
          notes: "Resposta do formulário recusada na validação",
          bringing_companion: false,
          companion_name: null,
          companion_is_child: false,
        })
        .eq("id", guest.id);
    }
  }

  await service.from("rsvp_audit_log").insert({
    guest_id: submission.guest_id,
    submission_id: submissionId,
    actor_type: "admin",
    actor_id: admin.id || null,
    action: "discard_submission",
  });
  revalidatePath("/admin/dashboard");
}

export async function createGuest(formData: FormData) {
  await requireAdmin();
  const service = createServiceClient();
  const event = await eventId(service);
  const displayName = String(formData.get("displayName") ?? "").trim();
  const groupOwner = String(formData.get("groupOwner") ?? "Alex") as "Alex" | "Paloma";
  if (!displayName) throw new Error("NAME_REQUIRED");
  await service.from("guests").insert({
    event_id: event,
    group_owner: groupOwner,
    display_name: displayName,
    normalized_name: normalizeName(displayName),
    official_status: "awaiting_response",
    confirmation_source: "manual",
  });
  revalidatePath("/admin/dashboard");
}

export async function generateInviteLink(guestId: string) {
  await requireAdmin();
  const service = createServiceClient();
  const token = createInviteToken();
  const hash = hashInviteToken(token);
  await service
    .from("guests")
    .update({ invite_token_hash: hash, token_issued_at: new Date().toISOString() })
    .eq("id", guestId);
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const url = `${origin}/convite?t=${token}`;
  const qr = await QRCode.toDataURL(url, { margin: 1, width: 280 });
  revalidatePath("/admin/dashboard");
  return { url, qr };
}

export async function unlockAdminWithCode(code: string) {
  if (!codeMatches(code)) {
    return { ok: false as const, message: "Código inválido. Confira e tente de novo." };
  }
  const jar = await cookies();
  jar.set(ADMIN_CODE_COOKIE, createAdminSessionToken(code), adminCookieOptions());
  return { ok: true as const };
}

export async function signOut() {
  const jar = await cookies();
  jar.set(ADMIN_CODE_COOKIE, "", adminCookieOptions(0));
  if (isSupabaseAuthConfigured()) {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

export async function updateEventSettings(formData: FormData) {
  await requireAdmin();
  const service = createServiceClient();
  await service
    .from("events")
    .update({
      venue_name: String(formData.get("venueName") ?? ""),
      venue_address: String(formData.get("venueAddress") ?? ""),
      maps_url: String(formData.get("mapsUrl") ?? ""),
      starts_at_local: String(formData.get("startsAtLocal") ?? "17:30"),
      dress_code_json: {
        title: String(formData.get("dressTitle") ?? "Coquetel elegante"),
        subtitle: String(formData.get("dressSubtitle") ?? ""),
        palette: DEFAULT_EVENT.dressCode.palette,
        notes: DEFAULT_EVENT.dressCode.notes,
      },
    })
    .eq("slug", DEFAULT_EVENT.slug);
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
}

export async function getMatchPreview(name: string) {
  await requireAdmin();
  const service = createServiceClient();
  const event = await eventId(service);
  const { data } = await service
    .from("guests")
    .select("id, display_name, normalized_name")
    .eq("event_id", event)
    .is("deleted_at", null);
  return suggestMatches(
    name,
    (data ?? []).map((guest) => ({
      id: guest.id as string,
      displayName: guest.display_name as string,
      normalizedName: guest.normalized_name as string,
    })),
  );
}
