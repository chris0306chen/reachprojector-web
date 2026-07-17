import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { hashPassword } from "@/lib/auth";

/**
 * POST /api/admin/register
 * Register a new admin user.
 * Body: { email, password, role? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseClient();

    // Check if user already exists
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);
    const { data, error } = await supabase
      .from("users")
      .insert({
        email: email.toLowerCase().trim(),
        password_hash: passwordHash,
        name: email.split("@")[0], // Use email prefix as default name
        role: role || "admin",
        permissions: [],
        is_active: true,
      })
      .select("id, email, name, role, is_active, created_at")
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        message: "Admin user created successfully",
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to register admin:", error);
    return NextResponse.json(
      { error: "Failed to register admin user" },
      { status: 500 }
    );
  }
}
