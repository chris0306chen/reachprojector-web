import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface SupabaseCredentials {
  url: string;
  anonKey: string;
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function loadEnv(): void {
  // Environment variables are supplied by Vercel/local .env files.
}

function getSupabaseCredentials(): SupabaseCredentials {
  return {
    url: getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: getRequiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  };
}

function getSupabaseServiceRoleKey(): string {
  return getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');
}

function getSupabaseClient(token?: string): SupabaseClient {
  const { url, anonKey } = getSupabaseCredentials();
  const key = token || process.env.SUPABASE_SERVICE_ROLE_KEY || anonKey;

  return createClient(url, key, {
    db: { timeout: 60000 },
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export { loadEnv, getSupabaseCredentials, getSupabaseServiceRoleKey, getSupabaseClient };
