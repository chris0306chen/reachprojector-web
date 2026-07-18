import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/product-tiers - Fetch tier pricing for a product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productSlug = searchParams.get('product_slug');

    if (!productSlug) {
      return NextResponse.json(
        { error: 'product_slug parameter is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('product_tiers')
      .select('*')
      .eq('product_slug', productSlug)
      .eq('is_active', true)
      .order('tier_min', { ascending: true });

    if (error) {
      console.error('Product tiers fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch product tiers', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching product tiers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product tiers' },
      { status: 500 }
    );
  }
}
