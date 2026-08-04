-- REACH PROJECTOR B2C order fulfillment migration.
-- Safe to run repeatedly in the Supabase SQL Editor.

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS inventory_quantity INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(50);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS country VARCHAR(100);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS inventory_restocked BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS orders_payer_email_lower_idx
  ON public.orders (lower(payer_email));

CREATE OR REPLACE FUNCTION public.create_paid_order_and_decrement_inventory(
  p_order JSONB
)
RETURNS public.orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_order public.orders;
  created_order public.orders;
  requested_quantity INTEGER;
  requested_product UUID;
BEGIN
  requested_quantity := (p_order->>'quantity')::INTEGER;
  requested_product := (p_order->>'product_id')::UUID;

  IF requested_quantity IS NULL OR requested_quantity < 1 THEN
    RAISE EXCEPTION 'INVALID_QUANTITY';
  END IF;

  IF p_order->>'paypal_order_id' IS NOT NULL THEN
    SELECT * INTO existing_order FROM public.orders
    WHERE paypal_order_id = p_order->>'paypal_order_id';
  ELSIF p_order->>'stripe_session_id' IS NOT NULL THEN
    SELECT * INTO existing_order FROM public.orders
    WHERE stripe_session_id = p_order->>'stripe_session_id';
  END IF;

  IF existing_order.id IS NOT NULL THEN
    RETURN existing_order;
  END IF;

  UPDATE public.products
  SET inventory_quantity = inventory_quantity - requested_quantity,
      stock_status = CASE
        WHEN inventory_quantity - requested_quantity <= 0 THEN 'out_of_stock'
        ELSE stock_status
      END,
      updated_at = now()
  WHERE id = requested_product
    AND is_active = true
    AND stock_status = 'in_stock'
    AND inventory_quantity >= requested_quantity;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'INSUFFICIENT_INVENTORY';
  END IF;

  INSERT INTO public.orders (
    order_id, product_id, product_name, quantity, amount, currency,
    payer_email, payer_name, customer_phone, shipping_address, country,
    paypal_order_id, stripe_session_id, stripe_payment_intent_id,
    airwallex_intent_id, payment_method, payment_status,
    shipping_method, shipping_cost, status
  ) VALUES (
    p_order->>'order_id', requested_product, p_order->>'product_name', requested_quantity,
    (p_order->>'amount')::NUMERIC, COALESCE(p_order->>'currency', 'USD'),
    p_order->>'payer_email', p_order->>'payer_name', p_order->>'customer_phone',
    p_order->>'shipping_address', p_order->>'country', p_order->>'paypal_order_id',
    p_order->>'stripe_session_id', p_order->>'stripe_payment_intent_id',
    p_order->>'airwallex_intent_id', p_order->>'payment_method',
    COALESCE(p_order->>'payment_status', 'paid'), p_order->>'shipping_method',
    (p_order->>'shipping_cost')::NUMERIC, COALESCE(p_order->>'status', 'preparing')
  )
  RETURNING * INTO created_order;

  RETURN created_order;
END;
$$;

REVOKE ALL ON FUNCTION public.create_paid_order_and_decrement_inventory(JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_paid_order_and_decrement_inventory(JSONB) TO service_role;

CREATE OR REPLACE FUNCTION public.refund_order_and_restore_inventory(
  p_stripe_payment_intent_id TEXT
)
RETURNS public.orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  refunded_order public.orders;
BEGIN
  SELECT * INTO refunded_order
  FROM public.orders
  WHERE stripe_payment_intent_id = p_stripe_payment_intent_id
  FOR UPDATE;

  IF refunded_order.id IS NULL THEN
    RETURN NULL;
  END IF;

  IF NOT refunded_order.inventory_restocked THEN
    UPDATE public.products
    SET inventory_quantity = inventory_quantity + refunded_order.quantity,
        stock_status = 'in_stock',
        updated_at = now()
    WHERE id = refunded_order.product_id;
  END IF;

  UPDATE public.orders
  SET status = 'refunded', payment_status = 'refunded',
      inventory_restocked = true, updated_at = now()
  WHERE id = refunded_order.id
  RETURNING * INTO refunded_order;

  RETURN refunded_order;
END;
$$;

REVOKE ALL ON FUNCTION public.refund_order_and_restore_inventory(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.refund_order_and_restore_inventory(TEXT) TO service_role;

CREATE OR REPLACE FUNCTION public.refund_paypal_order_and_restore_inventory(
  p_paypal_order_id TEXT
)
RETURNS public.orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  refunded_order public.orders;
BEGIN
  SELECT * INTO refunded_order
  FROM public.orders
  WHERE paypal_order_id = p_paypal_order_id
  FOR UPDATE;

  IF refunded_order.id IS NULL THEN
    RETURN NULL;
  END IF;

  IF NOT refunded_order.inventory_restocked THEN
    UPDATE public.products
    SET inventory_quantity = inventory_quantity + refunded_order.quantity,
        stock_status = 'in_stock',
        updated_at = now()
    WHERE id = refunded_order.product_id;
  END IF;

  UPDATE public.orders
  SET status = 'refunded', payment_status = 'refunded',
      inventory_restocked = true, updated_at = now()
  WHERE id = refunded_order.id
  RETURNING * INTO refunded_order;

  RETURN refunded_order;
END;
$$;

REVOKE ALL ON FUNCTION public.refund_paypal_order_and_restore_inventory(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.refund_paypal_order_and_restore_inventory(TEXT) TO service_role;

SELECT
  to_regprocedure('public.create_paid_order_and_decrement_inventory(jsonb)') AS paid_order_function,
  EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'shipping_address'
  ) AS has_shipping_address,
  EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'customer_phone'
  ) AS has_customer_phone;
