import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const packaging = { packed_weight_kg: 13, package_length_cm: 66, package_width_cm: 48,
  package_height_cm: 31, shipping_class: 'parcel', package_count: 1, shipping_quote_required: true };

async function update(body: Record<string, unknown>, stored: Record<string, unknown> = packaging) {
  let written: Record<string, unknown> | undefined;
  const client = { from(table: string) {
    assert.equal(table, 'products');
    const query = {
      select() { return query; }, eq() { return query; },
      update(value: Record<string, unknown>) { written = value; return query; },
      async single() { return { data: written || { is_active: false, ...stored }, error: null }; },
    };
    return query;
  } };
  const exports: { PUT?: (request: unknown, context: unknown) => Promise<Response> } = {};
  runInNewContext(ts.transpileModule(readFileSync('src/app/api/admin/products/[id]/route.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText, { exports, console, require(name: string) {
    if (name === 'next/server') return { NextResponse: { json: Response.json } };
    if (name === '@/storage/database/supabase-client') return { getSupabaseClient: () => client };
    if (name === '@/lib/auth') return { getCurrentUser: async () => ({}), hasPermission: () => true };
    if (name === '@/lib/product-detail') return {};
    throw new Error(name);
  } });
  const response = await exports.PUT!({ json: async () => body }, { params: Promise.resolve({ id: 'test-product' }) });
  return { response, written };
}

test('disabling manual quote uses saved packaging without rewriting it', async () => {
  const { response, written } = await update({ shipping_quote_required: false });
  assert.equal(response.status, 200);
  assert.equal(written?.shipping_quote_required, false);
  assert.deepEqual(Object.keys(written!).sort(), ['shipping_quote_required', 'updated_at']);
});

test('partial packaging changes combine with saved fields', async () => {
  const { response, written } = await update({ shipping_quote_required: false, packed_weight_kg: 14 });
  assert.equal(response.status, 200);
  assert.equal(written?.packed_weight_kg, 14);
});

test('missing packaging, freight, multiple parcels and explicit null remain blocked', async () => {
  for (const invalid of [{ package_length_cm: null }, { shipping_class: 'freight' }, { package_count: 2 }]) {
    const { response, written } = await update({ shipping_quote_required: false }, { ...packaging, ...invalid });
    assert.equal(response.status, 400);
    assert.equal(written, undefined);
  }
  const { response, written } = await update({ shipping_quote_required: false, packed_weight_kg: null });
  assert.equal(response.status, 400);
  assert.equal(written, undefined);
});
