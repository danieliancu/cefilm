import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { signToken } from '@/lib/auth';
import { findUserByEmail, findUserById, toPublicUser } from '@/lib/user';
import { query } from '@/lib/db';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).max(120).optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Date invalide' }, { status: 400 });
  }

  const { email, password, name } = parsed.data;

  const existing = await findUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: 'Utilizatorul există deja' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const id = crypto.randomUUID();

  await query(
    `INSERT INTO users (id, email, password_hash, name, is_vip, free_tickets, created_at, updated_at)
     VALUES (?, ?, ?, ?, 0, 5, NOW(), NOW())`,
    [id, email, passwordHash, name || null],
  );

  const user = await findUserById(id);
  if (!user) {
    return NextResponse.json({ error: 'Nu am putut crea utilizatorul' }, { status: 500 });
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
