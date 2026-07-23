-- Import the 15 SKUs supplied in PI.xlsx as unpublished catalog drafts.
--
-- Safety rules:
-- 1. Every newly-created product is inactive and unavailable for checkout.
-- 2. Purchase prices and supplier URLs live in product_sourcing, not products.
-- 3. PI.xlsx did not specify the purchase-price currency, so it remains NULL.
-- 4. Existing public prices are never overwritten by this import.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.product_sourcing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL UNIQUE REFERENCES public.products(id) ON DELETE CASCADE,
  purchase_price NUMERIC(12,2) NOT NULL CHECK (purchase_price >= 0),
  purchase_currency VARCHAR(3),
  moq INTEGER CHECK (moq IS NULL OR moq > 0),
  supplier_url TEXT NOT NULL,
  source_file TEXT NOT NULL DEFAULT 'PI.xlsx',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.product_sourcing ENABLE ROW LEVEL SECURITY;

INSERT INTO public.categories (name, slug, description, sort_order, is_active)
VALUES
  ('4K Laser Projectors', '4k-laser-projectors', '4K and laser projectors for home cinema and project installations.', 10, true),
  ('Projector Mounts', 'projector-mounts', 'Ceiling, floor and installation mounts for projectors.', 20, true),
  ('Laser TV Cabinets', 'laser-tv-cabinets', 'Cabinets and concealed furniture systems for laser TV installations.', 30, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_active = true,
  updated_at = now();

CREATE TEMP TABLE pi_catalog_import (
  category_slug TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  brand TEXT NOT NULL,
  purchase_price NUMERIC(12,2) NOT NULL,
  moq INTEGER,
  supplier_url TEXT NOT NULL
) ON COMMIT DROP;

INSERT INTO pi_catalog_import (
  category_slug, product_name, product_slug, brand, purchase_price, moq, supplier_url
)
VALUES
  ('4k-laser-projectors', 'AWOL Aetherion MAX UST Projector', 'awol-aetherion-max-ust-projector', 'AWOL', 12750, 1, 'https://www.alibaba.com/product-detail/AWOL-Aetherion-MAX-UST-Projector-3300_1601840114010.html?spm=a2700.galleryofferlist.normal_offer.d_title.7ce313a0mtG54Y&priceId=c214c214bbc94cbf8e222ad85f1d6e15'),
  ('4k-laser-projectors', 'AWOL Plus 2 Projector', 'awol-plus-2-projector', 'AWOL', 8165, 1, 'https://www.alibaba.com/product-detail/AWOL-Projector-Valerion-StreamMaster-Plus-2_1601845370394.html?spm=a2700.galleryofferlist.normal_offer.d_title.384513a0mvQ5mZ&priceId=86ae2f607f6c484a9eaeebd7c40e2e69'),
  ('4k-laser-projectors', 'Hisense C5 Master 4K Projector', 'hisense-c5-master-4k-projector', 'Hisense', 12500, 1, 'https://www.alibaba.com/product-detail/L-2026-Hisense-C5-Master-4K_1601818541731.html?spm=a2700.galleryofferlist.normal_offer.d_title.6c0f13a0D0f5Yc&priceId=8deaf91596794cbdbcc1778581022c71'),
  ('4k-laser-projectors', 'Hisense XR10 4K Triple Laser Projector', 'hisense-xr10-4k-triple-laser-projector', 'Hisense', 22450, 1, 'https://www.alibaba.com/product-detail/Global-Hisense-XR10-4K-Triple-Laser_1601885472702.html?spm=a2700.galleryofferlist.normal_offer.d_title.13df13a00bqYjU&priceId=ada2acf19dbf4d1c9c8906df331aca69'),
  ('4k-laser-projectors', 'Hisense PX4 Pro RGB Laser Projector', 'hisense-px4-pro-rgb-laser-projector', 'Hisense', 13000, 1, 'https://www.alibaba.com/product-detail/Global-2026-Hisense-PX4-Pro-RGB_1601887213823.html?spm=a2700.galleryofferlist.normal_offer.d_title.570d13a0ALauWG&priceId=0e5c32479497477abe3d6f2d7368c29b'),
  ('4k-laser-projectors', 'JMGO N5S Ultra Max Laser Projector', 'jmgo-n5s-ultra-max-laser-projector', 'JMGO', 9800, 1, 'https://www.alibaba.com/product-detail/JMGO-N5s-Ultra-Max-UHD-Laser_1601648729406.html?spm=a2700.galleryofferlist.topad_classic.d_title.ac1413a0YegPrR&priceId=d23cf24a204c40a696e99480009bd73e'),
  ('4k-laser-projectors', 'XGIMI X50 Ultra Max 4K RGB Laser Projector', 'xgimi-x50-ultra-max-4k-laser-projector', 'XGIMI', 16000, 1, 'https://www.alibaba.com/product-detail/2026-XGIMI-X50-Ultra-Max-Native_1601793755332.html?spm=a2700.galleryofferlist.topad_classic.d_title.5fad13a0TnFfdX&priceId=3982611e22e44259bf957737c0777e77'),
  ('4k-laser-projectors', 'XGIMI X50 Ultra 4K RGB Laser Projector', 'xgimi-x50-ultra-4k-rgb-laser-projector', 'XGIMI', 12000, 1, 'https://www.alibaba.com/product-detail/XGIMI-X50-Ultra-Native-4K-RGB_1601815965649.html?spm=a2700.galleryofferlist.normal_offer.d_title.3db413a0lL3tPW&priceId=2fad38ba564841df828971e81c54d35d'),
  ('projector-mounts', 'C1NE PH89 Universal Projector Ceiling Mount', 'c1ne-ph89-projector-ceiling-mount', 'C1NE', 280, 1, 'https://www.alibaba.com/product-detail/Universal-Projector-Ceiling-Mount-10KG-Heavy_1601780043883.html?spm=a2700.galleryofferlist.normal_offer.d_title.2ae113a0gH30uC&priceId=6508e76ce37542e896d28d93e64c7ed5'),
  ('projector-mounts', 'Jingmi BG9R Freestanding Projector Stand', 'jingmi-bg9r-freestanding-projector-stand', 'Jingmi', 1200, 1, 'https://www.alibaba.com/product-detail/C5-Boundless-Projection-Bracket-Wood-Freestanding_1601697704120.html?spm=a2700.galleryofferlist.normal_offer.d_image.43cc13a0VcHjmK&priceId=88540ded232c45de9ae033cd62cbb98b'),
  ('projector-mounts', 'Vidda ASC6 Aluminum Projector Ceiling Mount', 'vidda-asc6-projector-ceiling-mount', 'Vidda', 220, 1, 'https://www.alibaba.com/product-detail/Vidda-ASC6-Universal-Aluminum-Alloy-Ceiling_1601816434980.html?spm=a2700.galleryofferlist.normal_offer.d_title.695413a05zmo28&priceId=c01ebcb4c3d44e1db7cbd7d47d22c301'),
  ('laser-tv-cabinets', 'NEOTUNT S8 2.2m Concealed Laser TV Cabinet', 'neotunt-s8-2-2m-concealed-laser-tv-cabinet', 'NEOTUNT', 6000, 1, 'https://www.alibaba.com/product-detail/S8-concealed-laser-TV-telescopic-stand_1601892172248.html?spm=a2747.product_manager.0.0.3b8a71d2I7VE5L'),
  ('laser-tv-cabinets', 'NEOTUNT S8 2.4m Concealed Laser TV Cabinet', 'neotunt-s8-2-4m-concealed-laser-tv-cabinet', 'NEOTUNT', 6500, 1, 'https://www.alibaba.com/product-detail/S8-concealed-laser-TV-telescopic-stand_1601892172248.html?spm=a2747.product_manager.0.0.3b8a71d2I7VE5L'),
  ('laser-tv-cabinets', 'NEOTUNT S8 2.8m Concealed Laser TV Cabinet', 'neotunt-s8-2-8m-concealed-laser-tv-cabinet', 'NEOTUNT', 7000, NULL, 'https://www.alibaba.com/product-detail/S8-concealed-laser-TV-telescopic-stand_1601892172248.html?spm=a2747.product_manager.0.0.3b8a71d2I7VE5L'),
  ('laser-tv-cabinets', 'NEOTUNT S8 3.2m Concealed Laser TV Cabinet', 'neotunt-s8-3-2m-concealed-laser-tv-cabinet', 'NEOTUNT', 7500, NULL, 'https://www.alibaba.com/product-detail/S8-concealed-laser-TV-telescopic-stand_1601892172248.html?spm=a2747.product_manager.0.0.3b8a71d2I7VE5L');

WITH imported_products AS (
  INSERT INTO public.products (
    name,
    slug,
    brand,
    category_id,
    price,
    short_description,
    images,
    specifications,
    features,
    stock_status,
    is_featured,
    is_new_arrival,
    is_active,
    updated_at
  )
  SELECT
    source.product_name,
    source.product_slug,
    source.brand,
    category.id,
    0,
    'Draft catalog entry. Public specifications, selling price, warranty, regional configuration and shipping terms require confirmation.',
    '[]'::jsonb,
    '{}'::jsonb,
    '[]'::jsonb,
    'out_of_stock',
    false,
    false,
    false,
    now()
  FROM pi_catalog_import source
  JOIN public.categories category ON category.slug = source.category_slug
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    brand = EXCLUDED.brand,
    category_id = EXCLUDED.category_id,
    is_active = false,
    updated_at = now()
  RETURNING id, slug
)
INSERT INTO public.product_sourcing (
  product_id,
  purchase_price,
  purchase_currency,
  moq,
  supplier_url,
  source_file,
  notes,
  updated_at
)
SELECT
  product.id,
  source.purchase_price,
  NULL,
  source.moq,
  source.supplier_url,
  'PI.xlsx',
  CASE
    WHEN source.moq IS NULL
      THEN 'Purchase-price currency and MOQ require confirmation.'
    ELSE 'Purchase-price currency requires confirmation.'
  END,
  now()
FROM pi_catalog_import source
JOIN public.products product ON product.slug = source.product_slug
ON CONFLICT (product_id) DO UPDATE SET
  purchase_price = EXCLUDED.purchase_price,
  purchase_currency = EXCLUDED.purchase_currency,
  moq = EXCLUDED.moq,
  supplier_url = EXCLUDED.supplier_url,
  source_file = EXCLUDED.source_file,
  notes = EXCLUDED.notes,
  updated_at = now();

SELECT
  product.name,
  product.slug,
  product.is_active,
  product.stock_status,
  sourcing.purchase_price,
  sourcing.purchase_currency,
  sourcing.moq,
  sourcing.supplier_url
FROM public.products product
JOIN public.product_sourcing sourcing ON sourcing.product_id = product.id
WHERE sourcing.source_file = 'PI.xlsx'
ORDER BY product.name;
