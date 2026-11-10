import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { normalizeShippingTemplate } from "../src/lib/shipping-template";
import * as brandPolicy from "../src/lib/shipping-brand-policy";
import * as calculator from "../src/lib/shipping-quote";
import { shippingMethodLabel, INCLUDED_SHIPPING_LABEL, INCLUDED_TAX_LABEL } from "../src/lib/shipping-label";

const productId = "11111111-1111-4111-8111-111111111111";
const otherId = "22222222-2222-4222-8222-222222222222";
const template = {
  name: "Included for selected product", country_code: "US", trade_terms: "SHIPPING_INCLUDED",
  product_ids: [productId], shipping_class: "parcel", currency: "USD", method: "air",
  is_active: true, valid_from: "2020-01-01", valid_to: "2099-12-31",
  min_weight_kg: 0, max_weight_kg: 10, base_weight_kg: 1, base_fee: 0,
  increment_weight_kg: 0.5, increment_fee: 0, minimum_fee: 0, volumetric_divisor: 6000,
};

const paidRate = { ...template, trade_terms: "DDP", product_ids: [], base_fee: 10 };

function quoting(rows: Record<string, unknown>[], overrides: Record<string, unknown> = {}) {
  const product = { id: productId, brand: "Hisense", name: "Hisense projector", is_active: true, shipping_class: "parcel", package_count: 1,
    shipping_quote_required: false, packed_weight_kg: 1, package_length_cm: 10,
    package_width_cm: 10, package_height_cm: 10, ...overrides };
  const client = {
    from(table: string) {
      let result = table === "products" ? [product] : rows;
      const query = {
        select() { return query; },
        eq(key: string, value: unknown) { result = result.filter((row) => row[key] === value); return query; },
        in(key: string, values: unknown[]) { result = result.filter((row) => values.includes(row[key])); return query; },
        lte(key: string, value: string) { result = result.filter((row) => String(row[key]) <= value); return query; },
        gte(key: string, value: string) { result = result.filter((row) => String(row[key]) >= value); return query; },
        order() { return query; },
        maybeSingle: async () => ({ data: result[0] ?? null, error: null }),
        then(resolve: (value: unknown) => unknown) { return Promise.resolve({ data: result, error: null }).then(resolve); },
      };
      return query;
    },
  };
  const exports: Record<string, (...args: unknown[]) => Promise<Record<string, unknown>>> = {};
  const source = readFileSync(new URL("../src/lib/shipping.ts", import.meta.url), "utf8");
  runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, {
    exports,
    require(name: string) {
      if (name === "@/lib/shipping-brand-policy") return brandPolicy;
      if (name === "@/lib/shipping-quote") return calculator;
      if (name === "@/storage/database/supabase-client") return { getSupabaseClient: () => client };
      throw new Error(name);
    },
  });
  return exports.getShippingQuote;
}

test("template save/read preserves explicit selection and zero fees without enabling defaults", () => {
  const saved = normalizeShippingTemplate(template);
  const reread = normalizeShippingTemplate(JSON.parse(JSON.stringify(saved)));
  assert.deepEqual(reread.product_ids, [productId]);
  assert.equal(reread.trade_terms, "SHIPPING_INCLUDED");
  assert.equal(reread.base_fee, 0);
  assert.equal(reread.is_active, true);
  assert.equal(normalizeShippingTemplate({ ...template, is_active: undefined }).is_active, false);
});

test("included templates require product and country scopes and strictly zero fees", () => {
  for (const patch of [{ product_ids: [] }, { product_ids: ["invalid"] }, { country_code: "" }, { base_fee: 1 }, { increment_fee: 1 }, { minimum_fee: 1 }, { base_fee: NaN }, { base_fee: -1 }]) {
    assert.throws(() => normalizeShippingTemplate({ ...template, ...patch }));
  }
});

test("zero quote applies only to selected product and destination and tax remains unknown", async () => {
  const saved = normalizeShippingTemplate(template);
  const quote = await quoting([paidRate, saved])(productId, "US", 2);
  assert.equal(quote.mode, "automatic");
  assert.equal(quote.shippingCost, 0);
  assert.equal(quote.dutiesIncluded, null);
  assert.equal(quote.tradeTerms, "SHIPPING_INCLUDED");
  assert.equal((await quoting([saved], { id: otherId, brand: "Epson" })(otherId, "US", 1)).mode, "manual_quote");
  assert.equal((await quoting([saved])(productId, "CA", 1)).mode, "manual_quote");
});

test("inactive, expired, unscoped or invalid included rules cannot produce zero checkout", async () => {
  for (const patch of [{ is_active: false }, { valid_to: "2020-01-01" }, { valid_from: "2099-01-01" }, { product_ids: [] }, { base_fee: 1 }, { increment_fee: Infinity }]) {
    assert.equal((await quoting([{ ...template, ...patch }])(productId, "US", 1)).mode, "manual_quote");
  }
  for (const patch of [{ package_length_cm: null }, { shipping_quote_required: true }, { packed_weight_kg: 11 }]) {
    assert.equal((await quoting([template], patch)(productId, "US", 1)).mode, "manual_quote");
  }
});

