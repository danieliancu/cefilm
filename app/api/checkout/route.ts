import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { findUserById, setStripeCustomerId } from '@/lib/user';
import { query } from '@/lib/db';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const priceId = process.env.STRIPE_PRICE_ID_VIP;

// Use Stripe default API version (recommended unless you pin to a supported date)
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export async function POST(request: NextRequest) {
  if (!stripe || !priceId) {
    return NextResponse.json(
      { error: 'Stripe nu este configurat (lipsesc STRIPE_SECRET_KEY sau STRIPE_PRICE_ID_VIP).' },
      { status: 500 },
    );
  }

  const token = getTokenFromRequest(request);
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  }

  const { lang = 'ro' } = await request.json().catch(() => ({}));
  const langSafe = lang === 'en' ? 'en' : 'ro';

  const user = await findUserById(payload.userId);
  if (!user) {
    return NextResponse.json({ error: 'Utilizator inexistent' }, { status: 404 });
  }

  // Ensure customer id
  let customerId = user.stripe_customer_id || null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await setStripeCustomerId(user.id, customerId);
  }

  const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const successUrl = `${origin}/dashboard?checkout=success&lang=${langSafe}`;
  const cancelUrl = `${origin}/?lang=${langSafe}`;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId: user.id },
    subscription_data: {
      metadata: { userId: user.id },
    },
  });

  // Optional: track last intent
  await query('UPDATE users SET updated_at = NOW() WHERE id = ?', [user.id]);

  return NextResponse.json({ url: session.url });
}
