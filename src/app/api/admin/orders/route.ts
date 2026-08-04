import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { sendShippingNotification } from "@/lib/order-email";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");
    const status = searchParams.get("status");
    const offset = (page - 1) * limit;

    const supabase = await getSupabaseClient();
    let query = supabase
      .from("orders")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Return flat array for admin page
    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "加载订单失败" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "缺少订单编号" }, { status: 400 });
    }

    const body = await request.json();
    const supabase = await getSupabaseClient();

    const updateData: Record<string, unknown> = {};
    // Status changes use /api/admin/orders/[id]/status so transition rules cannot be bypassed.
    const trackingNumber = typeof body.tracking_number === "string" ? body.tracking_number.trim() : "";
    if (body.tracking_number !== undefined) {
      updateData.tracking_number = trackingNumber || null;
      if (trackingNumber) updateData.status = "shipped";
    }
    if (body.shipping_method !== undefined) updateData.shipping_method = body.shipping_method;
    if (body.notes !== undefined) updateData.notes = body.notes;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "没有可更新的订单字段" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (trackingNumber) {
      sendShippingNotification({
        orderId: data.order_id,
        productName: data.product_name,
        customerEmail: data.payer_email || data.customer_email,
        shippingMethod: data.shipping_method || "International shipping",
        trackingNumber,
      }).catch((emailError) => console.error("Shipping notification failed:", emailError));
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to update order:", error);
    return NextResponse.json({ error: "更新订单失败" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await getSupabaseClient();

    // Generate order ID for B2B
    const orderId = body.order_id || `B2B-${Date.now()}`;

    const orderData = {
      order_id: orderId,
      order_type: body.order_type || "b2b_offline",
      customer_name: body.customer_name || null,
      customer_email: body.customer_email || null,
      customer_company: body.customer_company || null,
      product_name: body.product_name,
      quantity: body.quantity || 1,
      amount: body.amount,
      currency: body.currency || "USD",
      payer_email: body.customer_email || body.payer_email || "",
      status: body.status || "pending_payment",
      payment_status: body.payment_status || "unpaid",
      payment_method: body.payment_method || "offline",
      country: body.country || null,
      shipping_address: body.shipping_address || null,
      shipping_method: body.shipping_method || null,
      pi_number: body.pi_number || null,
      deposit_amount: body.deposit_amount || null,
      final_payment_amount: body.final_payment_amount || null,
      product_specs: body.product_specs || null,
      notes: body.notes || null,
    };

    const { data, error } = await supabase
      .from("orders")
      .insert(orderData)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json({ error: "创建订单失败" }, { status: 500 });
  }
}
