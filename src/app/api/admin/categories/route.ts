import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function GET() {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id, name")
      .order("name");

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
