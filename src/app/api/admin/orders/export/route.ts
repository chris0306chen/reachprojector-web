import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

/**
 * GET /api/admin/orders/export
 * Export orders as CSV
 *
 * Query params:
 * - status: filter by order status
 * - start_date: filter orders created after this date
 * - end_date: filter orders created before this date
 *
 * Returns: CSV file download
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    const supabase = await getSupabaseClient();

    // Build query
    let query = supabase.from("orders").select("*").order("created_at", { ascending: false });

    // Apply filters
    if (status && status !== "all") {
      query = query.eq("status", status);
    }
    if (startDate) {
      query = query.gte("created_at", startDate);
    }
    if (endDate) {
      query = query.lte("created_at", endDate);
    }

    const { data: orders, error } = await query;
    if (error) throw error;

    // CSV headers (matching spec exactly)
    const headers = [
      "订单号",
      "订单类型",
      "客户名称",
      "邮箱",
      "公司",
      "产品",
      "数量",
      "金额",
      "币种",
      "支付方式",
      "支付状态",
      "国家",
      "物流方式",
      "运单号",
      "状态",
      "备注",
      "创建时间",
    ];

    const rows = (orders || []).map((o) => [
      o.order_id || "",
      o.order_type === "b2b_offline" ? "B2B线下" : "B2C线上",
      o.customer_name || "",
      o.customer_email || o.payer_email || "",
      o.customer_company || "",
      o.product_name || "",
      o.quantity || 1,
      o.amount || 0,
      o.currency || "USD",
      o.payment_method || "PayPal",
      translatePaymentStatus(o.payment_status),
      o.country || "",
      o.shipping_method || "",
      o.tracking_number || "",
      translateStatus(o.status),
      o.notes || "",
      formatDate(o.created_at),
    ]);

    // Escape CSV values
    const escapeCSV = (val: unknown) => {
      const str = String(val ?? "");
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    // Add BOM for Excel UTF-8 compatibility
    const bom = "\uFEFF";
    const csv = bom + csvContent;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="orders-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Orders export error:", error);
    return NextResponse.json(
      { error: "Failed to export orders", details: String(error) },
      { status: 500 }
    );
  }
}

function translateStatus(status: string | null): string {
  const map: Record<string, string> = {
    pending_payment: "待付款",
    preparing: "备货中",
    shipped: "已发货",
    completed: "已完成",
    after_sales: "售后中",
    // Legacy statuses
    pending: "待付款",
    paid: "已付款",
    delivered: "已完成",
    cancelled: "已取消",
  };
  return map[status || ""] || status || "未知";
}

function translatePaymentStatus(status: string | null): string {
  const map: Record<string, string> = {
    unpaid: "未支付",
    partial: "部分支付",
    paid: "已支付",
  };
  return map[status || ""] || status || "未知";
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
  } catch {
    return dateStr;
  }
}
