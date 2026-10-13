const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, mocks = {}) {
  const exports = {};
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, {
    exports, console, URL, Date, SyntaxError,
    require: (name) => name in mocks ? mocks[name] : name.startsWith('@/') ? load(`src/${name.slice(2)}.ts`, mocks) : require(name),
  });
  return exports;
}
const adminId = 'a7151d51-41da-4a2e-8529-f455edb657a0';
const staffId = 'b7151d51-41da-4a2e-8529-f455edb657a0';
const leadId = 'c7151d51-41da-4a2e-8529-f455edb657a0';
const staff = { id: staffId, role: 'staff', name: 'Sales', is_active: true, permissions: ['inquiries'] };
const manager = { ...staff, id: adminId, role: 'admin' };
const request = (body, suffix = '') => new Request(`http://localhost/api/admin/inquiries${suffix}`, { method: 'PUT', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });

function setup(actor = manager, row = { id: leadId, assigned_to: staffId, workflow_version: 0, status: 'pending', inquiry_type: 'rfq' }, candidate = staff) {
  const calls = [];
  let writes = 0;
  const db = { from(table) {
    const filters = [];
    let patch;
    const finish = () => {
      if (table === 'users') return { data: candidate, error: null };
      if (patch) {
        if (!filters.every(([key, value]) => row[key] === value)) return { data: null, error: null };
        row = { ...row, ...patch }; writes++;
        return { data: row, error: null };
      }
      return { data: filters.every(([key, value]) => row[key] === value) ? [row] : [], count: 1, error: null };
    };
    const query = {
      select() { return query; }, order() { return query; }, range() { return query; },
      eq(key, value) { calls.push(['eq', key, value]); filters.push([key, value]); return query; },
      in(key, value) { calls.push(['in', key, value]); return query; },
      or(value) { calls.push(['or', value]); return query; },
      update(value) { patch = value; return query; },
      maybeSingle: async () => finish(), then: (resolve) => Promise.resolve(finish()).then(resolve),
    };
    return query;
  } };
  const mocks = {
    '@/lib/inquiry-access': { getInquiryActor: async () => ({ actor, status: actor ? 200 : 401 }) },
    '@/storage/database/supabase-client': { getSupabaseClient: () => db },
  };
  return { route: load('src/app/api/admin/inquiries/route.ts', mocks), mocks, calls, state: () => ({ row, writes }) };
}

test('unauthenticated callers cannot list or update inquiries', async () => {
  const { route, state } = setup(null);
  assert.equal((await route.GET(new Request('http://localhost/'))).status, 401);
  assert.equal((await route.PUT(request({ id: leadId, expected_version: 0, reply: 'x' }))).status, 401);
  assert.equal(state().writes, 0);
});

test('staff lists are owner-scoped; managers see all sources', async () => {
  const own = setup(staff);
  await own.route.GET(new Request('http://localhost/'));
  assert.ok(own.calls.some((c) => c[0] === 'eq' && c[1] === 'assigned_to' && c[2] === staffId));
  const all = setup();
  await all.route.GET(new Request('http://localhost/?search=School'));
  assert.equal(all.calls.some((c) => c[1] === 'assigned_to' || c[1] === 'inquiry_type'), false);
  assert.ok(all.calls.some((c) => c[0] === 'or' && c[1].includes('message.ilike.')));
});

test('staff cannot edit another owner or change assignment', async () => {
  const other = setup(staff, { id: leadId, assigned_to: adminId, workflow_version: 0 });
  assert.equal((await other.route.PUT(request({ id: leadId, expected_version: 0, reply: 'private' }))).status, 409);
  assert.equal((await other.route.PUT(request({ id: leadId, expected_version: 0, assigned_to: staffId }))).status, 403);
  assert.equal(other.state().writes, 0);
});

test('valid owner edits persist status, nullable follow-up, empty notes and source', async () => {
  const app = setup(staff);
  const response = await app.route.PUT(request({ id: leadId, expected_version: 0, status: 'negotiating', next_follow_up_at: null, reply: '', channel: 'whatsapp' }));
  assert.equal(response.status, 200);
  assert.equal(app.state().row.reply, '');
  assert.equal(app.state().row.next_follow_up_at, null);
  assert.equal(app.state().row.channel, 'whatsapp');
  assert.equal(app.state().row.workflow_version, 1);
});

