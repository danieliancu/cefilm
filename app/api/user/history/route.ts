import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';
import { findUserById } from '@/lib/user';

const movieSchema = z.object({
  title: z.string().min(1),
  originalTitle: z.string().optional().nullable(),
  year: z.string().optional().nullable(),
  director: z.string().optional().nullable(),
  genre: z.string().optional().nullable(),
  synopsis: z.string().optional().nullable(),
  reason: z.string().optional().nullable(),
  imdbId: z.string().optional().nullable(),
});

const historySchema = z.object({
  quizName: z.string().min(1),
  preferences: z.array(z.string()).default([]),
  answers: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    )
    .min(1),
  result: movieSchema,
  alternatives: z.array(movieSchema).max(10).default([]),
  foundAt: z.string().datetime().optional(),
});

export async function GET(request: NextRequest) {
  const token = getTokenFromRequest(request);
  const payload = token ? verifyToken(token) : null;
  if (!payload) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  const user = await findUserById(payload.userId);
  if (!user || !user.is_vip) {
    return NextResponse.json({ error: 'Disponibil doar pentru VIP' }, { status: 403 });
  }

  const rows = await query<any>('SELECT * FROM vip_history WHERE user_id = ? ORDER BY created_at DESC', [payload.userId]);
  const history = rows.map((r) => ({
    id: r.id,
    createdAt: typeof r.created_at === 'string' ? r.created_at : r.created_at?.toISOString?.() ?? r.created_at,
    quizName: r.quiz_name,
    preferences: r.preferences_json ? JSON.parse(r.preferences_json) : [],
    answers: r.answers_json ? JSON.parse(r.answers_json) : [],
    result: r.result_main_json ? JSON.parse(r.result_main_json) : null,
    alternatives: r.alternatives_json ? JSON.parse(r.alternatives_json) : [],
  }));

  return NextResponse.json({ history });
}

export async function POST(request: NextRequest) {
  const token = getTokenFromRequest(request);
  const payload = token ? verifyToken(token) : null;
  if (!payload) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  const user = await findUserById(payload.userId);
  if (!user || !user.is_vip) {
    return NextResponse.json({ error: 'Disponibil doar pentru VIP' }, { status: 403 });
  }

  const body = await request.json();
  const parsed = historySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Date invalide' }, { status: 400 });
  }

  const { quizName, preferences, answers, result, alternatives, foundAt } = parsed.data;

  await query(
    `INSERT INTO vip_history (id, user_id, quiz_name, preferences_json, answers_json, result_main_json, alternatives_json, created_at)
     VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.userId,
      quizName,
      JSON.stringify(preferences || []),
      JSON.stringify(answers || []),
      JSON.stringify(result || null),
      JSON.stringify(alternatives || []),
      foundAt ? new Date(foundAt) : new Date(),
    ],
  );

  const [item] = await query<any>('SELECT * FROM vip_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 1', [
    payload.userId,
  ]);

  const response =
    item && {
      id: item.id,
      createdAt: typeof item.created_at === 'string' ? item.created_at : item.created_at?.toISOString?.() ?? item.created_at,
      quizName: item.quiz_name,
      preferences: item.preferences_json ? JSON.parse(item.preferences_json) : [],
      answers: item.answers_json ? JSON.parse(item.answers_json) : [],
      result: item.result_main_json ? JSON.parse(item.result_main_json) : null,
      alternatives: item.alternatives_json ? JSON.parse(item.alternatives_json) : [],
    };

  return NextResponse.json({ item: response }, { status: 201 });
}
