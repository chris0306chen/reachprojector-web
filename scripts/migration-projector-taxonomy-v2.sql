BEGIN;

-- Rename in place so every existing product keeps the same category_id.
UPDATE public.categories
SET name = 'Laser TVs (Ultra Short Throw)', sort_order = 11, updated_at = now()
WHERE slug = 'ust-laser-tv';

UPDATE public.categories
SET name = 'Home Smart Projectors', slug = 'home-smart-projectors', sort_order = 12, updated_at = now()
WHERE slug = 'home-theater-projectors'
  AND NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'home-smart-projectors');

UPDATE public.categories
SET name = 'Portable / Mini Projectors', slug = 'portable-mini-projectors', sort_order = 13, updated_at = now()
WHERE slug = 'portable-projectors'
  AND NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'portable-mini-projectors');

UPDATE public.categories
SET name = 'Business & Education Projectors', sort_order = 14, updated_at = now()
WHERE slug = 'business-education-projectors';

UPDATE public.categories
SET name = 'Engineering Projectors', slug = 'engineering-projectors', sort_order = 15, updated_at = now()
WHERE slug = 'installation-projectors'
  AND NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'engineering-projectors');

UPDATE public.categories
SET name = 'High-End Home Theater Projectors', slug = 'high-end-home-theater-projectors', sort_order = 16, updated_at = now()
WHERE slug = '4k-laser-projectors'
  AND NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'high-end-home-theater-projectors');

COMMIT;

SELECT child.name, child.slug, child.sort_order
FROM public.categories child
JOIN public.categories parent ON parent.id = child.parent_id
WHERE parent.slug = 'projectors' AND child.is_active = TRUE
ORDER BY child.sort_order;
