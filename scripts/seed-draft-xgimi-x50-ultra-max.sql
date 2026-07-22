-- Create the first REACH PROJECTOR product as an unpublished draft.
-- Source supplied by the business owner:
-- https://www.alibaba.com/product-detail/New-XGIMI-X50-Ultra-Max-Native_1601785977538.html
--
-- IMPORTANT: USD 2,850 is a public launch-price reference, not a confirmed
-- supplier quotation. Confirm landed cost, margin, warranty, plug, language,
-- shipping and final selling price before setting is_active to true.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  brand VARCHAR(100) NOT NULL,
  category_id UUID NOT NULL REFERENCES public.categories(id),
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10,2),
  description TEXT,
  short_description TEXT,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  stock_status VARCHAR(20) NOT NULL DEFAULT 'in_stock',
  is_bestseller BOOLEAN NOT NULL DEFAULT false,
  is_new_arrival BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS categories_sort_order_idx ON public.categories(sort_order);
CREATE INDEX IF NOT EXISTS products_category_id_idx ON public.products(category_id);
CREATE INDEX IF NOT EXISTS products_brand_idx ON public.products(brand);
CREATE INDEX IF NOT EXISTS products_is_active_idx ON public.products(is_active);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON public.products(created_at DESC);

DO $$
DECLARE
  projector_category_id UUID;
BEGIN
  INSERT INTO public.categories (
    name, slug, description, sort_order, is_active
  ) VALUES (
    '4K Laser Projectors',
    '4k-laser-projectors',
    'Premium 4K laser projectors for home cinema, commercial AV and project installations.',
    10,
    true
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_active = true,
    updated_at = now()
  RETURNING id INTO projector_category_id;

  INSERT INTO public.products (
    name,
    slug,
    brand,
    category_id,
    price,
    short_description,
    description,
    images,
    specifications,
    features,
    stock_status,
    is_featured,
    is_new_arrival,
    is_active,
    updated_at
  ) VALUES (
    'XGIMI X50 Ultra Max 4K RGB Laser Projector',
    'xgimi-x50-ultra-max-4k-laser-projector',
    'XGIMI',
    projector_category_id,
    2850.00,
    'Flagship 4K RGB laser projector with high brightness, optical zoom and flexible lens adjustment for premium home cinema and installation projects.',
    'The XGIMI X50 Ultra Max is designed for premium home theater and professional AV installations. Its 4K DLP imaging system, RGB laser light source, optical zoom and lens-shift capability support large-screen applications where brightness and installation flexibility matter. Contact REACH PROJECTOR for project pricing, regional configuration, warranty options and shipping terms.',
    '[]'::jsonb,
    '{
      "Display technology": "DLP, 0.47-inch DMD",
      "Native resolution": "3840 × 2160 (4K UHD)",
      "Light source": "RGB laser",
      "Brightness": "Up to 7000 CVIA lumens (manufacturer/supplier claim)",
      "Contrast": "Up to 100000:1 dynamic (supplier claim)",
      "Throw ratio": "0.98–2.0:1 optical zoom",
      "Lens adjustment": "Vertical and horizontal lens shift",
      "Memory": "4GB RAM",
      "Storage": "64GB; supplier may offer 128GB variant",
      "Wireless": "2.4/5GHz Wi-Fi 6E",
      "Operating system": "GMUI 6 (China-market configuration; confirm region/language)"
    }'::jsonb,
    '[
      "4K UHD home cinema projection",
      "RGB laser light source",
      "Optical zoom for flexible installation",
      "Automatic focus and image adjustment",
      "HDR support",
      "High-frame-rate 1080p mode",
      "Project pricing and global shipping consultation"
    ]'::jsonb,
    'in_stock',
    true,
    true,
    false,
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    brand = EXCLUDED.brand,
    category_id = EXCLUDED.category_id,
    short_description = EXCLUDED.short_description,
    description = EXCLUDED.description,
    specifications = EXCLUDED.specifications,
    features = EXCLUDED.features,
    updated_at = now();
END $$;

SELECT id, name, price, stock_status, is_active
FROM public.products
WHERE slug = 'xgimi-x50-ultra-max-4k-laser-projector';
