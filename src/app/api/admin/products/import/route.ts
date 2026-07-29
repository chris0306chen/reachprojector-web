import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, hasPermission } from "@/lib/auth";

export async function POST(_request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, "products")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(
    { error: "旧版采集接口已停用，请使用安全的产品链接采集页面" },
    { status: 410 }
  );
}
