import Stripe from 'stripe';
import { activateVipFromStripe, deactivateVipFromStripe, DbUserRow, findUserById } from './user';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePriceIdVip = process.env.STRIPE_PRICE_ID_VIP;

// Keep a single Stripe client for the fallback sync.
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;
const activeStatuses: Stripe.Subscription.Status[] = ['active', 'trialing'];

/**
 * Defensive fallback: if the webhook failed, check Stripe directly for an active
 * subscription on the customer and align the local VIP flags.
 */
export async function syncVipStatusFromStripe(user: DbUserRow): Promise<DbUserRow> {
  if (!stripe || !stripePriceIdVip || !user.stripe_customer_id) {
    return user;
  }

  try {
    const subs = await stripe.subscriptions.list({
      customer: user.stripe_customer_id,
      status: 'all',
      expand: ['data.items.data.price'],
      limit: 5,
    });

    const matchingSub = subs.data.find((sub) =>
      sub.items.data.some((item) => item.price.id === stripePriceIdVip),
    );

    const isActive = matchingSub && activeStatuses.includes(matchingSub.status);

    if (isActive) {
      await activateVipFromStripe(user.id, matchingSub!.id);
    } else if (user.is_vip || user.stripe_subscription_id) {
      await deactivateVipFromStripe(user.id);
    }

    const refreshed = await findUserById(user.id);
    return refreshed || user;
  } catch (error) {
    console.error('Stripe sync fallback failed', error);
    return user;
  }
}