test("paid zero-fee rules remain blocked and included selection takes precedence", async () => {
  const paid = { ...template, trade_terms: "DAP", product_ids: [], base_fee: 10 };
  assert.equal((await quoting([paid, template])(productId, "US", 1)).shippingCost, 0);
  assert.equal((await quoting([paid, template], { id: otherId, brand: "Epson" })(otherId, "US", 1)).shippingCost, 10);
  assert.equal((await quoting([{ ...paid, base_fee: 0 }])(productId, "US", 1)).mode, "manual_quote");
  assert.equal((await quoting([{ ...paid, country_code: "MX" }])(productId, "MX", 1)).mode, "manual_quote");
});

test("checkout/order/payment labels distinguish included shipping from trade terms", () => {
  const label = shippingMethodLabel({ method: "air", tradeTerms: "SHIPPING_INCLUDED" });
  assert.equal(label, `${INCLUDED_SHIPPING_LABEL}. ${INCLUDED_TAX_LABEL}`);
  assert.doesNotMatch(label, /DDP|DAP/);
  assert.ok(label.length <= 127);
  assert.equal(shippingMethodLabel({ method: "air", tradeTerms: "DDP" }), "air (DDP)");
});

test("Hisense non-VIDDA and AWOL get included shipping only through covered routes", async () => {
  for (const brand of ["Hisense", "HISENSE", "海信", "AWOL", "AWOL Vision"]) {
    const quote = await quoting([paidRate], { brand })(productId, "US", 1);
    assert.equal(quote.shippingCost, 0);
    assert.equal(quote.tradeTerms, "SHIPPING_INCLUDED");
    assert.equal(quote.dutiesIncluded, null);
    assert.equal((await quoting([paidRate], { brand })(productId, "CA", 1)).mode, "manual_quote");
    assert.equal((await quoting([template], { brand })(productId, "US", 1)).mode, "manual_quote");
    assert.equal((await quoting([{ ...paidRate, trade_terms: "MANUAL_QUOTE" }], { brand })(productId, "US", 1)).mode, "manual_quote");
    assert.equal((await quoting([paidRate], { brand, shipping_quote_required: true })(productId, "US", 1)).mode, "manual_quote");
  }
});

test("VIDDA exclusions override brand eligibility and explicit product inclusion", async () => {
  for (const identity of [
    { brand: "VIDDA" }, { brand: "Hisense VIDDA" },
    { brand: "Hisense", name: "Hisense Vidda C2" },
    { brand: "Hisense", model: "VIDDA C2" },
    { brand: "Hisense", slug: "hisense-vidda-c2" },
    { brand: "Hisense", specifications: { series: "VIDDA" } },
    { brand: "Hisense", detail_content: { specifications: [{ name: "系列", value: "Vidda" }] } },
    { brand: "AWOL", model: "VIDDA" },
  ]) {
    const quote = await quoting([paidRate, template], identity)(productId, "US", 1);
    assert.equal(quote.shippingCost, 10, JSON.stringify(identity));
    assert.equal(quote.tradeTerms, "DDP");
  }
});

test("other or ambiguous brands retain existing paid or manual quoting", async () => {
  for (const brand of ["Epson", "BenQ", "Not Hisense", "AWOL-compatible", "", null]) {
    const quote = await quoting([{ ...paidRate, trade_terms: "DAP" }, template], { brand })(productId, "US", 1);
    assert.equal(quote.shippingCost, 10);
    assert.equal(quote.tradeTerms, "DAP");
  }
});

test("approved Aetherion US bulk route bills at least 25 kg without widening other coverage", async () => {
  const id = "70bf6e4a-c53f-4390-8ea8-23bb4db81046";
  const product = { id, brand: "AWOL Vision", packed_weight_kg: 13.6, package_length_cm: 74, package_width_cm: 32, package_height_cm: 57 };
  const rate = { ...paidRate, method: "国际快递(大货)", min_weight_kg: 25, max_weight_kg: 300, increment_weight_kg: 1, base_fee: 0, increment_fee: 9.29 };
  const result = await quoting([rate], product)(id, "US", 2);
  assert.equal(result.mode, "automatic");
  assert.equal(result.actualWeightPerPackageKg, 13.6);
  assert.equal(result.volumetricWeightPerPackageKg, 22.5);
  assert.equal(result.chargeableWeightPerPackageKg, 25);
  assert.equal(result.totalChargeableWeightKg, 50);
  assert.equal(result.shippingCost, 0);
  assert.equal(result.tradeTerms, "SHIPPING_INCLUDED");
  assert.equal(result.dutiesIncluded, null);
  for (const patch of [{ id: otherId }, { brand: "VIDDA" }, { shipping_quote_required: true }, { package_count: 2 }, { packed_weight_kg: 301 }, { package_length_cm: null }]) {
    const item = { ...product, ...patch };
    assert.equal((await quoting([rate], item)(item.id, "US", 1)).mode, "manual_quote");
  }
  for (const patch of [{ country_code: "CA" }, { method: "other" }, { trade_terms: "DAP" }, { is_active: false }, { valid_to: "2020-01-01" }, { min_weight_kg: 30 }]) {
    const route = { ...rate, ...patch };
    assert.equal((await quoting([route], product)(id, route.country_code, 1)).mode, "manual_quote");
  }
  assert.equal((await quoting([rate], { ...product, packed_weight_kg: 26 })(id, "US", 1)).chargeableWeightPerPackageKg, 26);
});
