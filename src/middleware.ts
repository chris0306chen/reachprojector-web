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

interface AdminTokenPayload {
  role?: string;
  permissions?: string[];
}

async function verifyAdminToken(token: string): Promise<AdminTokenPayload | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) return null;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload as AdminTokenPayload;
  } catch {
    return null;
  }
}

function requiredPermission(pathname: string): string | null {
  if (pathname.startsWith('/api/admin/users') || pathname === '/api/admin/register') return 'users';
  if (pathname.startsWith('/api/admin/products/import')) return 'import';
  if (pathname.startsWith('/api/admin/products') || pathname.startsWith('/api/admin/categories')) return 'products';
  if (pathname.startsWith('/api/admin/orders')) return 'orders';
  if (pathname.startsWith('/api/admin/inquiries')) return 'inquiries';
  if (pathname.startsWith('/api/admin/shipping')) return 'shipping';
  return null;
}

function canAccess(payload: AdminTokenPayload, permission: string | null): boolean {
  if (!permission) return true;
  if (payload.role === 'admin') return true;
  return payload.permissions?.includes('all') === true || payload.permissions?.includes(permission) === true;
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
    const payload = token ? await verifyAdminToken(token) : null;
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!canAccess(payload, requiredPermission(pathname))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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
