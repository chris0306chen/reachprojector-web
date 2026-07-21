import bcrypt from "bcryptjs";
import { getSupabaseClient } from "@/storage/database/supabase-client";

async function seedAdmin() {
  const supabase = await getSupabaseClient();
  const password = process.env.ADMIN_PASSWORD;
  const email = process.env.ADMIN_EMAIL;
  if (!password || password.length < 12 || !email) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD (12+ characters) are required");
  }
  const passwordHash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase.from("users").insert({
    email: email.toLowerCase().trim(),
    password_hash: passwordHash,
    name: "Admin",
    role: "admin",
    permissions: ["all"],
    is_active: true,
  }).select().single();

  if (error) {
    console.error("Error creating admin:", error);
    return;
  }

  console.log("Admin user created:", data?.email);
}

seedAdmin().catch(console.error);
