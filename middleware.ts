import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';

interface SessionData {
  userId: string;
  isAdmin: boolean;
  isLoggedIn: boolean;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const response = NextResponse.next();

    const session = await getIronSession<SessionData>(request, response, {
      password: process.env.SESSION_SECRET!,
      cookieName: 'shoboji_admin',
      cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax' as const,
      },
    });

    if (!session.isLoggedIn || !session.isAdmin) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  // Also protect /api/admin routes (except auth routes)
  if (
    pathname.startsWith('/api/admin') &&
    !pathname.startsWith('/api/admin/auth')
  ) {
    const response = NextResponse.next();

    const session = await getIronSession<SessionData>(request, response, {
      password: process.env.SESSION_SECRET!,
      cookieName: 'shoboji_admin',
      cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax' as const,
      },
    });

    if (!session.isLoggedIn || !session.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
