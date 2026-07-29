-- Safe, repeatable migration for the reusable product bulk-import workflow.
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku VARCHAR(100);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS model VARCHAR(120);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS currency VARCHAR(3) NOT NULL DEFAULT 'USD';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS seo_title VARCHAR(70);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS meta_description VARCHAR(170);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS import_data JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS inventory_quantity INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_inventory_quantity_nonnegative;
ALTER TABLE public.products ADD CONSTRAINT products_inventory_quantity_nonnegative
  CHECK (inventory_quantity >= 0);

CREATE UNIQUE INDEX IF NOT EXISTS products_sku_unique
  ON public.products (lower(sku))
  WHERE sku IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.product_import_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by VARCHAR(255) NOT NULL,
  file_name VARCHAR(255),
  status VARCHAR(20) NOT NULL CHECK (status IN ('completed', 'failed')),
  product_count INTEGER NOT NULL DEFAULT 0,
  success_count INTEGER NOT NULL DEFAULT 0,
  failure_count INTEGER NOT NULL DEFAULT 0,
  report JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS product_import_jobs_created_at_idx
  ON public.product_import_jobs (created_at DESC);

