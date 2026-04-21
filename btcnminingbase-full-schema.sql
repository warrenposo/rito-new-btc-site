-- ============================================================
-- BtcNminingBase — Complete Database Schema
-- Project:  https://rucaagoiuvlfcsjwfrqv.supabase.co
-- Run this ONCE in your Supabase SQL Editor (Dashboard → SQL Editor)
-- Admin email auto-assigned: warrenokumu98@gmail.com
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PROFILES
--    One row per auth user. Stores KYC fields, role, referral.
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email               TEXT UNIQUE NOT NULL,
  full_name           TEXT,
  username            TEXT,
  mobile              TEXT,
  country_code        TEXT DEFAULT '+1',
  country             TEXT,
  address             TEXT,
  state               TEXT,
  zip_code            TEXT,
  city                TEXT,
  role                TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  referral_code       TEXT UNIQUE,
  referral_balance    DECIMAL(18,8) DEFAULT 0,
  usdt_wallet_address TEXT,
  mining_stop_balance DECIMAL(18,8) DEFAULT NULL,
  two_fa_enabled      BOOLEAN DEFAULT FALSE,
  two_fa_secret       TEXT,
  created_at          TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at          TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

COMMENT ON COLUMN profiles.referral_balance    IS 'Referral earnings balance — editable by admin.';
COMMENT ON COLUMN profiles.mining_stop_balance IS 'When total_mined >= this value mining auto-stops. NULL = no limit.';

-- ============================================================
-- 2. SITE SETTINGS
--    Single-row global toggle (mining on/off, etc.)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id              INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  mining_enabled  BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at      TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

COMMENT ON TABLE site_settings IS 'Global app settings — always exactly one row (id = 1).';

