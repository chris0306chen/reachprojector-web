import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { normalizeShippingTemplate } from "@/lib/shipping-template";

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
    const template = normalizeShippingTemplate(await request.json());
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("shipping_templates")
      .insert(template)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("Failed to create shipping template:", error);
    const message = error instanceof Error ? error.message : "";
    const invalid = message.startsWith("INVALID_");
    return NextResponse.json(
      { error: invalid ? "Invalid shipping rule" : "Failed to create shipping template" },
      { status: invalid ? 400 : 500 }
    );
  }
}
