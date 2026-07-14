import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function GET() {
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("shipping_templates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Failed to fetch shipping templates:", error);
    return NextResponse.json({ error: "Failed to fetch shipping templates" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, zone, method, weight_rate, volume_rate, fixed_fee, free_shipping_min, trade_terms } = body;

    if (!name || !zone || !method) {
      return NextResponse.json({ error: "Name, zone, and method are required" }, { status: 400 });
    }

    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("shipping_templates")
      .insert({
        name,
        zone,
        method,
        weight_rate: weight_rate || null,
        volume_rate: volume_rate || null,
        fixed_fee: fixed_fee || null,
        free_shipping_min: free_shipping_min || null,
        trade_terms: trade_terms || "DDP",
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("Failed to create shipping template:", error);
    return NextResponse.json({ error: "Failed to create shipping template" }, { status: 500 });
  }
}
