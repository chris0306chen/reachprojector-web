-- REACH PROJECTOR Stripe Checkout migration
-- Safe to run repeatedly in the Supabase SQL Editor.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS stripe_session_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(255);

CREATE UNIQUE INDEX IF NOT EXISTS orders_stripe_session_id_unique
  ON public.orders (stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS orders_stripe_payment_intent_id_idx
  ON public.orders (stripe_payment_intent_id)
  WHERE stripe_payment_intent_id IS NOT NULL;

SELECT
  to_regclass('public.orders') AS orders_table,
  EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'orders'
      AND column_name = 'stripe_session_id'
  ) AS stripe_ready;
