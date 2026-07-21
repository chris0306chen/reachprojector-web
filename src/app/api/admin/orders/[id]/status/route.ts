import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ["pending", "paid", "shipped", "delivered", "refunded"] as const;
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const supabase = await getSupabaseClient();
    const { data: currentOrder, error: readError } = await supabase
      .from("orders")
      .select("status")
      .eq("id", id)
      .single();

    if (readError || !currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const allowedTransitions: Record<string, readonly string[]> = {
      pending: ["paid", "refunded"],
      paid: ["shipped", "refunded"],
      shipped: ["delivered", "refunded"],
      delivered: ["refunded"],
      refunded: [],
    };

    if (status !== currentOrder.status && !allowedTransitions[currentOrder.status]?.includes(status)) {
      return NextResponse.json(
        { error: `Cannot move order from ${currentOrder.status} to ${status}` },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to update order status:", error);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}
