import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function GET() {
  try {
    const supabase = await getSupabaseClient();

    // Fetch all data in parallel
    const [
      { count: totalProducts },
      { data: allOrders },
      { count: totalInquiries },
      { data: recentOrders },
      { data: recentInquiries },
    ] = await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*"),
      supabase.from("inquiries").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(10),
      supabase.from("inquiries").select("*").order("created_at", { ascending: false }).limit(5),
    ]);

    const orders = allOrders || [];

    // Calculate total revenue (all non-cancelled orders)
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + parseFloat(o.amount || 0), 0);

    // Count orders by status
    const pendingPaymentOrders = orders.filter((o) =>
      ["pending", "pending_payment"].includes(o.status)
    ).length;
    const pendingShipOrders = orders.filter((o) =>
      ["paid", "preparing"].includes(o.status)
    ).length;

    // New inquiries count (status = 'new' or 'pending')
    const allInquiries = (await supabase.from("inquiries").select("status")).data || [];
    const newInquiriesCount = allInquiries.filter((i) =>
      ["new", "pending"].includes(i.status)
    ).length;

    // Sales by country
    const byCountry: Record<string, { total_sales: number; order_count: number }> = {};
    orders
      .filter((o) => o.status !== "cancelled")
      .forEach((o) => {
        const country = o.country || "Unknown";
        if (!byCountry[country]) byCountry[country] = { total_sales: 0, order_count: 0 };
        byCountry[country].order_count++;
        byCountry[country].total_sales += parseFloat(o.amount || 0);
      });

    const byCountryArray = Object.entries(byCountry)
      .map(([country, data]) => ({ country, ...data }))
      .sort((a, b) => b.total_sales - a.total_sales)
      .slice(0, 10);

    // Sales by product
    const byProduct: Record<string, { total_quantity: number; total_sales: number }> = {};
    orders
      .filter((o) => o.status !== "cancelled")
      .forEach((o) => {
        const productName = o.product_name || "Unknown";
        if (!byProduct[productName]) byProduct[productName] = { total_quantity: 0, total_sales: 0 };
        byProduct[productName].total_quantity += o.quantity || 1;
        byProduct[productName].total_sales += parseFloat(o.amount || 0);
      });

    const byProductArray = Object.entries(byProduct)
      .map(([product_name, data]) => ({ product_name, ...data }))
      .sort((a, b) => b.total_quantity - a.total_quantity)
      .slice(0, 10);

    return NextResponse.json({
      stats: {
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: totalProducts || 0,
        totalInquiries: totalInquiries || 0,
        totalSales: totalRevenue,
        pendingPaymentOrders,
        pendingShipOrders,
        newInquiriesCount,
      },
      byCountry: byCountryArray,
      byProduct: byProductArray,
      recentOrders: recentOrders || [],
      recentInquiries: recentInquiries || [],
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats", details: String(error) },
      { status: 500 }
    );
  }
}
