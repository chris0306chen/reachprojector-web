-- Reach Projector priority SEO/GEO drafts, prepared 2026-09-08.
-- Creates inactive, out-of-stock, image-free records only.
-- Existing active products are never modified. Existing inactive drafts receive
-- refreshed editorial content but retain all commercial fields and media.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO public.categories (name, slug, description, sort_order, is_active)
VALUES
  ('High-End Home Theater Projectors', 'high-end-home-theater-projectors', 'Premium projectors for performance-focused home cinema installations.', 16, true),
  ('Business & Education Projectors', 'business-education-projectors', 'Projectors for classrooms, meeting rooms and professional AV installations.', 14, true)
ON CONFLICT (slug) DO UPDATE SET is_active = true, updated_at = now();

CREATE TEMP TABLE priority_product_drafts (
  category_slug text NOT NULL,
  sku text NOT NULL,
  name text NOT NULL,
  slug text NOT NULL,
  brand text NOT NULL,
  short_description text NOT NULL,
  description text NOT NULL,
  seo_title text NOT NULL,
  meta_description text NOT NULL,
  specifications jsonb NOT NULL,
  features jsonb NOT NULL,
  detail_content jsonb NOT NULL,
  import_data jsonb NOT NULL
) ON COMMIT DROP;

INSERT INTO priority_product_drafts VALUES
('high-end-home-theater-projectors','VIDDA-C3-ULTRA','VIDDA C3 Ultra 4K RGB Laser Projector','vidda-c3-ultra-4k-rgb-laser-projector','VIDDA',
 'A performance-focused 4K RGB laser projector with optical zoom for flexible home cinema placement.',
 'The VIDDA C3 Ultra is a China-market 4K home cinema projector built around an MCL38 RGB laser light source and a 0.9–1.5:1 optical zoom range. It suits buyers who prioritize image performance and installation flexibility. The supplied interface may use Chinese-market software. Overseas streaming can be handled with a compatible external streaming device; confirm the exact unit language, plug and tested streaming-device combination before purchase.',
 'VIDDA C3 Ultra 4K RGB Laser Projector | Reach Projector',
 'VIDDA C3 Ultra 4K RGB laser projector with 0.9–1.5:1 optical zoom. Review version, placement and streaming-device requirements.',
 '{"Resolution":"4K UHD","Light source":"MCL38 RGB laser","Throw ratio":"0.9–1.5:1 optical zoom","Market version":"China-market configuration"}',
 '["4K home cinema projection","RGB laser light source","Optical zoom for flexible placement","External streaming-device compatible via HDMI"]',
 '{"specifications":[{"group":"Display","name":"Resolution","value":"4K UHD"},{"group":"Optical","name":"Light source","value":"MCL38 RGB laser"},{"group":"Optical","name":"Throw ratio","value":"0.9–1.5:1 optical zoom"},{"group":"System","name":"Regional version","value":"China-market configuration; confirm unit language and firmware before purchase"},{"group":"Connectivity","name":"Streaming","value":"Use a compatible external streaming device via HDMI for overseas services"}],"real_photos":[],"detail_images":[],"logistics_images":[]}',
 '{"source_url":"https://www.hisense.com/product/1307.html","retrieved_at":"2026-09-08","source_type":"brand_website","review_status":"technical-content-draft","geo_content":{"definition":"A 4K RGB laser home cinema projector with optical zoom.","audience":"Performance-focused home cinema buyers who can use an external streaming device.","limitations":["China-market software and regional services require confirmation.","Commercial terms and overseas warranty are not included in this draft."],"faq":[{"question":"Can the VIDDA C3 Ultra be used outside China?","answer":"The projection hardware can be used overseas when its power requirements are met. Confirm the exact language, plug and firmware, and use a compatible HDMI streaming device for the services you need."},{"question":"What throw ratio does the VIDDA C3 Ultra use?","answer":"The manufacturer page lists a 0.9–1.5:1 optical zoom range."}]}}'),

