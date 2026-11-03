-- Synthetic acceptance schema only. Never apply to a production database.
CREATE TABLE public.orders (
  id text PRIMARY KEY,
  order_id text NOT NULL,
  order_type text NOT NULL,
  status text NOT NULL,
  payment_status text NOT NULL,
  product_name text NOT NULL DEFAULT 'Synthetic acceptance order',
  payer_email text NOT NULL DEFAULT 'nobody@example.invalid',
  customer_email text NOT NULL DEFAULT 'nobody@example.invalid',
  tracking_number text,
  shipping_method text,
  notes text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
