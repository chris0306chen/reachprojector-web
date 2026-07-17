// Email sending API - uses Resend REST API
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, html, from, replyTo, cc, bcc } = body;

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'to, subject, and html are required' },
        { status: 400 }
      );
    }

    const result = await sendEmail({
      to,
      subject,
      html,
      from,
      replyTo,
      cc,
      bcc,
    });

    return NextResponse.json({
      success: true,
      messageId: result.id,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to send email', details: message },
      { status: 500 }
    );
  }
}

export async function GET() {
  const hasApiKey = !!process.env.RESEND_API_KEY;
  return NextResponse.json({
    provider: 'resend',
    apiKeyConfigured: hasApiKey,
    apiKeyPreview: hasApiKey
      ? process.env.RESEND_API_KEY!.substring(0, 8) + '...'
      : 'not set',
    defaultFrom: 'info@reachtronics.com',
  });
}
