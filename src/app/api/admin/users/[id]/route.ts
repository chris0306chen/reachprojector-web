import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { getCurrentUser, hashPassword } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser?.role !== "admin") {
      return NextResponse.json({ error: "Administrator access required" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, email, role, permissions, is_active, password } = body;

    if (role !== undefined && role !== "admin" && role !== "staff") {
      return NextResponse.json({ error: "Invalid user role" }, { status: 400 });
    }
    if (permissions !== undefined && (!Array.isArray(permissions) || !permissions.every((permission) => typeof permission === "string"))) {
      return NextResponse.json({ error: "Invalid permissions" }, { status: 400 });
    }
    if (password && password.length < 12) {
      return NextResponse.json({ error: "Password must be at least 12 characters" }, { status: 400 });
    }

    const supabase = await getSupabaseClient();
    if (currentUser.userId === id && (role === "staff" || is_active === false)) {
      return NextResponse.json({ error: "You cannot demote or deactivate your own account" }, { status: 400 });
    }

    const { data: target, error: targetError } = await supabase
      .from("users")
      .select("role, is_active")
      .eq("id", id)
      .single();
    if (targetError) throw targetError;

    if (target?.role === "admin" && target.is_active && (role === "staff" || is_active === false)) {
      const { count, error: countError } = await supabase
        .from("users")
        .select("id", { count: "exact", head: true })
        .eq("role", "admin")
        .eq("is_active", true);
      if (countError) throw countError;
      if ((count || 0) <= 1) {
        return NextResponse.json({ error: "The last active administrator cannot be demoted or deactivated" }, { status: 400 });
      }
    }

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email.toLowerCase().trim();
    if (role !== undefined) updateData.role = role;
    if (permissions !== undefined) updateData.permissions = permissions;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (password) updateData.password_hash = await hashPassword(password);

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select("id, email, name, role, permissions, is_active")
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();
    if (currentUser?.role !== "admin") {
      return NextResponse.json({ error: "Administrator access required" }, { status: 403 });
    }
    if (currentUser.userId === id) {
      return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
    }

    const supabase = await getSupabaseClient();
    const { data: target, error: targetError } = await supabase
      .from("users")
      .select("role")
      .eq("id", id)
      .single();
    if (targetError) throw targetError;

    if (target?.role === "admin") {
      const { count, error: countError } = await supabase
        .from("users")
        .select("id", { count: "exact", head: true })
        .eq("role", "admin")
        .eq("is_active", true);
      if (countError) throw countError;
      if ((count || 0) <= 1) {
        return NextResponse.json({ error: "The last active administrator cannot be deleted" }, { status: 400 });
      }
    }

    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
