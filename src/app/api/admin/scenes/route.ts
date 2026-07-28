import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function GET() {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("scenes")
      .select("id, name, slug, group_name, sort_order")
      .eq("is_active", true)
      .order("sort_order");

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Failed to fetch scenes:", error);
    return NextResponse.json({ error: "加载应用场景失败" }, { status: 500 });
  }
}
