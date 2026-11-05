const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// Optional local PostgreSQL-WASM test. Set PGLITE_MODULE to an installed
// @electric-sql/pglite module path; no production database is contacted.
test('migration is repeatable, preserves legacy data and blocks browser-role reads', { skip: !process.env.PGLITE_MODULE }, async () => {
  const { PGlite } = require(process.env.PGLITE_MODULE);
  const db = new PGlite();
  try {
    await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
      CREATE TABLE users (id uuid PRIMARY KEY);
      CREATE TABLE inquiries (id uuid PRIMARY KEY, assigned_to varchar(100), reply text, status text);
      INSERT INTO inquiries VALUES ('c7151d51-41da-4a2e-8529-f455edb657a0', 'Legacy name', 'Keep this note', 'new');
      GRANT SELECT ON inquiries TO anon, authenticated;`);
    const sql = fs.readFileSync(path.join(__dirname, '../scripts/migration-inquiry-pipeline.sql'), 'utf8');
    await db.exec(sql); await db.exec(sql);
    const { rows } = await db.query('SELECT * FROM inquiries');
    assert.equal(rows[0].assigned_to, 'Legacy name');
    assert.equal(rows[0].reply, 'Keep this note');
    assert.equal(rows[0].workflow_version, 0);
    assert.equal(rows[0].channel, 'website');
    assert.equal(rows[0].next_follow_up_at, null);
    await db.exec('SET ROLE anon');
    await assert.rejects(() => db.query('SELECT * FROM inquiries'), /permission denied/);
    await db.exec('RESET ROLE; SET ROLE service_role');
    assert.equal((await db.query('SELECT * FROM inquiries')).rows.length, 1);
  } finally { await db.close(); }
});
