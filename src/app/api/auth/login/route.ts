import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { verifyPassword, createToken, setAuthCookie } from "@/lib/auth";
import { clearLoginFailures, isLoginBlocked, recordLoginFailure } from "@/lib/login-rate-limit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const attemptKey = `${clientIp}:${normalizedEmail}`;
    const rateLimit = isLoginBlocked(attemptKey);
    if (rateLimit.blocked) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } }
      );
    }

    const supabase = await getSupabaseClient();
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", normalizedEmail)
      .eq("is_active", true)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Admin login database error:', error);
      return NextResponse.json(
        { error: 'Admin database is not initialized' },
        { status: 503 }
      );
    }

    if (!user) {
      recordLoginFailure(attemptKey);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      recordLoginFailure(attemptKey);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await createToken(user);
    await setAuthCookie(token);
    clearLoginFailures(attemptKey);

    // Update last login
    await supabase
      .from("users")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
