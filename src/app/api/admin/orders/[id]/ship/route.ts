import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { tracking_number, shipping_method } = body;

    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("orders")
      .update({
        tracking_number,
        shipping_method,
        status: "shipped",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to ship order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