('high-end-home-theater-projectors','VIDDA-C5-MASTER','VIDDA C5 Master 4K RGB Laser Projector','vidda-c5-master-4k-rgb-laser-projector','VIDDA',
 'A high-output 4K RGB laser home cinema projector with optical zoom, lens shift and liquid cooling.',
 'The VIDDA C5 Master is designed for large-screen, performance-focused home theaters. Manufacturer materials identify an MCL3A plus QuaLas42 laser system, optical zoom, lens shift and liquid cooling. It is a China-market model whose interface and regional services must be confirmed for the supplied unit. Buyers can use a compatible external streaming device for overseas content services.',
 'VIDDA C5 Master 4K RGB Laser Projector | Reach Projector',
 'Explore the VIDDA C5 Master 4K RGB laser projector with zoom, lens shift and liquid cooling. Confirm regional configuration before ordering.',
 '{"Resolution":"4K UHD","Light source":"MCL3A + QuaLas42 laser system","Lens":"Optical zoom and lens shift","Cooling":"Liquid cooling","Market version":"China-market configuration"}',
 '["High-performance 4K home cinema","RGB laser projection","Optical zoom and lens shift","Liquid-cooled design","External streaming-device compatible via HDMI"]',
 '{"specifications":[{"group":"Display","name":"Resolution","value":"4K UHD"},{"group":"Optical","name":"Light source","value":"MCL3A + QuaLas42 laser system"},{"group":"Optical","name":"Installation","value":"Optical zoom and lens shift"},{"group":"System","name":"Cooling","value":"Liquid cooling"},{"group":"System","name":"Regional version","value":"China-market configuration; confirm unit language and firmware before purchase"}],"real_photos":[],"detail_images":[],"logistics_images":[]}',
 '{"source_url":"https://mall.hisense.com/search?q=2026","retrieved_at":"2026-09-08","source_type":"brand_website","review_status":"technical-content-draft","geo_content":{"definition":"A high-output 4K RGB laser projector with zoom, lens shift and liquid cooling.","audience":"Dedicated home cinema and large-screen buyers prioritizing optical performance.","limitations":["Exact supplied configuration and overseas warranty require confirmation.","A compatible external streaming device may be required for overseas services."],"faq":[{"question":"Is the VIDDA C5 Master suitable for overseas use?","answer":"It can be considered for overseas installations when the exact voltage, plug, language and firmware are confirmed. An external HDMI streaming device can provide the required content platform."}]}}'),

('high-end-home-theater-projectors','VIDDA-C5-ULTRA','VIDDA C5 Ultra 4K RGB Laser Projector','vidda-c5-ultra-4k-rgb-laser-projector','VIDDA',
 'A 4K RGB laser projector with lens shift and 1.67x optical zoom for adaptable home cinema installation.',
 'The VIDDA C5 Ultra combines 4K projection, an MCL3A RGB laser system, lens shift and 1.67x optical zoom. It targets buyers who value brightness and optical placement flexibility more than an integrated global streaming platform. This is a China-market configuration; confirm language, plug, firmware and the external streaming device intended for use overseas.',
 'VIDDA C5 Ultra 4K RGB Laser Projector | Reach Projector',
 'VIDDA C5 Ultra 4K RGB laser projector with lens shift and 1.67x optical zoom. Review placement and regional setup requirements.',
 '{"Resolution":"4K UHD","Light source":"MCL3A RGB laser","Optical zoom":"1.67x","Lens adjustment":"Lens shift","Market version":"China-market configuration"}',
 '["4K home cinema projection","RGB laser light source","1.67x optical zoom","Lens shift","External streaming-device compatible via HDMI"]',
 '{"specifications":[{"group":"Display","name":"Resolution","value":"4K UHD"},{"group":"Optical","name":"Light source","value":"MCL3A RGB laser"},{"group":"Optical","name":"Optical zoom","value":"1.67x"},{"group":"Optical","name":"Lens adjustment","value":"Lens shift"},{"group":"System","name":"Regional version","value":"China-market configuration; confirm unit language and firmware before purchase"}],"real_photos":[],"detail_images":[],"logistics_images":[]}',
 '{"source_url":"https://mall.hisense.com/items/7028","retrieved_at":"2026-09-08","source_type":"brand_website","review_status":"technical-content-draft","geo_content":{"definition":"A 4K RGB laser home cinema projector with lens shift and 1.67x optical zoom.","audience":"Buyers prioritizing projection performance and flexible physical placement.","limitations":["Exact regional software, plug and overseas warranty require confirmation.","An external streaming device may be needed for overseas content services."],"faq":[{"question":"Does the VIDDA C5 Ultra have optical zoom?","answer":"The official Hisense store identifies 1.67x optical zoom and lens shift."}]}}'),

