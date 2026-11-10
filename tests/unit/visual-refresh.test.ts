import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const detail = fs.readFileSync("src/app/[locale]/products/[slug]/product-detail-client.tsx", "utf8");
const listing = fs.readFileSync("src/app/[locale]/products/products-client.tsx", "utf8");

test("product detail keeps one visually primary CTA and touch-sized secondary actions", () => {
  assert.match(detail, /grid gap-3 mb-6 sm:flex sm:flex-wrap/);
  assert.match(detail, /bg-orange-500 px-6 py-3 font-medium text-white/);
  assert.match(detail, /border border-green-600 bg-white/);
  assert.match(detail, /min-h-12/);
});

test("product listing sort control remains full-width and usable on narrow screens", () => {
  assert.match(listing, /flex w-full items-center gap-2 sm:w-auto/);
  assert.match(listing, /min-w-0 flex-1 rounded-lg/);
});
