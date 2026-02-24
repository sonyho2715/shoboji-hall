import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import type { SessionData } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({ success: true });

    const session = await getIronSession<SessionData>(req, response, {
      password: process.env.SESSION_SECRET!,
      cookieName: 'shoboji_admin',
      cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax' as const,
      },
    });

    session.destroy();

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}
