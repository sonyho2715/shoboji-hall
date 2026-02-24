import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface SessionData {
  userId: string;
  email: string;
  name: string;
  isAdmin: boolean;
  isLoggedIn: boolean;
}

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'shoboji_admin',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 8, // 8 hours
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function requireAdmin(): Promise<SessionData> {
  const session = await getSession();

  if (!session.isLoggedIn || !session.isAdmin || !session.userId) {
    redirect('/admin/login');
  }

  return {
    userId: session.userId,
    email: session.email,
    name: session.name,
    isAdmin: session.isAdmin,
    isLoggedIn: session.isLoggedIn,
  };
}
