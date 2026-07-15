-- ============================================================
-- REACH PROJECTOR - 数据库初始化脚本
-- 在 Supabase SQL Editor 中执行此脚本
-- ============================================================

-- 1. 分类表
CREATE TABLE IF NOT EXISTS categories (
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

CREATE INDEX IF NOT EXISTS categories_slug_idx ON categories(slug);
CREATE INDEX IF NOT EXISTS categories_sort_order_idx ON categories(sort_order);

-- 2. 产品表
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  brand VARCHAR(100) NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id),
  price NUMERIC(10,2) NOT NULL,
  compare_at_price NUMERIC(10,2),
  description TEXT,
  short_description TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '{}'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  stock_status VARCHAR(20) NOT NULL DEFAULT 'in_stock',
  is_bestseller BOOLEAN NOT NULL DEFAULT false,
  is_new_arrival BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS products_slug_idx ON products(slug);
CREATE INDEX IF NOT EXISTS products_category_id_idx ON products(category_id);
CREATE INDEX IF NOT EXISTS products_brand_idx ON products(brand);
CREATE INDEX IF NOT EXISTS products_price_idx ON products(price);
CREATE INDEX IF NOT EXISTS products_is_active_idx ON products(is_active);

-- 3. 询盘表
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(200),
  phone VARCHAR(50),
  message TEXT NOT NULL,
  product_id UUID REFERENCES products(id),
  status VARCHAR(20) NOT NULL DEFAULT 'new',
  reply TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS inquiries_status_idx ON inquiries(status);
CREATE INDEX IF NOT EXISTS inquiries_email_idx ON inquiries(email);

