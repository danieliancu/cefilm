import { query } from './db';

export interface DbUserRow {
  id: string;
  email: string;
  password_hash: string;
  name: string | null;
  avatar_url: string | null;
  is_vip: number;
  vip_since: Date | null;
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
