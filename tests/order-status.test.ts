import assert from "node:assert/strict";
import test from "node:test";
import { canTransitionOrder } from "../src/lib/order-status";

test("paid retail orders can progress through the current fulfillment states", () => {
  for (const [status, next] of [["pending_payment", "preparing"], ["preparing", "shipped"], ["shipped", "completed"], ["completed", "after_sales"]]) {
    assert.equal(canTransitionOrder({ status, payment_status: "paid" }, next), true);
  }
});

test("unpaid or refunded retail orders cannot be shipped, even on repeated updates", () => {
  for (const payment_status of ["unpaid", "partial", "refunded", "partially_refunded"]) {
    for (const status of ["pending_payment", "preparing", "shipped"]) {
      assert.equal(canTransitionOrder({ status, payment_status }, "shipped"), false);
    }
  }
});

test("tracking cannot skip preparation or reopen completed, cancelled or refunded orders", () => {
  for (const status of ["pending", "pending_payment", "completed", "delivered", "cancelled", "refunded", "after_sales"]) {
    assert.equal(canTransitionOrder({ status, payment_status: "paid" }, "shipped"), false);
  }
});

test("legacy fulfillment and confirmed refunds remain supported", () => {
  assert.equal(canTransitionOrder({ status: "paid", payment_status: "paid" }, "shipped"), true);
  assert.equal(canTransitionOrder({ status: "shipped", payment_status: "paid" }, "delivered"), true);
  assert.equal(canTransitionOrder({ status: "preparing", payment_status: "paid" }, "refunded"), false);
  assert.equal(canTransitionOrder({ status: "preparing", payment_status: "refunded" }, "refunded"), true);
  assert.equal(canTransitionOrder({ status: "pending", payment_status: "unpaid" }, "paid"), false);
  assert.equal(canTransitionOrder({ status: "preparing", payment_status: "paid" }, "constructor"), false);
});

test("B2B shipment requires full payment, with no deposit or credit exception", () => {
  for (const payment_status of ["unpaid", "partial", "refunded", "partially_refunded", null, undefined]) {
    for (const status of ["paid", "preparing", "shipped"]) {
      assert.equal(canTransitionOrder({ status, payment_status, order_type: "b2b_offline" }, "shipped"), false);
    }
  }
  assert.equal(canTransitionOrder({ status: "preparing", payment_status: "paid", order_type: "b2b_offline" }, "shipped"), true);
  assert.equal(canTransitionOrder({ status: "pending_payment", payment_status: "partial", order_type: "b2b_offline" }, "preparing"), true);
});
