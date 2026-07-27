-- Safe, repeatable packaging migration for product editing, bulk import and shipping quotes.
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS product_length_cm NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS product_width_cm NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS product_height_cm NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS net_weight_kg NUMERIC(10,2);

-- These packaging fields already exist on databases that ran the shipping migration.
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS packed_weight_kg NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS package_length_cm NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS package_width_cm NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS package_height_cm NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS shipping_class VARCHAR(20) NOT NULL DEFAULT 'parcel';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS package_count INTEGER NOT NULL DEFAULT 1;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS shipping_quote_required BOOLEAN NOT NULL DEFAULT true;
