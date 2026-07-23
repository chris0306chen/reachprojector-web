import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { normalizeShippingTemplate } from "@/lib/shipping-template";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = normalizeShippingTemplate(await request.json());

    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("shipping_templates")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to update shipping template:", error);
    const message = error instanceof Error ? error.message : "";
    const invalid = message.startsWith("INVALID_");
    return NextResponse.json(
      { error: invalid ? "Invalid shipping rule" : "Failed to update shipping template" },
      { status: invalid ? 400 : 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await getSupabaseClient();
    const { error } = await supabase
      .from("shipping_templates")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete shipping template:", error);
    return NextResponse.json({ error: "Failed to delete shipping template" }, { status: 500 });
  }
}
