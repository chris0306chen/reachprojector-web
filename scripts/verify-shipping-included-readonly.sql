-- Read-only post-migration evidence; run in the migrated project's SQL editor.
BEGIN READ ONLY;
-- One result set so the SQL editor does not hide earlier verification results.
SELECT 'columns' AS check_name, COALESCE(jsonb_agg(to_jsonb(c)), '[]'::jsonb) AS evidence
FROM (
  SELECT table_name, column_name, data_type, udt_name, is_nullable, column_default
  FROM information_schema.columns
  WHERE table_schema = 'public' AND
    ((table_name = 'shipping_templates' AND column_name IN ('product_ids', 'is_active'))
     OR (table_name = 'orders' AND column_name = 'shipping_method'))
  ORDER BY table_name, column_name
) c
UNION ALL
SELECT 'constraint', COALESCE(jsonb_agg(to_jsonb(c)), '[]'::jsonb)
FROM (
  SELECT conname, convalidated, pg_get_constraintdef(oid) AS definition
  FROM pg_constraint
  WHERE conrelid = 'public.shipping_templates'::regclass
    AND conname = 'shipping_included_explicit_scope'
) c
UNION ALL
SELECT 'rate_snapshot', COALESCE(jsonb_agg(to_jsonb(t) ORDER BY t.id), '[]'::jsonb)
FROM (
  SELECT id, name, country_code, trade_terms, base_fee, increment_fee, minimum_fee,
         is_active, valid_from, valid_to, product_ids
  FROM public.shipping_templates
) t;
-- Compare these rows with a pre-migration export/backup to prove no data changed.
-- A post-migration snapshot alone cannot prove historical equality.
COMMIT;
