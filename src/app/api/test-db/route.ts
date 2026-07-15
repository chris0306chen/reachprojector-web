import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET() {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client.from('products').select('id, name, slug').limit(3);

    return NextResponse.json({
      success: !error,
      count: data?.length ?? 0,
      products: data,
      error: error?.message,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
