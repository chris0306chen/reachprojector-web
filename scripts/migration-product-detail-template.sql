-- Reusable structured product detail content.
-- Safe for existing products: empty content is rendered as no additional sections.

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS detail_content JSONB NOT NULL DEFAULT
  '{"specifications":[],"real_photos":[],"detail_images":[],"logistics_images":[]}'::jsonb;

COMMENT ON COLUMN public.products.detail_content IS
  'Structured product specifications, real photos, detail images, and logistics images.';
