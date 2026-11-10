import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as labels from "../src/lib/shipping-label";

function route(provider: "stripe" | "paypal", manual = false) {
  const calls: Array<{ url: string; body: string }> = [];
  const exports: Record<string, (request: unknown) => Promise<Response>> = {};
  const path = provider === "stripe" ? "stripe/create-checkout-session" : "paypal/create-order";
  const source = readFileSync(new URL(`../src/app/api/${path}/route.ts`, import.meta.url), "utf8");
  runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, {
    exports, Buffer, URLSearchParams, console,
    process: { env: { STRIPE_SECRET_KEY: "sk_test_fake", PAYPAL_CLIENT_ID: "sandbox-fake", PAYPAL_SECRET: "sandbox-fake", PAYPAL_BASE_URL: "https://api-m.sandbox.paypal.com", NEXT_PUBLIC_SITE_URL: "https://example.invalid" } },
    // No network fetch exists in this sandbox: all provider responses are fixtures.
    fetch: async (url: string, options: { body: string }) => {
      calls.push({ url, body: options.body });
      if (url.endsWith("/token")) return Response.json({ access_token: "fake-token" });
      return Response.json(provider === "stripe" ? { url: "https://checkout.stripe.com/test-fixture" } : { id: "TEST-ORDER", status: "CREATED" });
    },
    require(name: string) {
      if (name === "next/server") return { NextResponse: { json: Response.json } };
      if (name === "@/lib/shipping-label") return labels;
      if (name === "@/i18n/config") return { locales: ["en"], defaultLocale: "en" };
      if (name === "@/lib/checkout") return { getCheckoutItem: async () => ({ id: "product", name: "Synthetic product", quantity: 2, unitPrice: 100, total: "200.00", currency: "USD" }) };
      if (name === "@/lib/shipping") return { getShippingQuote: async () => manual ? { mode: "manual_quote" } : ({ mode: "automatic", shippingCost: 0, currency: "USD", templateId: "template", tradeTerms: "SHIPPING_INCLUDED", method: "air", dutiesIncluded: null }) };
      throw new Error(`Unexpected import: ${name}`);
    },
  });
  return { calls, invoke: () => exports.POST({ json: async () => ({ productId: "product", quantity: 2, countryCode: "US" }) }) };
}

test("Stripe request retains zero shipping and tax disclosure", async () => {
  const app = route("stripe");
  assert.equal((await app.invoke()).status, 200);
  const body = new URLSearchParams(app.calls[0].body);
  assert.equal(body.get("line_items[1][price_data][unit_amount]"), "0");
  assert.equal(body.get("line_items[0][price_data][unit_amount]"), "10000");
  assert.equal(body.get("metadata[shipping_cost]"), "0.00");
  assert.match(body.get("line_items[1][price_data][product_data][name]"), /Shipping included in product price/);
  assert.match(body.get("line_items[1][price_data][product_data][name]"), /not guaranteed included/);
});
test("PayPal sandbox request totals exclude additional shipping charges", async () => {
  const app = route("paypal");
  assert.equal((await app.invoke()).status, 200);
  assert.ok(app.calls.every((call) => call.url.startsWith("https://api-m.sandbox.paypal.com/")));
  const unit = JSON.parse(app.calls[1].body).purchase_units[0];
  assert.equal(unit.amount.value, "200.00");
  assert.equal(unit.amount.breakdown.shipping.value, "0.00");
  assert.match(unit.description, /not guaranteed included/);
});
test("manual quoting blocks both payment requests", async () => {
  for (const provider of ["stripe", "paypal"] as const) {
    const app = route(provider, true);
    assert.equal((await app.invoke()).status, 409);
    assert.equal(app.calls.length, 0);
  }
});
