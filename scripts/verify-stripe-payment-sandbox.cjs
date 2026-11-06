// Real sandbox Checkout + CLI-signed webhook; fixed local DB, synthetic catalog, no email.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const http = require('node:http');
const { spawn } = require('node:child_process');
const ts = require('typescript');
const { Client } = require('pg');
const productId = '22222222-2222-4222-8222-222222222222';
const db = new Client({ connectionString: 'postgres://postgres:isolated-test-only@127.0.0.1:55477/payment_sandbox' });
let listener, server;
function load(path, resolve, globals = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText,
    { exports, require: resolve, console, Buffer, URLSearchParams, ...globals });
  return exports;
}
async function main() {
  assert.ok(process.argv.includes('--run-sandbox'));
  const env = require('dotenv').parse(fs.readFileSync('.env.test.local'));
  assert.match(env.STRIPE_SECRET_KEY || '', /^sk_test_/);
  const api = 'https://api.stripe.com/v1';
  async function call(path) {
    const response = await fetch(api + path, { headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` }, redirect: 'error' });
    assert.ok(response.ok, `Stripe HTTP ${response.status}`);
    return response.json();
  }
  assert.equal((await call('/account')).id, 'acct_1TvUACKLpy9D25tu');
  await db.connect();
  assert.equal((await db.query('SELECT current_database() AS name')).rows[0].name, 'payment_sandbox');
  await db.query("INSERT INTO products VALUES ($1,10,'in_stock',true,now()) ON CONFLICT DO NOTHING", [productId]);
  assert.equal((await db.query('SELECT inventory_quantity FROM products WHERE id=$1', [productId])).rows[0].inventory_quantity, 10);
  assert.equal((await db.query('SELECT count(*)::int AS n FROM orders WHERE product_id=$1', [productId])).rows[0].n, 0);
  const client = {
    async rpc(name, args) {
      assert.equal(name, 'create_paid_order_and_decrement_inventory');
      try { return { data: (await db.query('SELECT * FROM public.create_paid_order_and_decrement_inventory($1::jsonb)', [JSON.stringify(args.p_order)])).rows[0], error: null }; }
      catch (error) { return { data: null, error }; }
    },
    from(table) {
      assert.equal(table, 'orders');
      return { select: () => ({ eq: (column, value) => {
        assert.equal(column, 'stripe_session_id');
        return { maybeSingle: async () => ({ data: (await db.query('SELECT * FROM orders WHERE stripe_session_id=$1', [value])).rows[0] || null, error: null }) };
      } }) };
    },
  };
  const data = load('src/lib/data-service.ts', name => {
    assert.equal(name, '@/storage/database/supabase-client');
    return { getSupabaseClient: () => client };
  });
  const labels = load('src/lib/shipping-label.ts', () => { throw Error('Unexpected import'); });
  const address = load('src/lib/order-address.ts', () => { throw Error('Unexpected import'); });
  let notifications = 0, session, webhookSecret;
  const resolve = name => {
    if (name === 'next/server') return { NextResponse: { json: Response.json } };
    if (name === 'node:crypto') return require(name);
    if (name === '@/lib/data-service') return data;
    if (name === '@/lib/shipping-label') return labels;
    if (name === '@/lib/order-address') return address;
    if (name === '@/i18n/config') return { locales: ['en'], defaultLocale: 'en' };
    if (name === '@/lib/order-email') return { sendOrderConfirmation: async () => { notifications++; } };
    if (name === '@/lib/checkout') return { getCheckoutItem: async (id, quantity) => {
      assert.equal(id, productId); assert.equal(quantity, 2);
      return { id: productId, name: 'Synthetic shipping acceptance', quantity: 2, unitPrice: 100, total: '200.00', currency: 'USD' };
    } };
    if (name === '@/lib/shipping') return { getShippingQuote: async (id, country) => {
      assert.equal(id, productId); assert.equal(country, 'US');
      return { mode: 'automatic', shippingCost: 0, currency: 'USD', templateId: 'sandbox-template', tradeTerms: 'SHIPPING_INCLUDED', method: 'air' };
    } };
    throw Error(`Unexpected import ${name}`);
  };
  const create = load('src/app/api/stripe/create-checkout-session/route.ts', resolve, {
    process: { env: { STRIPE_SECRET_KEY: env.STRIPE_SECRET_KEY, NEXT_PUBLIC_SITE_URL: 'http://127.0.0.1:55478' } },
    fetch: async (url, init) => {
      assert.equal(url, api + '/checkout/sessions');
      const response = await fetch(url, { ...init, redirect: 'error' });
      session = await response.clone().json();
      return response;
    },
  });
  let webhook;
  let finish;
  const completed = new Promise((resolve, reject) => { finish = { resolve, reject }; });
  server = http.createServer(async (request, response) => {
    if (request.method === 'GET') { response.end('Sandbox checkout returned. Verification runs in the local harness.'); return; }
    if (request.method !== 'POST' || request.url !== '/webhook') { response.writeHead(404).end(); return; }
    try {
      let raw = ''; for await (const chunk of request) raw += chunk;
      const event = JSON.parse(raw);
      if (!session || event.type !== 'checkout.session.completed' || event.data?.object?.id !== session.id) { response.end('Ignored unrelated sandbox event'); return; }
      assert.equal(event.livemode, false);
      const invoke = () => webhook.POST({ headers: { get: key => request.headers[key] }, text: async () => raw });
      const result = await invoke();
      assert.equal(result.status, 200, await result.text());
      const retry = await invoke();
      assert.equal(retry.status, 200);
      const rows = (await db.query('SELECT * FROM orders WHERE stripe_session_id=$1', [session.id])).rows;
      assert.equal(rows.length, 1);
      assert.equal(rows[0].payment_status, 'paid');
      assert.equal(rows[0].shipping_cost, '0.00');
      assert.equal(rows[0].shipping_method, `${labels.INCLUDED_SHIPPING_LABEL}. ${labels.INCLUDED_TAX_LABEL}`);
      assert.equal((await db.query('SELECT inventory_quantity FROM products WHERE id=$1', [productId])).rows[0].inventory_quantity, 8);
      assert.equal(notifications, 1);
      const verified = await call(`/checkout/sessions/${session.id}`);
      assert.equal(verified.payment_status, 'paid');
      response.end('Verified');
      console.log(JSON.stringify({ result: 'PASS', session: session.id, event: event.id, payment: verified.payment_status, inventory: 8, shipping: '0.00', notificationsCaptured: notifications, replayStatus: retry.status }));
      finish.resolve();
    } catch (error) { response.writeHead(500).end('Sandbox verification failed'); finish.reject(error); }
  });
  await new Promise(resolve => server.listen(55478, '127.0.0.1', resolve));
  listener = spawn('.tmp/stripe-cli/stripe.exe', ['listen', '--api-key', env.STRIPE_SECRET_KEY, '--events', 'checkout.session.completed', '--forward-to', 'http://127.0.0.1:55478/webhook'], { windowsHide: true });
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(Error('Stripe listener did not become ready')), 45000);
    let output = '';
    const observe = chunk => {
      output += chunk.toString();
      const match = output.match(/whsec_[A-Za-z0-9]+/);
      if (match) { webhookSecret = match[0]; clearTimeout(timeout); resolve(); }
    };
    listener.stdout.on('data', observe); listener.stderr.on('data', observe);
    listener.once('error', reject);
    listener.once('exit', code => { clearTimeout(timeout); reject(Error(`Stripe listener exited ${code}`)); });
  });
  webhook = load('src/app/api/stripe/webhook/route.ts', resolve, { process: { env: { STRIPE_WEBHOOK_SECRET: webhookSecret } } });
  assert.equal((await create.POST({ json: async () => ({ productId, quantity: 2, countryCode: 'US' }) })).status, 200);
  assert.equal(session.livemode, false); assert.equal(session.amount_total, 20000);
  console.log(JSON.stringify({ status: 'READY', session: session.id, url: session.url }));
  await completed;
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(async () => {
  listener?.kill(); server?.close(); await db.end();
});