-- 4. 订单表
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(100) NOT NULL UNIQUE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  amount NUMERIC(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  payer_email VARCHAR(255),
  payer_name VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  payment_method VARCHAR(20) DEFAULT 'paypal',
  airwallex_intent_id VARCHAR(255),
  shipping_method VARCHAR(100),
  tracking_number VARCHAR(200),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS orders_order_id_idx ON orders(order_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_product_id_idx ON orders(product_id);

-- 5. 用户表（后台管理）
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'staff',
  permissions JSONB DEFAULT '[]'::jsonb,
  name VARCHAR(100),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- 6. 运费模板表
CREATE TABLE IF NOT EXISTS shipping_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  zone VARCHAR(100) NOT NULL,
  method VARCHAR(50) NOT NULL,
  weight_rate JSONB DEFAULT '{}'::jsonb,
  volume_rate JSONB DEFAULT '{}'::jsonb,
  fixed_fee NUMERIC(10,2) DEFAULT 0,
  min_order NUMERIC(10,2) DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS shipping_templates_zone_idx ON shipping_templates(zone);

-- ============================================================
-- 种子数据
-- ============================================================

-- 分类数据
INSERT INTO categories (name, slug, description, image_url, sort_order) VALUES
  ('Projectors', 'projectors', 'Professional 4K Laser Projectors, UST Laser TVs and home theater solutions from top brands.', '/images/category-projectors.jpg', 1),
  ('Printers', 'printers', 'High-performance laser and inkjet printers for office and home use.', '/images/category-printers.jpg', 2),
  ('Components', 'components', 'Premium PC components including CPUs, GPUs, motherboards, memory and storage.', '/images/category-components.jpg', 3)
ON CONFLICT (slug) DO NOTHING;

-- 产品数据（31个产品）
-- 先获取分类 ID
DO $$
DECLARE
  v_projector_id UUID;
  v_printer_id UUID;
  v_component_id UUID;
BEGIN
  SELECT id INTO v_projector_id FROM categories WHERE slug = 'projectors' LIMIT 1;
  SELECT id INTO v_printer_id FROM categories WHERE slug = 'printers' LIMIT 1;
  SELECT id INTO v_component_id FROM categories WHERE slug = 'components' LIMIT 1;

  -- Projectors (12 products)
  INSERT INTO products (name, slug, brand, category_id, price, short_description, description, features, specifications, images, is_bestseller, is_new_arrival, is_featured, stock_status) VALUES
    ('JMGO N5S ULTRA MAX 4K', 'jmgo-n5s-ultra-max-4k', 'JMGO', v_projector_id, 1600, 'Premium 4K laser projector with exceptional brightness and color accuracy for home theater.', 'The JMGO N5S ULTRA MAX 4K delivers an immersive cinematic experience with its advanced laser light source, delivering stunning 4K resolution with vivid colors and deep contrasts. Perfect for dedicated home theater setups.', '["4K UHD Resolution","Laser Light Source","3000+ ANSI Lumens","HDR10+ Support","Auto Keystone Correction","Built-in Speaker"]', '{"Resolution":"3840 x 2160","Brightness":"3200 ANSI Lumens","Light Source":"Triple Color Laser","Contrast Ratio":"3000:1","Throw Ratio":"1.2:1","Lens Shift":"Vertical/Horizontal","Speaker":"2 x 10W","Weight":"9.5 kg"}', '[]', true, false, true, 'in_stock'),
    ('XGIMI RS 10 Ultra 4K', 'xgimi-rs-10-ultra-4k', 'XGIMI', v_projector_id, 2499.99, 'Flagship 4K laser projector with dual laser engine and Dolby Vision support.', 'The XGIMI RS 10 Ultra represents the pinnacle of home projection technology. Featuring a dual laser engine that delivers unparalleled brightness and color volume, with Dolby Vision and HDR10+ for the most lifelike images.', '["4K UHD Resolution","Dual Laser Engine","3500+ ANSI Lumens","Dolby Vision + HDR10+","Auto Focus & Keystone","Harman Kardon Speakers"]', '{"Resolution":"3840 x 2160","Brightness":"3500 ANSI Lumens","Light Source":"Dual Laser","Contrast Ratio":"3500:1","Throw Ratio":"1.2:1","Speaker":"2 x 12W Harman Kardon","Connectivity":"HDMI 2.1 x2, USB 3.0 x2","Weight":"10.2 kg"}', '[]', true, false, true, 'in_stock'),
    ('XGIMI RS 10 Mini 4K', 'xgimi-rs-10-mini-4k', 'XGIMI', v_projector_id, 1199.99, 'Compact 4K laser projector with premium features in a smaller form factor.', 'The XGIMI RS 10 Mini 4K brings flagship performance to a compact design. Perfect for smaller rooms while maintaining incredible image quality and smart features.', '["4K UHD Resolution","Laser Light Source","2000+ ANSI Lumens","HDR10+ Support","Smart Auto Adjustment","Portable Design"]', '{"Resolution":"3840 x 2160","Brightness":"2000 ANSI Lumens","Light Source":"Laser","Contrast Ratio":"2500:1","Throw Ratio":"1.2:1","Speaker":"2 x 8W","Weight":"4.5 kg"}', '[]', false, true, false, 'in_stock'),
    ('Hisense VIDDA C5 Master 4K', 'hisense-vidda-c5-master-4k', 'Hisense', v_projector_id, 2699.99, 'Professional-grade 4K laser projector with cinema-level color accuracy.', 'The Hisense VIDDA C5 Master 4K is engineered for the most demanding home theater enthusiasts. With cinema-grade color accuracy and advanced laser technology, every frame comes alive with breathtaking detail.', '["4K UHD Resolution","Triple Laser (ALPD 5.0)","4000+ ANSI Lumens","Cinema-grade Color","120Hz Refresh Rate","Advanced Cooling System"]', '{"Resolution":"3840 x 2160","Brightness":"4200 ANSI Lumens","Light Source":"ALPD 5.0 Triple Laser","Color Gamut":"110% BT.2020","Throw Ratio":"0.9:1 - 1.5:1","Speaker":"2 x 15W","Weight":"12.5 kg"}', '[]', true, false, false, 'in_stock'),
    ('Hisense PX2-Pro 4K UST', 'hisense-px2-pro-4k-ust', 'Hisense', v_projector_id, 2399.99, 'Ultra Short Throw 4K laser TV with 120" image from inches away.', 'The Hisense PX2-Pro transforms any wall into a massive 120-inch 4K display from just inches away. Its ultra-short throw design eliminates shadows and glare, delivering a true cinema experience in your living room.', '["4K UHD Resolution","Ultra Short Throw","2400+ ANSI Lumens","Triple Laser","Dolby Vision","Ambient Light Rejecting"]', '{"Resolution":"3840 x 2160","Brightness":"2400 ANSI Lumens","Light Source":"Triple Laser","Throw Ratio":"0.23:1","Screen Size":"80\" - 150\"","Speaker":"2 x 15W + Subwoofer","Weight":"14 kg"}', '[]', false, false, true, 'in_stock'),
    ('AWOL Vision LTV-3500 4K', 'awol-vision-ltv-3500-4k', 'AWOL Vision', v_projector_id, 5999.99, 'Premium RGB triple laser UST projector with unmatched brightness.', 'The AWOL Vision LTV-3500 is the ultimate ultra-short throw projector featuring an RGB triple laser system that delivers extraordinary brightness and a color volume that surpasses any other projector in its class.', '["4K UHD Resolution","RGB Triple Laser","5500+ ANSI Lumens","150\" Display","HDR Support","Premium Build"]', '{"Resolution":"3840 x 2160","Brightness":"5500 ANSI Lumens","Light Source":"RGB Triple Laser","Throw Ratio":"0.198:1","Screen Size":"80\" - 150\"","Speaker":"2 x 15W","Weight":"18 kg"}', '[]', false, false, true, 'in_stock'),
    ('Formovie Theater 4K', 'formovie-theater-4k', 'Formovie', v_projector_id, 3499.99, 'Award-winning UST laser projector with ALPD 4.5 technology.', 'The Formovie Theater combines ALPD 4.5 laser technology with an ultra-short throw design to deliver stunning 4K images. Winner of multiple awards for its exceptional picture quality and value.', '["4K UHD Resolution","ALPD 4.5 Laser","2800+ ANSI Lumens","Dolby Vision + HDR10+","150\" Screen","Android TV Built-in"]', '{"Resolution":"3840 x 2160","Brightness":"2800 ANSI Lumens","Light Source":"ALPD 4.5","Throw Ratio":"0.23:1","Screen Size":"80\" - 150\"","Speaker":"2 x 15W Dolby Audio","Weight":"12 kg"}', '[]', false, true, false, 'in_stock'),
    ('JMGO U2 4K Laser TV', 'jmgo-u2-4k-laser-tv', 'JMGO', v_projector_id, 2199.99, 'Sleek 4K laser TV with superior optics and smart features.', 'The JMGO U2 brings cinematic 4K quality to your living room with its compact laser TV design. Featuring advanced optics and smart connectivity for effortless entertainment.', '["4K UHD Resolution","Laser Light Source","2400 ANSI Lumens","HDR10+","Auto Focus","Smart OS"]', '{"Resolution":"3840 x 2160","Brightness":"2400 ANSI Lumens","Light Source":"Laser","Throw Ratio":"0.23:1","Screen Size":"80\" - 130\"","Speaker":"2 x 10W","Weight":"8.5 kg"}', '[]', false, false, false, 'in_stock'),
    ('XGIMI Horizon Ultra', 'xgimi-horizon-ultra', 'XGIMI', v_projector_id, 1799.99, 'Premium 4K HDR projector with Dolby Vision and hybrid light source.', 'The XGIMI Horizon Ultra combines a hybrid light source (LED + Laser) for exceptional brightness and color accuracy. With Dolby Vision support and premium audio, it delivers a complete entertainment experience.', '["4K UHD Resolution","Hybrid LED+Laser","2300 ISO Lumens","Dolby Vision","Harman Kardon Audio","Android TV 11"]', '{"Resolution":"3840 x 2160","Brightness":"2300 ISO Lumens","Light Source":"LED + Laser","Throw Ratio":"1.2:1","Speaker":"2 x 12W Harman Kardon","Weight":"5.5 kg"}', '[]', true, false, false, 'in_stock'),
    ('XGIMI MoGo 3 Pro', 'xgimi-mogo-3-pro', 'XGIMI', v_projector_id, 599.99, 'Portable 1080p projector with built-in battery and Android TV.', 'Take your entertainment anywhere with the XGIMI MoGo 3 Pro. This portable projector features a built-in battery for cord-free viewing and delivers impressive 1080p image quality.', '["1080p Full HD","Built-in Battery","400 ISO Lumens","Android TV","Auto Keystone","Portable Design"]', '{"Resolution":"1920 x 1080","Brightness":"400 ISO Lumens","Battery Life":"2.5 hours","Throw Ratio":"1.1:1","Speaker":"2 x 4W","Weight":"1.6 kg"}', '[]', false, true, false, 'in_stock'),
    ('JMGO N1 Ultra 4K', 'jmgo-n1-ultra-4k', 'JMGO', v_projector_id, 1399.99, 'Compact 4K laser projector with innovative gimbal design.', 'The JMGO N1 Ultra features an innovative built-in gimbal stand that allows 360-degree rotation and easy angle adjustment. Combined with 4K laser projection, it offers unmatched versatility.', '["4K UHD Resolution","Laser Light Source","2200 ANSI Lumens","360-degree Gimbal","Auto Focus & Keystone","Cloud Gaming Ready"]', '{"Resolution":"3840 x 2160","Brightness":"2200 ANSI Lumens","Light Source":"Triple Color Laser","Throw Ratio":"0.6:1 - 4.5:1","Speaker":"2 x 10W","Weight":"4.6 kg"}', '[]', false, false, false, 'in_stock'),
    ('Hisense PL1 4K Laser TV', 'hisense-pl1-4k-laser-tv', 'Hisense', v_projector_id, 1899.99, 'Affordable 4K UST laser TV with impressive performance.', 'The Hisense PL1 offers 4K ultra-short throw projection at an accessible price point. Perfect for those wanting a large-screen experience without the premium price tag.', '["4K UHD Resolution","Laser Light Source","2100 ANSI Lumens","Ultra Short Throw","Smart TV Built-in","Voice Control"]', '{"Resolution":"3840 x 2160","Brightness":"2100 ANSI Lumens","Light Source":"Laser","Throw Ratio":"0.25:1","Screen Size":"80\" - 120\"","Speaker":"2 x 10W","Weight":"8 kg"}', '[]', false, false, false, 'in_stock'),

    -- Printers (8 products)
    ('HP LaserJet Pro M404dn', 'hp-laserjet-pro-m404dn', 'HP', v_printer_id, 329, 'Fast monochrome laser printer for busy offices.', 'The HP LaserJet Pro M404dn delivers fast, reliable monochrome printing for busy workgroups. With automatic duplex printing and network connectivity, it handles high-volume office tasks efficiently.', '["Monochrome Laser","40 ppm Print Speed","Auto Duplex","Network Ready","250-sheet Tray","Low Toner Cost"]', '{"Type":"Monochrome Laser","Speed":"40 ppm","Resolution":"1200 x 1200 dpi","Duplex":"Automatic","Connectivity":"USB, Ethernet","Paper Capacity":"350 sheets","Weight":"10.2 kg"}', '[]', true, false, false, 'in_stock'),
    ('Canon imageCLASS LBP226dw', 'canon-imageclass-lbp226dw', 'Canon', v_printer_id, 299, 'Compact wireless monochrome laser printer with duplex printing.', 'The Canon imageCLASS LBP226dw combines compact design with powerful performance. Wireless connectivity and automatic duplex printing make it ideal for small offices and home offices.', '["Monochrome Laser","40 ppm Print Speed","Wireless + Ethernet","Auto Duplex","Canon UFR II","Energy Efficient"]', '{"Type":"Monochrome Laser","Speed":"40 ppm","Resolution":"1200 x 1200 dpi","Duplex":"Automatic","Connectivity":"USB, Wi-Fi, Ethernet","Weight":"8.4 kg"}', '[]', false, false, false, 'in_stock'),
    ('Brother HL-L2370DW', 'brother-hl-l2370dw', 'Brother', v_printer_id, 209, 'Reliable wireless monochrome laser printer for home and small office.', 'The Brother HL-L2370DW offers reliable, cost-effective monochrome printing with wireless connectivity. Its compact design and fast print speeds make it perfect for home offices.', '["Monochrome Laser","36 ppm Print Speed","Wireless Printing","Auto Duplex","250-sheet Tray","Mobile Printing"]', '{"Type":"Monochrome Laser","Speed":"36 ppm","Resolution":"2400 x 600 dpi","Duplex":"Automatic","Connectivity":"USB 2.0, Wi-Fi","Weight":"7.2 kg"}', '[]', true, false, false, 'in_stock'),
    ('Epson EcoTank ET-4850', 'epson-ecotank-et-4850', 'Epson', v_printer_id, 449, 'All-in-one color inkjet with ultra-low cost per page.', 'The Epson EcoTank ET-4850 revolutionizes printing with its cartridge-free design. Fill the tanks instead of replacing cartridges and save up to 90% on ink costs.', '["Color Inkjet","All-in-One","Ultra-low Cost Per Page","Auto Duplex","ADF Scanner","Wi-Fi Direct"]', '{"Type":"Color Inkjet","Speed":"15 ppm (black)","Resolution":"4800 x 1200 dpi","Duplex":"Automatic","Connectivity":"USB, Wi-Fi, Ethernet","Weight":"6.8 kg"}', '[]', false, true, false, 'in_stock'),
    ('HP Color LaserJet Pro M479fdw', 'hp-color-laserjet-pro-m479fdw', 'HP', v_printer_id, 549, 'Multifunction color laser printer with advanced security features.', 'The HP Color LaserJet Pro M479fdw delivers professional color printing, scanning, copying, and faxing in one device. Advanced security features protect your business data.', '["Color Laser","Multifunction","28 ppm Print Speed","Auto Duplex","50-sheet ADF","HP Security Features"]', '{"Type":"Color Laser","Speed":"28 ppm","Resolution":"600 x 600 dpi","Duplex":"Automatic","Connectivity":"USB, Wi-Fi, Ethernet","Weight":"20.3 kg"}', '[]', false, false, false, 'in_stock'),
    ('Canon MAXIFY GX7020', 'canon-maxify-gx7020', 'Canon', v_printer_id, 499, 'High-volume refillable ink tank all-in-one printer.', 'The Canon MAXIFY GX7020 is built for high-volume business printing with its refillable ink tank system. Print thousands of pages before refilling, with professional-quality color output.', '["Color Inkjet","Refillable Ink Tanks","All-in-One","24 ppm Print Speed","Auto Duplex","Dual Paper Trays"]', '{"Type":"Color Inkjet","Speed":"24 ppm (black)","Resolution":"4800 x 1200 dpi","Duplex":"Automatic","Connectivity":"USB, Wi-Fi, Ethernet","Weight":"11.5 kg"}', '[]', false, false, false, 'in_stock'),
    ('Brother MFC-L3770CDW', 'brother-mfc-l3770cdw', 'Brother', v_printer_id, 449, 'Wireless color laser all-in-one with fast duplex printing.', 'The Brother MFC-L3770CDW delivers fast color laser printing, scanning, copying, and faxing. Its wireless connectivity and mobile printing capabilities make it perfect for modern offices.', '["Color Laser","Multifunction","33 ppm Print Speed","Wireless","Auto Duplex","50-sheet ADF"]', '{"Type":"Color Laser","Speed":"33 ppm","Resolution":"2400 x 600 dpi","Duplex":"Automatic","Connectivity":"USB 3.0, Wi-Fi, Ethernet","Weight":"24 kg"}', '[]', false, false, false, 'in_stock'),
    ('Epson WorkForce Pro WF-C5790', 'epson-workforce-pro-wf-c5790', 'Epson', v_printer_id, 399, 'Business color inkjet with PrecisionCore technology.', 'The Epson WorkForce Pro WF-C5790 uses PrecisionCore heat-free technology for fast, energy-efficient color printing. Replace Pack ink system reduces waste and lowers cost per page.', '["Color Inkjet","PrecisionCore Technology","25 ppm Print Speed","Replace Pack Ink","Auto Duplex","Low Energy Use"]', '{"Type":"Color Inkjet","Speed":"25 ppm","Resolution":"4800 x 1200 dpi","Duplex":"Automatic","Connectivity":"USB, Wi-Fi, Ethernet, NFC","Weight":"16.5 kg"}', '[]', false, false, false, 'in_stock'),

    -- Components (11 products)
    ('Intel Core i9-14900K', 'intel-core-i9-14900k', 'Intel', v_component_id, 589, 'Flagship 24-core desktop processor with 6.0 GHz boost.', 'The Intel Core i9-14900K is the ultimate desktop processor with 24 cores (8P + 16E), 32 threads, and boost clocks up to 6.0 GHz. Built on Intel 7 process for exceptional gaming and productivity performance.', '["24 Cores / 32 Threads","Up to 6.0 GHz","36MB Intel Smart Cache","DDR5 Support","PCIe 5.0","Intel 7 Process"]', '{"Cores":"24 (8P + 16E)","Threads":"32","Base Clock":"3.2 GHz (P) / 2.4 GHz (E)","Boost Clock":"6.0 GHz","Cache":"36 MB","TDP":"125W (253W MTP)","Socket":"LGA 1700","Memory":"DDR5-5600 / DDR4-3200"}', '[]', true, false, true, 'in_stock'),
    ('AMD Ryzen 9 7950X', 'amd-ryzen-9-7950x', 'AMD', v_component_id, 549, '16-core Zen 4 processor with exceptional multi-threaded performance.', 'The AMD Ryzen 9 7950X delivers 16 cores of Zen 4 performance on the AM5 platform. With boost clocks up to 5.7 GHz and support for DDR5 and PCIe 5.0, it excels at both gaming and content creation.', '["16 Cores / 32 Threads","Up to 5.7 GHz","64MB L3 Cache","Zen 4 Architecture","DDR5 Support","PCIe 5.0"]', '{"Cores":"16","Threads":"32","Base Clock":"4.5 GHz","Boost Clock":"5.7 GHz","L3 Cache":"64 MB","TDP":"170W","Socket":"AM5","Memory":"DDR5-5200"}', '[]', true, false, false, 'in_stock'),
    ('Intel Core i7-14700K', 'intel-core-i7-14700k', 'Intel', v_component_id, 409, 'High-performance 20-core processor for gaming and productivity.', 'The Intel Core i7-14700K offers 20 cores (8P + 12E) and 28 threads, delivering excellent performance for gaming, streaming, and content creation at a more accessible price point.', '["20 Cores / 28 Threads","Up to 5.6 GHz","33MB Intel Smart Cache","DDR5 Support","PCIe 5.0","Intel 7 Process"]', '{"Cores":"20 (8P + 12E)","Threads":"28","Base Clock":"3.4 GHz (P) / 2.5 GHz (E)","Boost Clock":"5.6 GHz","Cache":"33 MB","TDP":"125W (253W MTP)","Socket":"LGA 1700","Memory":"DDR5-5600"}', '[]', false, false, false, 'in_stock'),
    ('AMD Ryzen 7 7800X3D', 'amd-ryzen-7-7800x3d', 'AMD', v_component_id, 449, 'Best gaming CPU with 3D V-Cache technology.', 'The AMD Ryzen 7 7800X3D features AMD 3D V-Cache technology with 96MB of L3 cache, making it the ultimate gaming processor. Its 8 cores and 16 threads handle any game with ease.', '["8 Cores / 16 Threads","Up to 5.0 GHz","96MB L3 Cache (3D V-Cache)","Zen 4 Architecture","Best Gaming CPU","Low Power 120W TDP"]', '{"Cores":"8","Threads":"16","Base Clock":"4.2 GHz","Boost Clock":"5.0 GHz","L3 Cache":"96 MB (3D V-Cache)","TDP":"120W","Socket":"AM5","Memory":"DDR5-5200"}', '[]', true, false, true, 'in_stock'),
    ('NVIDIA GeForce RTX 4090', 'nvidia-rtx-4090', 'NVIDIA', v_component_id, 1599, 'Ultimate GPU with Ada Lovelace architecture and 24GB GDDR6X.', 'The NVIDIA GeForce RTX 4090 is the most powerful consumer GPU ever made. With 16384 CUDA cores, 24GB GDDR6X memory, and DLSS 3.0, it delivers unprecedented performance for gaming, AI, and content creation.', '["16384 CUDA Cores","24GB GDDR6X","DLSS 3.0","Ray Tracing Cores","Ada Lovelace Architecture","450W TDP"]', '{"CUDA Cores":"16384","Memory":"24 GB GDDR6X","Boost Clock":"2520 MHz","Memory Bus":"384-bit","TDP":"450W","Connectors":"1x 16-pin","Length":"336 mm"}', '[]', true, false, true, 'in_stock'),
    ('MSI GeForce RTX 4080 SUPER', 'msi-rtx-4080-super', 'MSI', v_component_id, 999, 'High-end GPU with 16GB GDDR6X for 4K gaming.', 'The MSI GeForce RTX 4080 SUPER delivers exceptional 4K gaming performance with 10240 CUDA cores and 16GB GDDR6X memory. MSI cooling ensures quiet, cool operation under heavy loads.', '["10240 CUDA Cores","16GB GDDR6X","DLSS 3.0","Ray Tracing","MSI Cooling","4K Gaming Ready"]', '{"CUDA Cores":"10240","Memory":"16 GB GDDR6X","Boost Clock":"2550 MHz","Memory Bus":"256-bit","TDP":"320W","Connectors":"1x 16-pin","Length":"340 mm"}', '[]', false, false, false, 'in_stock'),
    ('Corsair Vengeance DDR5-6000 32GB', 'corsair-vengeance-ddr5-6000-32gb', 'Corsair', v_component_id, 119, 'High-performance DDR5 memory kit optimized for AMD and Intel.', 'Corsair Vengeance DDR5-6000 32GB (2x16GB) kit delivers excellent performance for both gaming and productivity. Optimized for AMD EXPO and Intel XMP 3.0 platforms.', '["DDR5-6000","32GB (2x16GB)","CL36 Latency","Intel XMP 3.0","AMD EXPO","Aluminum Heat Spreader"]', '{"Type":"DDR5","Speed":"6000 MHz","Capacity":"32 GB (2x16GB)","Latency":"CL36-36-36-76","Voltage":"1.35V","Heat Spreader":"Aluminum"}', '[]', true, false, false, 'in_stock'),
    ('Samsung 990 Pro 2TB SSD', 'samsung-990-pro-2tb-ssd', 'Samsung', v_component_id, 179, 'PCIe 4.0 NVMe SSD with sequential read up to 7450 MB/s.', 'The Samsung 990 Pro 2TB delivers blazing-fast storage performance with sequential reads up to 7450 MB/s. Built on Samsung V-NAND technology and a proprietary controller for maximum reliability.', '["PCIe 4.0 NVMe","2TB Capacity","7450 MB/s Read","6900 MB/s Write","Samsung V-NAND","5-Year Warranty"]', '{"Interface":"PCIe 4.0 x4 NVMe","Capacity":"2 TB","Sequential Read":"7450 MB/s","Sequential Write":"6900 MB/s","Random Read":"1400K IOPS","Endurance":"1200 TBW","Form Factor":"M.2 2280"}', '[]', true, false, false, 'in_stock'),
    ('WD Black SN850X 2TB SSD', 'wd-black-sn850x-2tb-ssd', 'Western Digital', v_component_id, 159, 'High-performance gaming SSD with up to 7300 MB/s read speed.', 'The WD Black SN850X 2TB is engineered for gamers and content creators. With PCIe 4.0 performance and Game Mode 2.0, it delivers the speed and responsiveness needed for modern gaming.', '["PCIe 4.0 NVMe","2TB Capacity","7300 MB/s Read","Game Mode 2.0","Predictive Loading","5-Year Warranty"]', '{"Interface":"PCIe 4.0 x4 NVMe","Capacity":"2 TB","Sequential Read":"7300 MB/s","Sequential Write":"6600 MB/s","Random Read":"1200K IOPS","Endurance":"1200 TBW","Form Factor":"M.2 2280"}', '[]', false, false, false, 'in_stock'),
    ('ASUS ROG Strix Z790-E', 'asus-rog-strix-z790-e', 'ASUS', v_component_id, 429, 'Premium Intel Z790 ATX motherboard with PCIe 5.0 and DDR5.', 'The ASUS ROG Strix Z790-E Gaming WiFi is a premium motherboard built for Intel 13th/14th Gen processors. Features PCIe 5.0, DDR5 support, WiFi 6E, and robust power delivery for overclocking.', '["Intel Z790 Chipset","LGA 1700 Socket","DDR5 Support","PCIe 5.0 x16","WiFi 6E","20+1 Power Stages"]', '{"Chipset":"Intel Z790","Socket":"LGA 1700","Memory":"4x DDR5 (max 192GB)","PCIe":"1x 5.0 x16, 1x 4.0 x4","Storage":"5x M.2, 4x SATA","Networking":"2.5G LAN + WiFi 6E","Form Factor":"ATX"}', '[]', false, false, true, 'in_stock'),
    ('Gigabyte X670E Aorus Master', 'gigabyte-x670e-aorus-master', 'Gigabyte', v_component_id, 499, 'Premium AMD X670E motherboard with full PCIe 5.0 support.', 'The Gigabyte X670E Aorus Master is the ultimate motherboard for AMD Ryzen 7000 series processors. Full PCIe 5.0 support across GPU and M.2 slots, with a massive 18+2+2 power stage design.', '["AMD X670E Chipset","AM5 Socket","DDR5 Support","Full PCIe 5.0","WiFi 6E","18+2+2 Power Stages"]', '{"Chipset":"AMD X670E","Socket":"AM5","Memory":"4x DDR5 (max 128GB)","PCIe":"1x 5.0 x16, 1x 5.0 M.2","Storage":"5x M.2, 4x SATA","Networking":"10G LAN + WiFi 6E","Form Factor":"ATX"}', '[]', false, false, false, 'in_stock');
END $$;

-- 管理员账号 (密码: Reach@2024Admin, bcrypt hash)
INSERT INTO users (email, password_hash, role, permissions, name) VALUES
  ('admin@reachtronics.com', '$2a$10$rZ8vKxJqYxJqYxJqYxJqYuGxJqYxJqYxJqYxJqYxJqYxJqYxJqYx', 'admin', '["dashboard","products","orders","users","shipping","inquiries"]', 'Admin')
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- 完成提示
-- ============================================================
DO $$
BEGIN
  RAISE NOTICE 'Database initialization completed!';
  RAISE NOTICE 'Tables: categories, products, inquiries, orders, users, shipping_templates';
  RAISE NOTICE 'Categories: 3 (Projectors, Printers, Components)';
  RAISE NOTICE 'Products: 31 (12 projectors, 8 printers, 11 components)';
END $$;
