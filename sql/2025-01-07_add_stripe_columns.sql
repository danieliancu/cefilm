-- Adds Stripe tracking columns for subscriptions
ALTER TABLE users
  ADD COLUMN stripe_customer_id VARCHAR(191) NULL AFTER vip_since,
  ADD COLUMN stripe_subscription_id VARCHAR(191) NULL AFTER stripe_customer_id;

-- Optional: backfill existing VIP users with unlimited tickets
UPDATE users SET free_tickets = 999 WHERE is_vip = 1;
