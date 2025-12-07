import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/db';

const actionSchema = z.object({
  action: z.enum(['use']),
});

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  // @ts-ignore - NextRequest may expose .ip in some runtimes
  return (request as any).ip || 'unknown';
}

async function ensureRow(ip: string) {
  const rows = await query<any>('SELECT * FROM guest_tickets WHERE ip = ? LIMIT 1', [ip]);
  if (rows.length) return rows[0];
  await query('INSERT INTO guest_tickets (ip, remaining, created_at, updated_at) VALUES (?, 5, NOW(), NOW())', [ip]);
  const [created] = await query<any>('SELECT * FROM guest_tickets WHERE ip = ? LIMIT 1', [ip]);
  return created;
}

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const row = await ensureRow(ip);
  return NextResponse.json({ remaining: row.remaining ?? 5 });
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const body = await request.json();
  const parsed = actionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Actiune invalida' }, { status: 400 });
  }

  const row = await ensureRow(ip);
  let remaining = row.remaining ?? 5;

  if (parsed.data.action === 'use') {
    remaining = Math.max(0, remaining - 1);
  }

  await query('UPDATE guest_tickets SET remaining = ?, updated_at = NOW() WHERE ip = ?', [remaining, ip]);
  return NextResponse.json({ remaining });
}
