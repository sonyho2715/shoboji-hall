import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { getIronSession } from 'iron-session';
import type { SessionData } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const adminUser = await db.adminUser.findUnique({
      where: { email },
    });

    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const passwordValid = await bcrypt.compare(password, adminUser.passwordHash);

    if (!passwordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create response and set session
    const response = NextResponse.json({
      success: true,
      data: { name: adminUser.name, email: adminUser.email },
    });

    const session = await getIronSession<SessionData>(req, response, {
      password: process.env.SESSION_SECRET!,
      cookieName: 'shoboji_admin',
      cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax' as const,
        maxAge: 60 * 60 * 8,
      },
    });

    session.userId = String(adminUser.id);
    session.email = adminUser.email;
    session.name = adminUser.name;
    session.isAdmin = true;
    session.isLoggedIn = true;
    await session.save();

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
