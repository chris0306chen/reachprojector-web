import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Hardcoded Supabase credentials - new database
const SUPABASE_URL = 'https://br-handy-deer-627f60fc.supabase2.aidap-global.cn-beijing.volces.com';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjMzNjQ3MTAzNDAsInJvbGUiOiJzZXJ2aWNlX3JvbGUifQ.2SKx37Jklte9cKRFNwfe7m1C3NEThWJwJZkIG9xpl8g';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjMzNjQ3MTAzNDAsInJvbGUiOiJhbm9uIn0.-b5mkT7uzeORIibBpb9HiIY1bqS9T4Hl8la5JZdf2Mo';

interface SupabaseCredentials {
  url: string;
  anonKey: string;
}

function loadEnv(): void {
  // No-op: credentials are hardcoded
}

function getSupabaseCredentials(): SupabaseCredentials {
  return { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY };
}

function getSupabaseServiceRoleKey(): string {
  return SUPABASE_SERVICE_ROLE_KEY;
}

function getSupabaseClient(token?: string): SupabaseClient {
  const { url } = getSupabaseCredentials();

  let key: string;
  if (token) {
    key = token;
  } else {
    key = SUPABASE_SERVICE_ROLE_KEY;
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
