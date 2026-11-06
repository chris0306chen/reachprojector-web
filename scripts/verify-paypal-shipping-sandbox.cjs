// Opt-in real sandbox API; synthetic catalog, no capture, database or email.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
async function main() {
  assert.ok(process.argv.includes('--run-sandbox'), 'Explicit --run-sandbox required');
  const env = require('dotenv').parse(fs.readFileSync('.env.test.local'));
  const base = 'https://api-m.sandbox.paypal.com';
  assert.equal(env.PAYPAL_BASE_URL, base);
  assert.ok(env.PAYPAL_CLIENT_ID && env.PAYPAL_SECRET, 'Sandbox credentials required');
  function load(path, resolve, extra = {}) {
    const exports = {};
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports, require: resolve, ...extra });
    return exports;
  }
  const labels = load('src/lib/shipping-label.ts', () => { throw Error('Unexpected import'); });
  let token;
  const route = load('src/app/api/paypal/create-order/route.ts', name => {
    if (name === 'next/server') return { NextResponse: { json: Response.json } };
    if (name === '@/lib/shipping-label') return labels;
    if (name === '@/lib/checkout') return { getCheckoutItem: async () => ({ id: 'sandbox-shipping-product', name: 'Synthetic shipping acceptance', quantity: 2, unitPrice: 100, total: '200.00', currency: 'USD' }) };
    if (name === '@/lib/shipping') return { getShippingQuote: async () => ({ mode: 'automatic', shippingCost: 0, currency: 'USD', templateId: 'sandbox-template', tradeTerms: 'SHIPPING_INCLUDED', method: 'air', dutiesIncluded: null }) };
    throw Error(`Unexpected import ${name}`);
  }, { Buffer, console, process: { env: { PAYPAL_CLIENT_ID: env.PAYPAL_CLIENT_ID, PAYPAL_SECRET: env.PAYPAL_SECRET, PAYPAL_BASE_URL: base } },
    fetch: async (url, init) => {
      assert.ok([base + '/v1/oauth2/token', base + '/v2/checkout/orders'].includes(url));
      const response = await fetch(url, { ...init, redirect: 'error' });
      if (url.endsWith('/token') && response.ok) token = (await response.clone().json()).access_token;
      return response;
    },
  });
  const response = await route.POST({ json: async () => ({ productId: 'sandbox-shipping-product', quantity: 2, countryCode: 'US' }) });
  assert.equal(response.status, 200);
  const created = await response.json();
  assert.match(created.orderId, /^[A-Z0-9]+$/);
  const details = await fetch(`${base}/v2/checkout/orders/${created.orderId}`, { headers: { Authorization: `Bearer ${token}` }, redirect: 'error' });
  assert.equal(details.status, 200);
  const order = await details.json();
  assert.equal(order.status, 'CREATED');
  const unit = order.purchase_units[0];
  assert.equal(unit.amount.currency_code, 'USD');
  assert.equal(unit.amount.value, '200.00');
  assert.equal(unit.amount.breakdown.shipping.value, '0.00');
  assert.match(unit.description, /Shipping included in product price/);
  assert.match(unit.description, /not guaranteed included/);
  console.log(JSON.stringify({ result: 'PASS', orderId: order.id, status: order.status, amount: unit.amount.value, shipping: unit.amount.breakdown.shipping.value, description: unit.description }));
  console.log('Synthetic sandbox order only; no buyer approval or capture attempted.');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
