import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { sendShippingNotification } from "@/lib/order-email";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { tracking_number, shipping_method } = body;

    if (
      typeof tracking_number !== "string" ||
      tracking_number.trim().length < 3 ||
      tracking_number.length > 100 ||
      typeof shipping_method !== "string" ||
      shipping_method.trim().length < 2 ||
      shipping_method.length > 100
    ) {
      return NextResponse.json({ error: "Valid tracking number and shipping method are required" }, { status: 400 });
    }

    const supabase = await getSupabaseClient();
    const { data: currentOrder, error: readError } = await supabase
      .from("orders")
      .select("status, order_id, product_name, payer_email")
      .eq("id", id)
      .single();

    if (readError || !currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (!["paid", "preparing"].includes(currentOrder.status)) {
      return NextResponse.json({ error: "Only paid orders can be shipped" }, { status: 409 });
    }

    const { data, error } = await supabase
      .from("orders")
      .update({
        tracking_number: tracking_number.trim(),
        shipping_method: shipping_method.trim(),
        status: "shipped",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    sendShippingNotification({
      orderId: currentOrder.order_id,
      productName: currentOrder.product_name,
      customerEmail: currentOrder.payer_email,
      shippingMethod: shipping_method.trim(),
      trackingNumber: tracking_number.trim(),
    }).catch((emailError) => console.error("Shipping notification failed:", emailError));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to ship order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
