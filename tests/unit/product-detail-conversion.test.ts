import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

test("product detail visually removes a duplicated brand prefix from the title", () => {
  const source = fs.readFileSync("src/app/[locale]/products/[slug]/product-detail-client.tsx", "utf8");
  assert.match(source, /simplifyProductTitle\(translatedItem\?\.name \|\| product\.name, product\.brand\)/);
  assert.match(source, /startsWith\(prefix\.toLowerCase\(\)\)/);
});

test("product detail descriptions use readable, scannable layout classes", () => {
  const source = fs.readFileSync("src/components/product-detail-sections.tsx", "utf8");
  assert.match(source, /max-w-4xl space-y-6 text-pretty/);
  assert.match(source, /text-lg font-semibold leading-7/);
});
