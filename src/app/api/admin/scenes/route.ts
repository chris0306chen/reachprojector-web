import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, hasPermission } from "@/lib/auth";
import { getSupabaseClient } from "@/storage/database/supabase-client";

const SCENE_GROUPS = ["Home Theater", "Business & Education", "Professional & Large Venues", "Events & Rental", "Hospitality & Entertainment"] as const;
const GROUP_BY_SLUG: Record<string, string> = {
  "home-cinema": SCENE_GROUPS[0], "living-room-laser-tv": SCENE_GROUPS[0], "bedroom-small-space": SCENE_GROUPS[0], "gaming-room": SCENE_GROUPS[0], "outdoor-cinema": SCENE_GROUPS[0],
  "meeting-rooms": SCENE_GROUPS[1], "education-training": SCENE_GROUPS[1], "large-venues": SCENE_GROUPS[2], "events-rental": SCENE_GROUPS[3],
  "hotels-hospitality": SCENE_GROUPS[4], "bars-restaurants": SCENE_GROUPS[4], "retail-showrooms": SCENE_GROUPS[4],
};

async function authorize() {
  const user = await getCurrentUser();
  return user && hasPermission(user, "products");
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120);
}

export async function GET() {
  try {
    if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const supabase = await getSupabaseClient();
    const [{ data, error }, { data: links, error: linkError }] = await Promise.all([
      supabase.from("scenes").select("id, name, slug, group_name, description, sort_order, is_active").order("sort_order"),
      supabase.from("product_scenes").select("scene_id"),
    ]);
    if (error) throw error;
    if (linkError) throw linkError;
    const counts = new Map<string, number>();
    for (const link of links || []) counts.set(link.scene_id, (counts.get(link.scene_id) || 0) + 1);
    return NextResponse.json({ groups: SCENE_GROUPS, scenes: (data || []).map((scene) => ({ ...scene, product_count: counts.get(scene.id) || 0 })) });
  } catch (error) {
    console.error("Failed to fetch scenes:", error);
    return NextResponse.json({ error: "加载应用场景失败" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    const supabase = await getSupabaseClient();
    if (body.action === "normalize_groups") {
      for (const [slug, groupName] of Object.entries(GROUP_BY_SLUG)) {
        const { error } = await supabase.from("scenes").update({ group_name: groupName, updated_at: new Date().toISOString() }).eq("slug", slug);
        if (error) throw error;
      }
      return NextResponse.json({ success: true });
    }
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const groupName = typeof body.group_name === "string" ? body.group_name : "";
    if (!name || !SCENE_GROUPS.includes(groupName as typeof SCENE_GROUPS[number])) return NextResponse.json({ error: "请填写场景名称并选择母类目" }, { status: 400 });
    const slug = slugify(typeof body.slug === "string" && body.slug ? body.slug : name);
    if (!slug) return NextResponse.json({ error: "无法生成有效 Slug" }, { status: 400 });
    const { data, error } = await supabase.from("scenes").insert({
      name, slug, group_name: groupName, description: typeof body.description === "string" ? body.description.trim() : null,
      sort_order: Number.isInteger(body.sort_order) ? body.sort_order : 100, is_active: true,
    }).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("Failed to create scene:", error);
    return NextResponse.json({ error: "新增场景失败，名称或 Slug 可能重复" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    if (typeof body.id !== "string") return NextResponse.json({ error: "缺少场景 ID" }, { status: 400 });
    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (typeof body.name === "string" && body.name.trim()) update.name = body.name.trim().slice(0, 120);
    if (typeof body.group_name === "string") {
      if (!SCENE_GROUPS.includes(body.group_name as typeof SCENE_GROUPS[number])) return NextResponse.json({ error: "无效的母类目" }, { status: 400 });
      update.group_name = body.group_name;
    }
    if (typeof body.is_active === "boolean") update.is_active = body.is_active;
    if (Number.isInteger(body.sort_order)) update.sort_order = body.sort_order;
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase.from("scenes").update(update).eq("id", body.id).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to update scene:", error);
    return NextResponse.json({ error: "更新场景失败" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "缺少场景 ID" }, { status: 400 });
    const supabase = await getSupabaseClient();
    const { count, error: countError } = await supabase.from("product_scenes").select("product_id", { count: "exact", head: true }).eq("scene_id", id);
    if (countError) throw countError;
    if ((count || 0) > 0) return NextResponse.json({ error: "该场景仍有关联产品，请先移动产品或将场景停用" }, { status: 409 });
    const { error } = await supabase.from("scenes").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete scene:", error);
    return NextResponse.json({ error: "删除场景失败" }, { status: 500 });
  }
}