('high-end-home-theater-projectors','HISENSE-PT1','Hisense PT1 4K Triple Laser Ultra Short Throw Projector','hisense-pt1-4k-triple-laser-ust-projector','Hisense',
 'A 4K triple-laser ultra-short-throw projector for 80–150-inch living-room cinema installations.',
 'The Hisense PT1 is a 4K triple-laser ultra-short-throw projector designed for living-room cinema. Official specifications list 2,500 ANSI lumens, a 3,000:1 contrast ratio and an 80–150-inch image range, with Dolby Vision and IMAX Enhanced support. Confirm the exact regional smart-TV platform, plug and warranty for the supplied version before purchase.',
 'Hisense PT1 4K Triple Laser UST Projector | Reach Projector',
 'Hisense PT1 4K triple-laser UST projector for 80–150-inch screens, with 2,500 ANSI lumens, Dolby Vision and IMAX Enhanced.',
 '{"Resolution":"3840 × 2160","Light source":"RGB triple laser","Brightness":"2,500 ANSI lumens","Contrast":"3,000:1","Image size":"80–150 inches","HDR":"Dolby Vision, HDR10+","Audio":"Dolby Atmos"}',
 '["Ultra-short-throw living-room cinema","4K RGB triple-laser projection","Dolby Vision and HDR10+","IMAX Enhanced","Up to 150-inch image"]',
 '{"specifications":[{"group":"Display","name":"Resolution","value":"3840 × 2160"},{"group":"Optical","name":"Light source","value":"RGB triple laser"},{"group":"Optical","name":"Brightness","value":"2,500 ANSI lumens"},{"group":"Display","name":"Contrast","value":"3,000:1"},{"group":"Optical","name":"Image size","value":"80–150 inches"},{"group":"Display","name":"HDR","value":"Dolby Vision, HDR10+"},{"group":"System","name":"Audio","value":"Dolby Atmos"}],"real_photos":[],"detail_images":[],"logistics_images":[]}',
 '{"source_url":"https://www.hisense-usa.com/product-page/projectors-4k-triple-laser-ultra-short-throw-projector-pt1","retrieved_at":"2026-09-08","source_type":"brand_website","review_status":"technical-content-draft","geo_content":{"definition":"A 4K triple-laser UST projector for 80–150-inch living-room cinema.","audience":"Home cinema buyers who want a large image with the projector close to the wall.","limitations":["An ALR/CLR screen and accurate cabinet placement may be needed for strong daylight performance.","Regional smart-TV platform and warranty vary by supplied version."],"faq":[{"question":"How large an image can the Hisense PT1 produce?","answer":"Hisense specifies an 80–150-inch image range."},{"question":"Does the Hisense PT1 support Dolby Vision?","answer":"Yes. Official product information lists Dolby Vision and IMAX Enhanced."}]}}'),

