import { NextRequest, NextResponse } from 'next/server'

const SETUP_SECRET = 'reachtronics-db-setup-2026'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const url = new URL(request.url)
  const token = url.searchParams.get('token') || authHeader?.replace('Bearer ', '')

  if (token !== SETUP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { Client } = await import('pg')
    
    const client = new Client({
      connectionString: process.env.DATABASE_URL || 
        'postgresql://postgres:rUICHI2020!!@ufzzynacrknnmmyczmzl.supabase.co:5432/postgres?sslmode=require',
      connectionTimeoutMillis: 30000,
      ssl: { rejectUnauthorized: false },
    })

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    await client.connect()
    const results: string[] = []

    // Execute all SQL statements
    const sql = `-- Create all tables based on schema.ts

-- 1. health_check
CREATE TABLE IF NOT EXISTS health_check (
    id SERIAL PRIMARY KEY,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. categories
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS categories_slug_idx ON categories(slug);
CREATE INDEX IF NOT EXISTS categories_sort_order_idx ON categories(sort_order);

-- 3. products
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    brand VARCHAR(100) NOT NULL,
    category_id VARCHAR(36) NOT NULL REFERENCES categories(id),
    price NUMERIC(10,2) NOT NULL,
    compare_at_price NUMERIC(10,2),
    description TEXT,
    short_description TEXT,
    images JSONB,
    specifications JSONB,
    features JSONB,
    stock_status VARCHAR(20) NOT NULL DEFAULT 'in_stock',
    is_bestseller BOOLEAN NOT NULL DEFAULT false,
    is_new_arrival BOOLEAN NOT NULL DEFAULT false,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS products_slug_idx ON products(slug);
CREATE INDEX IF NOT EXISTS products_category_id_idx ON products(category_id);
CREATE INDEX IF NOT EXISTS products_brand_idx ON products(brand);
CREATE INDEX IF NOT EXISTS products_price_idx ON products(price);
CREATE INDEX IF NOT EXISTS products_is_active_idx ON products(is_active);
CREATE INDEX IF NOT EXISTS products_is_bestseller_idx ON products(is_bestseller);
CREATE INDEX IF NOT EXISTS products_is_new_arrival_idx ON products(is_new_arrival);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON products(created_at);

-- 4. inquiries
CREATE TABLE IF NOT EXISTS inquiries (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(200),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    product_id VARCHAR(36) REFERENCES products(id),
    inquiry_type VARCHAR(20) NOT NULL DEFAULT 'general',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS inquiries_email_idx ON inquiries(email);
CREATE INDEX IF NOT EXISTS inquiries_status_idx ON inquiries(status);
CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON inquiries(created_at);
CREATE INDEX IF NOT EXISTS inquiries_product_id_idx ON inquiries(product_id);

-- 5. orders
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    order_id VARCHAR(100) NOT NULL UNIQUE,
    product_id VARCHAR(36) NOT NULL REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    payer_email VARCHAR(255),
    payer_name VARCHAR(200),
    paypal_order_id VARCHAR(100),
    airwallex_intent_id VARCHAR(100),
    payment_method VARCHAR(20) NOT NULL DEFAULT 'paypal',
    shipping_method VARCHAR(50),
    shipping_cost NUMERIC(10,2),
    tracking_number VARCHAR(200),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS orders_order_id_idx ON orders(order_id);
CREATE INDEX IF NOT EXISTS orders_product_id_idx ON orders(product_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_paypal_order_id_idx ON orders(paypal_order_id);
CREATE INDEX IF NOT EXISTS orders_airwallex_intent_id_idx ON orders(airwallex_intent_id);
CREATE INDEX IF NOT EXISTS orders_payment_method_idx ON orders(payment_method);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at);

-- 6. users
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'staff',
    permissions JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);

-- 7. shipping_templates
CREATE TABLE IF NOT EXISTS shipping_templates (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(100) NOT NULL,
    zone VARCHAR(200) NOT NULL,
    method VARCHAR(50) NOT NULL,
    weight_rate JSONB,
    volume_rate JSONB,
    fixed_fee NUMERIC(10,2),
    free_shipping_min NUMERIC(10,2),
    trade_terms VARCHAR(20) DEFAULT 'DDP',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS shipping_templates_zone_idx ON shipping_templates(zone);
CREATE INDEX IF NOT EXISTS shipping_templates_method_idx ON shipping_templates(method);

-- Insert health check
INSERT INTO health_check DEFAULT VALUES;



-- ============================================
-- INSERT CATEGORIES
-- ============================================

INSERT INTO categories (id, name, slug, description, image_url, sort_order, is_active) VALUES
('cat-4k-laser', '4K Laser Projectors', '4k-laser-projectors', 'Cinema-grade 4K laser projection for home theater and professional use', '/images/categories/4k-laser-projectors.jpg', 1, true),
('cat-ust-laser', 'UST Laser TV', 'ust-laser-tv', 'Ultra-short throw laser TV for immersive big-screen experience', '/images/categories/ust-laser-tv.jpg', 2, true),
('cat-printers', 'Printers & Scanners', 'printers-scanners', 'Professional printers and scanners for office productivity', '/images/categories/printers-scanners.jpg', 3, true),
('cat-components', 'Components', 'components', 'High-performance computer components: CPU, GPU, RAM, SSD and more', '/images/categories/components.jpg', 4, true);

-- ============================================
-- INSERT PRODUCTS - 4K Laser Projectors (10)
-- ============================================

INSERT INTO products (name, slug, brand, category_id, price, compare_at_price, description, short_description, images, specifications, features, stock_status, is_bestseller, is_new_arrival, is_featured, is_active, sort_order) VALUES

-- 1
('XGIMI RS 10 Ultra 4K', 'xgimi-rs-10-ultra-4k', 'XGIMI', 'cat-4k-laser', 2599.00, 2999.00,
'The XGIMI RS 10 Ultra 4K delivers breathtaking cinema-quality visuals with its advanced laser light source and native 4K resolution. Featuring 3000 ISO lumens of brightness and Dolby Vision support, it transforms any room into a premium home theater.',
'Premium 4K laser projector with 3000 ISO lumens and Dolby Vision',
'["/images/products/xgimi-rs10-ultra-1.jpg", "/images/products/xgimi-rs10-ultra-2.jpg"]',
'{"Resolution": "3840x2160 (4K)", "Brightness": "3000 ISO Lumens", "Light Source": "Triple Color Laser", "Throw Ratio": "1.2:1", "Lens Shift": "Vertical/Horizontal", "Keystone": "Auto 4-corner", "HDR": "Dolby Vision, HDR10+", "Contrast Ratio": "1800:1", "Speakers": "Dual 12W Harman Kardon", "Lamp Life": "25,000 hours", "Weight": "7.5 kg", "Connectivity": "HDMI 2.1 x2, USB 3.0 x2, WiFi 6, Bluetooth 5.2"}',
'["Native 4K UHD resolution", "Triple Color Laser technology", "Dolby Vision & HDR10+", "Harman Kardon built-in speakers", "Auto keystone & focus", "Android TV smart system", "WiFi 6 & Bluetooth 5.2"]',
'in_stock', true, true, true, true, 1),

-- 2
('XGIMI RS 10 Mini 4K', 'xgimi-rs-10-mini-4k', 'XGIMI', 'cat-4k-laser', 1399.00, 1599.00,
'Compact yet powerful, the XGIMI RS 10 Mini 4K packs stunning 4K laser projection into a sleek, portable design. With 1700 ISO lumens and automated smart features, it is perfect for bedrooms and small living spaces.',
'Compact 4K laser projector with 1700 ISO lumens in a portable design',
'["/images/products/xgimi-rs10-mini-1.jpg", "/images/products/xgimi-rs10-mini-2.jpg"]',
'{"Resolution": "3840x2160 (4K)", "Brightness": "1700 ISO Lumens", "Light Source": "Triple Color Laser", "Throw Ratio": "1.2:1", "Keystone": "Auto 4-corner", "HDR": "HDR10+", "Contrast Ratio": "1600:1", "Speakers": "Dual 6W", "Lamp Life": "25,000 hours", "Weight": "2.1 kg", "Connectivity": "HDMI 2.1, USB, WiFi 6, Bluetooth 5.2"}',
'["Compact & portable design", "Native 4K UHD", "Triple Color Laser", "Auto keystone & focus", "Built-in Android TV", "Low latency gaming mode"]',
'in_stock', true, false, true, true, 2),

-- 3
('Hisense VIDDA C5 Master 4K', 'hisense-vidda-c5-master-4k', 'Hisense', 'cat-4k-laser', 1899.00, 2199.00,
'The Hisense VIDDA C5 Master 4K combines cutting-edge laser technology with exceptional color accuracy. Its 2600 ISO lumens brightness and 110% DCI-P3 color gamut deliver lifelike images for an immersive viewing experience.',
'High-brightness 4K laser projector with exceptional color accuracy',
'["/images/products/hisense-vidda-c5-1.jpg", "/images/products/hisense-vidda-c5-2.jpg"]',
'{"Resolution": "3840x2160 (4K)", "Brightness": "2600 ISO Lumens", "Light Source": "Triple Color Laser", "Color Gamut": "110% DCI-P3", "Throw Ratio": "1.2:1", "HDR": "HDR10+, HLG", "Contrast Ratio": "2000:1", "Speakers": "Dual 10W", "Lamp Life": "25,000 hours", "Weight": "6.8 kg", "Connectivity": "HDMI 2.1 x2, USB x2, WiFi, Bluetooth"}',
'["110% DCI-P3 wide color gamut", "Triple Color Laser engine", "HDR10+ support", "Intelligent obstacle avoidance", "Auto screen alignment", "MEMC motion smoothing"]',
'in_stock', false, true, true, true, 3),

-- 4
('JMGO N5S ULTRA MAX 4K', 'jmgo-n5s-ultra-max-4k', 'JMGO', 'cat-4k-laser', 2299.00, 2699.00,
'The JMGO N5S ULTRA MAX 4K features a revolutionary triple-color laser engine with 3100 ISO lumens. Its integrated gimber design allows effortless 360-degree projection on walls, ceilings, and any surface.',
'3100 lumen 4K laser projector with 360-degree gimbal design',
'["/images/products/jmgo-n5s-ultra-1.jpg", "/images/products/jmgo-n5s-ultra-2.jpg"]',
'{"Resolution": "3840x2160 (4K)", "Brightness": "3100 ISO Lumens", "Light Source": "Triple Color Laser", "Throw Ratio": "1.2:1", "Keystone": "360-degree gimbal", "HDR": "HDR10+, HLG", "Contrast Ratio": "1800:1", "Speakers": "Dual 10W", "Lamp Life": "25,000 hours", "Weight": "6.2 kg", "Connectivity": "HDMI 2.1 x2, USB x2, WiFi 6, Bluetooth 5.2"}',
'["360-degree gimbal projection", "Triple Color Laser", "3100 ISO lumens", "Auto focus & keystone", "Wall/ceiling projection", "Built-in smart OS"]',
'in_stock', true, true, true, true, 4),

-- 5
('JMGO N1 Ultra 4K', 'jmgo-n1-ultra-4k', 'JMGO', 'cat-4k-laser', 1699.00, 1999.00,
'The JMGO N1 Ultra 4K brings cinema-quality laser projection with its compact gimbal design. Featuring 2200 ISO lumens and triple-color laser technology, it delivers vibrant colors and sharp images anywhere.',
'Portable 4K laser projector with innovative gimbal design',
'["/images/products/jmgo-n1-ultra-1.jpg", "/images/products/jmgo-n1-ultra-2.jpg"]',
'{"Resolution": "3840x2160 (4K)", "Brightness": "2200 ISO Lumens", "Light Source": "Triple Color Laser", "Throw Ratio": "1.2:1", "Keystone": "360-degree gimbal", "HDR": "HDR10+", "Contrast Ratio": "1600:1", "Speakers": "Dual 10W", "Lamp Life": "25,000 hours", "Weight": "4.8 kg", "Connectivity": "HDMI 2.1, USB, WiFi, Bluetooth"}',
'["Innovative gimbal design", "Triple Color Laser", "Portable & compact", "Auto focus & keystone", "1080p gaming at 120Hz"]',
'in_stock', false, false, false, true, 5),

-- 6
('XGIMI Horizon Ultra', 'xgimi-horizon-ultra', 'XGIMI', 'cat-4k-laser', 1999.00, 2399.00,
'The XGIMI Horizon Ultra combines dual light source technology with 4K resolution for exceptional picture quality. Its hybrid laser-LED engine delivers vibrant colors with 2300 ISO lumens brightness.',
'Hybrid laser-LED 4K projector with Dolby Vision',
'["/images/products/xgimi-horizon-ultra-1.jpg", "/images/products/xgimi-horizon-ultra-2.jpg"]',
'{"Resolution": "3840x2160 (4K)", "Brightness": "2300 ISO Lumens", "Light Source": "Hybrid Laser+LED", "Throw Ratio": "1.2:1", "HDR": "Dolby Vision, HDR10+", "Contrast Ratio": "1600:1", "Speakers": "Dual 12W Harman Kardon", "Lamp Life": "25,000 hours", "Weight": "5.6 kg", "Connectivity": "HDMI 2.1 x2, USB x2, WiFi 6, Bluetooth 5.2"}',
'["Hybrid Laser+LED engine", "Dolby Vision certified", "Harman Kardon speakers", "Auto keystone correction", "Android TV 11"]',
'in_stock', false, false, true, true, 6),

-- 7
('XGIMI MoGo 3 Pro', 'xgimi-mogo-3-pro', 'XGIMI', 'cat-4k-laser', 699.00, 849.00,
'Ultra-portable smart projector with 1080p resolution and 650 ISO lumens. The XGIMI MoGo 3 Pro is perfect for outdoor movie nights, travel, and small rooms. Features built-in Android TV and 2-hour battery life.',
'Portable smart projector with built-in battery and Android TV',
'["/images/products/xgimi-mogo3-pro-1.jpg", "/images/products/xgimi-mogo3-pro-2.jpg"]',
'{"Resolution": "1920x1080 (FHD)", "Brightness": "650 ISO Lumens", "Light Source": "LED", "Throw Ratio": "1.2:1", "Battery": "2 hours", "HDR": "HDR10", "Speakers": "Dual 5W", "Lamp Life": "30,000 hours", "Weight": "1.6 kg", "Connectivity": "HDMI, USB-C, WiFi, Bluetooth"}',
'["Ultra-portable 1.6kg", "Built-in 2hr battery", "Android TV built-in", "Auto keystone", "WiFi & Bluetooth"]',
'in_stock', false, true, false, true, 7),

-- 8
('Formovie Theater 4K', 'formovie-theater-4k', 'Formovie', 'cat-4k-laser', 2199.00, 2599.00,
'The Formovie Theater 4K is a premium UST laser projector delivering a massive 150-inch image with 2500 ISO lumens. Its ALPD 4.0 laser technology ensures exceptional color accuracy and longevity.',
'Premium UST laser projector with ALPD 4.0 and 150-inch capability',
'["/images/products/formovie-theater-1.jpg", "/images/products/formovie-theater-2.jpg"]',
'{"Resolution": "3840x2160 (4K)", "Brightness": "2500 ISO Lumens", "Light Source": "ALPD 4.0 Laser", "Throw Ratio": "0.23:1", "Screen Size": "80-150 inch", "HDR": "HDR10+, HLG", "Contrast Ratio": "3000:1", "Speakers": "Dual 15W", "Lamp Life": "25,000 hours", "Weight": "9.3 kg", "Connectivity": "HDMI 2.1 x3, USB x2, WiFi, Bluetooth"}',
'["ALPD 4.0 laser technology", "Ultra-short throw 0.23:1", "Up to 150-inch display", "3000:1 contrast ratio", "Triple 15W speakers", "MEMC motion compensation"]',
'in_stock', false, false, true, true, 8),

-- 9
('AWOL Vision LTV-3500 4K', 'awol-vision-ltv-3500-4k', 'AWOL Vision', 'cat-4k-laser', 3999.00, 4599.00,
'The AWOL Vision LTV-3500 is a flagship 4K laser TV with 3500 lumens and an ultra-short throw design. Featuring triple color laser technology and a stunning 120-inch+ image, it rivals traditional TV experiences.',
'Flagship 4K laser TV with 3500 lumens triple color laser',
'["/images/products/awol-ltv3500-1.jpg", "/images/products/awol-ltv3500-2.jpg"]',
'{"Resolution": "3840x2160 (4K)", "Brightness": "3500 Lumens", "Light Source": "Triple Color Laser", "Throw Ratio": "0.198:1", "Screen Size": "80-150 inch", "HDR": "Dolby Vision, HDR10+", "Contrast Ratio": "3000:1", "Speakers": "2x15W + Subwoofer", "Lamp Life": "25,000 hours", "Weight": "13.5 kg", "Connectivity": "HDMI 2.1 x3, USB x3, LAN, WiFi 6, Bluetooth 5.0"}',
'["3500 lumens brightness", "Triple Color Laser", "Dolby Vision", "0.198:1 ultra-short throw", "Built-in subwoofer", "Android TV smart platform"]',
'in_stock', true, false, true, true, 9),

-- 10
('Hisense PL1 4K', 'hisense-pl1-4k', 'Hisense', 'cat-4k-laser', 1499.00, 1799.00,
'The Hisense PL1 is an affordable entry into 4K laser projection. With 2100 lumens and Hisense proprietary laser technology, it delivers sharp, bright images for home entertainment.',
'Affordable 4K laser projector with 2100 lumens brightness',
'["/images/products/hisense-pl1-1.jpg", "/images/products/hisense-pl1-2.jpg"]',
'{"Resolution": "3840x2160 (4K)", "Brightness": "2100 Lumens", "Light Source": "Laser", "Throw Ratio": "1.2:1", "HDR": "HDR10+", "Contrast Ratio": "1500:1", "Speakers": "Dual 10W", "Lamp Life": "25,000 hours", "Weight": "5.5 kg", "Connectivity": "HDMI 2.0 x2, USB x2, WiFi, Bluetooth"}',
'["Affordable 4K laser", "HDR10+ support", "Auto keystone correction", "Smart TV built-in", "Energy efficient"]',
'in_stock', false, false, false, true, 10);


-- ============================================
-- UST Laser TV (5)
-- ============================================

INSERT INTO products (name, slug, brand, category_id, price, compare_at_price, description, short_description, images, specifications, features, stock_status, is_bestseller, is_new_arrival, is_featured, is_active, sort_order) VALUES

-- 11
('Hisense PX2-Pro 4K UST', 'hisense-px2-pro-4k-ust', 'Hisense', 'cat-ust-laser', 3499.00, 3999.00,
'The Hisense PX2-Pro is a premium 4K UST laser TV with triple laser technology delivering 3000 lumens. Its ultra-short throw design projects a stunning 100-130 inch image from just inches away from the wall.',
'Premium 4K UST laser TV with triple laser and 3000 lumens',
'["/images/products/hisense-px2-pro-1.jpg", "/images/products/hisense-px2-pro-2.jpg"]',
'{"Resolution": "3840x2160 (4K)", "Brightness": "3000 Lumens", "Light Source": "Triple Laser", "Throw Ratio": "0.234:1", "Screen Size": "100-130 inch", "HDR": "Dolby Vision, HDR10+", "Contrast Ratio": "2500:1", "Speakers": "2x15W + Subwoofer", "Lamp Life": "25,000 hours", "Weight": "13 kg", "Connectivity": "HDMI 2.1 x3, USB x2, WiFi 6, Bluetooth 5.0, eARC"}',
'["Triple laser light source", "Dolby Vision & Atmos", "0.234:1 ultra-short throw", "Built-in subwoofer", "Gaming mode 4K@120Hz", "Google TV smart platform"]',
'in_stock', true, false, true, true, 11),

-- 12
('JMGO U2 4K', 'jmgo-u2-4k', 'JMGO', 'cat-ust-laser', 2099.00, 2499.00,
'The JMGO U2 is a 4K UST laser projector with 2500 ISO lumens and a compact design. Its 0.21:1 throw ratio allows placement just inches from the wall for a massive 100-120 inch display.',
'Compact 4K UST laser projector with 2500 lumens',
'["/images/products/jmgo-u2-1.jpg", "/images/products/jmgo-u2-2.jpg"]',
'{"Resolution": "3840x2160 (4K)", "Brightness": "2500 ISO Lumens", "Light Source": "Triple Color Laser", "Throw Ratio": "0.21:1", "Screen Size": "100-120 inch", "HDR": "HDR10+", "Contrast Ratio": "2000:1", "Speakers": "Dual 15W", "Lamp Life": "25,000 hours", "Weight": "8.5 kg", "Connectivity": "HDMI 2.1 x2, USB x2, WiFi, Bluetooth"}',
'["Triple Color Laser", "Ultra-short throw 0.21:1", "Auto focus & keystone", "Built-in premium speakers", "Eye protection sensor"]',
'in_stock', false, true, false, true, 12),

-- 13
('Formovie 4K Laser Cinema', 'formovie-4k-laser-cinema', 'Formovie', 'cat-ust-laser', 2799.00, 3199.00,
'The Formovie 4K Laser Cinema uses ALPD 4.0 technology for exceptional color purity and brightness. Its UST design projects a 100-150 inch 4K image with cinematic quality.',
'ALPD 4.0 UST laser cinema with up to 150-inch display',
'["/images/products/formovie-cinema-1.jpg", "/images/products/formovie-cinema-2.jpg"]',
'{"Resolution": "3840x2160 (4K)", "Brightness": "2800 Lumens", "Light Source": "ALPD 4.0 Laser", "Throw Ratio": "0.23:1", "Screen Size": "100-150 inch", "HDR": "HDR10+, HLG", "Contrast Ratio": "2800:1", "Speakers": "2x12W", "Lamp Life": "25,000 hours", "Weight": "10 kg", "Connectivity": "HDMI 2.1 x2, USB x2, WiFi, Bluetooth, LAN"}',
'["ALPD 4.0 laser engine", "Up to 150-inch screen", "2800:1 high contrast", "MEMC motion smoothing", "Auto screen alignment"]',
'in_stock', false, false, true, true, 13),

-- 14
('AWOL Vision LTV-2500 Pro', 'awol-vision-ltv-2500-pro', 'AWOL Vision', 'cat-ust-laser', 2499.00, 2899.00,
'The AWOL Vision LTV-2500 Pro delivers stunning 4K laser TV experience with 2500 lumens. Its ultra-quiet operation and premium optics make it ideal for dedicated home theater setups.',
'4K UST laser TV with 2500 lumens and ultra-quiet operation',
'["/images/products/awol-ltv2500-1.jpg", "/images/products/awol-ltv2500-2.jpg"]',
'{"Resolution": "3840x2160 (4K)", "Brightness": "2500 Lumens", "Light Source": "Triple Color Laser", "Throw Ratio": "0.198:1", "Screen Size": "80-130 inch", "HDR": "Dolby Vision, HDR10", "Contrast Ratio": "2500:1", "Speakers": "2x12W", "Lamp Life": "25,000 hours", "Weight": "11 kg", "Connectivity": "HDMI 2.1 x3, USB x2, WiFi, Bluetooth, LAN"}',
'["Ultra-quiet under 24dB", "Triple Color Laser", "Dolby Vision", "Premium optics", "120Hz refresh rate"]',
'in_stock', false, false, false, true, 14),

-- 15
('Hisense PX1-H 4K UST', 'hisense-px1-h-4k-ust', 'Hisense', 'cat-ust-laser', 1799.00, 2199.00,
'The Hisense PX1-H offers accessible 4K UST laser projection with 2000 lumens. Perfect for living rooms, it projects a sharp 100-inch image from just 15cm away from the wall.',
'Affordable 4K UST laser TV with 2000 lumens',
'["/images/products/hisense-px1h-1.jpg", "/images/products/hisense-px1h-2.jpg"]',
'{"Resolution": "3840x2160 (4K)", "Brightness": "2000 Lumens", "Light Source": "Laser", "Throw Ratio": "0.234:1", "Screen Size": "80-120 inch", "HDR": "HDR10+", "Contrast Ratio": "1800:1", "Speakers": "2x10W", "Lamp Life": "25,000 hours", "Weight": "9.5 kg", "Connectivity": "HDMI 2.0 x2, USB x2, WiFi, Bluetooth"}',
'["Affordable UST 4K", "15cm projection distance", "HDR10+", "Smart TV platform", "Auto focus"]',
'in_stock', false, false, false, true, 15);


-- ============================================
-- Printers & Scanners (8)
-- ============================================

INSERT INTO products (name, slug, brand, category_id, price, compare_at_price, description, short_description, images, specifications, features, stock_status, is_bestseller, is_new_arrival, is_featured, is_active, sort_order) VALUES

-- 16
('HP LaserJet Pro M404dn', 'hp-laserjet-pro-m404dn', 'HP', 'cat-printers', 329.00, 399.00,
'The HP LaserJet Pro M404dn delivers fast, reliable monochrome printing for busy offices. With speeds up to 40 ppm and automatic duplex printing, it handles high-volume workloads with ease.',
'Fast monochrome laser printer with 40 ppm and auto duplex',
'["/images/products/hp-m404dn-1.jpg", "/images/products/hp-m404dn-2.jpg"]',
'{"Type": "Monochrome Laser", "Speed": "40 ppm", "Resolution": "1200x1200 dpi", "Duplex": "Automatic", "Paper Capacity": "350 sheets", "Connectivity": "USB 2.0, Ethernet", "Monthly Duty Cycle": "80,000 pages", "Processor": "1200 MHz", "Memory": "256 MB", "Weight": "9.3 kg"}',
'["40 pages per minute", "Auto duplex printing", "Ethernet connectivity", "High monthly duty cycle", "HP JetIntelligence toner"]',
'in_stock', true, false, false, true, 16),

-- 17
('Canon imageCLASS LBP226dw', 'canon-imageclass-lbp226dw', 'Canon', 'cat-printers', 279.00, 329.00,
'Compact and efficient, the Canon imageCLASS LBP226dw offers fast monochrome printing with wireless connectivity. Its compact design fits perfectly in small offices and home offices.',
'Compact wireless monochrome laser printer',
'["/images/products/canon-lbp226dw-1.jpg", "/images/products/canon-lbp226dw-2.jpg"]',
'{"Type": "Monochrome Laser", "Speed": "38 ppm", "Resolution": "1200x1200 dpi", "Duplex": "Automatic", "Paper Capacity": "350 sheets", "Connectivity": "USB 2.0, WiFi, Ethernet", "Monthly Duty Cycle": "50,000 pages", "Weight": "8.6 kg"}',
'["38 ppm print speed", "WiFi & Ethernet", "Auto duplex", "Compact design", "Canon UFR II printer language"]',
'in_stock', false, false, false, true, 17),

-- 18
('Brother HL-L2370DW', 'brother-hl-l2370dw', 'Brother', 'cat-printers', 159.00, 199.00,
'The Brother HL-L2370DW is a reliable and affordable monochrome laser printer with wireless printing. Perfect for home offices and small businesses that need quality printing without breaking the bank.',
'Affordable wireless monochrome laser printer',
'["/images/products/brother-hll2370dw-1.jpg", "/images/products/brother-hll2370dw-2.jpg"]',
'{"Type": "Monochrome Laser", "Speed": "34 ppm", "Resolution": "2400x600 dpi", "Duplex": "Automatic", "Paper Capacity": "250 sheets", "Connectivity": "USB 3.0, WiFi", "Monthly Duty Cycle": "30,000 pages", "Weight": "7.2 kg"}',
'["Budget-friendly price", "Auto duplex", "Wireless printing", "Brother genuine toner", "Energy Star certified"]',
'in_stock', true, false, false, true, 18),

-- 19
('Epson EcoTank ET-4850', 'epson-ecotank-et-4850', 'Epson', 'cat-printers', 449.00, 549.00,
'The Epson EcoTank ET-4850 revolutionizes printing with its tank-based ink system. Print thousands of pages at an incredibly low cost per page with the included ink bottles that last up to 2 years.',
'All-in-one cartridge-free ink tank printer with ultra-low cost per page',
'["/images/products/epson-et4850-1.jpg", "/images/products/epson-et4850-2.jpg"]',
'{"Type": "Color Inkjet (EcoTank)", "Speed": "15 ppm (black), 8 ppm (color)", "Resolution": "4800x1200 dpi", "Duplex": "Automatic", "Functions": "Print, Scan, Copy, Fax", "Paper Capacity": "250 sheets", "Connectivity": "USB, WiFi, Ethernet", "ADF": "30-sheet auto document feeder", "Weight": "6.3 kg"}',
'["Cartridge-free ink tanks", "Up to 2 years of ink included", "Ultra-low cost per page", "All-in-one functions", "30-sheet ADF", "WiFi & Ethernet"]',
'in_stock', false, true, true, true, 19),

-- 20
('HP Color LaserJet Pro M479fdw', 'hp-color-laserjet-pro-m479fdw', 'HP', 'cat-printers', 599.00, 749.00,
'The HP Color LaserJet Pro M479fdw delivers professional color printing with fast speeds and advanced security features. Its all-in-one functionality handles print, scan, copy, and fax for demanding offices.',
'Professional color laser all-in-one with advanced security',
'["/images/products/hp-m479fdw-1.jpg", "/images/products/hp-m479fdw-2.jpg"]',
'{"Type": "Color Laser", "Speed": "28 ppm (color/b&w)", "Resolution": "600x600 dpi", "Duplex": "Automatic", "Functions": "Print, Scan, Copy, Fax", "Paper Capacity": "350 sheets", "Connectivity": "USB 2.0, WiFi, Ethernet, NFC", "Monthly Duty Cycle": "50,000 pages", "ADF": "50-sheet", "Weight": "23.4 kg"}',
'["Fast color printing", "Advanced HP security", "50-sheet ADF", "NFC tap-to-print", "Color touch screen", "HP Wolf Security"]',
'in_stock', false, false, false, true, 20),

-- 21
('Canon MAXIFY GX7020', 'canon-maxify-gx7020', 'Canon', 'cat-printers', 499.00, 599.00,
'The Canon MAXIFY GX7020 is a high-capacity inkjet all-in-one designed for productive offices. Its refillable ink tank system delivers up to 60,000 pages in black, dramatically reducing printing costs.',
'High-capacity business inkjet with 60,000-page yield',
'["/images/products/canon-gx7020-1.jpg", "/images/products/canon-gx7020-2.jpg"]',
'{"Type": "Color Inkjet (MegaTank)", "Speed": "24 ppm (black), 15.5 ppm (color)", "Resolution": "600x1200 dpi", "Duplex": "Automatic", "Functions": "Print, Scan, Copy, Fax", "Paper Capacity": "2x250 sheet cassettes", "Connectivity": "USB, WiFi, Ethernet", "ADF": "50-sheet DADF", "Weight": "11.8 kg"}',
'["60,000 page black ink yield", "Dual paper cassettes", "50-sheet DADF", "Auto duplex", "Ethernet & WiFi", "Refillable ink tanks"]',
'in_stock', false, false, false, true, 21),

-- 22
('Brother MFC-L3770CDW', 'brother-mfc-l3770cdw', 'Brother', 'cat-printers', 449.00, 549.00,
'The Brother MFC-L3770CDW is a color laser all-in-one with wireless connectivity and fast printing speeds. Ideal for small workgroups needing reliable color output.',
'Color laser all-in-one with wireless and fast printing',
'["/images/products/brother-mfcl3770cdw-1.jpg", "/images/products/brother-mfcl3770cdw-2.jpg"]',
'{"Type": "Color LED", "Speed": "25 ppm (color/b&w)", "Resolution": "2400x600 dpi", "Duplex": "Automatic", "Functions": "Print, Scan, Copy, Fax", "Paper Capacity": "250 sheets", "Connectivity": "USB 2.0, WiFi, Ethernet, NFC", "ADF": "50-sheet", "Weight": "24.1 kg"}',
'["Color LED technology", "50-sheet ADF", "NFC touch-to-print", "250-sheet paper tray", "Duplex printing", "Color touchscreen"]',
'in_stock', false, false, false, true, 22),

-- 23
('Epson WorkForce Pro WF-C5790', 'epson-workforce-pro-wf-c5790', 'Epson', 'cat-printers', 549.00, 649.00,
'The Epson WorkForce Pro WF-C5790 delivers laser-quality color printing at up to 50% lower cost per page. Its PrecisionCore heat-free technology ensures fast, energy-efficient printing.',
'Business color inkjet with laser-quality output and low cost',
'["/images/products/epson-wfc5790-1.jpg", "/images/products/epson-wfc5790-2.jpg"]',
'{"Type": "Color Inkjet (Business)", "Speed": "24 ppm (black), 24 ppm (color)", "Resolution": "4800x1200 dpi", "Duplex": "Automatic", "Functions": "Print, Scan, Copy, Fax", "Paper Capacity": "330 sheets", "Connectivity": "USB 2.0, WiFi, Ethernet, NFC", "ADF": "50-sheet", "Weight": "19.8 kg"}',
'["PrecisionCore heat-free technology", "50% lower cost per page vs laser", "50-sheet ADF", "Dual paper trays", "NFC & WiFi Direct", "500-page monthly duty cycle"]',
'in_stock', false, false, false, true, 23);



-- ============================================
-- Components (8)
-- ============================================

INSERT INTO products (name, slug, brand, category_id, price, compare_at_price, description, short_description, images, specifications, features, stock_status, is_bestseller, is_new_arrival, is_featured, is_active, sort_order) VALUES

-- 24
('Intel Core i9-14900K', 'intel-core-i9-14900k', 'Intel', 'cat-components', 589.00, 649.00,
'The Intel Core i9-14900K is a flagship desktop processor with 24 cores (8P+16E) and 32 threads. With boost clocks up to 6.0 GHz and 36MB cache, it delivers exceptional performance for gaming, content creation, and productivity.',
'Flagship 24-core desktop processor with 6.0 GHz boost',
'["/images/products/intel-i9-14900k-1.jpg", "/images/products/intel-i9-14900k-2.jpg"]',
'{"Cores": "24 (8P+16E)", "Threads": "32", "Base Clock": "3.2 GHz (P-core)", "Boost Clock": "6.0 GHz", "Cache": "36MB Intel Smart Cache", "TDP": "125W (PBP), 253W (MTP)", "Socket": "LGA 1700", "Memory Support": "DDR5-5600, DDR4-3200", "PCIe": "PCIe 5.0 & 4.0", "Integrated Graphics": "Intel UHD 770"}',
'["24 cores / 32 threads", "6.0 GHz max turbo", "Intel Turbo Boost Max 3.0", "DDR5 support", "PCIe 5.0", "Intel UHD 770 graphics"]',
'in_stock', true, true, true, true, 24),

-- 25
('AMD Ryzen 9 7950X', 'amd-ryzen-9-7950x', 'AMD', 'cat-components', 549.00, 629.00,
'The AMD Ryzen 9 7950X features 16 cores and 32 threads built on the Zen 4 architecture. With a 5.7 GHz boost clock and AMD 3D V-Cache support, it excels in both gaming and multi-threaded workloads.',
'16-core Zen 4 processor with 5.7 GHz boost',
'["/images/products/amd-ryzen9-7950x-1.jpg", "/images/products/amd-ryzen9-7950x-2.jpg"]',
'{"Cores": "16", "Threads": "32", "Base Clock": "4.5 GHz", "Boost Clock": "5.7 GHz", "Cache": "64MB L2 + L3", "TDP": "170W", "Socket": "AM5", "Memory Support": "DDR5-5200", "PCIe": "PCIe 5.0", "Integrated Graphics": "AMD Radeon (RDNA 2)"}',
'["16 cores / 32 threads", "Zen 4 architecture", "5.7 GHz boost", "AM5 platform", "PCIe 5.0 & DDR5", "AMD EXPO memory support"]',
'in_stock', true, false, true, true, 25),

-- 26
('Intel Core i7-14700K', 'intel-core-i7-14700k', 'Intel', 'cat-components', 409.00, 449.00,
'The Intel Core i7-14700K offers 20 cores (8P+12E) and 28 threads for excellent multitasking and gaming performance. With up to 5.6 GHz and strong multi-threaded performance, it is a versatile choice.',
'20-core processor with 5.6 GHz boost for gaming and productivity',
'["/images/products/intel-i7-14700k-1.jpg", "/images/products/intel-i7-14700k-2.jpg"]',
'{"Cores": "20 (8P+12E)", "Threads": "28", "Base Clock": "3.4 GHz (P-core)", "Boost Clock": "5.6 GHz", "Cache": "33MB Intel Smart Cache", "TDP": "125W (PBP), 253W (MTP)", "Socket": "LGA 1700", "Memory Support": "DDR5-5600, DDR4-3200", "PCIe": "PCIe 5.0 & 4.0", "Integrated Graphics": "Intel UHD 770"}',
'["20 cores / 28 threads", "5.6 GHz max turbo", "Great for gaming & productivity", "DDR5 & DDR4 support", "Intel UHD 770 graphics"]',
'in_stock', false, false, false, true, 26),

-- 27
('AMD Ryzen 7 7800X3D', 'amd-ryzen-7-7800x3d', 'AMD', 'cat-components', 449.00, 499.00,
'The AMD Ryzen 7 7800X3D is the ultimate gaming processor with AMD 3D V-Cache technology. Its massive 96MB L3 cache delivers industry-leading gaming performance across all titles.',
'Gaming king with 3D V-Cache and 96MB L3',
'["/images/products/amd-ryzen7-7800x3d-1.jpg", "/images/products/amd-ryzen7-7800x3d-2.jpg"]',
'{"Cores": "8", "Threads": "16", "Base Clock": "4.2 GHz", "Boost Clock": "5.0 GHz", "Cache": "8MB L2 + 96MB L3 (3D V-Cache)", "TDP": "120W", "Socket": "AM5", "Memory Support": "DDR5-5200", "PCIe": "PCIe 5.0", "Integrated Graphics": "AMD Radeon (RDNA 2)"}',
'["Best gaming CPU", "3D V-Cache technology", "96MB L3 cache", "8 cores / 16 threads", "Low 120W TDP", "AM5 platform"]',
'in_stock', true, true, true, true, 27),

-- 28
('NVIDIA GeForce RTX 4090', 'nvidia-geforce-rtx-4090', 'NVIDIA', 'cat-components', 1599.00, 1799.00,
'The NVIDIA GeForce RTX 4090 is the most powerful consumer GPU ever made. Built on the Ada Lovelace architecture with 16,384 CUDA cores and 24GB GDDR6X memory, it delivers unmatched 4K gaming and AI performance.',
'The ultimate GPU with 16,384 CUDA cores and 24GB GDDR6X',
'["/images/products/nvidia-rtx4090-1.jpg", "/images/products/nvidia-rtx4090-2.jpg"]',
'{"CUDA Cores": "16,384", "Memory": "24GB GDDR6X", "Memory Bus": "384-bit", "Boost Clock": "2520 MHz", "TDP": "450W", "Ray Tracing Cores": "128 (3rd Gen)", "Tensor Cores": "512 (4th Gen)", "DLSS": "DLSS 3 with Frame Generation", "Outputs": "1x HDMI 2.1, 3x DisplayPort 1.4a", "PCIe": "PCIe 4.0 x16"}',
'["Most powerful consumer GPU", "24GB GDDR6X VRAM", "DLSS 3 Frame Generation", "3rd Gen Ray Tracing", "AV1 encoding", "PCIe 4.0"]',
'in_stock', true, false, true, true, 28),

-- 29
('MSI GeForce RTX 4080 SUPER', 'msi-geforce-rtx-4080-super', 'NVIDIA', 'cat-components', 999.00, 1149.00,
'The MSI GeForce RTX 4080 SUPER offers excellent 4K gaming performance with 10,240 CUDA cores and 16GB GDDR6X memory. Its advanced cooling solution ensures quiet and cool operation under heavy loads.',
'High-performance 4K gaming GPU with 16GB GDDR6X',
'["/images/products/msi-rtx4080s-1.jpg", "/images/products/msi-rtx4080s-2.jpg"]',
'{"CUDA Cores": "10,240", "Memory": "16GB GDDR6X", "Memory Bus": "256-bit", "Boost Clock": "2550 MHz", "TDP": "320W", "Ray Tracing Cores": "80 (3rd Gen)", "Tensor Cores": "320 (4th Gen)", "DLSS": "DLSS 3 with Frame Generation", "Outputs": "1x HDMI 2.1, 3x DisplayPort 1.4a", "PCIe": "PCIe 4.0 x16"}',
'["16GB GDDR6X VRAM", "DLSS 3 Frame Generation", "Advanced cooling", "Factory overclocked", "MSI Center software"]',
'in_stock', false, true, false, true, 29),

-- 30
('Corsair Vengeance DDR5-6000 32GB', 'corsair-vengeance-ddr5-6000-32gb', 'Corsair', 'cat-components', 119.00, 149.00,
'The Corsair Vengeance DDR5-6000 32GB kit (2x16GB) provides high-speed memory for demanding applications and gaming. Optimized for Intel XMP 3.0 and AMD EXPO, it ensures easy overclocking.',
'High-speed DDR5-6000 32GB kit optimized for XMP 3.0 & EXPO',
'["/images/products/corsair-ddr5-1.jpg", "/images/products/corsair-ddr5-2.jpg"]',
'{"Capacity": "32GB (2x16GB)", "Speed": "DDR5-6000 (PC5-48000)", "Latency": "CL36-36-36-76", "Voltage": "1.35V", "XMP": "Intel XMP 3.0", "EXPO": "AMD EXPO", "Height": "34.9mm (low profile)", "Heat Spreader": "Aluminum", "Warranty": "Lifetime"}',
'["DDR5-6000 speed", "Intel XMP 3.0 & AMD EXPO", "Low-profile design", "Aluminum heat spreader", "Lifetime warranty"]',
'in_stock', false, false, false, true, 30),

-- 31
('Samsung 990 Pro 2TB NVMe SSD', 'samsung-990-pro-2tb-nvme-ssd', 'Samsung', 'cat-components', 199.00, 249.00,
'The Samsung 990 Pro 2TB is a PCIe 4.0 NVMe SSD delivering sequential read speeds up to 7,450 MB/s. Its Samsung V-NAND technology and optimized controller ensure consistent performance under heavy workloads.',
'PCIe 4.0 NVMe SSD with 7,450 MB/s read speed',
'["/images/products/samsung-990pro-1.jpg", "/images/products/samsung-990pro-2.jpg"]',
'{"Capacity": "2TB", "Interface": "PCIe 4.0 x4 NVMe", "Sequential Read": "7,450 MB/s", "Sequential Write": "6,900 MB/s", "Random Read": "1,400K IOPS", "Random Write": "1,550K IOPS", "Form Factor": "M.2 2280", "NAND": "Samsung V-NAND", "Controller": "Samsung Pascal", "TBW": "1,200 TB", "Warranty": "5 years"}',
'["7,450 MB/s sequential read", "PCIe 4.0 NVMe", "Samsung V-NAND", "5-year warranty", "Samsung Magician software"]',
'in_stock', false, true, false, true, 31);


-- ============================================
-- INSERT ADMIN USER
-- ============================================

INSERT INTO users (email, password_hash, name, role, permissions, is_active) VALUES
('admin@reachtronics.com', '$2b$10$xhZmkky2SErpxtNteNkLMebGppGH6bX6Oz7UiI97BayD68Akb2KtK', 'Admin', 'admin', '["all"]'::jsonb, true);


`

    // Split by semicolons and execute each statement
    const stmts = sql.split(';').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
    
    let executed = 0
    for (const stmt of stmts) {
      try {
        await client.query(stmt)
        executed++
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        if (!msg.includes('already exists') && !msg.includes('duplicate key')) {
          results.push(`⚠️ ${msg.substring(0, 120)}`)
        }
      }
    }
    results.push(`✅ Executed ${executed}/${stmts.length} SQL statements`)

    // Verify data
    const catCount = await client.query('SELECT count(*) FROM categories')
    const prodCount = await client.query('SELECT count(*) FROM products')
    const userCount = await client.query('SELECT count(*) FROM users')

    await client.end()
    
    return NextResponse.json({
      success: true,
      results,
      summary: {
        categories: parseInt(catCount.rows[0].count),
        products: parseInt(prodCount.rows[0].count),
        users: parseInt(userCount.rows[0].count),
      }
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Database setup endpoint. Send POST request with token to initialize.',
    usage: 'POST ?token=reachtronics-db-setup-2026'
  })
}
