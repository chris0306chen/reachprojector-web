-- Shipping foundation for country + weight based pricing.
-- Safe default: every existing and new rule stays inactive until verified.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.shipping_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  zone VARCHAR(200) NOT NULL DEFAULT 'manual',
  method VARCHAR(50) NOT NULL DEFAULT 'manual',
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.shipping_templates ADD COLUMN IF NOT EXISTS country_code VARCHAR(2);
ALTER TABLE public.shipping_templates ADD COLUMN IF NOT EXISTS shipping_class VARCHAR(20) NOT NULL DEFAULT 'parcel';
ALTER TABLE public.shipping_templates ADD COLUMN IF NOT EXISTS currency VARCHAR(3) NOT NULL DEFAULT 'USD';
ALTER TABLE public.shipping_templates ADD COLUMN IF NOT EXISTS min_weight_kg NUMERIC(10,2) NOT NULL DEFAULT 0;
ALTER TABLE public.shipping_templates ADD COLUMN IF NOT EXISTS max_weight_kg NUMERIC(10,2) NOT NULL DEFAULT 0;
ALTER TABLE public.shipping_templates ADD COLUMN IF NOT EXISTS base_weight_kg NUMERIC(10,2) NOT NULL DEFAULT 0;
ALTER TABLE public.shipping_templates ADD COLUMN IF NOT EXISTS base_fee NUMERIC(12,2) NOT NULL DEFAULT 0;
ALTER TABLE public.shipping_templates ADD COLUMN IF NOT EXISTS increment_weight_kg NUMERIC(10,2) NOT NULL DEFAULT 0.5;
ALTER TABLE public.shipping_templates ADD COLUMN IF NOT EXISTS increment_fee NUMERIC(12,2) NOT NULL DEFAULT 0;
ALTER TABLE public.shipping_templates ADD COLUMN IF NOT EXISTS minimum_fee NUMERIC(12,2) NOT NULL DEFAULT 0;
ALTER TABLE public.shipping_templates ADD COLUMN IF NOT EXISTS volumetric_divisor INTEGER NOT NULL DEFAULT 5000;
ALTER TABLE public.shipping_templates ADD COLUMN IF NOT EXISTS estimated_days_min INTEGER;
ALTER TABLE public.shipping_templates ADD COLUMN IF NOT EXISTS estimated_days_max INTEGER;
ALTER TABLE public.shipping_templates ADD COLUMN IF NOT EXISTS valid_from DATE;
ALTER TABLE public.shipping_templates ADD COLUMN IF NOT EXISTS valid_to DATE;
ALTER TABLE public.shipping_templates ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.shipping_templates ADD COLUMN IF NOT EXISTS trade_terms VARCHAR(20);

UPDATE public.shipping_templates
SET trade_terms = 'MANUAL_QUOTE', is_active = false
WHERE trade_terms IS NULL OR trade_terms NOT IN ('DDP', 'DAP', 'MANUAL_QUOTE', 'UNAVAILABLE');

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS shipping_class VARCHAR(20) NOT NULL DEFAULT 'parcel';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS packed_weight_kg NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS package_length_cm NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS package_width_cm NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS package_height_cm NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS package_count INTEGER NOT NULL DEFAULT 1;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS shipping_quote_required BOOLEAN NOT NULL DEFAULT true;

UPDATE public.products
SET shipping_class = 'freight', shipping_quote_required = true
WHERE lower(name) LIKE '%cabinet%' OR lower(name) LIKE '%screen%';

CREATE INDEX IF NOT EXISTS idx_shipping_templates_country_active
  ON public.shipping_templates(country_code, is_active);
CREATE INDEX IF NOT EXISTS idx_shipping_templates_lookup
  ON public.shipping_templates(country_code, shipping_class, method, min_weight_kg, max_weight_kg);

ALTER TABLE public.shipping_templates ENABLE ROW LEVEL SECURITY;
