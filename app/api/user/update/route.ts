import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { findUserById, toPublicUser } from '@/lib/user';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

const updateSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  avatarUrl: z.string().url().optional(),
  password: z.string().min(6).optional(),
});

export async function PATCH(request: NextRequest) {
  const token = getTokenFromRequest(request);
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Date invalide' }, { status: 400 });
  }

  let passwordHash: string | undefined;
  if (parsed.data.password) {
    passwordHash = await bcrypt.hash(parsed.data.password, 10);
  }

  await query(
    'UPDATE users SET name = COALESCE(?, name), avatar_url = COALESCE(?, avatar_url), password_hash = COALESCE(?, password_hash), updated_at = NOW() WHERE id = ?',
    [parsed.data.name ?? null, parsed.data.avatarUrl ?? null, passwordHash ?? null, payload.userId],
  );

  const user = await findUserById(payload.userId);
  if (!user) {
    return NextResponse.json({ error: 'Utilizator inexistent' }, { status: 404 });
  }

  return NextResponse.json({ user: toPublicUser(user) });
}
