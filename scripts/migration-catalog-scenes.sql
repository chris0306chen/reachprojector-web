BEGIN;

ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS categories_parent_id_idx ON public.categories(parent_id);

CREATE TABLE IF NOT EXISTS public.scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  group_name VARCHAR(60) NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS scenes_sort_order_idx ON public.scenes(sort_order);

CREATE TABLE IF NOT EXISTS public.product_scenes (
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  scene_id UUID NOT NULL REFERENCES public.scenes(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, scene_id)
);
CREATE INDEX IF NOT EXISTS product_scenes_scene_id_idx ON public.product_scenes(scene_id);

INSERT INTO public.categories (name, slug, description, sort_order, is_active) VALUES
  ('Projectors', 'projectors', 'Projectors for residential, business, education, events and large-venue installations.', 10, TRUE),
  ('Projection Screens', 'projection-screens', 'Projection screens for standard, UST, portable and fixed installations.', 20, TRUE),
  ('Mounts & Stands', 'projector-mounts-stands', 'Ceiling, wall, floor and desktop mounting solutions.', 30, TRUE),
  ('AV Furniture', 'av-furniture', 'Projector cabinets, motorized TV cabinets and media furniture.', 40, TRUE),
  ('Accessories & Parts', 'accessories-parts', 'Cables, adapters, cases, remotes and replacement parts.', 50, TRUE),
  ('Solution Bundles', 'solution-bundles', 'Scenario-specific projector, screen, mount and accessory packages.', 60, TRUE)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  is_active = TRUE,
  updated_at = now();

WITH children(name, slug, parent_slug, sort_order) AS (
  VALUES
    ('Home Theater Projectors', 'home-theater-projectors', 'projectors', 11),
    ('UST / Laser TV', 'ust-laser-tv', 'projectors', 12),
    ('Portable Projectors', 'portable-projectors', 'projectors', 13),
    ('Business & Education Projectors', 'business-education-projectors', 'projectors', 14),
    ('Installation Projectors', 'installation-projectors', 'projectors', 15),
    ('4K Laser Projectors', '4k-laser-projectors', 'projectors', 16),
    ('ALR / CLR Screens', 'alr-clr-screens', 'projection-screens', 21),
    ('Motorized Screens', 'motorized-screens', 'projection-screens', 22),
    ('Fixed Frame Screens', 'fixed-frame-screens', 'projection-screens', 23),
    ('Floor Rising Screens', 'floor-rising-screens', 'projection-screens', 24),
    ('Portable & Outdoor Screens', 'portable-outdoor-screens', 'projection-screens', 25),
    ('Ceiling Mounts', 'ceiling-mounts', 'projector-mounts-stands', 31),
    ('Wall Mounts', 'wall-mounts', 'projector-mounts-stands', 32),
    ('Floor Stands', 'floor-stands', 'projector-mounts-stands', 33),
    ('Desktop Stands', 'desktop-stands', 'projector-mounts-stands', 34),
    ('Projector Cabinets', 'projector-cabinets', 'av-furniture', 41),
    ('Motorized TV Cabinets', 'motorized-tv-cabinets', 'av-furniture', 42),
    ('Media Consoles', 'media-consoles', 'av-furniture', 43),
    ('Cables & Adapters', 'cables-adapters', 'accessories-parts', 51),
    ('Cases & Bags', 'cases-bags', 'accessories-parts', 52),
    ('Remotes & Replacement Parts', 'replacement-parts', 'accessories-parts', 53),
    ('Home Cinema Kits', 'home-cinema-kits', 'solution-bundles', 61),
    ('Meeting Room Kits', 'meeting-room-kits', 'solution-bundles', 62),
    ('Project Packages', 'project-packages', 'solution-bundles', 63)
)
INSERT INTO public.categories (name, slug, parent_id, sort_order, is_active)
SELECT children.name, children.slug, parent.id, children.sort_order, TRUE
FROM children
JOIN public.categories parent ON parent.slug = children.parent_slug
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  parent_id = EXCLUDED.parent_id,
  sort_order = EXCLUDED.sort_order,
  is_active = TRUE,
  updated_at = now();

UPDATE public.categories child
SET parent_id = parent.id, updated_at = now()
FROM public.categories parent
WHERE child.slug = 'projector-mounts'
  AND parent.slug = 'projector-mounts-stands';

INSERT INTO public.scenes (name, slug, group_name, description, sort_order, is_active) VALUES
  ('Home Cinema', 'home-cinema', 'Residential', 'Complete projector, screen and mounting solutions for dedicated home theaters.', 10, TRUE),
  ('Living Room Laser TV', 'living-room-laser-tv', 'Residential', 'UST projector, CLR screen and furniture-integrated living room systems.', 20, TRUE),
  ('Bedroom & Small Space', 'bedroom-small-space', 'Residential', 'Compact and quiet projection systems for bedrooms and apartments.', 30, TRUE),
  ('Gaming Room', 'gaming-room', 'Residential', 'Low-latency large-screen projection systems for console and PC gaming.', 40, TRUE),
  ('Backyard & Outdoor Cinema', 'outdoor-cinema', 'Residential', 'Portable projector and screen packages for outdoor entertainment.', 50, TRUE),
  ('Office & Meeting Rooms', 'meeting-rooms', 'Business & Projects', 'Presentation and collaboration systems for meeting and conference rooms.', 110, TRUE),
  ('Classrooms & Training', 'education-training', 'Business & Projects', 'Reliable multi-room projection systems for education and training.', 120, TRUE),
  ('Hotels & Hospitality', 'hotels-hospitality', 'Business & Projects', 'Projection systems for guestrooms, lounges, meetings and entertainment.', 130, TRUE),
  ('Bars & Restaurants', 'bars-restaurants', 'Business & Projects', 'Bright large-screen systems for sports and entertainment venues.', 140, TRUE),
  ('Retail & Showrooms', 'retail-showrooms', 'Business & Projects', 'Visual merchandising and immersive showroom projection.', 150, TRUE),
  ('Events & Rental', 'events-rental', 'Business & Projects', 'Portable and serviceable systems for events and rental fleets.', 160, TRUE),
  ('Auditoriums & Large Venues', 'large-venues', 'Business & Projects', 'High-brightness engineered projection for large public spaces.', 170, TRUE)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  group_name = EXCLUDED.group_name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  is_active = TRUE,
  updated_at = now();

-- Safe initial assignments based on existing category. Admins can add or remove
-- additional scene relationships later without changing the primary category.
INSERT INTO public.product_scenes (product_id, scene_id)
SELECT product.id, scene.id
FROM public.products product
JOIN public.categories category ON category.id = product.category_id
JOIN public.scenes scene ON
  (scene.slug = 'home-cinema' AND category.slug IN ('projectors', '4k-laser-projectors', 'home-theater-projectors', 'projection-screens'))
  OR (scene.slug = 'living-room-laser-tv' AND category.slug IN ('ust-laser-tv', 'alr-clr-screens', 'av-furniture'))
  OR (scene.slug = 'outdoor-cinema' AND category.slug IN ('portable-projectors', 'portable-outdoor-screens'))
  OR (scene.slug = 'meeting-rooms' AND category.slug IN ('business-education-projectors', 'motorized-screens', 'projector-mounts'))
ON CONFLICT DO NOTHING;

COMMIT;

SELECT
  (SELECT count(*) FROM public.categories WHERE is_active) AS active_categories,
  (SELECT count(*) FROM public.scenes WHERE is_active) AS active_scenes,
  (SELECT count(*) FROM public.product_scenes) AS product_scene_links;
