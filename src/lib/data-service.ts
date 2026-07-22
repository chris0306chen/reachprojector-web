import { getSupabaseClient } from '@/storage/database/supabase-client';
import type { Product, Category, Inquiry, InsertInquiry, Order } from '@/storage/database/shared/schema';

const client = getSupabaseClient();

// ============ Categories ============

export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await client
      .from('categories')
      .select('id, name, slug, description, image_url, sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) {
      console.warn('[DataService] Failed to fetch categories:', error.message);
      return [];
    }
    return data as Category[];
  } catch (error) {
    console.error('[DataService] getCategories error:', error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const { data, error } = await client
      .from('categories')
      .select('id, name, slug, description, image_url')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();
    if (error) {
      console.warn('[DataService] Failed to fetch category:', error.message);
      return null;
    }
    return data as Category | null;
  } catch (error) {
    console.error('[DataService] getCategoryBySlug error:', error);
    return null;
  }
}

// ============ Products ============

export interface ProductFilters {
  categorySlug?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'name';
  page?: number;
  pageSize?: number;
}

export interface ProductListResult {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getProducts(filters: ProductFilters = {}): Promise<ProductListResult> {
  const {
    categorySlug,
    brand,
    minPrice,
    maxPrice,
    search,
    isBestseller,
    isNewArrival,
    isFeatured,
    sortBy = 'newest',
    page = 1,
    pageSize = 12,
  } = filters;

  let query = client
    .from('products')
    .select('id, name, slug, brand, category_id, price, compare_at_price, images, short_description, stock_status, is_bestseller, is_new_arrival, is_featured, created_at', { count: 'exact' })
    .eq('is_active', true);

  if (categorySlug) {
    const { data: cat } = await client
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle();
    if (cat) {
      query = query.eq('category_id', cat.id);
    }
  }

  if (brand) {
    query = query.eq('brand', brand);
  }
  if (minPrice !== undefined) {
    query = query.gte('price', minPrice.toString());
  }
  if (maxPrice !== undefined) {
    query = query.lte('price', maxPrice.toString());
  }
  if (search) {
    query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%`);
  }
  if (isBestseller) {
    query = query.eq('is_bestseller', true);
  }
  if (isNewArrival) {
    query = query.eq('is_new_arrival', true);
  }
  if (isFeatured) {
    query = query.eq('is_featured', true);
  }

  switch (sortBy) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'name':
      query = query.order('name', { ascending: true });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) {
    console.warn('[DataService] Failed to fetch products:', error.message);
    return { products: [], total: 0, page, pageSize, totalPages: 0 };
  }

  const total = count ?? 0;
  return {
    products: data as Product[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();
    if (error) {
      console.warn('[DataService] Failed to fetch product:', error.message);
      return null;
    }
    return data as Product | null;
  } catch (error) {
    console.error('[DataService] getProductBySlug error:', error);
    return null;
  }
}

export async function getRelatedProducts(productId: string, categoryId: string, limit = 4): Promise<Product[]> {
  try {
    const { data, error } = await client
      .from('products')
      .select('id, name, slug, brand, price, images, short_description, stock_status')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .neq('id', productId)
      .limit(limit);
    if (error) {
      console.warn('[DataService] Failed to fetch related products:', error.message);
      return [];
    }
    return data as Product[];
  } catch (error) {
    console.error('[DataService] getRelatedProducts error:', error);
    return [];
  }
}

export async function getBrands(): Promise<string[]> {
  try {
    const { data, error } = await client
      .from('products')
      .select('brand')
      .eq('is_active', true)
      .order('brand');
    if (error) {
      console.warn('[DataService] Failed to fetch brands:', error.message);
      return [];
    }
    const brands = [...new Set(data.map((p: { brand: string }) => p.brand))];
    return brands.sort();
  } catch (error) {
    console.error('[DataService] getBrands error:', error);
    return [];
  }
}

// ============ Inquiries ============

export async function createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
  const { data, error } = await client
    .from('inquiries')
    .insert(inquiry)
    .select()
    .single();
  if (error) throw new Error(`Failed to create inquiry: ${error.message}`);
  return data as Inquiry;
}

// ============ Orders ============

export interface CreateOrderInput {
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  amount: string;
  currency: string;
  payer_email: string | null;
  payer_name: string | null;
  paypal_order_id: string | null;
  stripe_session_id?: string | null;
  stripe_payment_intent_id?: string | null;
  airwallex_intent_id: string | null;
  payment_method: string;
  payment_status?: string;
  status: string;
}

export async function createOrder(order: CreateOrderInput): Promise<Order> {
  const { data, error } = await client
    .from('orders')
    .insert(order)
    .select()
    .single();
  if (error) throw new Error(`Failed to create order: ${error.message}`);
  return data as Order;
}

export async function getOrderByPayPalId(paypalOrderId: string): Promise<Order | null> {
  const { data, error } = await client
    .from('orders')
    .select('*')
    .eq('paypal_order_id', paypalOrderId)
    .maybeSingle();
  if (error) throw new Error(`Failed to fetch order: ${error.message}`);
  return data as Order | null;
}

export async function getOrderByStripeSessionId(stripeSessionId: string): Promise<Order | null> {
  const { data, error } = await client
    .from('orders')
    .select('*')
    .eq('stripe_session_id', stripeSessionId)
    .maybeSingle();
  if (error) throw new Error(`Failed to fetch Stripe order: ${error.message}`);
  return data as Order | null;
}

export async function updateOrderStatusByStripePaymentIntent(
  paymentIntentId: string,
  status: string
): Promise<Order | null> {
  const { data, error } = await client
    .from('orders')
    .update({ status, payment_status: status, updated_at: new Date().toISOString() })
    .eq('stripe_payment_intent_id', paymentIntentId)
    .select()
    .maybeSingle();
  if (error) throw new Error(`Failed to update Stripe order: ${error.message}`);
  return data as Order | null;
}

export async function updateOrderStatus(id: string, status: string): Promise<Order> {
  const { data, error } = await client
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(`Failed to update order: ${error.message}`);
  return data as Order;
}

export async function updateOrderStatusByPayPalId(paypalOrderId: string, status: string): Promise<Order | null> {
  const { data, error } = await client
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('paypal_order_id', paypalOrderId)
    .select()
    .maybeSingle();
  if (error) throw new Error(`Failed to update PayPal order: ${error.message}`);
  return data as Order | null;
}
