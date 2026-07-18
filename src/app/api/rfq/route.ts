import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { getCurrentUser } from '@/lib/auth';

// Generate RFQ number: RFQ-XXXXXXXX (8-char hex)
function generateRfqNumber(): string {
  const hex = Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('').toUpperCase();
  return `RFQ-${hex}`;
}

// Send RFQ notification email via /api/send-email
async function sendRfqNotification(rfq: {
  rfqNumber: string;
  productName: string;
  quantity: number;
  targetPrice: number | null;
  companyName: string;
  contactName: string;
  country: string;
  email: string;
  phone: string;
  whatsapp: string | null;
  intendedUse: string | null;
  message: string | null;
}) {
  const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F172A; border-bottom: 2px solid #F97316; padding-bottom: 8px;">
        New RFQ: ${rfq.rfqNumber}
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; width: 140px; border: 1px solid #e2e8f0;">RFQ Number</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: 700; color: #F97316;">${rfq.rfqNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Product</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${rfq.productName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Quantity</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${rfq.quantity} units</td>
        </tr>
        ${rfq.targetPrice ? `
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Target Price</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">$${rfq.targetPrice.toFixed(2)}</td>
        </tr>
        ` : ''}
        ${rfq.intendedUse ? `
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Intended Use</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${rfq.intendedUse}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Company</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${rfq.companyName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Contact</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${rfq.contactName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Country</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${rfq.country}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Email</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">
            <a href="mailto:${rfq.email}" style="color: #F97316;">${rfq.email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Phone</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${rfq.phone}</td>
        </tr>
        ${rfq.whatsapp ? `
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">WhatsApp</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${rfq.whatsapp}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Time</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${now}</td>
        </tr>
      </table>
      ${rfq.message ? `
      <div style="margin: 16px 0;">
        <h3 style="color: #0F172A; margin-bottom: 8px;">Message</h3>
        <div style="padding: 12px 16px; background: #f8fafc; border-left: 3px solid #F97316; border-radius: 4px; white-space: pre-wrap;">
${rfq.message}
        </div>
      </div>
      ` : ''}
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center;">
        Sent from REACH PROJECTOR RFQ Form
      </p>
    </div>
  `;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'info@reachprojector.com',
        subject: `New RFQ ${rfq.rfqNumber}: ${rfq.productName} x${rfq.quantity}`,
        html,
        replyTo: rfq.email,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('RFQ email notification failed:', err);
    }
  } catch (err) {
    console.error('RFQ email notification error:', err);
  }
}

// POST /api/rfq - Submit a new RFQ
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      product_name,
      product_slug,
      quantity,
      target_price,
      company_name,
      contact_name,
      country,
      email,
      phone,
      whatsapp,
      intended_use,
      message,
    } = body;

    // Validation
    if (!product_name || !quantity || !company_name || !contact_name || !country || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: product_name, quantity, company_name, contact_name, country, email, phone' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    const rfqNumber = generateRfqNumber();

    // Store RFQ in inquiries table with inquiry_type='rfq'
    const { data, error } = await supabase
      .from('inquiries')
      .insert({
        name: contact_name,
        email,
        phone,
        company: company_name,
        subject: rfqNumber,
        message: JSON.stringify({
          rfq_number: rfqNumber,
          product_name,
          product_slug,
          quantity,
          target_price,
          country,
          whatsapp,
          intended_use,
          message,
        }),
        inquiry_type: 'rfq',
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    // Send notification email (fire and forget)
    sendRfqNotification({
      rfqNumber,
      productName: product_name,
      quantity,
      targetPrice: target_price,
      companyName: company_name,
      contactName: contact_name,
      country,
      email,
      phone,
      whatsapp,
      intendedUse: intended_use,
      message,
    }).catch((err) => console.error('RFQ notification failed:', err));

    return NextResponse.json(
      { success: true, data: { ...data, rfq_number: rfqNumber } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create RFQ:', error);
    return NextResponse.json(
      { error: 'Failed to create RFQ' },
      { status: 500 }
    );
  }
}

// GET /api/rfq - List RFQs (admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const offset = (page - 1) * limit;

    const supabase = getSupabaseClient();
    let query = supabase
      .from('inquiries')
      .select('*', { count: 'exact' })
      .eq('inquiry_type', 'rfq')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq('status', status);

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({
      data,
      pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0) / limit) },
    });
  } catch (error) {
    console.error('Failed to fetch RFQs:', error);
    return NextResponse.json({ error: 'Failed to fetch RFQs' }, { status: 500 });
  }
}
