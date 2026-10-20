export const orderTransitions: Record<string, readonly string[]> = {
  pending: ["paid", "preparing", "cancelled", "refunded"],
  pending_payment: ["paid", "preparing", "cancelled", "refunded"],
  paid: ["preparing", "shipped", "cancelled", "refunded"],
  preparing: ["shipped", "cancelled", "refunded"],
  shipped: ["delivered", "completed", "after_sales", "refunded"],
  delivered: ["after_sales", "refunded"],
  completed: ["after_sales", "refunded"],
  after_sales: ["refunded"],
  cancelled: ["refunded"],
  refunded: [],
};

export function canTransitionOrder(
  order: { status: string; payment_status: string; order_type?: string },
  nextStatus: string
) {
  if (!Object.hasOwn(orderTransitions, nextStatus) || !Object.hasOwn(orderTransitions, order.status)) return false;
  if (nextStatus !== order.status && !orderTransitions[order.status]?.includes(nextStatus)) return false;
  // Changing fulfillment status must not pretend to collect or refund money.
  if (nextStatus === "refunded") return order.payment_status === "refunded";
  // Both retail and B2B orders require confirmed full payment before shipment.
  if (["paid", "shipped", "delivered", "completed"].includes(nextStatus)) {
    return order.payment_status === "paid";
  }
  if (nextStatus === "preparing") {
    return order.payment_status === "paid" || (
      order.order_type === "b2b_offline" && ["unpaid", "partial"].includes(order.payment_status)
    );
  }
  return true;
}
