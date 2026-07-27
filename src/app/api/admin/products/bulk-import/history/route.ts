import { NextResponse } from "next/server";
import { getCurrentUser, hasPermission } from "@/lib/auth";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, "products")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from("product_import_jobs")
    .select("id, created_by, status, product_count, success_count, failure_count, created_at")
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data || [] });
}
