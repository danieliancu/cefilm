import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { findUserByEmail, toPublicUser } from '@/lib/user';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Date invalide' }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const user = await findUserByEmail(email);

  if (!user) {
    return NextResponse.json({ error: 'Contul nu există' }, { status: 404 });
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return NextResponse.json({ error: 'Parolă incorectă' }, { status: 401 });
  }

  const token = signToken({ userId: user.id, email: user.email });
  const response = NextResponse.json({ user: toPublicUser(user) });
  response.cookies.set('cefilm_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
