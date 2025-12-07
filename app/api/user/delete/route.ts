import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { query } from '@/lib/db';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export async function DELETE(request: NextRequest) {
  const token = getTokenFromRequest(request);
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  const userId = payload.userId;

  // Fetch subscription id if any
  const [user] = await query<any>('SELECT stripe_subscription_id FROM users WHERE id = ? LIMIT 1', [userId]);
  const subscriptionId = user?.stripe_subscription_id as string | undefined;

  // Cancel Stripe subscription if present and Stripe configured
  if (subscriptionId && stripe) {
    try {
      await stripe.subscriptions.cancel(subscriptionId);
    } catch (err: any) {
      return NextResponse.json({ error: 'Nu am putut anula abonamentul Stripe.' }, { status: 500 });
    }
  }

  // Clean related data first to avoid orphans
  await query('DELETE FROM watchlist_items WHERE user_id = ?', [userId]);
  await query('DELETE FROM vip_history WHERE user_id = ?', [userId]);
  await query('DELETE FROM ratings WHERE user_id = ?', [userId]);
  await query('DELETE FROM discussions WHERE user_id = ?', [userId]);
  await query('DELETE FROM users WHERE id = ?', [userId]);

  // Clear auth cookie
  const response = NextResponse.json({ ok: true });
  response.cookies.set('cefilm_token', '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });
  return response;
}
