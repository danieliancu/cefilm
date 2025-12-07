import { query } from './db';

export interface DbUserRow {
  id: string;
  email: string;
  password_hash: string;
  name: string | null;
  avatar_url: string | null;
  is_vip: number;
  vip_since: Date | null;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  free_tickets: number;
  last_ticket_reset: Date | null;
  created_at: Date;
  updated_at: Date;
}

export const toPublicUser = (user: DbUserRow) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  avatarUrl: user.avatar_url,
  isVip: !!user.is_vip,
  vipSince: user.vip_since,
  freeTickets: user.free_tickets,
  lastTicketReset: user.last_ticket_reset,
  createdAt: user.created_at,
  updatedAt: user.updated_at,
});

export async function findUserByEmail(email: string) {
  const rows = await query<DbUserRow>('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
}

export async function findUserById(id: string) {
  const rows = await query<DbUserRow>('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

export async function findUserByStripeCustomerId(customerId: string) {
  const rows = await query<DbUserRow>('SELECT * FROM users WHERE stripe_customer_id = ? LIMIT 1', [customerId]);
  return rows[0] || null;
}

export async function setStripeCustomerId(userId: string, customerId: string) {
  await query('UPDATE users SET stripe_customer_id = ?, updated_at = NOW() WHERE id = ?', [customerId, userId]);
}

export async function activateVipFromStripe(userId: string, subscriptionId?: string | null) {
  await query(
    'UPDATE users SET is_vip = 1, vip_since = IFNULL(vip_since, NOW()), free_tickets = 999, stripe_subscription_id = ?, updated_at = NOW() WHERE id = ?',
    [subscriptionId || null, userId],
  );
}

export async function deactivateVipFromStripe(userId: string) {
  await query(
    'UPDATE users SET is_vip = 0, free_tickets = 5, stripe_subscription_id = NULL, updated_at = NOW() WHERE id = ?',
    [userId],
  );
}
