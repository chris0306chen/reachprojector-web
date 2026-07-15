import { createClient, SupabaseClient } from '@supabase/supabase-js';

let envLoaded = false;

interface SupabaseCredentials {
  url: string;
  anonKey: string;
}

function loadEnv(): void {
  // 标准环境变量优先（Vercel 等部署平台），fallback 到 Coze 专用变量
  if (envLoaded || process.env.SUPABASE_URL || process.env.COZE_SUPABASE_URL) {
    return;
  }

  try {
    // 尝试 dotenv
    try {
      require('dotenv').config();
      if (process.env.SUPABASE_URL || process.env.COZE_SUPABASE_URL) {
        envLoaded = true;
        return;
      }
    } catch {
      // dotenv not available
    }

    // 尝试 Coze workload identity（仅 Coze 环境可用）
    try {
      const { execSync } = require('child_process');
      const pythonCode = `
import os
import sys
try:
    from coze_workload_identity import Client
    client = Client()
    env_vars = client.get_project_env_vars()
    client.close()
    for env_var in env_vars:
        print(f"{env_var.key}={env_var.value}")
except Exception as e:
    print(f"# Error: {e}", file=sys.stderr)
`;
      const output = execSync(`python3 -c '${pythonCode.replace(/'/g, "'\"'\"'")}'`, {
        encoding: 'utf-8',
        timeout: 10000,
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      const lines = output.trim().split('\n');
      for (const line of lines) {
        if (line.startsWith('#')) continue;
        const eqIndex = line.indexOf('=');
        if (eqIndex > 0) {
          const key = line.substring(0, eqIndex);
          let value = line.substring(eqIndex + 1);
          if ((value.startsWith("'") && value.endsWith("'")) ||
              (value.startsWith('"') && value.endsWith('"'))) {
            value = value.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      }
      envLoaded = true;
    } catch {
      // Coze workload identity not available (e.g. Vercel)
    }
  } catch {
    // Silently fail
  }
}

function getSupabaseCredentials(): SupabaseCredentials {
  loadEnv();

  // 优先读标准环境变量（Vercel 等），fallback 到 Coze 专用变量
  const url = process.env.SUPABASE_URL || process.env.COZE_SUPABASE_URL || 'https://br-handy-deer-627f60fc.supabase2.aidap-global.cn-beijing.volces.com';
  const anonKey = process.env.SUPABASE_KEY || process.env.COZE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjMzNjQ3MTAzNDAsInJvbGUiOiJzZXJ2aWNlX3JvbGUifQ.2SKx37Jklte9cKRFNwfe7m1C3NEThWJwJZkIG9xpl8g';

  return { url, anonKey };
}

function getSupabaseServiceRoleKey(): string | undefined {
  loadEnv();
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.COZE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjMzNjQ3MTAzNDAsInJvbGUiOiJzZXJ2aWNlX3JvbGUifQ.2SKx37Jklte9cKRFNwfe7m1C3NEThWJwJZkIG9xpl8g';
}

function getSupabaseClient(token?: string): SupabaseClient {
  const { url, anonKey } = getSupabaseCredentials();

  let key: string;
  if (token) {
    key = anonKey;
  } else {
    const serviceRoleKey = getSupabaseServiceRoleKey();
    key = serviceRoleKey ?? anonKey;
  }

  const globalOptions: Record<string, any> = {};
  if (token) {
    globalOptions.headers = { Authorization: `Bearer ${token}` };
  }

  // 尝试加载 Coze 上报（仅 Coze 环境）
  try {
    const { getReportBuffer, createWrappedFetch } = require('coze-coding-dev-sdk');
    const buffer = getReportBuffer();
    if (buffer) {
      globalOptions.fetch = createWrappedFetch(buffer, 'supabase');
    }
  } catch {
    // coze-coding-dev-sdk not available (e.g. Vercel)
  }

  return createClient(url, key, {
    global: globalOptions,
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
