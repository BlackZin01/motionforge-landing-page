-- ─────────────────────────────────────────────
--  LovPilot — Supabase Database Setup
--  Execute este SQL no SQL Editor do seu projeto
--  Supabase: https://supabase.com/dashboard
-- ─────────────────────────────────────────────

-- Licenses table
CREATE TABLE IF NOT EXISTS licenses (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  key         TEXT        UNIQUE NOT NULL,
  active      BOOLEAN     DEFAULT true,
  expires_at  TIMESTAMPTZ,
  max_devices INTEGER     DEFAULT 1,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- License devices table
CREATE TABLE IF NOT EXISTS license_devices (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  license_id  UUID        NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
  device_id   TEXT        NOT NULL,
  last_seen   TIMESTAMPTZ DEFAULT NOW(),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(license_id, device_id)
);

-- ── Row Level Security ────────────────────────

ALTER TABLE licenses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE license_devices ENABLE ROW LEVEL SECURITY;

-- Licenses: anyone can read (needed for validation)
CREATE POLICY "anon_read_licenses"
  ON licenses FOR SELECT USING (true);

-- Devices: anyone can insert/update/select/delete
-- (the anon key is embedded in the extension — keep it read-only for licenses)
CREATE POLICY "anon_insert_devices"
  ON license_devices FOR INSERT WITH CHECK (true);

CREATE POLICY "anon_update_devices"
  ON license_devices FOR UPDATE USING (true);

CREATE POLICY "anon_select_devices"
  ON license_devices FOR SELECT USING (true);

CREATE POLICY "anon_delete_devices"
  ON license_devices FOR DELETE USING (true);

-- ── Sample licenses ───────────────────────────

-- Licença de teste (3 dispositivos, sem expiração)
INSERT INTO licenses (key, active, max_devices)
VALUES ('LP-TEST-0000-0000', true, 3)
ON CONFLICT (key) DO NOTHING;

-- Licença com expiração (exemplo)
-- INSERT INTO licenses (key, active, max_devices, expires_at)
-- VALUES ('LP-PROD-XXXX-XXXX', true, 1, '2025-12-31T23:59:59Z')
-- ON CONFLICT (key) DO NOTHING;
