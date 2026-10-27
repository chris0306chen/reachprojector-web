import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { getInquiryActor } from "@/lib/inquiry-access";
import { canManageInquiries, inquiryUpdateSchema } from "@/lib/inquiry-pipeline";

const querySchema = z.object({
  page: z.coerce.number().int().min(1).max(100000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.string().max(20).optional(),
  search: z.string().trim().max(200).optional(),
  inquiry_type: z.enum(["rfq"]).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { actor, status: authStatus } = await getInquiryActor();
    if (!actor) return NextResponse.json({ error: "无询盘访问权限" }, { status: authStatus });
    const parsed = querySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
    if (!parsed.success) return NextResponse.json({ error: "无效查询参数" }, { status: 400 });
    const { page, limit, status, search, inquiry_type } = parsed.data;
    const offset = (page - 1) * limit;
    let query = getSupabaseClient().from("inquiries").select("*", { count: "exact" })
      .order("created_at", { ascending: false }).range(offset, offset + limit - 1);
    if (actor.role !== "admin") query = query.eq("assigned_to", actor.id);
    if (status === "pending") query = query.in("status", ["pending", "new"]);
    else if (status) query = query.eq("status", status);
    if (inquiry_type) query = query.eq("inquiry_type", inquiry_type);
    if (search) {
      const pattern = `%${search.replace(/[\\%_]/g, "\\$&")}%`;
      const value = `"${pattern.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
      query = query.or(["name", "email", "company", "subject", "message"].map((field) => `${field}.ilike.${value}`).join(","));
    }
    const { data, error, count } = await query;
    if (error) throw error;
    return NextResponse.json({
      data, viewer: { id: actor.id, name: actor.name, is_manager: actor.role === "admin" },
      pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0) / limit) },
    });
  } catch (error) {
    console.error("Failed to fetch inquiries", error);
    return NextResponse.json({ error: "读取询盘失败" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { actor, status: authStatus } = await getInquiryActor();
    if (!actor) return NextResponse.json({ error: "无询盘访问权限" }, { status: authStatus });
    const parsed = inquiryUpdateSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "无效更新，请刷新并检查状态、负责人和跟进时间" }, { status: 400 });
    const { id, expected_version, ...patch } = parsed.data;
    if (actor.role !== "admin" && patch.assigned_to !== undefined) {
      return NextResponse.json({ error: "只有主管可以分配或转交" }, { status: 403 });
    }
    const db = getSupabaseClient();
    if (patch.assigned_to) {
      const { data: owner, error } = await db.from("users").select("role, permissions, is_active")
        .eq("id", patch.assigned_to).maybeSingle();
      if (error) throw error;
      if (!owner || !canManageInquiries(owner)) return NextResponse.json({ error: "负责人未启用或无询盘权限" }, { status: 400 });
    }
    // Ownership and version are part of the atomic UPDATE predicate, not a prior read.
    let query = db.from("inquiries").update({ ...patch, workflow_version: expected_version + 1, updated_at: new Date().toISOString() })
      .eq("id", id).eq("workflow_version", expected_version);
    if (actor.role !== "admin") query = query.eq("assigned_to", actor.id);
    if (new URL(request.url).searchParams.get("inquiry_type") === "rfq") query = query.eq("inquiry_type", "rfq");
    const { data, error } = await query.select().maybeSingle();
    if (error) throw error;
    if (!data) return NextResponse.json({ error: "记录已更新或不再有权访问，请刷新列表后重试" }, { status: 409 });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: "无效 JSON" }, { status: 400 });
    console.error("Failed to update inquiry", error);
    return NextResponse.json({ error: "保存失败，请确认询盘迁移已执行" }, { status: 500 });
  }
}
