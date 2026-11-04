-- Read-only post-migration evidence; run in the migrated project's SQL editor.
BEGIN READ ONLY;
SELECT table_name, column_name, data_type, udt_name, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND
  ((table_name = 'shipping_templates' AND column_name IN ('product_ids', 'is_active'))
   OR (table_name = 'orders' AND column_name = 'shipping_method'));
SELECT conname, convalidated, pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.shipping_templates'::regclass
  AND conname = 'shipping_included_explicit_scope';
SELECT id, name, country_code, trade_terms, base_fee, increment_fee, minimum_fee,
       is_active, valid_from, valid_to, product_ids
FROM public.shipping_templates ORDER BY id;
-- Compare these rows with a pre-migration export/backup to prove no data changed.
-- A post-migration snapshot alone cannot prove historical equality.
COMMIT;
