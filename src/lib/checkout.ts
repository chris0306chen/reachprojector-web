import { getSupabaseClient } from '@/storage/database/supabase-client';

const MAX_RETAIL_QUANTITY = 20;

export interface CheckoutItem {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
  currency: 'USD';
  total: string;
}

export async function getCheckoutItem(productId: unknown, quantityValue: unknown): Promise<CheckoutItem> {
  if (typeof productId !== 'string' || !productId) throw new Error('INVALID_PRODUCT');

  const quantity = Number(quantityValue ?? 1);
  if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > MAX_RETAIL_QUANTITY) {
    throw new Error('INVALID_QUANTITY');
  }

  const supabase = await getSupabaseClient();
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(productId);
  let query = supabase
    .from('products')
    .select('id, name, price, stock_status, is_active');

  query = isUuid ? query.eq('id', productId) : query.eq('slug', productId);
  const { data, error } = await query.single();

  if (error || !data) throw new Error('PRODUCT_NOT_FOUND');
  if (!data.is_active) throw new Error('PRODUCT_UNAVAILABLE');
  if (data.stock_status !== 'in_stock') throw new Error('PRODUCT_UNAVAILABLE');

  const unitPrice = Number(data.price);
  if (!Number.isFinite(unitPrice) || unitPrice <= 0) throw new Error('INVALID_CATALOG_PRICE');

  return {
    id: data.id,
    name: data.name,
    unitPrice,
    quantity,
    currency: 'USD',
    total: (unitPrice * quantity).toFixed(2),
  };
}
