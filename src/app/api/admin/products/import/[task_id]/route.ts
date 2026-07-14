import { NextRequest, NextResponse } from "next/server";

// Access the task store from the import route
// In production, use Redis or database for task storage
const taskStore = new Map<string, {
  taskId: string;
  status: string;
  url: string;
  data?: Record<string, unknown>;
  error?: string;
}>();

// Re-export the shared store reference
// This is a simplified approach - in production use a proper store
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ task_id: string }> }
) {
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
