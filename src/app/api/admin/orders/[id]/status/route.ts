import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { canTransitionOrder, orderTransitions } from "@/lib/order-status";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (typeof status !== "string" || !Object.hasOwn(orderTransitions, status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const supabase = await getSupabaseClient();
    const { data: currentOrder, error: readError } = await supabase
      .from("orders")
      .select("status,payment_status,order_type")
      .eq("id", id)
      .maybeSingle();

    if (readError) throw readError;
    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!canTransitionOrder(currentOrder, status)) {
      return NextResponse.json(
        { error: `Cannot move order from ${currentOrder.status} to ${status}` },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("status", currentOrder.status)
      .eq("payment_status", currentOrder.payment_status)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: "Order changed; reload and retry" }, { status: 409 });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to update order status:", error);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}
