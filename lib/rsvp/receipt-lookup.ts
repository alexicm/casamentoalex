import { createServiceClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { canUseLocalRsvp, findLocalReceipt } from "@/lib/rsvp/local-store";
import { hashReceiptToken } from "@/lib/rsvp/receipt";

export type ReceiptView = {
  found: boolean;
  attending: boolean;
  validated: boolean;
};

export async function loadReceipt(token?: string): Promise<ReceiptView> {
  if (!token) {
    return { found: false, attending: true, validated: false };
  }

  if (!isSupabaseConfigured()) {
    if (!canUseLocalRsvp()) {
      return { found: false, attending: true, validated: false };
    }
    const local = await findLocalReceipt(hashReceiptToken(token));
    if (!local) return { found: false, attending: true, validated: false };
    return {
      found: true,
      attending: local.attending,
      validated: false,
    };
  }

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("rsvp_submissions")
    .select("attendance_choice, review_status")
    .eq("receipt_token_hash", hashReceiptToken(token))
    .maybeSingle();

  if (!data) {
    return { found: false, attending: true, validated: false };
  }

  return {
    found: true,
    attending: Boolean(data.attendance_choice),
    validated: data.review_status === "linked",
  };
}
