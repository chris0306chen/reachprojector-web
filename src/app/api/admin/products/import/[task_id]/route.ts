import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, hasPermission } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ task_id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, "products")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { task_id } = await params;
  
  // Try to get from shared store (same process)
  const tasks = (globalThis as Record<string, unknown>).__importTasks as Map<string, unknown> | undefined;
  if (tasks && tasks.has(task_id)) {
    return NextResponse.json(tasks.get(task_id));
  }

  return NextResponse.json({ 
    taskId: task_id, 
    status: "not_found",
    error: "Task not found. It may have expired." 
  }, { status: 404 });
}
