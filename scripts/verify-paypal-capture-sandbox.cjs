// Opt-in sandbox payment harness. Fixed local PostgreSQL; no email transport.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { Client } = require('pg');
const productId = '11111111-1111-4111-8111-111111111111';
const base = 'https://api-m.sandbox.paypal.com';
const db = new Client({ connectionString: 'postgres://postgres:isolated-test-only@127.0.0.1:55477/payment_sandbox' });
function load(path, resolve, globals = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports, require: resolve, console, Buffer, ...globals });
  return exports;
}
async function main() {
  const action = process.argv[2];
  assert.ok(['setup', 'create', 'capture'].includes(action));
  if (action !== 'create') {
    await db.connect();
    assert.equal((await db.query('SELECT current_database() AS name')).rows[0].name, 'payment_sandbox');
  }
  if (action === 'setup') {
    assert.equal((await db.query("SELECT to_regclass('public.products') AS name")).rows[0].name, null, 'Setup only supports a fresh disposable DB');
    await db.query("CREATE ROLE service_role; CREATE TABLE products (id uuid PRIMARY KEY, inventory_quantity integer NOT NULL, stock_status text NOT NULL, is_active boolean NOT NULL, updated_at timestamptz)");
    await db.query(fs.readFileSync('scripts/migration-payment-hardening.sql', 'utf8'));
    await db.query('ALTER TABLE orders ADD COLUMN stripe_session_id text UNIQUE, ADD COLUMN stripe_payment_intent_id text, ADD COLUMN airwallex_intent_id text; ALTER TABLE orders ALTER COLUMN shipping_method TYPE text');
    await db.query(fs.readFileSync('scripts/migration-b2c-order-fulfillment.sql', 'utf8'));
    await db.query("INSERT INTO products VALUES ($1,10,'in_stock',true,now())", [productId]);
    console.log('Fresh local payment DB ready; original inventory RPC installed.');
    return;
  }
  const env = require('dotenv').parse(fs.readFileSync('.env.test.local'));
  assert.equal(env.PAYPAL_BASE_URL, base);
  let notifications = 0;
  // SQL bridge to the real database function; no production Supabase credentials.
  const client = {
    async rpc(name, args) {
      assert.equal(name, 'create_paid_order_and_decrement_inventory');
      try { return { data: (await db.query('SELECT * FROM public.create_paid_order_and_decrement_inventory($1::jsonb)', [JSON.stringify(args.p_order)])).rows[0], error: null }; }
      catch (error) { return { data: null, error }; }
    },
    from(table) {
      assert.equal(table, 'orders');
      return { select: () => ({ eq: (column, value) => {
        assert.equal(column, 'paypal_order_id');
        return { maybeSingle: async () => ({ data: (await db.query('SELECT * FROM orders WHERE paypal_order_id=$1', [value])).rows[0] || null, error: null }) };
      } }) };
    },
  };
  const data = load('src/lib/data-service.ts', name => {
    assert.equal(name, '@/storage/database/supabase-client');
    return { getSupabaseClient: () => client };
  });
  const labels = load('src/lib/shipping-label.ts', () => { throw Error('Unexpected import'); });
  const address = load('src/lib/order-address.ts', () => { throw Error('Unexpected import'); });
  let token;
  const route = load(`src/app/api/paypal/${action === 'create' ? 'create-order' : 'capture-order'}/route.ts`, name => {
    if (name === 'next/server') return { NextResponse: { json: Response.json } };
    if (name === '@/lib/data-service') return data;
    if (name === '@/lib/shipping-label') return labels;
    if (name === '@/lib/order-address') return address;
    if (name === '@/lib/order-email') return { sendOrderConfirmation: async () => { notifications++; } };
    if (name === '@/lib/checkout') return { getCheckoutItem: async () => ({ id: productId, name: 'Synthetic shipping acceptance', quantity: 2, unitPrice: 100, total: '200.00', currency: 'USD' }) };
    if (name === '@/lib/shipping') return { getShippingQuote: async () => ({ mode: 'automatic', shippingCost: 0, currency: 'USD', templateId: 'sandbox-template', tradeTerms: 'SHIPPING_INCLUDED', method: 'air' }) };
    throw Error(`Unexpected import ${name}`);
  }, { process: { env: { PAYPAL_CLIENT_ID: env.PAYPAL_CLIENT_ID, PAYPAL_SECRET: env.PAYPAL_SECRET, PAYPAL_BASE_URL: base } },
    fetch: async (url, init) => {
      assert.equal(new URL(url).origin, base);
      const response = await fetch(url, { ...init, redirect: 'error' });
      if (url.endsWith('/token') && response.ok) token = (await response.clone().json()).access_token;
      return response;
    },
  });
  const orderId = process.argv[3];
  if (action === 'capture') assert.match(orderId || '', /^[A-Z0-9]+$/);
  // US sandbox buyer; fixture quote must match its delivery address.
  const invoke = () => route.POST({ json: async () => ({ orderId, productId, quantity: 2, countryCode: 'US' }) });
  const response = await invoke();
  const result = await response.json();
  assert.equal(response.status, 200, result.error || 'Unexpected route result');
  if (action === 'create') {
    const detailResponse = await fetch(`${base}/v2/checkout/orders/${result.orderId}`, { headers: { Authorization: `Bearer ${token}` }, redirect: 'error' });
    assert.ok(detailResponse.ok);
    const detail = await detailResponse.json();
    const approval = detail.links.find(link => link.rel === 'approve')?.href;
    assert.equal(new URL(approval).hostname, 'www.sandbox.paypal.com');
    console.log(JSON.stringify({ orderId: detail.id, status: detail.status, approval }));
  } else {
    assert.equal(result.success, true);
    const saved = (await db.query('SELECT * FROM orders WHERE paypal_order_id=$1', [orderId])).rows[0];
    assert.equal(saved.shipping_cost, '0.00');
    assert.equal(saved.shipping_method, `${labels.INCLUDED_SHIPPING_LABEL}. ${labels.INCLUDED_TAX_LABEL}`);
    assert.equal(saved.payment_status, 'paid');
    assert.equal((await db.query('SELECT inventory_quantity FROM products WHERE id=$1', [productId])).rows[0].inventory_quantity, 8);
    const retry = await (await invoke()).json();
    assert.equal(retry.idempotent, true);
    assert.equal((await db.query('SELECT count(*)::int AS n FROM orders')).rows[0].n, 1);
    assert.equal((await db.query('SELECT inventory_quantity FROM products WHERE id=$1', [productId])).rows[0].inventory_quantity, 8);
    assert.equal(notifications, 1);
    console.log(JSON.stringify({ result: 'PASS', orderId, status: saved.status, payment: saved.payment_status, inventory: 8, shipping: saved.shipping_cost, notificationsCaptured: notifications }));
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => db.end());
