-- ══════════════════════════════════════
--  Set minimum plan price to $100
--  Run in Supabase SQL Editor
-- ══════════════════════════════════════

-- Update plans under $100 to $100
UPDATE mining_plans SET price = 100 WHERE price < 100;

-- Optionally rename the cheap plans to reflect the new price
UPDATE mining_plans SET name = 'STARTER' WHERE name = 'PROMOTIONS' AND currency = 'BTC';
UPDATE mining_plans SET name = 'BEGINNER' WHERE name = 'NEW BEGINNER' AND currency = 'BTC';
