-- Run before deploying the included-shipping UI/API. Enables no rules or countries.
ALTER TABLE public.shipping_templates
  ADD COLUMN IF NOT EXISTS product_ids UUID[] NOT NULL DEFAULT '{}';

-- Preserve the full included-shipping and tax disclosure in existing order snapshots.
ALTER TABLE public.orders ALTER COLUMN shipping_method TYPE TEXT;

ALTER TABLE public.shipping_templates
  ADD CONSTRAINT shipping_included_explicit_scope CHECK (
    trade_terms IS DISTINCT FROM 'SHIPPING_INCLUDED' OR (
      cardinality(product_ids) > 0 AND country_code IS NOT NULL
      AND country_code ~ '^[A-Z]{2}$'
      AND base_fee IS NOT NULL AND base_fee = 0
      AND increment_fee IS NOT NULL AND increment_fee = 0
      AND minimum_fee IS NOT NULL AND minimum_fee = 0
    )
  );
