import { hasAdminCodeSession } from "@/lib/auth/admin-code";
import { createServiceClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AdminSession = {
  id: string | null;
  role: "admin";
  via: "code" | "supabase";
};

export async function getAdminUser(): Promise<AdminSession | null> {
  if (await hasAdminCodeSession()) {
    return { id: null, role: "admin", via: "code" };
  }

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
  return { id: profile.user_id as string, role: "admin", via: "supabase" };
}

export async function requireAdmin() {
  const admin = await getAdminUser();
  if (!admin) {
    throw new Error("UNAUTHORIZED");
  }
  return admin;
}
