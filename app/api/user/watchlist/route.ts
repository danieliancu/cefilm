import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';

const createSchema = z.object({
  title: z.string().min(1),
  originalTitle: z.string().optional(),
  imdbId: z.string().optional(),
  year: z.string().optional(),
  notes: z.string().max(500).optional(),
  synopsis: z.string().max(5000).optional(),
  reason: z.string().max(5000).optional(),
  director: z.string().max(200).optional(),
});

export async function GET(request: NextRequest) {
  const token = getTokenFromRequest(request);
  const payload = token ? verifyToken(token) : null;
  if (!payload) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  const rows = await query<any>('SELECT * FROM watchlist_items WHERE user_id = ? ORDER BY created_at DESC', [payload.userId]);
  const items = rows.map((r) => ({
    id: r.id,
    title: r.title,
    originalTitle: r.original_title,
    imdbId: r.imdb_id,
    year: r.year,
    notes: r.notes,
    synopsis: r.synopsis,
    reason: r.reason,
    director: r.director,
    createdAt: typeof r.created_at === 'string' ? r.created_at : r.created_at?.toISOString?.() ?? r.created_at,
  }));

  return NextResponse.json({ watchlist: items });
}

export async function POST(request: NextRequest) {
  const token = getTokenFromRequest(request);
  const payload = token ? verifyToken(token) : null;
  if (!payload) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Date invalide' }, { status: 400 });
  }

  const { title, originalTitle, imdbId, year, notes, synopsis, reason, director } = parsed.data;

  await query(
    `INSERT INTO watchlist_items (id, user_id, title, original_title, imdb_id, year, notes, synopsis, reason, director, created_at)
     VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [payload.userId, title, originalTitle || null, imdbId || null, year || null, notes || null, synopsis || null, reason || null, director || null],
  );

  const [created] = await query<any>('SELECT * FROM watchlist_items WHERE user_id = ? ORDER BY created_at DESC LIMIT 1', [
    payload.userId,
  ]);
  const item = created
    ? {
        id: created.id,
    title: created.title,
    originalTitle: created.original_title,
    imdbId: created.imdb_id,
    year: created.year,
    notes: created.notes,
    synopsis: created.synopsis,
    reason: created.reason,
    director: created.director,
    createdAt:
      typeof created.created_at === 'string' ? created.created_at : created.created_at?.toISOString?.() ?? created.created_at,
  }
    : null;

  return NextResponse.json({ item }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const token = getTokenFromRequest(request);
  const payload = token ? verifyToken(token) : null;
  if (!payload) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Lipsește id' }, { status: 400 });
  }

  await query('DELETE FROM watchlist_items WHERE id = ? AND user_id = ?', [id, payload.userId]);

  return NextResponse.json({ ok: true });
}
