import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { getCurrentUser, hasPermission } from "@/lib/auth";

async function authorize() {
  const user = await getCurrentUser();
  return user && hasPermission(user, "products");
}

export async function GET() {
  try {
    if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const supabase = await getSupabaseClient();
    const [{ data, error }, { data: products, error: productError }] = await Promise.all([
      supabase
      .from("categories")
      .select("id, name, slug, parent_id, sort_order, is_active")
      .order("sort_order"),
      supabase.from("products").select("category_id"),
    ]);

    if (error) throw error;
    if (productError) throw productError;

    const counts = new Map<string, number>();
    for (const product of products || []) {
      if (product.category_id) counts.set(product.category_id, (counts.get(product.category_id) || 0) + 1);
    }

    return NextResponse.json((data || []).map((category) => ({
      ...category,
      product_count: counts.get(category.id) || 0,
    })));
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : "";
    if (!id) return NextResponse.json({ error: "缺少分类 ID" }, { status: 400 });

    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (typeof body.name === "string" && body.name.trim()) update.name = body.name.trim().slice(0, 100);
    if (typeof body.parent_id === "string" || body.parent_id === null) {
      if (body.parent_id === id) return NextResponse.json({ error: "分类不能成为自己的上级" }, { status: 400 });
      update.parent_id = body.parent_id || null;
    }
    if (typeof body.sort_order === "number" && Number.isInteger(body.sort_order)) update.sort_order = body.sort_order;
    if (typeof body.is_active === "boolean") update.is_active = body.is_active;

    const supabase = await getSupabaseClient();
    if (body.is_active === false) {
      const [{ count: productCount, error: countError }, { count: childCount, error: childError }] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }).eq("category_id", id),
        supabase.from("categories").select("id", { count: "exact", head: true }).eq("parent_id", id).eq("is_active", true),
      ]);
      if (countError) throw countError;
      if (childError) throw childError;
      if ((productCount || 0) > 0 || (childCount || 0) > 0) {
        return NextResponse.json({ error: "该分类仍有产品或启用中的下级分类，请先移动或合并" }, { status: 409 });
      }
    }
    const { data, error } = await supabase.from("categories").update(update).eq("id", id).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to update category:", error);
    return NextResponse.json({ error: "更新分类失败" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    if (body.action !== "merge" || typeof body.source_id !== "string" || typeof body.target_id !== "string") {
      return NextResponse.json({ error: "合并参数不完整" }, { status: 400 });
    }
    if (body.source_id === body.target_id) return NextResponse.json({ error: "不能合并到同一个分类" }, { status: 400 });

    const supabase = await getSupabaseClient();
    const { data: target, error: targetError } = await supabase
      .from("categories").select("id").eq("id", body.target_id).eq("is_active", true).maybeSingle();
    if (targetError) throw targetError;
    if (!target) return NextResponse.json({ error: "目标分类不存在或已停用" }, { status: 400 });

    const { data: allCategories, error: hierarchyError } = await supabase
      .from("categories").select("id, parent_id");
    if (hierarchyError) throw hierarchyError;
    let cursor: string | null = body.target_id;
    const visited = new Set<string>();
    while (cursor && !visited.has(cursor)) {
      if (cursor === body.source_id) {
        return NextResponse.json({ error: "不能把分类合并到自己的下级分类" }, { status: 400 });
      }
      visited.add(cursor);
      cursor = allCategories?.find((category) => category.id === cursor)?.parent_id || null;
    }

    const { error: productError } = await supabase
      .from("products").update({ category_id: body.target_id, updated_at: new Date().toISOString() }).eq("category_id", body.source_id);
    if (productError) throw productError;
    const { error: childError } = await supabase
      .from("categories").update({ parent_id: body.target_id, updated_at: new Date().toISOString() }).eq("parent_id", body.source_id);
    if (childError) throw childError;
    const { error: sourceError } = await supabase
      .from("categories").update({ is_active: false, updated_at: new Date().toISOString() }).eq("id", body.source_id);
    if (sourceError) throw sourceError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to merge category:", error);
    return NextResponse.json({ error: "合并分类失败" }, { status: 500 });
  }
}
