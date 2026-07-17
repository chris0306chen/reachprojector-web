import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

/**
 * POST /api/admin/products/batch-update
 * Batch operations on products
 *
 * Body:
 * - { action: "update_status", product_ids: [...], value: "active"|"inactive" }
 * - { action: "update_featured", product_ids: [...], value: "true"|"false" }
 * - { action: "delete", product_ids: [...] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, product_ids, value } = body;

    if (!action || !product_ids || !Array.isArray(product_ids) || product_ids.length === 0) {
      return NextResponse.json(
        { error: "action and product_ids array are required" },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseClient();

    if (action === "delete") {
      const { error } = await supabase
        .from("products")
        .delete()
        .in("id", product_ids);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: `已删除 ${product_ids.length} 个产品`,
      });
    }

    let updateData: Record<string, unknown> = {};
    let message = "";

    switch (action) {
      case "update_status":
        updateData = { status: value };
        message = `已${value === "active" ? "上架" : "下架"} ${product_ids.length} 个产品`;
        break;

      case "update_featured":
        updateData = { is_featured: value === "true" };
        message = `已${value === "true" ? "设为推荐" : "取消推荐"} ${product_ids.length} 个产品`;
        break;

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    const { data, error } = await supabase
      .from("products")
      .update(updateData)
      .in("id", product_ids)
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message,
      updated: data?.length || 0,
    });
  } catch (error) {
    console.error("Batch update error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
