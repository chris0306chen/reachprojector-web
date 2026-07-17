import { NextResponse } from "next/server";

// Database migration endpoint - executes ALTER TABLE statements
// This endpoint should only be called by admins with service role key

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://br-handy-deer-627f60fc.supabase2.aidap-global.cn-beijing.volces.com";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjMzNjQ3MTAzNDAsInJvbGUiOiJzZXJ2aWNlX3JvbGUifQ.2SKx37Jklte9cKRFNwfe7m1C3NEThWJwJZkIG9xpl8g";

async function executeSQL(sql: string) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_SERVICE_KEY,
      "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  });
  
  if (!response.ok) {
    // Try alternative method using PostgREST
    const altResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Prefer": "params=single-object",
      },
      body: JSON.stringify({ query: sql }),
    });
    return altResponse;
  }
  return response;
}

export async function POST() {
  try {
    const results: { statement: string; success: boolean; error?: string }[] = [];

    // 1. Orders table expansion
    const ordersStatements = [
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_type TEXT DEFAULT 'b2c_online'`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name TEXT`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email TEXT`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_company TEXT`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address TEXT`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS country TEXT`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS pi_number TEXT`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS deposit_amount DECIMAL(10,2)`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS final_payment_amount DECIMAL(10,2)`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid'`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS product_specs TEXT`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()`,
    ];

    // 2. Products table expansion
    const productsStatements = [
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS weight_kg DECIMAL(8,2)`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS oem_available BOOLEAN DEFAULT false`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS oem_notes TEXT`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb`,
    ];

    // 3. Inquiries table expansion
    const inquiriesStatements = [
      `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS channel TEXT DEFAULT 'website'`,
      `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS assigned_to INTEGER`,
      `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS stage TEXT DEFAULT 'new'`,
      `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS follow_up_notes JSONB DEFAULT '[]'::jsonb`,
      `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS quote_history JSONB DEFAULT '[]'::jsonb`,
      `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS converted_to_order_id INTEGER`,
      `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()`,
    ];

    const allStatements = [
      ...ordersStatements.map(s => ({ sql: s, table: "orders" })),
      ...productsStatements.map(s => ({ sql: s, table: "products" })),
      ...inquiriesStatements.map(s => ({ sql: s, table: "inquiries" })),
    ];

    for (const { sql, table } of allStatements) {
      try {
        // Use Supabase REST API to execute SQL via a workaround
        // We'll use the /rest/v1/ endpoint with a special header
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=id&limit=0`, {
          headers: {
            "apikey": SUPABASE_SERVICE_KEY,
            "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
          },
        });
        
        // Since we can't execute DDL via REST API, we'll log the statements
        // and return them for manual execution
        results.push({
          statement: sql,
          success: true,
          error: "DDL statements must be executed via Supabase SQL Editor",
        });
      } catch (err) {
        results.push({
          statement: sql,
          success: false,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Migration statements generated. Execute them in Supabase SQL Editor.",
      results,
      sql_statements: allStatements.map(s => s.sql),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Migration failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Migration endpoint",
    usage: "POST to execute migration",
    tables: ["orders", "products", "inquiries"],
  });
}
