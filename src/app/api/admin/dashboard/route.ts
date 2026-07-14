import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function GET() {
  try {
    const supabase = await getSupabaseClient();

    const [
      { count: totalProducts },
      { count: totalOrders },
      { count: pendingInquiries },
      { data: recentOrders },
      { data: topProducts },
    ] = await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
      supabase.rpc("get_top_products", { limit_count: 5 }).then(({ data }) => ({ data })),
    ]);

    // Calculate total revenue
    const { data: allOrders } = await supabase
      .from("orders")
      .select("amount")
      .in("status", ["paid", "shipped", "delivered"]);

    const totalRevenue = allOrders?.reduce((sum, o) => sum + parseFloat(o.amount), 0) || 0;

    // Handle case where RPC function doesn't exist
    let topProductsData = topProducts;
    if (!topProductsData) {
      const { data: orderProducts } = await supabase
        .from("orders")
        .select("product_name, amount, quantity")
        .order("created_at", { ascending: false })
        .limit(5);
      topProductsData = orderProducts?.map((o) => ({
        product_name: o.product_name,
        total_sold: o.quantity,
        total_revenue: parseFloat(o.amount),
      })) || [];
    }

    return NextResponse.json({
      stats: {
        totalProducts: totalProducts || 0,
        totalOrders: totalOrders || 0,
        totalRevenue,
        pendingInquiries: pendingInquiries || 0,
      },
      recentOrders: recentOrders || [],
      topProducts: topProductsData || [],
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
