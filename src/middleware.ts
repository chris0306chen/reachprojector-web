import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

async function verifyAdminToken(token: string): Promise<boolean> {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) return false;

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Database bootstrap and diagnostics must never be internet-accessible.
  if (['/api/setup', '/api/setup-db', '/api/test-db'].includes(pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  // Protect the API itself. Hiding the admin pages is not authorization.
  if (pathname.startsWith('/api/admin')) {
    const token = request.cookies.get('admin_token')?.value;
    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Skip i18n middleware for API routes, admin routes, and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp|css|js|woff|woff2|ttf|eot)$/)
  ) {
    // Handle admin route protection
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      const token = request.cookies.get('admin_token')?.value;
      if (!token || !(await verifyAdminToken(token))) {
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
      }
    }
    return NextResponse.next();
  }

  // Apply i18n middleware for all other routes
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/setup',
    '/api/setup-db',
    '/api/test-db',
    '/((?!api|_next|_vercel|images|.*\\..*).*)',
  ],
};
