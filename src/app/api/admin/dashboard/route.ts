import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

/**
 * GET /api/admin/dashboard
 * Enhanced dashboard statistics
 *
 * Returns:
 * - total_revenue: sum of completed orders
 * - pending_payment_count: orders with status=pending_payment
 * - pending_ship_count: orders with status=preparing
 * - new_inquiries_count: inquiries from last 7 days
 * - by_country: order count & amount grouped by country
 * - by_product: top 10 products by sales
 * - recent_orders: last 10 orders
 */
export async function GET() {
  try {
    const supabase = await getSupabaseClient();

    // Calculate date 7 days ago for new inquiries
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString();

    // Fetch all data in parallel
    const [
      { count: totalProducts },
      { data: allOrders },
      { count: totalInquiries },
      { data: recentOrders },
      { count: newInquiriesCount },
    ] = await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*"),
      supabase.from("inquiries").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(10),
      supabase
        .from("inquiries")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgoStr),
    ]);

    const orders = allOrders || [];

    // total_revenue: sum of completed orders
    const totalRevenue = orders
      .filter((o) => o.status === "completed" || o.status === "delivered")
      .reduce((sum, o) => sum + parseFloat(String(o.amount || 0)), 0);

    // pending_payment_count
    const pendingPaymentCount = orders.filter(
      (o) => o.status === "pending_payment" || o.status === "pending"
    ).length;

    // pending_ship_count
    const pendingShipCount = orders.filter(
      (o) => o.status === "preparing" || o.status === "paid"
    ).length;

    // by_country: aggregate by country field
    const countryMap: Record<string, { order_count: number; total_amount: number }> = {};
    orders
      .filter((o) => o.status !== "cancelled")
      .forEach((o) => {
        const country = o.country || "Unknown";
        if (!countryMap[country]) countryMap[country] = { order_count: 0, total_amount: 0 };
        countryMap[country].order_count++;
        countryMap[country].total_amount += parseFloat(String(o.amount || 0));
      });

    const byCountry = Object.entries(countryMap)
      .map(([country, data]) => ({ country, ...data }))
      .sort((a, b) => b.total_amount - a.total_amount);

    // by_product: top 10 by sales quantity
    const productMap: Record<string, { total_quantity: number; total_sales: number }> = {};
    orders
      .filter((o) => o.status !== "cancelled")
      .forEach((o) => {
        const productName = o.product_name || "Unknown";
        if (!productMap[productName])
          productMap[productName] = { total_quantity: 0, total_sales: 0 };
        productMap[productName].total_quantity += o.quantity || 1;
        productMap[productName].total_sales += parseFloat(String(o.amount || 0));
      });

    const byProduct = Object.entries(productMap)
      .map(([product_name, data]) => ({ product_name, ...data }))
      .sort((a, b) => b.total_quantity - a.total_quantity)
      .slice(0, 10);

    return NextResponse.json({
      total_revenue: Math.round(totalRevenue * 100) / 100,
      pending_payment_count: pendingPaymentCount,
      pending_ship_count: pendingShipCount,
      new_inquiries_count: newInquiriesCount || 0,
      total_products: totalProducts || 0,
      total_orders: orders.length,
      total_inquiries: totalInquiries || 0,
      by_country: byCountry,
      by_product: byProduct,
      recent_orders: recentOrders || [],
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats", details: String(error) },
      { status: 500 }
    );
  }
}
