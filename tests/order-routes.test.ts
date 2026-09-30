import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";
import * as orderStatus from "../src/lib/order-status";

function setup(route: string, status: string, paymentStatus: string, options: {
  orderType?: string; concurrentChange?: "refund" | "payment"; missing?: boolean; readError?: boolean; writeError?: boolean;
} = {}) {
  let row = { id: "order-1", status, payment_status: paymentStatus, order_type: options.orderType ?? "b2c_online", tracking_number: null };
  let writes = 0;
  let emails = 0;
  const supabase = {
    from() {
      let update: Record<string, unknown> | undefined;
      const filters: Record<string, unknown> = {};
      const query = {
        select() { return query; },
        eq(key: string, value: unknown) { filters[key] = value; return query; },
        update(value: Record<string, unknown>) { update = value; return query; },
        insert(value: Record<string, unknown>) { update = value; return query; },
        single() { return query.maybeSingle(); },
        async maybeSingle() {
          if (!update) {
            if (options.readError) return { data: null, error: new Error("read failed") };
            if (options.missing) return { data: null, error: null };
            const snapshot = { ...row };
            if (options.concurrentChange === "refund") row = { ...row, status: "refunded", payment_status: "refunded" };
            if (options.concurrentChange === "payment") row = { ...row, payment_status: "partial" };
            return { data: snapshot, error: null };
          }
          if (options.writeError) return { data: null, error: new Error("write failed") };
          if (!Object.entries(filters).every(([key, value]) => row[key] === value)) return { data: null, error: null };
          row = { ...row, ...update };
          writes++;
          return { data: { ...row }, error: null };
        },
      };
      return query;
    },
  };
  const exports: Record<string, (request: unknown, context?: unknown) => Promise<{ status: number }>> = {};
  const source = readFileSync(new URL(`../src/app/api/admin/orders/${route}`, import.meta.url), "utf8");
  runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, {
    exports, URL, console: { error() {} },
    require(name: string) {
      if (name === "next/server") return { NextResponse: { json: (data: unknown, options?: { status?: number }) => ({ data, status: options?.status ?? 200 }) } };
      if (name === "@/storage/database/supabase-client") return { getSupabaseClient: () => supabase };
      if (name === "@/lib/order-status") return orderStatus;
      if (name === "@/lib/order-email") return { sendShippingNotification: async () => { emails++; } };
      throw new Error(`Unexpected dependency: ${name}`);
    },
  });
  return {
    call: (body: Record<string, unknown>) => exports.PUT({ url: "https://test.invalid/api/admin/orders?id=order-1", json: async () => body }, { params: Promise.resolve({ id: "order-1" }) }),
    create: (body: Record<string, unknown>) => exports.POST({ json: async () => body }),
    state: () => ({ row, writes, emails }),
  };
}

test("tracking endpoint rejects unpaid and terminal orders without writing or notifying", async () => {
  for (const [status, payment] of [["preparing", "unpaid"], ["pending_payment", "paid"], ["refunded", "refunded"], ["completed", "paid"]]) {
    const app = setup("route.ts", status, payment);
    assert.equal((await app.call({ tracking_number: "TRACK-1" })).status, 409);
    assert.equal(app.state().writes, 0);
    assert.equal(app.state().emails, 0);
  }
});

test("paid tracking update ships the order and does not resend email for the same tracking number", async () => {
  const app = setup("route.ts", "preparing", "paid");
  assert.equal((await app.call({ tracking_number: " TRACK-1 " })).status, 200);
  assert.equal(app.state().row.status, "shipped");
  assert.equal((await app.call({ tracking_number: "TRACK-1" })).status, 200);
  assert.equal(app.state().emails, 1);
});

test("both update endpoints preserve a concurrent refund", async () => {
  for (const [route, body] of [["route.ts", { tracking_number: "TRACK-1" }], ["[id]/status/route.ts", { status: "shipped" }]] as const) {
    const app = setup(route, "preparing", "paid", { concurrentChange: "refund" });
    assert.equal((await app.call(body)).status, 409);
    assert.equal(app.state().row.status, "refunded");
    assert.equal(app.state().writes, 0);
    assert.equal(app.state().emails, 0);
  }
});

test("B2B deposit and unpaid orders cannot ship through either endpoint", async () => {
  for (const payment of ["unpaid", "partial", "refunded"]) {
    for (const [route, body] of [["route.ts", { tracking_number: "TRACK-1" }], ["[id]/status/route.ts", { status: "shipped" }]] as const) {
      const app = setup(route, "preparing", payment, { orderType: "b2b_offline" });
      assert.equal((await app.call(body)).status, 409);
      assert.equal(app.state().writes, 0);
      assert.equal(app.state().emails, 0);
    }
  }
  for (const [route, body] of [["route.ts", { tracking_number: "TRACK-1" }], ["[id]/status/route.ts", { status: "shipped" }]] as const) {
    const app = setup(route, "preparing", "paid", { orderType: "b2b_offline" });
    assert.equal((await app.call(body)).status, 200);
    assert.equal(app.state().row.status, "shipped");
  }
});

test("creating a B2B order cannot bypass full-payment shipment validation", async () => {
  const app = setup("route.ts", "pending_payment", "unpaid");
  for (const payment_status of ["unpaid", "partial", undefined]) {
    for (const status of ["paid", "shipped", "completed"]) {
      assert.equal((await app.create({ status, payment_status, order_type: "b2b_offline" })).status, 409);
    }
  }
  assert.equal(app.state().writes, 0);
  assert.equal((await app.create({ status: "shipped", payment_status: "paid", order_type: "b2b_offline" })).status, 201);
});

test("payment-only races, missing orders and database errors fail without notification", async () => {
  for (const [route, body] of [["route.ts", { tracking_number: "TRACK-1" }], ["[id]/status/route.ts", { status: "shipped" }]] as const) {
    for (const [options, expected] of [[{ concurrentChange: "payment" }, 409], [{ missing: true }, 404], [{ readError: true }, 500], [{ writeError: true }, 500]] as const) {
      const app = setup(route, "preparing", "paid", options);
      assert.equal((await app.call(body)).status, expected);
      assert.equal(app.state().writes, 0);
      assert.equal(app.state().emails, 0);
    }
  }
});

test("status endpoint accepts current states and rejects unconfirmed payment/refund changes", async () => {
  const app = setup("[id]/status/route.ts", "preparing", "paid");
  assert.equal((await app.call({ status: "refunded" })).status, 409);
  assert.equal((await app.call({ status: "shipped" })).status, 200);
  assert.equal((await app.call({ status: "completed" })).status, 200);
  assert.equal((await app.call({ status: "constructor" })).status, 400);
  const unpaid = setup("[id]/status/route.ts", "pending_payment", "unpaid");
  assert.equal((await unpaid.call({ status: "preparing" })).status, 409);
});
