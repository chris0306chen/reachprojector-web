import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { hashPassword } from "@/lib/auth";
import { getCurrentUser } from "@/lib/auth";

async function requireAdministrator() {
  const user = await getCurrentUser();
  return user?.role === "admin" ? user : null;
}

export async function GET() {
  try {
    if (!(await requireAdministrator())) {
      return NextResponse.json({ error: "Administrator access required" }, { status: 403 });
    }

    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from("users")
      .select("id, email, name, role, permissions, is_active, last_login_at, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await requireAdministrator())) {
      return NextResponse.json({ error: "Administrator access required" }, { status: 403 });
    }

    const body = await request.json();
    const { email, password, name, role, permissions } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 });
    }

    if (password.length < 12) {
      return NextResponse.json({ error: "Password must be at least 12 characters" }, { status: 400 });
    }

    if (role !== "admin" && role !== "staff") {
      return NextResponse.json({ error: "Invalid user role" }, { status: 400 });
    }

    if (!Array.isArray(permissions) || !permissions.every((permission) => typeof permission === "string")) {
      return NextResponse.json({ error: "Invalid permissions" }, { status: 400 });
    }

    const supabase = await getSupabaseClient();

    // Check if user already exists
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const { data, error } = await supabase
      .from("users")
      .insert({
        email: email.toLowerCase().trim(),
        password_hash: passwordHash,
        name,
        role: role || "staff",
        permissions: permissions || [],
        is_active: true,
      })
      .select("id, email, name, role, permissions, is_active, created_at")
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("Failed to create user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
