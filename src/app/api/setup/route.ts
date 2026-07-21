import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SETUP_SECRET = 'reachtronics-db-setup-2026'

const SUPABASE_URL = 'https://br-handy-deer-627f60fc.supabase2.aidap-global.cn-beijing.volces.com'
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjMzNjQ3MTAzNDAsInJvbGUiOiJzZXJ2aWNlX3JvbGUifQ.2SKx37Jklte9cKRFNwfe7m1C3NEThWJwJZkIG9xpl8g'

function getSupabase() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    db: { timeout: 60000 },
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

// 4 categories
const categories = [
  { name: '4K Laser Projectors', slug: '4k-laser-projectors', description: 'Premium 4K laser projectors for home theater and professional use.', image_url: '/images/categories/projector-4k.jpg', sort_order: 1 },
  { name: 'UST Laser TV', slug: 'ust-laser-tv', description: 'Ultra short throw laser TVs with massive screen experience.', image_url: '/images/categories/ust-laser-tv.jpg', sort_order: 2 },
  { name: 'Projector Mounts', slug: 'projector-mounts', description: 'Ceiling, wall, floor stands and UST adjustable mounts for every projection setup.', image_url: '/images/categories/projector-mount.jpg', sort_order: 3 },
  { name: 'Projection Screens', slug: 'projection-screens', description: 'Motorized, fixed frame, portable and ALR screens for any environment.', image_url: '/images/categories/projection-screen.jpg', sort_order: 4 },
]

