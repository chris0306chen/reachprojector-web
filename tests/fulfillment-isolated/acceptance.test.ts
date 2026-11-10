import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { after, before, test } from "node:test";
import { Client } from "pg";
import { createClient } from "@supabase/supabase-js";
import ts from "typescript";
import * as orderStatus from "../../src/lib/order-status";

// Fixed loopback endpoints: never read application or production credentials.
const db = new Client({ connectionString: "postgres://acceptance:isolated-test-only@127.0.0.1:55467/fulfillment_acceptance" });
const rest = createClient("http://127.0.0.1:55468", "isolated-test-only", {
  auth: { persistSession: false, autoRefreshToken: false },
  global: {
    // Standalone PostgREST has no Supabase gateway or JWT service.
    fetch: (input, init) => {
      const url = new URL(String(input));
      assert.equal(url.origin, "http://127.0.0.1:55468");
      url.pathname = url.pathname.replace(/^\/rest\/v1/, "");
      const headers = new Headers(init?.headers);
      headers.delete("authorization");
      return fetch(url, { ...init, headers, redirect: "error" });
    },
  },
});
const endpoints = [
  ["route.ts", { tracking_number: "TRACK-1" }],
  ["[id]/status/route.ts", { status: "shipped" }],
  ["[id]/ship/route.ts", { tracking_number: "TRACK-1", shipping_method: "Air" }],
] as const;

before(async () => {
  await db.connect();
  assert.equal((await db.query("SELECT current_database() AS name")).rows[0].name, "fulfillment_acceptance");
  const { error } = await rest.from("orders").select("id").limit(1);
  assert.equal(error, null, "Start the isolated compose stack before running this suite");
});
after(async () => { await db.end(); });

async function seed(status: string, payment: string, type = "b2b_offline", tracking: string | null = null) {
  await db.query("TRUNCATE public.orders");
  await db.query("INSERT INTO public.orders (id, order_id, order_type, status, payment_status, tracking_number) VALUES ('order-1', 'ACCEPTANCE-1', $1, $2, $3, $4)", [type, status, payment, tracking]);
}
async function row() {
  return (await db.query("SELECT * FROM public.orders WHERE id = 'order-1'")).rows[0];
}

function handler(route: string, onRead?: () => Promise<void>) {
  let notifications = 0;
  // Real Supabase/PostgREST reads and writes; the hook only controls race timing.
  const client = {
    from(table: string) {
      assert.equal(table, "orders");
      const builder = rest.from(table);
      return {
        update: builder.update.bind(builder),
        select(columns: string) {
          let query = builder.select(columns);
          const read = {
            eq(column: string, value: string) { query = query.eq(column, value); return read; },
            async maybeSingle() {
              const result = await query.maybeSingle();
              if (onRead) await onRead();
              return result;
            },
          };
          return read;
        },
      };
    },
  };
  const exports: Record<string, (request: unknown, context: unknown) => Promise<Response>> = {};
  const source = readFileSync(new URL(`../../src/app/api/admin/orders/${route}`, import.meta.url), "utf8");
  runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, {
    exports, URL, console,
    require(name: string) {
      if (name === "next/server") return { NextResponse: { json: (body: unknown, options?: ResponseInit) => Response.json(body, options) } };
      if (name === "@/storage/database/supabase-client") return { getSupabaseClient: () => client };
      if (name === "@/lib/order-status") return orderStatus;
      // Do not import the real email module, including its business-email BCC.
      if (name === "@/lib/order-email") return { sendShippingNotification: async () => { notifications++; } };
      throw new Error(`Unexpected dependency: ${name}`);
    },
  });
  return {
    call: (body: unknown) => exports.PUT({ url: "http://localhost/api/admin/orders?id=order-1", json: async () => body }, { params: Promise.resolve({ id: "order-1" }) }),
    notifications: () => notifications,
  };
}

test("real database: all three endpoints reject unpaid and deposit-only orders", async () => {
  for (const type of ["b2b_offline", "b2c_online"]) {
    for (const payment of ["unpaid", "partial", "refunded"]) {
      for (const [route, body] of endpoints) {
        await seed("preparing", payment, type);
        const app = handler(route);
        assert.equal((await app.call(body)).status, 409);
        assert.equal((await row()).status, "preparing");
        assert.equal((await row()).tracking_number, null);
        assert.equal(app.notifications(), 0);
      }
    }
  }
});

test("real database: fully paid orders ship through each endpoint", async () => {
  for (const type of ["b2b_offline", "b2c_online"]) {
    for (const [route, body] of endpoints) {
      await seed("preparing", "paid", type);
      const app = handler(route);
      assert.equal((await app.call(body)).status, 200);
      assert.equal((await row()).status, "shipped");
      assert.equal((await row()).payment_status, "paid");
      assert.equal(app.notifications(), route.includes("status") ? 0 : 1);
    }
  }
});

test("real database: refund or payment change after read blocks stale writes", async () => {
  for (const change of ["refund", "payment"]) {
    for (const [route, body] of endpoints) {
      await seed("preparing", "paid");
      const app = handler(route, async () => {
        await db.query("UPDATE orders SET status = $1, payment_status = $2 WHERE id = 'order-1'", change === "refund" ? ["refunded", "refunded"] : ["preparing", "partial"]);
      });
      assert.equal((await app.call(body)).status, 409);
      const saved = await row();
      assert.equal(saved.status, change === "refund" ? "refunded" : "preparing");
      assert.equal(saved.payment_status, change === "refund" ? "refunded" : "partial");
      assert.equal(saved.tracking_number, null);
      assert.equal(app.notifications(), 0);
    }
  }
});

test("real database: concurrent duplicate requests have only one winner", async () => {
  for (const [route, body] of endpoints) {
    for (const initial of route === "route.ts" ? ["preparing", "shipped"] : ["preparing"]) {
      for (const tracking of route === "route.ts" ? [null, "OLD-TRACK"] : [null]) {
        await seed(initial, "paid", "b2b_offline", tracking);
        let reads = 0;
        let release: () => void;
        const barrier = new Promise<void>((resolve) => { release = resolve; });
        const app = handler(route, async () => { if (++reads === 2) release(); await barrier; });
        const responses = await Promise.all([app.call(body), app.call(body)]);
        assert.deepEqual(responses.map((response) => response.status).sort(), [200, 409]);
        assert.equal((await row()).status, "shipped");
        assert.equal(app.notifications(), route.includes("status") ? 0 : 1);
      }
    }
  }
});

test("real database: sequential duplicates do not notify again", async () => {
  for (const [route, body] of endpoints) {
    await seed("preparing", "paid");
    const app = handler(route);
    assert.equal((await app.call(body)).status, 200);
    assert.equal((await app.call(body)).status, route.includes("/ship/") ? 409 : 200);
    assert.equal(app.notifications(), route.includes("status") ? 0 : 1);
  }
});

test("real database: cancelled and terminal orders cannot reopen for shipment", async () => {
  for (const status of ["cancelled", "completed", "refunded"]) {
    for (const [route, body] of endpoints) {
      await seed(status, "paid");
      const app = handler(route);
      assert.equal((await app.call(body)).status, 409);
      assert.equal((await row()).status, status);
      assert.equal(app.notifications(), 0);
    }
  }
});
