import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHmac, timingSafeEqual } from "node:crypto";
import { runInNewContext } from "node:vm";
import { after, before, test } from "node:test";
import { Client } from "pg";
import ts from "typescript";
import * as labels from "../../src/lib/shipping-label";
import * as address from "../../src/lib/order-address";

// Fixed disposable DB, synthetic signed events, no provider or email network calls.
const db = new Client({ connectionString: "postgres://acceptance:isolated-test-only@127.0.0.1:55467/fulfillment_acceptance" });
const secret = "synthetic-webhook-secret";
let notifications = 0;
let post: (request: unknown) => Promise<Response>;
before(async () => {
  await db.connect();
  assert.equal((await db.query("SELECT current_database() AS name")).rows[0].name, "fulfillment_acceptance");
  // Connection-local table; leaves the existing fulfillment fixture untouched.
  await db.query("CREATE TEMP TABLE webhook_orders (session_id text PRIMARY KEY, payload jsonb NOT NULL)");
  const exports: Record<string, typeof post> = {};
  const source = readFileSync(new URL("../../src/app/api/stripe/webhook/route.ts", import.meta.url), "utf8");
  runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, {
    exports, Buffer, console, process: { env: { STRIPE_WEBHOOK_SECRET: secret } },
    require(name: string) {
      if (name === "node:crypto") return { createHmac, timingSafeEqual };
      if (name === "next/server") return { NextResponse: { json: Response.json } };
      if (name === "@/lib/shipping-label") return labels;
      if (name === "@/lib/order-address") return address;
      if (name === "@/lib/order-email") return { sendOrderConfirmation: async () => { notifications++; } };
      if (name === "@/lib/checkout") return { getCheckoutItem: async () => ({ id: "synthetic-product", name: "Synthetic projector", quantity: 2, total: "200.00", currency: "USD" }) };
      if (name === "@/lib/shipping") return { getShippingQuote: async () => ({ mode: "automatic", shippingCost: 0, currency: "USD", method: "air", tradeTerms: "SHIPPING_INCLUDED" }) };
      if (name === "@/lib/data-service") return {
        getOrderByStripeSessionId: async (id: string) => (await db.query("SELECT payload FROM webhook_orders WHERE session_id=$1", [id])).rows[0]?.payload,
        createPaidOrder: async (order: Record<string, unknown>) => {
          await db.query("INSERT INTO webhook_orders VALUES ($1,$2)", [order.stripe_session_id, JSON.stringify(order)]);
          return order;
        },
      };
      throw new Error(`Unexpected import: ${name}`);
    },
  });
  post = exports.POST;
});
after(async () => { await db.end(); });

async function invoke(changes: Record<string, unknown> = {}, signatureMode = "valid") {
  const payload = JSON.stringify({ id: "evt_synthetic", type: "checkout.session.completed", data: { object: {
    id: "cs_test_synthetic_shipping", payment_status: "paid", amount_total: 20000, currency: "usd",
    payment_intent: "pi_synthetic", metadata: { product_id: "synthetic-product", quantity: "2", country_code: "US" },
    customer_details: { name: "Synthetic Buyer", email: "nobody@example.invalid" },
    collected_information: { shipping_details: { name: "Synthetic Buyer", address: { line1: "1 Test Street", city: "Test City", country: "US" } } },
    ...changes,
  } } });
  const timestamp = Math.floor(Date.now() / 1000) - (signatureMode === "stale" ? 600 : 0);
  const digest = createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
  const signature = signatureMode === "invalid" ? "0".repeat(64) : digest;
  return post({ text: async () => payload, headers: new Headers({ "stripe-signature": `t=${timestamp},v1=${signature}` }) });
}

test("signed callback persists zero shipping and full disclosure once", async () => {
  assert.equal((await invoke()).status, 200);
  const saved = (await db.query("SELECT payload FROM webhook_orders")).rows[0].payload;
  assert.equal(saved.amount, "200.00");
  assert.equal(saved.shipping_cost, "0.00");
  assert.equal(saved.shipping_method, `${labels.INCLUDED_SHIPPING_LABEL}. ${labels.INCLUDED_TAX_LABEL}`);
  assert.equal(saved.payment_status, "paid");
  assert.equal(saved.status, "preparing");
  assert.match(saved.shipping_address, /1 Test Street/);
  assert.equal((await invoke()).status, 200);
  assert.equal((await db.query("SELECT count(*)::int AS count FROM webhook_orders")).rows[0].count, 1);
  assert.equal(notifications, 1);
});

test("invalid or stale signatures never persist an order", async () => {
  await db.query("TRUNCATE webhook_orders");
  notifications = 0;
  assert.equal((await invoke({}, "invalid")).status, 401);
  assert.equal((await invoke({}, "stale")).status, 401);
  assert.equal((await db.query("SELECT count(*)::int AS count FROM webhook_orders")).rows[0].count, 0);
  assert.equal(notifications, 0);
});

test("unpaid, amount/currency mismatch and country mismatch cannot create paid orders", async () => {
  for (const [changes, status] of [
    [{ payment_status: "unpaid" }, 200],
    [{ amount_total: 20001 }, 409],
    [{ currency: "eur" }, 409],
    [{ collected_information: { shipping_details: { address: { country: "CA" } } } }, 409],
  ] as const) assert.equal((await invoke(changes)).status, status);
  assert.equal((await db.query("SELECT count(*)::int AS count FROM webhook_orders")).rows[0].count, 0);
  assert.equal(notifications, 0);
});
