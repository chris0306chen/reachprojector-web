-- REACH PROJECTOR payment/order hardening migration
-- Safe to run repeatedly in the Supabase SQL Editor.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(100) NOT NULL UNIQUE,
  order_type VARCHAR(30) NOT NULL DEFAULT 'b2c_online',
  product_id UUID,
  product_name VARCHAR(255) NOT NULL,
  product_specs TEXT,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  payer_email VARCHAR(255),
  payer_name VARCHAR(200),
  customer_name VARCHAR(200),
  customer_email VARCHAR(255),
  customer_company VARCHAR(255),
  country VARCHAR(100),
  shipping_address TEXT,
  paypal_order_id VARCHAR(100),
  payment_method VARCHAR(20) NOT NULL DEFAULT 'paypal',
  payment_status VARCHAR(30) NOT NULL DEFAULT 'unpaid',
  shipping_method VARCHAR(100),
  shipping_cost NUMERIC(12,2),
  tracking_number VARCHAR(200),
  pi_number VARCHAR(100),
  deposit_amount NUMERIC(12,2),
  final_payment_amount NUMERIC(12,2),
  notes TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Upgrade an older orders table without destroying existing records.
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_type VARCHAR(30) NOT NULL DEFAULT 'b2c_online';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS product_specs TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name VARCHAR(200);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_company VARCHAR(255);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS country VARCHAR(100);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(30) NOT NULL DEFAULT 'unpaid';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS pi_number VARCHAR(100);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS deposit_amount NUMERIC(12,2);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS final_payment_amount NUMERIC(12,2);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Stop here and inspect the result if this query returns any rows.
SELECT paypal_order_id, COUNT(*) AS duplicate_count
FROM public.orders
WHERE paypal_order_id IS NOT NULL
GROUP BY paypal_order_id
HAVING COUNT(*) > 1;

CREATE UNIQUE INDEX IF NOT EXISTS orders_paypal_order_id_unique
  ON public.orders (paypal_order_id)
  WHERE paypal_order_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders (status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS orders_customer_email_idx ON public.orders (customer_email);

-- Verify the table and indexes exist.
SELECT
  to_regclass('public.orders') AS orders_table,
  (SELECT COUNT(*) FROM public.orders) AS existing_order_count;
