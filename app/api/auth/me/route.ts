import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { findUserById, toPublicUser } from '@/lib/user';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Token expirat' }, { status: 401 });
  }

  const user = await findUserById(payload.userId);

  if (!user) {
    return NextResponse.json({ error: 'Utilizator inexistent' }, { status: 404 });
  }

  const watchlistRows = await query<any>('SELECT * FROM watchlist_items WHERE user_id = ? ORDER BY created_at DESC', [user.id]);
  const historyRows = await query<any>('SELECT * FROM vip_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 20', [user.id]);
  const ratingRows = await query<any>('SELECT * FROM ratings WHERE user_id = ? ORDER BY created_at DESC LIMIT 20', [user.id]);
  const discussionRows = await query<any>('SELECT * FROM discussions WHERE user_id = ? ORDER BY created_at DESC LIMIT 20', [user.id]);

  const toCamelDate = (date: any) =>
    typeof date === 'string' ? date : date?.toISOString ? date.toISOString() : date;

  const watchlist = watchlistRows.map((r) => ({
    id: r.id,
    title: r.title,
    originalTitle: r.original_title,
    imdbId: r.imdb_id,
    year: r.year,
    notes: r.notes,
    synopsis: r.synopsis,
    reason: r.reason,
    director: r.director,
    createdAt: toCamelDate(r.created_at),
  }));

  const movieHistory = historyRows.map((r) => ({
    id: r.id,
    createdAt: toCamelDate(r.created_at),
    quizName: r.quiz_name,
    preferences: r.preferences_json ? JSON.parse(r.preferences_json) : [],
    answers: r.answers_json ? JSON.parse(r.answers_json) : [],
    result: r.result_main_json ? JSON.parse(r.result_main_json) : null,
    alternatives: r.alternatives_json ? JSON.parse(r.alternatives_json) : [],
  }));

  const ratings = ratingRows.map((r) => ({
    id: r.id,
    movieTitle: r.movie_title,
    imdbId: r.imdb_id,
    score: r.score,
    review: r.review,
    createdAt: toCamelDate(r.created_at),
  }));

  const discussions = discussionRows.map((r) => ({
    id: r.id,
    topic: r.topic,
    body: r.body,
    createdAt: toCamelDate(r.created_at),
  }));

  return NextResponse.json({
    user: {
      ...toPublicUser(user),
      watchlist,
      movieHistory,
      ratings,
      discussions,
    },
  });
}