('high-end-home-theater-projectors','XGIMI-X50-ULTRA-MAX','XGIMI X50 Ultra Max 4K RGB Laser Projector','xgimi-x50-ultra-max-4k-rgb-laser-projector','XGIMI',
 'A China-market flagship 4K RGB laser projector with optical zoom and lens shift for premium installations.',
 'The XGIMI X50 Ultra Max is a China-market flagship aimed at premium home theater and professional AV installations. Its 4K DLP imaging system, RGB laser light source, optical zoom and lens-shift capability support large-screen applications where image performance and flexible placement matter. Overseas buyers should confirm language, firmware, plug and voltage and plan to use a tested external streaming device for their preferred services.',
 'XGIMI X50 Ultra Max 4K RGB Laser Projector | Reach Projector',
 'XGIMI X50 Ultra Max China-market 4K RGB laser projector with optical zoom and lens shift. Confirm regional setup before ordering.',
 '{"Resolution":"3840 × 2160","Display technology":"DLP","Light source":"RGB laser","Lens":"Optical zoom and lens shift","Market version":"China-market configuration"}',
 '["Premium 4K home cinema","RGB laser light source","Optical zoom","Vertical and horizontal lens shift","External streaming-device compatible via HDMI"]',
 '{"specifications":[{"group":"Display","name":"Resolution","value":"3840 × 2160"},{"group":"Display","name":"Display technology","value":"DLP"},{"group":"Optical","name":"Light source","value":"RGB laser"},{"group":"Optical","name":"Installation","value":"Optical zoom with vertical and horizontal lens shift"},{"group":"System","name":"Regional version","value":"China-market configuration; confirm unit language and firmware before purchase"}],"real_photos":[],"detail_images":[],"logistics_images":[]}',
 '{"source_url":"https://kayaprojector.store/products/xgimi-x50-ultra-max-4k-laser-projector","retrieved_at":"2026-09-08","source_type":"supplier_product_page","warnings":["Key specifications require final confirmation against the exact supplied unit."],"review_status":"technical-content-draft","geo_content":{"definition":"A China-market flagship 4K RGB laser projector with optical zoom and lens shift.","audience":"Performance-focused home cinema and AV installation buyers.","limitations":["Exact firmware, language, plug, voltage and overseas warranty require confirmation.","Use a tested external streaming device for required overseas services."],"faq":[{"question":"Can the XGIMI X50 Ultra Max stream overseas services?","answer":"The projection hardware accepts external HDMI sources. Confirm a tested streaming-device combination for the specific services and country you need."}]}}'),

('business-education-projectors','EPSON-L695SU','Epson PowerLite L695SU 6,200-Lumen Short Throw Laser Projector','epson-powerlite-l695su-short-throw-laser-projector','Epson',
 'A 6,200-lumen short-throw WUXGA 3LCD laser projector for education and professional AV installations.',
 'The Epson PowerLite L695SU is a short-throw WUXGA 3LCD laser projector designed for classrooms, meeting rooms and installed AV. Epson specifies 6,200 lumens and positions the model for large, readable images where installation distance is limited. This product is offered as project quotation only; lens, mount, signal distribution and regional service requirements must be confirmed for each installation.',
 'Epson PowerLite L695SU Short Throw Laser Projector | RFQ',
 'Request a project quote for the Epson PowerLite L695SU, a 6,200-lumen short-throw WUXGA 3LCD laser projector for installed AV.',
 '{"Resolution":"WUXGA","Projection system":"3LCD","Brightness":"6,200 lumens","Throw type":"Short throw","Light source":"Laser"}',
 '["Classroom and lecture-room projection","Meeting and collaboration spaces","Short-throw installation","Professional AV integration","Quote-only project configuration"]',
 '{"specifications":[{"group":"Display","name":"Resolution","value":"WUXGA"},{"group":"Display","name":"Projection system","value":"3LCD"},{"group":"Optical","name":"Brightness","value":"6,200 lumens"},{"group":"Optical","name":"Throw type","value":"Short throw"},{"group":"Optical","name":"Light source","value":"Laser"}],"real_photos":[],"detail_images":[],"logistics_images":[]}',
 '{"source_url":"https://epson.com/For-Work/Projectors/Classroom/PowerLite-L695SU-6%2C200-Lumen-Short-Throw-WUXGA-3LCD-Laser-Projector/p/V11HB31120","retrieved_at":"2026-09-08","source_type":"brand_website","sale_mode":"quote_only","review_status":"technical-content-draft","geo_content":{"definition":"A 6,200-lumen short-throw WUXGA 3LCD laser installation projector.","audience":"Schools, meeting-room planners and AV integrators.","limitations":["Final configuration depends on room geometry, mounting and signal requirements.","Price, availability, warranty and lead time require a project quotation."],"faq":[{"question":"Is the Epson L695SU available for online checkout?","answer":"No. Reach Projector handles this professional model through a project quotation so installation and regional requirements can be confirmed."}]}}'),