INSERT INTO site_settings (id, mining_enabled)
VALUES (1, TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 3. MINING STATS
--    Live balance & earnings counters per user.
-- ============================================================
CREATE TABLE IF NOT EXISTS mining_stats (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hash_rate         DECIMAL(10,2)  DEFAULT 0,
  total_mined       DECIMAL(18,8)  DEFAULT 0,
  daily_earnings    DECIMAL(18,8)  DEFAULT 0,
  available_balance DECIMAL(18,8)  DEFAULT 0,
  last_updated      TIMESTAMPTZ    DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- ============================================================
-- 4. MINING PLANS
--    Admin-managed catalogue of purchasable plans.
-- ============================================================
CREATE TABLE IF NOT EXISTS mining_plans (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                TEXT NOT NULL,
  currency            TEXT NOT NULL CHECK (currency IN ('BTC', 'LTC')),
  price               DECIMAL(18,2) NOT NULL,
  duration            INTEGER NOT NULL,           -- days
  hardware            TEXT,
  daily_mining_btc    DECIMAL(18,8),
  daily_mining_ltc    DECIMAL(18,8),
  daily_mining_usd    DECIMAL(18,2),
  monthly_mining_btc  DECIMAL(18,8),
  monthly_mining_ltc  DECIMAL(18,8),
  monthly_mining_usd  DECIMAL(18,2),
  total_mining_btc    DECIMAL(18,8),
  total_mining_ltc    DECIMAL(18,8),
  total_mining_usd    DECIMAL(18,2),
  referral_rewards    DECIMAL(18,2),
  available           INTEGER DEFAULT 0,
  sold                INTEGER DEFAULT 0,
  is_active           BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at          TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================
-- 5. USER PLANS
--    Plans purchased by individual users.
-- ============================================================
CREATE TABLE IF NOT EXISTS user_plans (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            UUID REFERENCES auth.users(id)   ON DELETE CASCADE  NOT NULL,
  plan_id            UUID REFERENCES mining_plans(id) ON DELETE RESTRICT NOT NULL,
  plan_name          TEXT NOT NULL,
  price              DECIMAL(18,2) NOT NULL,
  currency           TEXT NOT NULL,
  return_per_day_min DECIMAL(18,8),
  return_per_day_max DECIMAL(18,8),
  total_days         INTEGER NOT NULL,
  remaining_days     INTEGER NOT NULL,
  fixed_return       DECIMAL(18,8) DEFAULT 0,
  status             TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'completed', 'expired')),
  purchased_date     TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  activated_at       TIMESTAMPTZ,
  expires_at         TIMESTAMPTZ,
  created_at         TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at         TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================
-- 6. MINING SESSIONS
--    One row per mining session / simulated day.
-- ============================================================
CREATE TABLE IF NOT EXISTS mining_sessions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  started_at    TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  ended_at      TIMESTAMPTZ,
  amount_mined  DECIMAL(18,8) DEFAULT 0 NOT NULL,
  target_amount DECIMAL(18,8) NOT NULL,
  status        TEXT NOT NULL DEFAULT 'running'
    CHECK (status IN ('running', 'completed', 'stopped')),
  created_at    TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

COMMENT ON COLUMN mining_sessions.amount_mined  IS 'USD amount mined in this session — credited when completed.';
COMMENT ON COLUMN mining_sessions.target_amount IS 'Target USD for the session (e.g. 20 % of balance at start).';

-- ============================================================
-- 7. DEPOSITS
--    Incoming fund transactions (crypto + fiat gateways).
-- ============================================================
CREATE TABLE IF NOT EXISTS deposits (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  transaction_id   TEXT UNIQUE NOT NULL,
  gateway          TEXT NOT NULL
    CHECK (gateway IN ('btc','usdt-trc20','usdt-erc20','usdc','eth','solana','coinbase','paypal','stripe')),
  amount           DECIMAL(18,2) NOT NULL,
  charge           DECIMAL(18,2) DEFAULT 0,
  payable          DECIMAL(18,2) NOT NULL,
  status           TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','processing','completed','failed','cancelled')),
  deposit_address  TEXT,
  currency         TEXT NOT NULL DEFAULT 'USD',
  conversion_rate  DECIMAL(18,8),
  crypto_amount    DECIMAL(18,8),
  created_at       TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at       TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  completed_at     TIMESTAMPTZ
);

-- ============================================================
-- 8. WITHDRAWALS
--    Outgoing fund requests to user wallets.
-- ============================================================
CREATE TABLE IF NOT EXISTS withdrawals (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  transaction_id TEXT UNIQUE NOT NULL,
  gateway        TEXT NOT NULL
    CHECK (gateway IN ('btc','usdt-trc20','usdt-erc20','usdc','eth','solana')),
  amount         DECIMAL(18,2) NOT NULL,
  wallet_address TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','processing','completed','rejected','cancelled')),
  admin_notes    TEXT,
  created_at     TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at     TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  completed_at   TIMESTAMPTZ
);

-- ============================================================
-- 9. DEPOSIT ADDRESSES
--    Admin-configured receive addresses per gateway.
-- ============================================================
CREATE TABLE IF NOT EXISTS deposit_addresses (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gateway    TEXT NOT NULL
    CHECK (gateway IN ('btc','usdt-trc20','usdt-erc20','usdc','eth','solana','coinbase','paypal','stripe')),
  address    TEXT NOT NULL,
  qr_code_url TEXT,
  is_active  BOOLEAN DEFAULT TRUE,
  min_amount DECIMAL(18,2),
  max_amount DECIMAL(18,2),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================
-- 10. USER WALLETS
--     User-saved withdrawal addresses.
-- ============================================================
CREATE TABLE IF NOT EXISTS user_wallets (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  currency   TEXT NOT NULL CHECK (currency IN ('BTC','USDT','USDC','ETH','LTC','SOL')),
  network    TEXT,  -- e.g. 'TRC20', 'ERC20', 'Mainnet'
  address    TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id, currency, network)
);

-- ============================================================
-- 11. REFERRALS
--     Referral relationships between users.
-- ============================================================
CREATE TABLE IF NOT EXISTS referrals (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id   UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referred_id   UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referral_code TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(referred_id) -- a user can only be referred once
);

-- ============================================================
-- 12. REFERRAL COMMISSIONS
--     Commission log entries tied to referral activity.
-- ============================================================
CREATE TABLE IF NOT EXISTS referral_commissions (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id            UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referred_id            UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  commission_type        TEXT NOT NULL CHECK (commission_type IN ('signup','deposit','plan_purchase')),
  amount                 DECIMAL(18,8) NOT NULL,
  currency               TEXT DEFAULT 'USDT',
  percentage             DECIMAL(5,2) NOT NULL,
  related_transaction_id UUID,
  wallet_address         TEXT,
  status                 TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','cancelled')),
  created_at             TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  paid_at                TIMESTAMPTZ
);

-- ============================================================
-- 13. SUPPORT TICKETS
--     User help-desk submissions with optional file attachment.
-- ============================================================
CREATE TABLE IF NOT EXISTS support_tickets (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name           TEXT NOT NULL,
  email          TEXT NOT NULL,
  subject        TEXT NOT NULL,
  message        TEXT NOT NULL,
  file_url       TEXT,
  file_name      TEXT,
  status         TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open','in_progress','resolved','closed')),
  priority       TEXT NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('low','medium','high','urgent')),
  admin_response TEXT,
  created_at     TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at     TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  resolved_at    TIMESTAMPTZ
);

-- ============================================================
-- INDEXES  (run before policies for speed)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_profiles_user_id              ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email                ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role                 ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code        ON profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_mining_stats_user_id          ON mining_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_mining_sessions_user_id       ON mining_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_mining_sessions_started_at    ON mining_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_deposits_user_id              ON deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_deposits_status               ON deposits(status);
CREATE INDEX IF NOT EXISTS idx_deposits_transaction_id       ON deposits(transaction_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id           ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status            ON withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_transaction_id    ON withdrawals(transaction_id);
CREATE INDEX IF NOT EXISTS idx_user_plans_user_id            ON user_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_plans_status             ON user_plans(status);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id         ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id         ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_ref_commissions_referrer_id   ON referral_commissions(referrer_id);
CREATE INDEX IF NOT EXISTS idx_ref_commissions_status        ON referral_commissions(status);
CREATE INDEX IF NOT EXISTS idx_user_wallets_user_id          ON user_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id       ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status        ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_deposit_addresses_gateway     ON deposit_addresses(gateway);

-- ============================================================
-- HELPER FUNCTION — is_admin()
--   SECURITY DEFINER so it can bypass RLS without recursion.
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = user_uuid AND role = 'admin'
  );
END;
$$;

-- ============================================================
-- AUTO-TIMESTAMP FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- NEW-USER TRIGGER
--   Fires after every auth.users INSERT.
--   Creates profile + initial mining_stats automatically.
--
--   *** IMPORTANT: Replace 'your-admin@email.com' below
--       with the email address you will use for the admin account. ***
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_referral_code TEXT;
BEGIN
  -- Generate a unique 8-char referral code
  user_referral_code := UPPER(SUBSTRING(MD5(COALESCE(NEW.email, '') || NEW.id::text) FROM 1 FOR 8));

  WHILE EXISTS (SELECT 1 FROM profiles WHERE referral_code = user_referral_code) LOOP
    user_referral_code := UPPER(
      SUBSTRING(MD5(COALESCE(NEW.email, '') || NEW.id::text || random()::text) FROM 1 FOR 8)
    );
  END LOOP;

  INSERT INTO public.profiles (user_id, email, role, referral_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    CASE
      WHEN LOWER(COALESCE(NEW.email, '')) = LOWER('warrenokumu98@gmail.com') THEN 'admin'
      ELSE 'user'
    END,
    user_referral_code
  )
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.mining_stats (user_id, hash_rate, total_mined, daily_earnings, available_balance)
  VALUES (NEW.id, 0, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE WARNING 'handle_new_user error: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================
DROP TRIGGER IF EXISTS trg_profiles_updated_at          ON profiles;
DROP TRIGGER IF EXISTS trg_support_tickets_updated_at   ON support_tickets;
DROP TRIGGER IF EXISTS trg_deposits_updated_at          ON deposits;
DROP TRIGGER IF EXISTS trg_withdrawals_updated_at       ON withdrawals;
DROP TRIGGER IF EXISTS trg_mining_plans_updated_at      ON mining_plans;
DROP TRIGGER IF EXISTS trg_user_plans_updated_at        ON user_plans;
DROP TRIGGER IF EXISTS trg_mining_sessions_updated_at   ON mining_sessions;
DROP TRIGGER IF EXISTS trg_user_wallets_updated_at      ON user_wallets;
DROP TRIGGER IF EXISTS trg_deposit_addresses_updated_at ON deposit_addresses;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_support_tickets_updated_at
  BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_deposits_updated_at
  BEFORE UPDATE ON deposits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_withdrawals_updated_at
  BEFORE UPDATE ON withdrawals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_mining_plans_updated_at
  BEFORE UPDATE ON mining_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_user_plans_updated_at
  BEFORE UPDATE ON user_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_mining_sessions_updated_at
  BEFORE UPDATE ON mining_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_user_wallets_updated_at
  BEFORE UPDATE ON user_wallets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_deposit_addresses_updated_at
  BEFORE UPDATE ON deposit_addresses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY — enable on every table
-- ============================================================
ALTER TABLE profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings        ENABLE ROW LEVEL SECURITY;
ALTER TABLE mining_stats         ENABLE ROW LEVEL SECURITY;
ALTER TABLE mining_plans         ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plans           ENABLE ROW LEVEL SECURITY;
ALTER TABLE mining_sessions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposits             ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals          ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposit_addresses    ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_wallets         ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals            ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets      ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- ---- profiles ----
DROP POLICY IF EXISTS "Users view own profile"    ON profiles;
DROP POLICY IF EXISTS "Users insert own profile"  ON profiles;
DROP POLICY IF EXISTS "Users update own profile"  ON profiles;
DROP POLICY IF EXISTS "Admins view all profiles"  ON profiles;
DROP POLICY IF EXISTS "Admins update all profiles" ON profiles;

CREATE POLICY "Users view own profile"
  ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins view all profiles"
  ON profiles FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins update all profiles"
  ON profiles FOR UPDATE USING (public.is_admin(auth.uid()));

-- ---- site_settings ----
DROP POLICY IF EXISTS "Anyone reads site_settings"   ON site_settings;
DROP POLICY IF EXISTS "Admins update site_settings"  ON site_settings;

CREATE POLICY "Anyone reads site_settings"
  ON site_settings FOR SELECT USING (TRUE);
CREATE POLICY "Admins update site_settings"
  ON site_settings FOR UPDATE USING (public.is_admin(auth.uid()));

-- ---- mining_stats ----
DROP POLICY IF EXISTS "Users view own stats"     ON mining_stats;
DROP POLICY IF EXISTS "Users update own stats"   ON mining_stats;
DROP POLICY IF EXISTS "Admins view all stats"    ON mining_stats;
DROP POLICY IF EXISTS "Admins update all stats"  ON mining_stats;

CREATE POLICY "Users view own stats"
  ON mining_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own stats"
  ON mining_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins view all stats"
  ON mining_stats FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins update all stats"
  ON mining_stats FOR UPDATE USING (public.is_admin(auth.uid()));

-- ---- mining_plans (public read for active, admin full control) ----
DROP POLICY IF EXISTS "Public view active plans"  ON mining_plans;
DROP POLICY IF EXISTS "Admins view all plans"     ON mining_plans;
DROP POLICY IF EXISTS "Admins manage plans"       ON mining_plans;

CREATE POLICY "Public view active plans"
  ON mining_plans FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins view all plans"
  ON mining_plans FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins manage plans"
  ON mining_plans FOR ALL USING (public.is_admin(auth.uid()));

-- ---- user_plans ----
DROP POLICY IF EXISTS "Users view own plans"      ON user_plans;
DROP POLICY IF EXISTS "Users create plans"        ON user_plans;
DROP POLICY IF EXISTS "Admins view all user plans" ON user_plans;
DROP POLICY IF EXISTS "Admins update user plans"  ON user_plans;

CREATE POLICY "Users view own plans"
  ON user_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create plans"
  ON user_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all user plans"
  ON user_plans FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins update user plans"
  ON user_plans FOR UPDATE USING (public.is_admin(auth.uid()));

-- ---- mining_sessions ----
DROP POLICY IF EXISTS "Users view own sessions"    ON mining_sessions;
DROP POLICY IF EXISTS "Users insert own sessions"  ON mining_sessions;
DROP POLICY IF EXISTS "Users update own sessions"  ON mining_sessions;
DROP POLICY IF EXISTS "Admins view all sessions"   ON mining_sessions;

CREATE POLICY "Users view own sessions"
  ON mining_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own sessions"
  ON mining_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own sessions"
  ON mining_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins view all sessions"
  ON mining_sessions FOR SELECT USING (public.is_admin(auth.uid()));

-- ---- deposits ----
DROP POLICY IF EXISTS "Users view own deposits"   ON deposits;
DROP POLICY IF EXISTS "Users create deposits"     ON deposits;
DROP POLICY IF EXISTS "Admins view all deposits"  ON deposits;
DROP POLICY IF EXISTS "Admins update deposits"    ON deposits;

CREATE POLICY "Users view own deposits"
  ON deposits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create deposits"
  ON deposits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all deposits"
  ON deposits FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins update deposits"
  ON deposits FOR UPDATE USING (public.is_admin(auth.uid()));

-- ---- withdrawals ----
DROP POLICY IF EXISTS "Users view own withdrawals"  ON withdrawals;
DROP POLICY IF EXISTS "Users create withdrawals"    ON withdrawals;
DROP POLICY IF EXISTS "Admins view all withdrawals" ON withdrawals;
DROP POLICY IF EXISTS "Admins update withdrawals"   ON withdrawals;

CREATE POLICY "Users view own withdrawals"
  ON withdrawals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create withdrawals"
  ON withdrawals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all withdrawals"
  ON withdrawals FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins update withdrawals"
  ON withdrawals FOR UPDATE USING (public.is_admin(auth.uid()));

-- ---- deposit_addresses (public read for active, admin full) ----
DROP POLICY IF EXISTS "Public view active addresses" ON deposit_addresses;
DROP POLICY IF EXISTS "Admins manage addresses"      ON deposit_addresses;

CREATE POLICY "Public view active addresses"
  ON deposit_addresses FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins manage addresses"
  ON deposit_addresses FOR ALL USING (public.is_admin(auth.uid()));

-- ---- user_wallets ----
DROP POLICY IF EXISTS "Users manage own wallets"  ON user_wallets;
DROP POLICY IF EXISTS "Admins view all wallets"   ON user_wallets;

CREATE POLICY "Users manage own wallets"
  ON user_wallets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins view all wallets"
  ON user_wallets FOR SELECT USING (public.is_admin(auth.uid()));

-- ---- referrals ----
DROP POLICY IF EXISTS "Users view own referrals"  ON referrals;
DROP POLICY IF EXISTS "Users create referrals"    ON referrals;
DROP POLICY IF EXISTS "Admins view all referrals" ON referrals;

CREATE POLICY "Users view own referrals"
  ON referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);
CREATE POLICY "Users create referrals"
  ON referrals FOR INSERT WITH CHECK (auth.uid() = referred_id);
CREATE POLICY "Admins view all referrals"
  ON referrals FOR SELECT USING (public.is_admin(auth.uid()));

-- ---- referral_commissions ----
DROP POLICY IF EXISTS "Users view own commissions"  ON referral_commissions;
DROP POLICY IF EXISTS "Admins view all commissions" ON referral_commissions;
DROP POLICY IF EXISTS "Admins update commissions"   ON referral_commissions;

CREATE POLICY "Users view own commissions"
  ON referral_commissions FOR SELECT USING (auth.uid() = referrer_id);
CREATE POLICY "Admins view all commissions"
  ON referral_commissions FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins update commissions"
  ON referral_commissions FOR UPDATE USING (public.is_admin(auth.uid()));

-- ---- support_tickets ----
DROP POLICY IF EXISTS "Users view own tickets"    ON support_tickets;
DROP POLICY IF EXISTS "Users create tickets"      ON support_tickets;
DROP POLICY IF EXISTS "Users update own tickets"  ON support_tickets;
DROP POLICY IF EXISTS "Admins view all tickets"   ON support_tickets;
DROP POLICY IF EXISTS "Admins update all tickets" ON support_tickets;

CREATE POLICY "Users view own tickets"
  ON support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create tickets"
  ON support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own tickets"
  ON support_tickets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins view all tickets"
  ON support_tickets FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins update all tickets"
  ON support_tickets FOR UPDATE USING (public.is_admin(auth.uid()));

-- ============================================================
-- SEED DATA — Deposit Addresses
--   Replace with your real wallet addresses before going live.
-- ============================================================
INSERT INTO deposit_addresses (gateway, address, is_active, min_amount, max_amount) VALUES
  ('btc',         '163JAZy3CEz8YoNGDDtu9KxpXgnm5Kn9Rs',           TRUE, NULL,  NULL),
  ('usdt-trc20',  'THaAnBqAvQ3YY751nXqNDzCoczYVQtBKnP',           TRUE, NULL,  NULL),
  ('usdt-erc20',  '0x8c0fd3fdc6f56e658fb1bffa8f5ddd65388ba690',   TRUE, NULL,  NULL),
  ('usdc',        '0x8c0fd3fdc6f56e658fb1bffa8f5ddd65388ba690',   TRUE, NULL,  NULL),
  ('eth',         '0x8c0fd3fdc6f56e658fb1bffa8f5ddd65388ba690',   TRUE, NULL,  NULL),
  ('solana',      'D26bc2Rh5Ebz5vMxb8dkHKMLJB6YRy4GGapKJWiiqgwc', TRUE, 70,   500000),
  ('coinbase',    'demo-coinbase-address-123456789',               TRUE, 10,   100000),
  ('paypal',      'demo-paypal-address-123456789',                 TRUE, 50,    50000),
  ('stripe',      'demo-stripe-address-123456789',                 TRUE, 10,   100000)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED DATA — BTC Mining Plans
-- ============================================================
INSERT INTO mining_plans (name, currency, price, duration, hardware, total_mining_btc, total_mining_usd, available, sold, is_active) VALUES
  ('PROMOTIONS',   'BTC',  50,     1,   'Antminer S19', 0.00190,  225.00, 4000, 652,  TRUE),
  ('NEW BEGINNER', 'BTC',  70,     1,   'Antminer S19', 0.001347, 350.00, 4000, 652,  TRUE),
  ('BASIC',        'BTC',  200,    1,   'Antminer S19', 0.008938, 650.30, 4000, 452,  TRUE),
  ('ECONOMY',      'BTC',  400,    2,   'Antminer S19', 0.030351, 1200.00,3000, 2154, TRUE),
  ('STANDART',     'BTC',  2400,   365, 'Antminer S19', NULL,     NULL,   2000, 1096, TRUE),
  ('SENIOR',       'BTC',  6500,   365, 'Antminer S19', NULL,     NULL,   1000, 800,  TRUE),
  ('ADVANCED',     'BTC',  12600,  365, 'Antminer S19', NULL,     NULL,   800,  461,  TRUE),
  ('LUXURIOUS',    'BTC',  32000,  365, 'Antminer S19', NULL,     NULL,   300,  177,  TRUE),
  ('VIP 1',        'BTC',  72000,  365, 'Antminer S19', NULL,     NULL,   300,  174,  TRUE),
  ('VIP 3',        'BTC', 169800,  365, 'Antminer S19', NULL,     NULL,   300,  278,  TRUE)
ON CONFLICT DO NOTHING;

UPDATE mining_plans SET daily_mining_btc=0.009335, daily_mining_usd=1018.75,  monthly_mining_btc=0.280075,   monthly_mining_usd=30562.5,    referral_rewards=240    WHERE name='STANDART'  AND currency='BTC';
UPDATE mining_plans SET daily_mining_btc=0.03913,  daily_mining_usd=4270,     monthly_mining_btc=1.1739075,  monthly_mining_usd=128100,     referral_rewards=650    WHERE name='SENIOR'    AND currency='BTC';
UPDATE mining_plans SET daily_mining_btc=0.042764, daily_mining_usd=4666.50,  monthly_mining_btc=1.282913,   monthly_mining_usd=139995.00,  referral_rewards=1260   WHERE name='ADVANCED'  AND currency='BTC';
UPDATE mining_plans SET daily_mining_btc=0.119498, daily_mining_usd=13040.00, monthly_mining_btc=3.584953,   monthly_mining_usd=391200.00,  referral_rewards=3200   WHERE name='LUXURIOUS' AND currency='BTC';
UPDATE mining_plans SET daily_mining_btc=0.445645, daily_mining_usd=48630.00, monthly_mining_btc=13.3693,    monthly_mining_usd=1458900.00, referral_rewards=7200   WHERE name='VIP 1'     AND currency='BTC';
UPDATE mining_plans SET daily_mining_btc=0.995393, daily_mining_usd=108620.00,monthly_mining_btc=29.8618,    monthly_mining_usd=3258600.00, referral_rewards=16980  WHERE name='VIP 3'     AND currency='BTC';
UPDATE mining_plans SET referral_rewards=72.8 WHERE name='ECONOMY' AND currency='BTC';

-- ============================================================
-- SEED DATA — LTC Mining Plans
-- ============================================================
INSERT INTO mining_plans (name, currency, price, duration, hardware, daily_mining_ltc, daily_mining_usd, monthly_mining_ltc, monthly_mining_usd, available, sold, is_active) VALUES
  ('Activity Award', 'LTC', 200,   365, 'Antminer L3+', 0.076033,  6.70,    2.280997,   201.00,   5000, 1977, TRUE),
  ('BASIC',          'LTC', 1000,  365, 'Antminer L3+', 0.465278,  41.00,   13.958343,  1230.00,  3000, 2817, TRUE),
  ('STANDART',       'LTC', 3000,  365, 'Antminer L3+', 2.360435,  208.00,  70.813056,  6240.00,  1000, 971,  TRUE),
  ('LUXURIOUS',      'LTC', 15000, 365, 'Antminer L3+', 18.384159, 1620.00, 551.524765, 48600.00, 500,  470,  TRUE)
ON CONFLICT DO NOTHING;

-- ============================================================
-- POST-SETUP CHECKLIST
-- ============================================================
-- 1. Replace 'your-admin@email.com' in handle_new_user() above
--    with the real admin email, then re-run only that function block.
--
-- 2. Manually grant admin to an existing user if needed:
--    UPDATE profiles SET role = 'admin' WHERE email = 'your-admin@email.com';
--
-- 3. Replace the placeholder deposit addresses with real wallet addresses
--    in the deposit_addresses seed block above.
--
-- 4. The Supabase anon key is already set in src/lib/supabase.ts:
--    URL:  https://rucaagoiuvlfcsjwfrqv.supabase.co
--    Key:  sb_publishable_o803MNuoFjzB5vQZ7NiUxQ_S9nJ5Tfr
-- ============================================================
