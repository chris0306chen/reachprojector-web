// Email sending API - uses SMTP transport configured via environment variables
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// SMTP configuration with hardcoded fallbacks
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.qiye.aliyun.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465');
const SMTP_USER = process.env.SMTP_USER || 'Reach001@reachtronics.com';
const SMTP_PASS = process.env.SMTP_PASS || 'LC314frHyYJOgZxq';
const SMTP_FROM = process.env.SMTP_FROM || 'info@reachtronics.com';

function createTransport() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    connectionTimeout: 10000,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, html, from } = body;

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'to, subject, and html are required' },
        { status: 400 }
      );
    }

    const transporter = createTransport();
    const fromAddress = from || SMTP_FROM;

    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      html,
    });

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
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
  return NextResponse.json({
    host: SMTP_HOST,
    port: SMTP_PORT,
    user: SMTP_USER,
    pass: SMTP_PASS ? SMTP_PASS.substring(0,3) + '***' + SMTP_PASS.substring(SMTP_PASS.length-3) : 'not set',
    from: SMTP_FROM,
    envUser: process.env.SMTP_USER || 'not set',
    envPass: process.env.SMTP_PASS ? process.env.SMTP_PASS.substring(0,3) + '***' : 'not set'
  });
}