('business-education-projectors','EPSON-L530U','Epson PowerLite L530U 5,200-Lumen WUXGA Laser Projector','epson-powerlite-l530u-wuxga-laser-projector','Epson',
 'A 5,200-lumen WUXGA 3LCD laser projector for classrooms, meetings and large shared displays.',
 'The Epson PowerLite L530U is a WUXGA 3LCD laser projector for education and business environments. Epson specifies 5,200 lumens, image sizes up to 500 inches and a 20,000-hour laser light-source rating under stated conditions. It supports flexible installation with lens shift and accepts 4K input. This model is available by project quotation only.',
 'Epson PowerLite L530U WUXGA Laser Projector | RFQ',
 'Request a quote for the Epson PowerLite L530U, a 5,200-lumen WUXGA 3LCD laser projector for classrooms and meeting rooms.',
 '{"Resolution":"1920 × 1200 WUXGA","Projection system":"3LCD","Brightness":"5,200 lumens","Image size":"Up to 500 inches","Light source":"Laser, rated up to 20,000 hours","Input":"Accepts 4K signal"}',
 '["Classrooms and lecture halls","Meeting and collaboration rooms","Large shared displays","Lens-shift installation","Quote-only project configuration"]',
 '{"specifications":[{"group":"Display","name":"Resolution","value":"1920 × 1200 WUXGA"},{"group":"Display","name":"Projection system","value":"3LCD"},{"group":"Optical","name":"Brightness","value":"5,200 lumens"},{"group":"Optical","name":"Image size","value":"Up to 500 inches"},{"group":"Optical","name":"Light source","value":"Laser, rated up to 20,000 hours under Epson test conditions"},{"group":"Connectivity","name":"Input support","value":"Accepts 4K signal"}],"real_photos":[],"detail_images":[],"logistics_images":[]}',
 '{"source_url":"https://epson.com/For-Work/Projectors/Meeting-Room/PowerLite-L530U-Full-HD-WUXGA-3LCD-Laser-Projector/p/V11HA27020","retrieved_at":"2026-09-08","source_type":"brand_website","sale_mode":"quote_only","review_status":"technical-content-draft","geo_content":{"definition":"A 5,200-lumen WUXGA 3LCD laser projector for education and meeting spaces.","audience":"Schools, companies and AV integrators needing bright, large shared displays.","limitations":["Installation suitability depends on throw distance, screen and ambient light.","Price, availability, warranty and lead time require a project quotation."],"faq":[{"question":"Does the Epson L530U accept 4K input?","answer":"Yes. Epson states that the native WUXGA projector accepts a 4K signal."}]}}'),

('business-education-projectors','EPSON-L690SU','Epson PowerLite L690SU 6,200-Lumen Short Throw Laser Projector','epson-powerlite-l690su-short-throw-laser-projector','Epson',
 'A 6,200-lumen short-throw WUXGA 3LCD laser projector for bright education and business spaces.',
 'The Epson PowerLite L690SU is a 6,200-lumen short-throw WUXGA 3LCD laser projector for classrooms, meeting rooms and professional AV. Its short-throw design supports large images where projector distance is constrained. Reach Projector supplies this model through project quotation so mounting, signal, control and regional service requirements can be checked.',
 'Epson PowerLite L690SU Short Throw Laser Projector | RFQ',
 'Request a project quote for the Epson PowerLite L690SU, a 6,200-lumen short-throw WUXGA 3LCD laser projector.',
 '{"Resolution":"WUXGA","Projection system":"3LCD","Brightness":"6,200 lumens","Throw type":"Short throw","Light source":"Laser"}',
 '["Education and training spaces","Meeting rooms","Short-throw installation","Professional AV integration","Quote-only project configuration"]',
 '{"specifications":[{"group":"Display","name":"Resolution","value":"WUXGA"},{"group":"Display","name":"Projection system","value":"3LCD"},{"group":"Optical","name":"Brightness","value":"6,200 lumens"},{"group":"Optical","name":"Throw type","value":"Short throw"},{"group":"Optical","name":"Light source","value":"Laser"}],"real_photos":[],"detail_images":[],"logistics_images":[]}',
 '{"source_url":"https://epson.com/For-Work/Projectors/Classroom/c/w350","retrieved_at":"2026-09-08","source_type":"brand_website","sale_mode":"quote_only","review_status":"technical-content-draft","geo_content":{"definition":"A 6,200-lumen short-throw WUXGA 3LCD laser installation projector.","audience":"Schools, companies and AV integrators with limited throw distance.","limitations":["Final suitability requires room and mounting details.","Price, availability, warranty and lead time require a project quotation."],"faq":[{"question":"Why is the Epson L690SU quote-only?","answer":"Short-throw professional installations depend on room geometry, mount, screen, signal and regional service requirements, so Reach Projector confirms the complete project before quoting."}]}}'),

