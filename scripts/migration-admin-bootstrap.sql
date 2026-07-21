-- REACH PROJECTOR admin bootstrap
-- 1. Replace the two CHANGE_ME values below.
-- 2. Run once in the Supabase SQL Editor.
-- 3. Keep the password out of Git and change it after the first login.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'staff',
  permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS users_role_idx ON public.users (role);

DO $$
DECLARE
  admin_email TEXT := 'CHANGE_ME_EMAIL';
  admin_password TEXT := 'CHANGE_ME_PASSWORD';
BEGIN
  IF admin_email = 'CHANGE_ME_EMAIL' OR admin_password = 'CHANGE_ME_PASSWORD' THEN
    RAISE EXCEPTION 'Replace CHANGE_ME_EMAIL and CHANGE_ME_PASSWORD before running this script';
  END IF;
  IF length(admin_password) < 12 THEN
    RAISE EXCEPTION 'Admin password must contain at least 12 characters';
  END IF;

  INSERT INTO public.users (
    email, password_hash, name, role, permissions, is_active, updated_at
  ) VALUES (
    lower(trim(admin_email)),
    crypt(admin_password, gen_salt('bf', 12)),
    'Administrator',
    'admin',
    '["all"]'::jsonb,
    true,
    now()
  )
  ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    role = 'admin',
    permissions = '["all"]'::jsonb,
    is_active = true,
    updated_at = now();
END $$;

SELECT email, role, is_active, created_at
FROM public.users
WHERE role = 'admin';
