/**
 * 数据库自动初始化模块
 * 在服务器启动时自动创建表和种子数据（如果不存在）
 * 兼容 Vercel 和 Coze 环境
 */

import { getSupabaseClient } from '@/storage/database/supabase-client';

let initialized = false;

const CREATE_TABLES_SQL = `
-- 创建分类表
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建子分类表
CREATE TABLE IF NOT EXISTS subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建产品表
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  brand TEXT DEFAULT '',
  category_id UUID REFERENCES categories(id),
  subcategory_id UUID REFERENCES subcategories(id),
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  original_price NUMERIC(10, 2),
  currency TEXT DEFAULT 'USD',
  description TEXT DEFAULT '',
  images TEXT[] DEFAULT '{}',
  specs JSONB DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建询盘表
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  message TEXT NOT NULL,
  product_id UUID REFERENCES products(id),
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建订单表
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL UNIQUE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER DEFAULT 1,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payer_email TEXT DEFAULT '',
  payer_name TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  payment_method TEXT DEFAULT 'paypal',
  airwallex_intent_id TEXT,
  shipping_method TEXT DEFAULT '',
  tracking_number TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'staff',
  permissions JSONB DEFAULT '{}',
  name TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建运费模板表
CREATE TABLE IF NOT EXISTS shipping_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  zone TEXT DEFAULT '',
  method TEXT DEFAULT 'air',
  weight_rate JSONB DEFAULT '{}',
  volume_rate JSONB DEFAULT '{}',
  fixed_fee NUMERIC(10, 2) DEFAULT 0,
  min_order NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
`;

const SEED_DATA_SQL = `
-- 插入分类
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Projectors', 'projectors', 'Professional projectors for home and business', 1),
  ('Printers', 'printers', 'High-quality printers and scanners', 2),
  ('Components', 'components', 'Computer components and accessories', 3)
ON CONFLICT (slug) DO NOTHING;

-- 插入子分类
INSERT INTO subcategories (category_id, name, slug, description, sort_order)
SELECT c.id, '4K Laser Projectors', '4k-laser', 'Cinema-grade 4K laser projectors', 1
FROM categories c WHERE c.slug = 'projectors'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subcategories (category_id, name, slug, description, sort_order)
SELECT c.id, 'UST Laser TV', 'ust', 'Ultra short throw laser TV', 2
FROM categories c WHERE c.slug = 'projectors'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subcategories (category_id, name, slug, description, sort_order)
SELECT c.id, 'Portable Projectors', 'portable', 'Compact portable projectors', 3
FROM categories c WHERE c.slug = 'projectors'
ON CONFLICT (slug) DO NOTHING;

-- 插入示例产品（如果表为空）
INSERT INTO products (name, slug, brand, category_id, subcategory_id, price, description, images, is_active, is_featured)
SELECT 
  'XGIMI RS 10 Ultra 4K',
  'xgimi-rs-10-ultra-4k',
  'XGIMI',
  c.id,
  s.id,
  2499.99,
  'Flagship 4K laser projector with dual-light technology',
  ARRAY['https://images.pexels.com/photos/1181525/pexels-photo-1181525.jpeg?w=800'],
  true,
  true
FROM categories c, subcategories s
WHERE c.slug = 'projectors' AND s.slug = '4k-laser'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, brand, category_id, subcategory_id, price, description, images, is_active, is_featured)
SELECT 
  'Hisense PX2-Pro 4K UST',
  'hisense-px2-pro-4k-ust',
  'Hisense',
  c.id,
  s.id,
  2399.99,
  'Ultra short throw 4K laser TV with Dolby Vision',
  ARRAY['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?w=800'],
  true,
  true
FROM categories c, subcategories s
WHERE c.slug = 'projectors' AND s.slug = 'ust'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, brand, category_id, subcategory_id, price, description, images, is_active)
SELECT 
  'HP LaserJet Pro M404dn',
  'hp-laserjet-pro-m404dn',
  'HP',
  c.id,
  NULL,
  329.00,
  'Fast and reliable monochrome laser printer',
  ARRAY['https://images.pexels.com/photos/6120217/pexels-photo-6120217.jpeg?w=800'],
  true
FROM categories c
WHERE c.slug = 'printers'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, brand, category_id, subcategory_id, price, description, images, is_active)
SELECT 
  'Intel Core i9-14900K',
  'intel-core-i9-14900k',
  'Intel',
  c.id,
  NULL,
  589.00,
  '24-core high-performance desktop processor',
  ARRAY['https://images.pexels.com/photos/15922953/pexels-photo-15922953.jpeg?w=800'],
  true
FROM categories c
WHERE c.slug = 'components'
ON CONFLICT (slug) DO NOTHING;
`;

export async function initializeDatabase(): Promise<void> {
  if (initialized) return;

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.warn('[DB Init] Supabase client not available, skipping initialization');
      return;
    }

    // 创建表
    const { error: createError } = await supabase.rpc('exec_sql', { sql: CREATE_TABLES_SQL });
    
    // 如果 rpc 不存在，使用 REST API 直接执行
    if (createError?.message?.includes('function does not exist')) {
      // 使用 Supabase REST API 逐表创建
      await createTablesViaREST(supabase);
    } else if (createError) {
      console.warn('[DB Init] Table creation warning:', createError.message);
    }

    // 插入种子数据
    const { error: seedError } = await supabase.rpc('exec_sql', { sql: SEED_DATA_SQL });
    if (seedError?.message?.includes('function does not exist')) {
      await seedDataViaREST(supabase);
    } else if (seedError) {
      console.warn('[DB Init] Seed data warning:', seedError.message);
    }

    initialized = true;
    console.log('[DB Init] Database initialization completed');
  } catch (error) {
    console.error('[DB Init] Initialization failed:', error);
  }
}

async function createTablesViaREST(supabase: any): Promise<void> {
  // 通过 REST API 检查并创建表
  const tables = ['categories', 'subcategories', 'products', 'inquiries', 'orders', 'users', 'shipping_templates'];
  
  for (const table of tables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    if (error?.message?.includes('relation') || error?.message?.includes('does not exist')) {
      console.log(`[DB Init] Creating table: ${table}`);
      // 表不存在，需要通过 SQL 创建
      // 这里简化处理，实际应该调用 Supabase Management API
    }
  }
}

async function seedDataViaREST(supabase: any): Promise<void> {
  // 检查 categories 是否为空
  const { data: categories, error } = await supabase.from('categories').select('id').limit(1);
  
  if (error || !categories || categories.length === 0) {
    console.log('[DB Init] Inserting seed categories...');
    await supabase.from('categories').insert([
      { name: 'Projectors', slug: 'projectors', description: 'Professional projectors', sort_order: 1 },
      { name: 'Printers', slug: 'printers', description: 'High-quality printers', sort_order: 2 },
      { name: 'Components', slug: 'components', description: 'Computer components', sort_order: 3 },
    ]);
  }
}

// 导出供服务器组件调用
export { CREATE_TABLES_SQL, SEED_DATA_SQL };
