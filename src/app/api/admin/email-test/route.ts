import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST() {
  try {
    const sentAt = new Date().toISOString();
    const result = await sendEmail({
      to: 'info@reachprojector.com',
      subject: 'REACH PROJECTOR email delivery test',
      html: `<h2>Email delivery is working</h2><p>Resend accepted this test at ${sentAt}.</p>`,
    });
    return NextResponse.json({ success: true, messageId: result.id, sentAt });
  } catch (error) {
    console.error('Email test failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Email test failed' },
      { status: 500 }
    );
  }
}
