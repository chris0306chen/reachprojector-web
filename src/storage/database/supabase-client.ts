import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface SupabaseCredentials {
  url: string;
  anonKey: string;
}

function loadEnv(): void {
  // Environment variables are provided by Vercel in production.
}

function getSupabaseCredentials(): SupabaseCredentials {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_KEY;
  if (!url || !anonKey) {
    throw new Error('SUPABASE_URL and SUPABASE_KEY must be configured');
  }
  return { url, anonKey };
}

function getSupabaseServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY must be configured');
  return key;
}

function getSupabaseClient(token?: string): SupabaseClient {
  const { url } = getSupabaseCredentials();

  let key: string;
  if (token) {
    key = token;
  } else {
    key = getSupabaseServiceRoleKey();
  }

  return createClient(url, key, {
    db: {
      timeout: 60000,
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export { loadEnv, getSupabaseCredentials, getSupabaseServiceRoleKey, getSupabaseClient };
