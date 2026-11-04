\set ON_ERROR_STOP on
-- Only for an empty disposable PostgreSQL database, never production.
CREATE TABLE shipping_templates (
  id integer PRIMARY KEY, trade_terms text, country_code text,
  base_fee numeric, increment_fee numeric, minimum_fee numeric,
  is_active boolean NOT NULL DEFAULT false
);
CREATE TABLE orders (id integer PRIMARY KEY, shipping_method varchar(100));
INSERT INTO shipping_templates VALUES
  (1, 'DDP', 'US', 20, 5, 20, true),
  (2, 'DAP', 'CA', 30, 8, 30, false),
  (3, 'MANUAL_QUOTE', 'ZZ', 0, 0, 0, false);
INSERT INTO orders VALUES (1, 'air (DDP)');
CREATE TEMP TABLE before_rates AS SELECT to_jsonb(t) AS value FROM shipping_templates t;
\i /tmp/migration-shipping-included.sql
DO $$ BEGIN
  IF EXISTS (
    (SELECT value FROM before_rates EXCEPT SELECT to_jsonb(t) - 'product_ids' FROM shipping_templates t)
    UNION ALL
    (SELECT to_jsonb(t) - 'product_ids' FROM shipping_templates t EXCEPT SELECT value FROM before_rates)
  ) THEN RAISE EXCEPTION 'Existing rate or activation state changed'; END IF;
  IF EXISTS (SELECT 1 FROM shipping_templates WHERE product_ids <> '{}'::uuid[]) THEN
    RAISE EXCEPTION 'Existing rules received product scope'; END IF;
  IF (SELECT shipping_method FROM orders WHERE id = 1) <> 'air (DDP)' THEN
    RAISE EXCEPTION 'Existing order changed'; END IF;
  BEGIN
    INSERT INTO shipping_templates VALUES (4, 'SHIPPING_INCLUDED', 'US', 0, 0, 0, false, '{}');
    RAISE EXCEPTION 'Empty scope accepted';
  EXCEPTION WHEN check_violation THEN NULL; END;
  BEGIN
    INSERT INTO shipping_templates VALUES (4, 'SHIPPING_INCLUDED', 'US', 1, 0, 0, false, ARRAY['11111111-1111-4111-8111-111111111111']::uuid[]);
    RAISE EXCEPTION 'Nonzero included fee accepted';
  EXCEPTION WHEN check_violation THEN NULL; END;
END $$;
INSERT INTO shipping_templates (id, trade_terms, country_code, base_fee, increment_fee, minimum_fee, product_ids)
VALUES (4, 'SHIPPING_INCLUDED', 'US', 0, 0, 0, ARRAY['11111111-1111-4111-8111-111111111111']::uuid[]);
DO $$ BEGIN
  IF (SELECT is_active FROM shipping_templates WHERE id = 4) THEN RAISE EXCEPTION 'New template activated'; END IF;
END $$;
UPDATE orders SET shipping_method = repeat('x', 150) WHERE id = 1;
SELECT 'PASS: rates preserved, no activation, explicit scope enforced, order text widened' AS result;
