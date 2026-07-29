import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, hasPermission } from "@/lib/auth";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ task_id: string }> }
) {
  await params;
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, "products")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(
    { error: "旧版发布接口已停用，请使用预检后导入草稿的工作流" },
    { status: 410 }
  );
}
