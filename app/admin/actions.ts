"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { DEFAULT_EVENT } from "@/lib/event/defaults";
import { suggestMatches } from "@/lib/rsvp/matching";
import { normalizeName } from "@/lib/rsvp/normalize";
import { createInviteToken, hashInviteToken } from "@/lib/rsvp/tokens";
import { createServiceClient } from "@/lib/supabase/admin";
import QRCode from "qrcode";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseAuthConfigured } from "@/lib/supabase/env";

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
    actor_id: admin.id,
    action: `set_status:${status}`,
    before_json: before,
    after_json: { official_status: status },
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
  const nextStatus = submission.attendance_choice ? "manually_confirmed" : "declined";
  await service
    .from("guests")
    .update({
      official_status: nextStatus,
      confirmation_source: "public_form",
      preferred_contact: submission.optional_contact ?? before?.preferred_contact,
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
  await service
    .from("rsvp_submissions")
    .update({
      review_status: "discarded",
      reviewed_at: new Date().toISOString(),
      reviewer_id: admin.id,
    })
    .eq("id", submissionId);
  await service.from("rsvp_audit_log").insert({
    submission_id: submissionId,
    actor_type: "admin",
    actor_id: admin.id,
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
  const url = `${origin}/i/${token}`;
  const qr = await QRCode.toDataURL(url, { margin: 1, width: 280 });
  revalidatePath("/admin/dashboard");
  return { url, qr };
}

export async function signOut() {
  if (!isSupabaseAuthConfigured()) redirect("/admin/login");
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
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
      starts_at_local: String(formData.get("startsAtLocal") ?? "17:00"),
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
