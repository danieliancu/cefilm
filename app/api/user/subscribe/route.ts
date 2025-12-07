import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { findUserById, toPublicUser } from '@/lib/user';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  const token = getTokenFromRequest(request);
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  await query(
    'UPDATE users SET is_vip = 1, vip_since = NOW(), free_tickets = 999, updated_at = NOW() WHERE id = ?',
    [payload.userId],
  );

  const user = await findUserById(payload.userId);
  if (!user) {
    return NextResponse.json({ error: 'Utilizator inexistent' }, { status: 404 });
  }

  return NextResponse.json({ user: toPublicUser(user) });
}
