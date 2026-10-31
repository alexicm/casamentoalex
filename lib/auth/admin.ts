import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function getAdminUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) return null;

  const service = createServiceClient();
  const { data: profile } = await service
    .from("admin_profiles")
    .select("user_id, role")
    .eq("user_id", data.claims.sub)
    .maybeSingle();

  if (!profile || profile.role !== "admin") return null;
  return { id: profile.user_id as string, role: "admin" as const };
}

export async function requireAdmin() {
  const admin = await getAdminUser();
  if (!admin) {
    throw new Error("UNAUTHORIZED");
  }
  return admin;
}
