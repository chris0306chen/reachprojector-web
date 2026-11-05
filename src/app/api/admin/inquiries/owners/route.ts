import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { getInquiryActor } from "@/lib/inquiry-access";
import { canManageInquiries } from "@/lib/inquiry-pipeline";

export async function GET() {
  try {
    const { actor, status } = await getInquiryActor();
    if (!actor) return NextResponse.json({ error: "无询盘访问权限" }, { status });
    if (actor.role !== "admin") return NextResponse.json({ data: [{ id: actor.id, name: actor.name }] });
    const { data, error } = await getSupabaseClient().from("users")
      .select("id, name, role, permissions, is_active").eq("is_active", true).order("name");
    if (error) throw error;
    return NextResponse.json({ data: (data || []).filter(canManageInquiries).map(({ id, name }) => ({ id, name })) });
  } catch (error) {
    console.error("Failed to fetch inquiry owners", error);
    return NextResponse.json({ error: "读取负责人失败" }, { status: 500 });
  }
}
