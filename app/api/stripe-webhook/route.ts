import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { activateVipFromStripe, deactivateVipFromStripe, setStripeCustomerId } from '@/lib/user';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Use Stripe default API version to avoid invalid version errors
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe webhook nu este configurat.' }, { status: 500 });
  }

  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    return NextResponse.json({ error: 'Semnatura lipsa' }, { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const subscriptionId = typeof session.subscription === 'string' ? session.subscription : undefined;
        const customerId = session.customer as string;
        if (userId) {
          await setStripeCustomerId(userId, customerId);
          await activateVipFromStripe(userId, subscriptionId);
        }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (userId) {
          await activateVipFromStripe(userId, subscription.id);
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (userId) {
          await deactivateVipFromStripe(userId);
        }
        break;
      }
      default:
        break;
    }
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook handler failed: ${err.message}` }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
