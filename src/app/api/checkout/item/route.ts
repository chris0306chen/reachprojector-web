import { NextRequest, NextResponse } from 'next/server';
import { getCheckoutItem } from '@/lib/checkout';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const item = await getCheckoutItem(body.productId, body.quantity);

    return NextResponse.json({
      productId: item.id,
      productName: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      currency: item.currency,
      total: item.total,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const status = ['INVALID_PRODUCT', 'INVALID_QUANTITY'].includes(message) ? 400 : 404;
    return NextResponse.json(
      { error: status === 400 ? 'Invalid checkout request' : 'Product is unavailable' },
      { status }
    );
  }
}
