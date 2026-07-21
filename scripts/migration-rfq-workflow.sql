-- Run once in the Supabase SQL Editor. Safe to repeat.

ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS reply TEXT;
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS assigned_to VARCHAR(100);
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

CREATE INDEX IF NOT EXISTS inquiries_type_status_idx
  ON public.inquiries (inquiry_type, status);
CREATE INDEX IF NOT EXISTS inquiries_assigned_to_idx
  ON public.inquiries (assigned_to);

SELECT
  to_regclass('public.inquiries') AS inquiries_table,
  (SELECT COUNT(*) FROM public.inquiries WHERE inquiry_type = 'rfq') AS rfq_count;