test('stale versions cannot overwrite a newer update', async () => {
  const app = setup(staff);
  assert.equal((await app.route.PUT(request({ id: leadId, expected_version: 0, reply: 'first' }))).status, 200);
  assert.equal((await app.route.PUT(request({ id: leadId, expected_version: 0, reply: 'stale' }))).status, 409);
  assert.equal(app.state().row.reply, 'first');
  assert.equal(app.state().writes, 1);
});

test('assignment rejects inactive or unauthorized accounts and allows unassignment', async () => {
  for (const candidate of [null, { ...staff, is_active: false }, { ...staff, permissions: [] }]) {
    const app = setup(manager, undefined, candidate);
    assert.equal((await app.route.PUT(request({ id: leadId, expected_version: 0, assigned_to: staffId }))).status, 400);
    assert.equal(app.state().writes, 0);
  }
  const app = setup();
  assert.equal((await app.route.PUT(request({ id: leadId, expected_version: 0, assigned_to: null }))).status, 200);
  assert.equal(app.state().row.assigned_to, null);
});

test('invalid dates, statuses, owner IDs, missing versions and injected fields are rejected', async () => {
  const app = setup();
  for (const patch of [{ next_follow_up_at: 'tomorrow' }, { status: 'arbitrary' }, { assigned_to: 'Name' }, { workflow_version: 99 }, { next_follow_up_at: '2026-10-12T09:00:00' }]) {
    assert.equal((await app.route.PUT(request({ id: leadId, expected_version: 0, ...patch }))).status, 400);
  }
  assert.equal((await app.route.PUT(request({ id: leadId, reply: '' }))).status, 400);
  assert.equal((await app.route.GET(new Request('http://localhost/?page=-1'))).status, 400);
  assert.equal(app.state().writes, 0);
});

test('legacy RFQ update cannot bypass owner, type or version predicates', async () => {
  const app = setup(staff, { id: leadId, assigned_to: adminId, workflow_version: 0, inquiry_type: 'rfq' });
  const route = load('src/app/api/rfq/[id]/route.ts', { '@/app/api/admin/inquiries/route': app.route });
  const response = await route.PUT(request({ expected_version: 0, notes: 'attempt' }), { params: Promise.resolve({ id: leadId }) });
  assert.equal(response.status, 409);
  assert.ok(app.calls.some((c) => c[1] === 'inquiry_type' && c[2] === 'rfq'));
  assert.equal(app.state().writes, 0);
});

test('legacy RFQ list delegates to the same owner-scoped listing', async () => {
  const app = setup(staff);
  const route = load('src/app/api/rfq/route.ts', { ...app.mocks, '@/app/api/admin/inquiries/route': app.route, '@/lib/email': {} });
  assert.equal((await route.GET(new Request('http://localhost/api/rfq'))).status, 200);
  assert.ok(app.calls.some((c) => c[1] === 'assigned_to' && c[2] === staffId));
  assert.ok(app.calls.some((c) => c[1] === 'inquiry_type' && c[2] === 'rfq'));
});

test('current database account overrides stale JWT permissions', async () => {
  for (const account of [null, { ...staff, is_active: false }, { ...staff, permissions: [] }]) {
    const auth = load('src/lib/inquiry-access.ts', {
      '@/lib/auth': { getCurrentUser: async () => ({ userId: staffId, role: 'admin' }) },
      '@/storage/database/supabase-client': { getSupabaseClient: () => ({ from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: account, error: null }) }) }) }) }) },
    });
    assert.equal((await auth.getInquiryActor()).status, 403);
  }
});

test('Shanghai follow-up input round-trips and supports clearing', () => {
  const { toShanghaiInput, fromShanghaiInput } = load('src/lib/inquiry-pipeline.ts');
  assert.equal(toShanghaiInput('2026-10-12T16:30:00Z'), '2026-10-13T00:30');
  assert.equal(fromShanghaiInput('2026-10-13T00:30'), '2026-10-12T16:30:00.000Z');
  assert.equal(fromShanghaiInput(''), null);
});