// 31 products
const products = [
  // 4K Laser Projectors (10)
  { name: 'JMGO N5S ULTRA MAX 4K', slug: 'jmgo-n5s-ultra-max-4k', brand: 'JMGO', category_slug: '4k-laser-projectors', price: 1600, compare_at_price: 1800, short_description: 'Premium 4K laser projector with exceptional brightness.', description: 'The JMGO N5S ULTRA MAX 4K delivers an immersive cinematic experience with advanced laser light source.', features: '["4K UHD","Laser Light Source","3000+ ANSI Lumens","HDR10+","Auto Keystone","Built-in Speaker"]', specifications: '{"Resolution":"3840x2160","Brightness":"3200 ANSI Lumens","Light Source":"Triple Color Laser","Contrast":"3000:1","Throw Ratio":"1.2:1","Speaker":"2x10W","Weight":"9.5kg"}', images: '[]', is_bestseller: true, is_new_arrival: false, is_featured: true, stock_status: 'in_stock' },
  { name: 'XGIMI RS 10 Ultra 4K', slug: 'xgimi-rs-10-ultra-4k', brand: 'XGIMI', category_slug: '4k-laser-projectors', price: 2499.99, compare_at_price: 2799.99, short_description: 'Flagship 4K laser projector with dual laser engine.', description: 'The XGIMI RS 10 Ultra represents the pinnacle of home projection with dual laser engine.', features: '["4K UHD","Dual Laser Engine","3500+ ANSI Lumens","Dolby Vision+HDR10+","Auto Focus","Harman Kardon"]', specifications: '{"Resolution":"3840x2160","Brightness":"3500 ANSI Lumens","Light Source":"Dual Laser","Contrast":"3500:1","Speaker":"2x12W Harman Kardon","Weight":"10.2kg"}', images: '[]', is_bestseller: true, is_new_arrival: false, is_featured: true, stock_status: 'in_stock' },
  { name: 'XGIMI RS 10 Mini 4K', slug: 'xgimi-rs-10-mini-4k', brand: 'XGIMI', category_slug: '4k-laser-projectors', price: 1199.99, compare_at_price: 1399.99, short_description: 'Compact 4K laser projector with premium features.', description: 'The XGIMI RS 10 Mini 4K brings flagship performance to a compact design.', features: '["4K UHD","Laser","2000+ ANSI Lumens","HDR10+","Smart Auto","Portable"]', specifications: '{"Resolution":"3840x2160","Brightness":"2000 ANSI Lumens","Light Source":"Laser","Contrast":"2500:1","Speaker":"2x8W","Weight":"4.5kg"}', images: '[]', is_bestseller: false, is_new_arrival: true, is_featured: false, stock_status: 'in_stock' },
  { name: 'Hisense VIDDA C5 Master 4K', slug: 'hisense-vidda-c5-master-4k', brand: 'Hisense', category_slug: '4k-laser-projectors', price: 2699.99, compare_at_price: 2999.99, short_description: 'Professional-grade 4K laser with cinema-level color.', description: 'The Hisense VIDDA C5 Master 4K is engineered for demanding home theater enthusiasts.', features: '["4K UHD","Triple Laser ALPD 5.0","4000+ ANSI Lumens","Cinema Color","120Hz","Advanced Cooling"]', specifications: '{"Resolution":"3840x2160","Brightness":"4200 ANSI Lumens","Light Source":"ALPD 5.0 Triple Laser","Color Gamut":"110% BT.2020","Speaker":"2x15W","Weight":"12.5kg"}', images: '[]', is_bestseller: true, is_new_arrival: false, is_featured: false, stock_status: 'in_stock' },
  { name: 'XGIMI Horizon Ultra', slug: 'xgimi-horizon-ultra', brand: 'XGIMI', category_slug: '4k-laser-projectors', price: 1799.99, compare_at_price: 1999.99, short_description: 'Premium 4K HDR with Dolby Vision and hybrid light.', description: 'The XGIMI Horizon Ultra combines hybrid LED+Laser for exceptional brightness and color.', features: '["4K UHD","Hybrid LED+Laser","2300 ISO Lumens","Dolby Vision","Harman Kardon","Android TV 11"]', specifications: '{"Resolution":"3840x2160","Brightness":"2300 ISO Lumens","Light Source":"LED+Laser","Speaker":"2x12W Harman Kardon","Weight":"5.5kg"}', images: '[]', is_bestseller: true, is_new_arrival: false, is_featured: false, stock_status: 'in_stock' },
  { name: 'XGIMI MoGo 3 Pro', slug: 'xgimi-mogo-3-pro', brand: 'XGIMI', category_slug: '4k-laser-projectors', price: 599.99, compare_at_price: 699.99, short_description: 'Portable 1080p projector with built-in battery.', description: 'Take entertainment anywhere with built-in battery for cord-free viewing.', features: '["1080p Full HD","Built-in Battery","400 ISO Lumens","Android TV","Auto Keystone","Portable"]', specifications: '{"Resolution":"1920x1080","Brightness":"400 ISO Lumens","Battery":"2.5 hours","Speaker":"2x4W","Weight":"1.6kg"}', images: '[]', is_bestseller: false, is_new_arrival: true, is_featured: false, stock_status: 'in_stock' },
  { name: 'JMGO N1 Ultra 4K', slug: 'jmgo-n1-ultra-4k', brand: 'JMGO', category_slug: '4k-laser-projectors', price: 1399.99, compare_at_price: 1599.99, short_description: 'Compact 4K laser with innovative gimbal design.', description: 'The JMGO N1 Ultra features an innovative built-in gimbal stand for 360-degree rotation.', features: '["4K UHD","Laser","2200 ANSI Lumens","360-degree Gimbal","Auto Focus","Cloud Gaming"]', specifications: '{"Resolution":"3840x2160","Brightness":"2200 ANSI Lumens","Light Source":"Triple Color Laser","Throw Ratio":"0.6:1-4.5:1","Speaker":"2x10W","Weight":"4.6kg"}', images: '[]', is_bestseller: false, is_new_arrival: false, is_featured: false, stock_status: 'in_stock' },
  { name: 'AMD Ryzen 7 7800X3D', slug: 'amd-ryzen-7-7800x3d', brand: 'AMD', category_slug: '4k-laser-projectors', price: 449, compare_at_price: 499, short_description: 'Best gaming CPU with 3D V-Cache.', description: 'The AMD Ryzen 7 7800X3D features 96MB L3 cache, the ultimate gaming processor.', features: '["8 Cores/16 Threads","Up to 5.0 GHz","96MB L3 3D V-Cache","Zen 4","Best Gaming","120W TDP"]', specifications: '{"Cores":"8","Threads":"16","Boost":"5.0 GHz","L3 Cache":"96 MB (3D)","TDP":"120W","Socket":"AM5"}', images: '[]', is_bestseller: true, is_new_arrival: false, is_featured: true, stock_status: 'in_stock' },

  // UST Laser TV (5)
  { name: 'Hisense PX2-Pro 4K UST', slug: 'hisense-px2-pro-4k-ust', brand: 'Hisense', category_slug: 'ust-laser-tv', price: 2399.99, compare_at_price: 2699.99, short_description: 'Ultra Short Throw 4K laser TV.', description: 'The Hisense PX2-Pro transforms any wall into a massive 120-inch 4K display.', features: '["4K UHD","Ultra Short Throw","2400+ ANSI Lumens","Triple Laser","Dolby Vision","ALR Screen"]', specifications: '{"Resolution":"3840x2160","Brightness":"2400 ANSI Lumens","Throw Ratio":"0.23:1","Screen":"80-150 inch","Speaker":"2x15W+Sub","Weight":"14kg"}', images: '[]', is_bestseller: false, is_new_arrival: false, is_featured: true, stock_status: 'in_stock' },
  { name: 'AWOL Vision LTV-3500 4K', slug: 'awol-vision-ltv-3500-4k', brand: 'AWOL Vision', category_slug: 'ust-laser-tv', price: 5999.99, compare_at_price: 6499.99, short_description: 'Premium RGB triple laser UST.', description: 'The AWOL Vision LTV-3500 is the ultimate ultra-short throw with RGB triple laser.', features: '["4K UHD","RGB Triple Laser","5500+ ANSI Lumens","150 inch","HDR","Premium Build"]', specifications: '{"Resolution":"3840x2160","Brightness":"5500 ANSI Lumens","Light Source":"RGB Triple Laser","Throw Ratio":"0.198:1","Speaker":"2x15W","Weight":"18kg"}', images: '[]', is_bestseller: false, is_new_arrival: false, is_featured: true, stock_status: 'in_stock' },
  { name: 'Formovie Theater 4K', slug: 'formovie-theater-4k', brand: 'Formovie', category_slug: 'ust-laser-tv', price: 3499.99, compare_at_price: 3999.99, short_description: 'Award-winning UST with ALPD 4.5.', description: 'The Formovie Theater combines ALPD 4.5 laser technology with UST design.', features: '["4K UHD","ALPD 4.5","2800+ ANSI Lumens","Dolby Vision+HDR10+","150 inch","Android TV"]', specifications: '{"Resolution":"3840x2160","Brightness":"2800 ANSI Lumens","Light Source":"ALPD 4.5","Throw Ratio":"0.23:1","Speaker":"2x15W Dolby","Weight":"12kg"}', images: '[]', is_bestseller: false, is_new_arrival: true, is_featured: false, stock_status: 'in_stock' },
  { name: 'JMGO U2 4K Laser TV', slug: 'jmgo-u2-4k-laser-tv', brand: 'JMGO', category_slug: 'ust-laser-tv', price: 2199.99, compare_at_price: 2499.99, short_description: 'Sleek 4K laser TV with superior optics.', description: 'The JMGO U2 brings cinematic 4K quality with compact laser TV design.', features: '["4K UHD","Laser","2400 ANSI Lumens","HDR10+","Auto Focus","Smart OS"]', specifications: '{"Resolution":"3840x2160","Brightness":"2400 ANSI Lumens","Throw Ratio":"0.23:1","Screen":"80-130 inch","Speaker":"2x10W","Weight":"8.5kg"}', images: '[]', is_bestseller: false, is_new_arrival: false, is_featured: false, stock_status: 'in_stock' },
  { name: 'Hisense PL1 4K Laser TV', slug: 'hisense-pl1-4k-laser-tv', brand: 'Hisense', category_slug: 'ust-laser-tv', price: 1899.99, compare_at_price: 2199.99, short_description: 'Affordable 4K UST laser TV.', description: 'The Hisense PL1 offers 4K ultra-short throw at an accessible price.', features: '["4K UHD","Laser","2100 ANSI Lumens","Ultra Short Throw","Smart TV","Voice Control"]', specifications: '{"Resolution":"3840x2160","Brightness":"2100 ANSI Lumens","Throw Ratio":"0.25:1","Screen":"80-120 inch","Speaker":"2x10W","Weight":"8kg"}', images: '[]', is_bestseller: false, is_new_arrival: false, is_featured: false, stock_status: 'in_stock' },

  // Printers & Scanners (8)

  // Components (8)
]

