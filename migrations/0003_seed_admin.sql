-- ===========================================
-- SEED ADMIN USER
-- Migration: 0003_seed_admin.sql
-- ===========================================
-- Password: Westeros2018 (SHA-256 hashed)

INSERT OR REPLACE INTO admin_users (id, username, password_hash)
VALUES (
  'admin-001',
  'marcofco',
  '81e774ca967b89081a4c3282896f0b7fa14dcc75e0a7876390865cf41a3de1df'
);

-- Note: The hash above is for 'Westeros2018' password
-- To generate a new hash, use:
-- echo -n "yourpassword" | sha256sum