('business-education-projectors','EPSON-L690U','Epson PowerLite L690U 6,500-Lumen WUXGA Laser Projector','epson-powerlite-l690u-wuxga-laser-projector','Epson',
 'A 6,500-lumen WUXGA 3LCD laser projector for classrooms, meeting rooms and professional installations.',
 'The Epson PowerLite L690U is a 6,500-lumen WUXGA 3LCD laser projector designed for bright education, business and installed AV environments. It is suited to applications that need high light output with standard-throw placement. Reach Projector offers the model through project quotation so screen size, mounting, control and regional service can be confirmed.',
 'Epson PowerLite L690U 6,500-Lumen Laser Projector | RFQ',
 'Request a quote for the Epson PowerLite L690U, a 6,500-lumen WUXGA 3LCD laser projector for professional installations.',
 '{"Resolution":"WUXGA","Projection system":"3LCD","Brightness":"6,500 lumens","Throw type":"Standard throw","Light source":"Laser"}',
 '["Bright classrooms and lecture rooms","Meeting and collaboration spaces","Professional AV installation","Large shared displays","Quote-only project configuration"]',
 '{"specifications":[{"group":"Display","name":"Resolution","value":"WUXGA"},{"group":"Display","name":"Projection system","value":"3LCD"},{"group":"Optical","name":"Brightness","value":"6,500 lumens"},{"group":"Optical","name":"Throw type","value":"Standard throw"},{"group":"Optical","name":"Light source","value":"Laser"}],"real_photos":[],"detail_images":[],"logistics_images":[]}',
 '{"source_url":"https://epson.com/For-Work/Projectors/Classroom/c/w350","retrieved_at":"2026-09-08","source_type":"brand_website","sale_mode":"quote_only","review_status":"technical-content-draft","geo_content":{"definition":"A 6,500-lumen WUXGA 3LCD laser projector for bright professional spaces.","audience":"Education, enterprise and AV integration buyers.","limitations":["Final specification depends on screen, room light and installation geometry.","Price, availability, warranty and lead time require a project quotation."],"faq":[{"question":"Is the Epson L690U intended for home cinema?","answer":"It is primarily positioned for education, business and professional AV environments. Home use should be evaluated against noise, throw distance, screen and image requirements."}]}}'),

