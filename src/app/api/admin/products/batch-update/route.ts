import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

/**
 * POST /api/admin/products/batch-update
 * Batch operations on products
 *
 * Body:
 * - { action: "toggle_active", ids: number[], value: boolean }
 * - { action: "update_price", ids: number[], value: number }
 * - { action: "update_stock", ids: number[], value: "in_stock" | "out_of_stock" | "preorder" }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ids, value } = body;

    if (!action || !ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "action and ids array are required" },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseClient();

    let updateData: Record<string, unknown> = {};

    switch (action) {
      case "toggle_active":
        if (typeof value !== "boolean") {
          return NextResponse.json(
            { error: "value must be a boolean for toggle_active" },
            { status: 400 }
          );
        }
        updateData = { is_active: value };
        break;

      case "update_price":
        if (typeof value !== "number" || value < 0) {
          return NextResponse.json(
            { error: "value must be a non-negative number for update_price" },
            { status: 400 }
          );
        }
        updateData = { price: value };
        break;

      case "update_stock":
        if (!["in_stock", "out_of_stock", "preorder"].includes(value)) {
          return NextResponse.json(
            { error: "value must be 'in_stock', 'out_of_stock', or 'preorder' for update_stock" },
            { status: 400 }
          );
        }
        updateData = { stock_status: value };
        break;

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}. Supported: toggle_active, update_price, update_stock` },
          { status: 400 }
        );
    }

    const { data, error } = await supabase
      .from("products")
      .update(updateData)
      .in("id", ids)
      .select("id");

    if (error) throw error;

    return NextResponse.json({
      success: true,
      updated: data?.length || ids.length,
    });
  } catch (error) {
    console.error("Batch update error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
