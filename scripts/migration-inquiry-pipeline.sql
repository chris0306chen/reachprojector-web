-- Prerequisite: public.inquiries exists (run migration-rfq-workflow.sql first).
-- Additive and repeatable; existing notes, owner strings and statuses are preserved.
BEGIN;
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS assigned_to varchar(100);
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS reply text;
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS channel varchar(30) NOT NULL DEFAULT 'website';
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS next_follow_up_at timestamptz;
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS workflow_version integer NOT NULL DEFAULT 0;
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
CREATE INDEX IF NOT EXISTS inquiries_assigned_to_idx ON public.inquiries (assigned_to);
CREATE INDEX IF NOT EXISTS inquiries_follow_up_idx ON public.inquiries (assigned_to, next_follow_up_at);

-- All website submissions/admin access use server-side service_role. Prevent
-- bypassing application ownership checks with an exposed Supabase browser key.
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.inquiries FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.inquiries TO service_role;
COMMIT;

-- Inspect legacy owner strings before manually assigning active staff accounts.
SELECT id, assigned_to FROM public.inquiries
WHERE nullif(btrim(assigned_to), '') IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM public.users WHERE users.id::text = inquiries.assigned_to);
