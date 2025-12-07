import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { findUserById, toPublicUser } from '@/lib/user';
import { query } from '@/lib/db';

const schema = z.object({
  action: z.enum(['use', 'reset']),
});

export async function POST(request: NextRequest) {
  const token = getTokenFromRequest(request);
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Acțiune invalidă' }, { status: 400 });
  }

  const user = await findUserById(payload.userId);
  if (!user) {
    return NextResponse.json({ error: 'Utilizator inexistent' }, { status: 404 });
  }

  let freeTickets = user.free_tickets;

  if (parsed.data.action === 'use') {
    freeTickets = Math.max(0, freeTickets - 1);
  } else if (parsed.data.action === 'reset') {
    freeTickets = 5;
  }

  await query('UPDATE users SET free_tickets = ?, updated_at = NOW() WHERE id = ?', [freeTickets, payload.userId]);

  const updated = await findUserById(payload.userId);
  if (!updated) {
    return NextResponse.json({ error: 'Utilizator inexistent' }, { status: 404 });
  }

  return NextResponse.json({ user: toPublicUser(updated) });
}
