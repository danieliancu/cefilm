import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';
import { findUserById, toPublicUser } from '@/lib/user';

export async function POST(request: NextRequest) {
  const token = getTokenFromRequest(request);
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  await query('UPDATE users SET free_tickets = 5, updated_at = NOW() WHERE id = ?', [payload.userId]);
  const user = await findUserById(payload.userId);
  if (!user) {
    return NextResponse.json({ error: 'Utilizator inexistent' }, { status: 404 });
  }

  return NextResponse.json({ user: toPublicUser(user) });
}
