import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { getCurrentUser } from '@/lib/auth';
import { hasPermission } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { z } from 'zod';

// Generate RFQ number: RFQ-XXXXXXXX (8-char hex)
function generateRfqNumber(): string {
  const hex = Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('').toUpperCase();
  return `RFQ-${hex}`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[char] || char);
}

// Send RFQ notification directly from the server.
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
  const safe = {
    rfqNumber: escapeHtml(rfq.rfqNumber),
    productName: escapeHtml(rfq.productName),
    companyName: escapeHtml(rfq.companyName),
    contactName: escapeHtml(rfq.contactName),
    country: escapeHtml(rfq.country),
    email: escapeHtml(rfq.email),
    phone: escapeHtml(rfq.phone),
    whatsapp: rfq.whatsapp ? escapeHtml(rfq.whatsapp) : null,
    intendedUse: rfq.intendedUse ? escapeHtml(rfq.intendedUse) : null,
    message: rfq.message ? escapeHtml(rfq.message) : null,
  };

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F172A; border-bottom: 2px solid #F97316; padding-bottom: 8px;">
        New RFQ: ${safe.rfqNumber}
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; width: 140px; border: 1px solid #e2e8f0;">RFQ Number</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: 700; color: #F97316;">${safe.rfqNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Product</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${safe.productName}</td>
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
        ${safe.intendedUse ? `
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Intended Use</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${safe.intendedUse}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Company</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${safe.companyName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Contact</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${safe.contactName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Country</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${safe.country}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Email</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">
            <a href="mailto:${safe.email}" style="color: #F97316;">${safe.email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Phone</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${safe.phone}</td>
        </tr>
        ${safe.whatsapp ? `
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">WhatsApp</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${safe.whatsapp}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 8px 12px; background: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">Time</td>
          <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${now}</td>
        </tr>
      </table>
      ${safe.message ? `
      <div style="margin: 16px 0;">
        <h3 style="color: #0F172A; margin-bottom: 8px;">Message</h3>
        <div style="padding: 12px 16px; background: #f8fafc; border-left: 3px solid #F97316; border-radius: 4px; white-space: pre-wrap;">
${safe.message}
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
    await sendEmail({
      to: 'info@reachtronics.com',
      subject: `New RFQ ${rfq.rfqNumber}: ${escapeHtml(rfq.productName)} x${rfq.quantity}`,
      html,
      replyTo: rfq.email,
    });
  } catch (err) {
    console.error('RFQ email notification error:', err);
  }
}

// POST /api/rfq - Submit a new RFQ
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const normalized = {
      product_name: body.product_name ?? body.productName,
      product_slug: body.product_slug ?? body.productSlug,
      quantity: body.quantity,
      target_price: body.target_price ?? body.targetPrice,
      company_name: body.company_name ?? body.companyName,
      contact_name: body.contact_name ?? body.contactName,
      country: body.country,
      email: body.email,
      phone: body.phone,
      whatsapp: body.whatsapp,
      intended_use: body.intended_use ?? body.intendedUse,
      message: body.message,
      accept_marketing: body.accept_marketing ?? body.acceptMarketing ?? false,
    };
    const schema = z.object({
      product_name: z.string().trim().min(1).max(255),
      product_slug: z.string().trim().max(255).optional().default(''),
      quantity: z.coerce.number().int().min(1).max(100000),
      target_price: z.coerce.number().positive().max(10000000).nullable().optional(),
      company_name: z.string().trim().min(1).max(200),
      contact_name: z.string().trim().min(1).max(100),
      country: z.string().trim().min(1).max(100),
      email: z.string().trim().email().max(255),
      phone: z.string().trim().max(50).optional().default(''),
      whatsapp: z.string().trim().max(50).optional().default(''),
      intended_use: z.string().trim().min(1).max(200),
      message: z.string().trim().max(3000).optional().default(''),
      accept_marketing: z.boolean().default(false),
    }).refine((value) => value.phone || value.whatsapp, {
      message: 'Phone or WhatsApp is required',
    });
    const parsed = schema.safeParse(normalized);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid RFQ data', issues: parsed.error.flatten() }, { status: 400 });
    }
    const {
      product_name, product_slug, quantity, target_price, company_name,
      contact_name, country, email, phone, whatsapp, intended_use, message,
      accept_marketing,
    } = parsed.data;

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
          accept_marketing,
        }),
        inquiry_type: 'rfq',
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    // Await the notification so serverless execution is not terminated early.
    await sendRfqNotification({
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
    });

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
    if (!hasPermission(user, 'inquiries')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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
