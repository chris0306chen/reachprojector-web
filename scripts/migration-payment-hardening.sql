-- Run once in the Supabase SQL Editor before enabling production payments.
-- Inspect and resolve any returned duplicates before creating the index.

SELECT paypal_order_id, COUNT(*)
FROM orders
WHERE paypal_order_id IS NOT NULL
GROUP BY paypal_order_id
HAVING COUNT(*) > 1;

CREATE UNIQUE INDEX IF NOT EXISTS orders_paypal_order_id_unique
  ON orders (paypal_order_id)
  WHERE paypal_order_id IS NOT NULL;
