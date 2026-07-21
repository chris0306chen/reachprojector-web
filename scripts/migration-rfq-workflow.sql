-- REACH PROJECTOR inquiries/RFQ workflow migration
-- Safe to run repeatedly in the Supabase SQL Editor.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(200),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  product_id UUID,
  inquiry_type VARCHAR(20) NOT NULL DEFAULT 'general',
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  reply TEXT,
  assigned_to VARCHAR(100),
  channel VARCHAR(30) NOT NULL DEFAULT 'website',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Upgrade an older inquiries table without deleting existing records.
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS company VARCHAR(200);
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS subject VARCHAR(255);
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS product_id UUID;
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS inquiry_type VARCHAR(20) NOT NULL DEFAULT 'general';
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'pending';
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS reply TEXT;
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS assigned_to VARCHAR(100);
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS channel VARCHAR(30) NOT NULL DEFAULT 'website';
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS inquiries_email_idx ON public.inquiries (email);
CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON public.inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS inquiries_type_status_idx ON public.inquiries (inquiry_type, status);
CREATE INDEX IF NOT EXISTS inquiries_assigned_to_idx ON public.inquiries (assigned_to);

SELECT
  to_regclass('public.inquiries') AS inquiries_table,
  (SELECT COUNT(*) FROM public.inquiries WHERE inquiry_type = 'rfq') AS rfq_count;