('business-education-projectors','EPSON-EB-PU1007','Epson EB-PU1007 7,000-Lumen WUXGA Laser Projector','epson-eb-pu1007-wuxga-laser-projector','Epson',
 'A 7,000-lumen WUXGA interchangeable-lens laser projector for professional venues and installed AV.',
 'The Epson EB-PU1007 is a WUXGA interchangeable-lens laser projector for professional AV, events and larger venues. It is available in black and white variants and requires a compatible lens selected for the installation. Reach Projector handles this model as quote-only so lens choice, throw distance, mounting, signal, control and service requirements can be specified together.',
 'Epson EB-PU1007 Interchangeable-Lens Laser Projector | RFQ',
 'Request a project quote for the Epson EB-PU1007 WUXGA interchangeable-lens laser projector for venues and professional AV installations.',
 '{"Resolution":"WUXGA","Projection system":"3LCD","Brightness":"7,000 lumens","Lens":"Interchangeable; compatible lens required","Light source":"Laser","Color variants":"Black or white"}',
 '["Professional venues and events","Interchangeable-lens installation","Large-screen AV systems","Integrated control environments","Quote-only project configuration"]',
 '{"specifications":[{"group":"Display","name":"Resolution","value":"WUXGA"},{"group":"Display","name":"Projection system","value":"3LCD"},{"group":"Optical","name":"Brightness","value":"7,000 lumens"},{"group":"Optical","name":"Lens","value":"Interchangeable; compatible lens required"},{"group":"Optical","name":"Light source","value":"Laser"},{"group":"Other","name":"Color variants","value":"EB-PU1007B black / EB-PU1007W white"}],"real_photos":[],"detail_images":[],"logistics_images":[]}',
 '{"source_url":"https://files.support.epson.com/pdf/specs/specifications_ebpu2010series_en_r102.pdf","retrieved_at":"2026-09-08","source_type":"brand_website","sale_mode":"quote_only","review_status":"technical-content-draft","geo_content":{"definition":"A 7,000-lumen WUXGA interchangeable-lens 3LCD laser projector for professional AV.","audience":"AV integrators, event operators and venue project buyers.","limitations":["A compatible lens is required and must be selected for the actual throw geometry.","Price, lens, availability, warranty and lead time require a project quotation."],"faq":[{"question":"Does the Epson EB-PU1007 include a lens?","answer":"Lens configuration must be confirmed for the supplied package. Reach Projector selects and quotes the compatible lens from the project throw distance and image size."}]}}');

WITH prepared AS (
  SELECT draft.*, category.id AS category_id
  FROM priority_product_drafts draft
  JOIN public.categories category ON category.slug = draft.category_slug
)
INSERT INTO public.products (
  sku, name, slug, brand, category_id, price, currency, short_description,
  description, images, specifications, features, detail_content, seo_title,
  meta_description, import_data, stock_status, inventory_quantity,
  is_bestseller, is_new_arrival, is_featured, is_active, sort_order, updated_at
)
SELECT
  sku, name, slug, brand, category_id, 0, 'USD', short_description,
  description, '[]'::jsonb, specifications, features, detail_content, seo_title,
  meta_description, import_data, 'out_of_stock', 0,
  false, false, false, false, 0, now()
FROM prepared
WHERE NOT EXISTS (
  SELECT 1
  FROM public.products existing
  WHERE existing.sku = prepared.sku OR existing.slug = prepared.slug
);

UPDATE public.products
SET import_data = COALESCE(import_data, '{}'::jsonb) || jsonb_build_object(
      'sale_mode', CASE WHEN brand = 'Epson' THEN 'quote_only' ELSE 'retail_and_bulk' END,
      'commerce_profile', jsonb_build_object(
        'sale_mode', CASE WHEN brand = 'Epson' THEN 'quote_only' ELSE 'retail_and_bulk' END,
        'market_version', CASE
          WHEN brand = 'VIDDA' OR sku = 'XGIMI-X50-ULTRA-MAX'
            THEN 'China-market configuration'
          ELSE 'Confirm exact regional version before purchase'
        END,
        'system_language', 'Confirm exact unit before purchase',
        'streaming_setup', CASE
          WHEN brand = 'VIDDA' OR sku = 'XGIMI-X50-ULTRA-MAX'
            THEN 'Use a compatible external HDMI streaming device for overseas services'
          ELSE 'Confirm built-in services for the supplied regional version'
        END,
        'plug_and_voltage', 'Confirm supplied plug and voltage before purchase',
        'warranty', 'Confirm for destination before purchase',
        'duties', 'DDP or DAP is confirmed for the checkout destination; terms are never combined'
      )
    ),
    updated_at = now()
WHERE sku IN (SELECT sku FROM priority_product_drafts)
  AND is_active = false;

SELECT sku, name, slug, is_active, stock_status,
       import_data->>'sale_mode' AS sale_mode,
       import_data->>'source_url' AS source_url
FROM public.products
WHERE sku IN (SELECT sku FROM priority_product_drafts)
ORDER BY brand, name;
