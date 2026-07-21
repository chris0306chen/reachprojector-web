// Email sending API - uses Resend REST API
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { getCurrentUser, hasPermission } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!hasPermission(user, 'inquiries')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
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
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const hasApiKey = !!process.env.RESEND_API_KEY;
  return NextResponse.json({
    provider: 'resend',
    apiKeyConfigured: hasApiKey,
    defaultFrom: 'info@reachprojector.com',
  });
}
