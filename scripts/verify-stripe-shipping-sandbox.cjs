// Explicit opt-in: real Stripe sandbox API, synthetic catalog/shipping fixtures.
// Does not pay, import database/email modules, or configure webhooks.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const dotenv = require('dotenv');

async function main() {
  assert.ok(process.argv.includes('--run-sandbox'), 'Pass --run-sandbox explicitly');
  const env = dotenv.parse(fs.readFileSync('.env.test.local'));
  assert.match(env.STRIPE_SECRET_KEY || '', /^sk_test_[A-Za-z0-9]+$/);
  const api = 'https://api.stripe.com/v1';
  const headers = { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` };
  async function call(path, init = {}) {
    const response = await fetch(api + path, { ...init, headers, redirect: 'error' });
    const data = await response.json();
    assert.ok(response.ok, `Stripe HTTP ${response.status}: ${data.error?.type || 'unknown'}`);
    return data;
  }
  const account = await call('/account');
  assert.equal(account.id, 'acct_1TvUACKLpy9D25tu', 'Unexpected sandbox account');
  function load(path, requireModule, extra = {}) {
    const exports = {};
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(path, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText, { exports, require: requireModule, ...extra });
    return exports;
  }
  const labels = load('src/lib/shipping-label.ts', () => { throw Error('Unexpected import'); });
  let session;
  const route = load('src/app/api/stripe/create-checkout-session/route.ts', name => {
    if (name === 'next/server') return { NextResponse: { json: Response.json } };
    if (name === '@/lib/shipping-label') return labels;
    if (name === '@/i18n/config') return { locales: ['en'], defaultLocale: 'en' };
    if (name === '@/lib/checkout') return { getCheckoutItem: async () => ({ id: 'sandbox-shipping-product', name: 'Synthetic shipping acceptance', quantity: 2, unitPrice: 100, total: '200.00', currency: 'USD' }) };
    if (name === '@/lib/shipping') return { getShippingQuote: async () => ({ mode: 'automatic', shippingCost: 0, currency: 'USD', templateId: 'sandbox-template', tradeTerms: 'SHIPPING_INCLUDED', method: 'air', dutiesIncluded: null }) };
    throw Error(`Unexpected import ${name}`);
  }, {
    URLSearchParams, console,
    process: { env: { STRIPE_SECRET_KEY: env.STRIPE_SECRET_KEY, NEXT_PUBLIC_SITE_URL: 'http://localhost:3000' } },
    fetch: async (url, init) => {
      assert.equal(url, api + '/checkout/sessions');
      const response = await fetch(url, { ...init, redirect: 'error' });
      session = await response.clone().json();
      return response;
    },
  });
  try {
    const response = await route.POST({ json: async () => ({ productId: 'sandbox-shipping-product', quantity: 2, countryCode: 'US' }) });
    assert.equal(response.status, 200);
    assert.equal(session.livemode, false);
    assert.equal(session.amount_total, 20000);
    assert.equal(session.currency, 'usd');
    assert.equal(session.metadata.shipping_cost, '0.00');
    const items = await call(`/checkout/sessions/${session.id}/line_items`);
    const shipping = items.data.find(item => item.description.includes('Shipping included in product price'));
    assert.ok(shipping);
    assert.equal(shipping.amount_total, 0);
    assert.match(shipping.description, /not guaranteed included/);
    console.log(JSON.stringify({ result: 'PASS', account: account.id, session: session.id, livemode: false, amount_total: session.amount_total, shipping: shipping.amount_total, taxDisclosure: shipping.description }));
  } finally {
    if (session?.id?.startsWith('cs_test_')) {
      const expired = await call(`/checkout/sessions/${session.id}/expire`, { method: 'POST' });
      assert.equal(expired.status, 'expired');
      console.log('Synthetic checkout expired; no payment attempted.');
    }
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
