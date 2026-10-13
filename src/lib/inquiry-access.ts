import { getCurrentUser } from "@/lib/auth";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { canManageInquiries } from "@/lib/inquiry-pipeline";

// Check current database permissions, including account deactivation after login.
export async function getInquiryActor() {
  const token = await getCurrentUser();
  if (!token) return { actor: null, status: 401 };
  const { data, error } = await getSupabaseClient().from("users")
    .select("id, name, role, permissions, is_active").eq("id", token.userId).maybeSingle();
  if (error) throw error;
  if (!data || !canManageInquiries(data)) return { actor: null, status: 403 };
  return { actor: data as { id: string; name: string; role: string }, status: 200 };
}