// Admin user
const adminUser = {
  email: 'admin@reachtronics.com',
  password_hash: '$2a$10$rZ8vKxJqYxJqYxJqYxJqYuGxJqYxJqYxJqYxJqYxJqYxJqYxJqYx',
  role: 'admin',
  permissions: '["dashboard","products","orders","users","shipping","inquiries"]',
  name: 'Admin',
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const url = new URL(request.url)
  const token = url.searchParams.get('token') || authHeader?.replace('Bearer ', '')

  if (token !== SETUP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabase()
  const results: string[] = []

  try {
    // 1. Check & insert categories
    const { data: existingCats, error: catCheckErr } = await supabase.from('categories').select('id, slug')
    if (catCheckErr) throw new Error(`categories check failed: ${catCheckErr.message}`)

    const existingCatSlugs = new Set((existingCats || []).map((c: { slug: string }) => c.slug))
    const catsToInsert = categories.filter(c => !existingCatSlugs.has(c.slug))

    if (catsToInsert.length > 0) {
      const { error: catInsertErr } = await supabase.from('categories').insert(catsToInsert)
      if (catInsertErr) throw new Error(`categories insert failed: ${catInsertErr.message}`)
      results.push(`Inserted ${catsToInsert.length} categories`)
    } else {
      results.push(`Categories already exist (${existingCats?.length || 0})`)
    }

    // 2. Get category ID map
    const { data: allCats } = await supabase.from('categories').select('id, slug')
    const catSlugToId = new Map<string, string>()
    for (const c of (allCats || [])) {
      catSlugToId.set(c.slug, c.id)
    }

    // 3. Check & insert products
    const { data: existingProds, error: prodCheckErr } = await supabase.from('products').select('id, slug')
    if (prodCheckErr) throw new Error(`products check failed: ${prodCheckErr.message}`)

    const existingProdSlugs = new Set((existingProds || []).map((p: { slug: string }) => p.slug))
    const prodsToInsert = products
      .filter(p => !existingProdSlugs.has(p.slug))
      .map(p => ({
        ...p,
        category_id: catSlugToId.get(p.category_slug) || null,
      }))

    if (prodsToInsert.length > 0) {
      const { error: prodInsertErr } = await supabase.from('products').insert(prodsToInsert)
      if (prodInsertErr) throw new Error(`products insert failed: ${prodInsertErr.message}`)
      results.push(`Inserted ${prodsToInsert.length} products`)
    } else {
      results.push(`Products already exist (${existingProds?.length || 0})`)
    }

    // 4. Check & insert admin user
    const { data: existingUsers } = await supabase.from('users').select('id, email').eq('email', adminUser.email)
    if (!existingUsers || existingUsers.length === 0) {
      const { error: userInsertErr } = await supabase.from('users').insert(adminUser)
      if (userInsertErr) throw new Error(`admin user insert failed: ${userInsertErr.message}`)
      results.push('Inserted admin user')
    } else {
      results.push('Admin user already exists')
    }

    // 5. Final row counts
    const [{ count: catCount }, { count: prodCount }, { count: userCount }] = await Promise.all([
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }),
    ])

    return NextResponse.json({
      success: true,
      results,
      final_row_counts: {
        categories: catCount,
        products: prodCount,
        users: userCount,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Setup error:', error)
    return NextResponse.json({
      error: message,
      results,
      connection: 'supabase-rest-api',
      database_url: SUPABASE_URL,
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const token = url.searchParams.get('token')

  if (token !== SETUP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabase()

  try {
    const [{ count: catCount }, { count: prodCount }, { count: userCount }] = await Promise.all([
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }),
    ])

    return NextResponse.json({
      status: 'ok',
      connection: 'supabase-rest-api',
      database_url: SUPABASE_URL,
      row_counts: {
        categories: catCount,
        products: prodCount,
        users: userCount,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message, connection: 'supabase-rest-api' }, { status: 500 })
  }
}
