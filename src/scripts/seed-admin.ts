import bcrypt from "bcryptjs";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { users } from "@/storage/database/shared/schema";

async function seedAdmin() {
  const supabase = await getSupabaseClient();
  const password = "Reach@2024Admin";
  const passwordHash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase.from("users").insert({
    email: "admin@reachprojector.com",
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
