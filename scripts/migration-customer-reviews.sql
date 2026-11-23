-- Customer review system (Phase 1)
-- Safety: review-only schema. This migration does not alter orders, payments,
-- shipping, products, prices, or existing Alibaba feedback presentation.
-- Execute only after review in a non-production Supabase environment.

create extension if not exists pgcrypto;

create table if not exists public.review_transactions (
  id uuid primary key default gen_random_uuid(),
  product_id varchar(36) references public.products(id) on delete set null,
  order_id varchar(36) references public.orders(id) on delete set null,
  source_channel text not null check (source_channel in ('website', 'Alibaba', 'WhatsApp', 'manual')),
  sale_channel text not null check (sale_channel in ('website', 'Alibaba', 'WhatsApp', 'manual')),
  external_reference text,
  customer_email text,
  customer_email_hash text,
  customer_name text,
  country text,
  quantity integer check (quantity is null or quantity > 0),
  transaction_date date,
  verified_at timestamptz,
  verified_by varchar(36) references public.users(id) on delete set null,
  verification_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint review_transactions_order_or_external_reference check (order_id is not null or external_reference is not null)
);

create table if not exists public.review_invitations (
  id uuid primary key default gen_random_uuid(),
  review_transaction_id uuid not null references public.review_transactions(id) on delete cascade,
  token_hash text not null unique,
  recipient_email text,
  expires_at timestamptz not null,
  used_at timestamptz,
  revoked_at timestamptz,
  status text not null default 'pending' check (status in ('pending', 'used', 'expired', 'revoked')),
  created_by varchar(36) references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  review_transaction_id uuid references public.review_transactions(id) on delete set null,
  product_id varchar(36) references public.products(id) on delete set null,
  review_type text not null check (review_type in ('product', 'company')),
  source_channel text not null check (source_channel in ('website', 'Alibaba', 'WhatsApp', 'manual')),
  verification_status text not null default 'unverified' check (verification_status in ('unverified', 'verified', 'rejected')),
  moderation_status text not null default 'pending' check (moderation_status in ('pending', 'approved', 'rejected', 'hidden')),
  product_rating integer check (product_rating is null or product_rating between 1 and 5),
  service_rating integer check (service_rating is null or service_rating between 1 and 5),
  title varchar(160) not null,
  body text not null,
  display_name varchar(120) not null,
  country varchar(100) not null,
  company_name varchar(200),
  allow_public_name boolean not null default false,
  allow_public_company boolean not null default false,
  allow_public_image boolean not null default false,
  locale varchar(10) not null default 'en',
  submitted_at timestamptz not null default now(),
  moderated_at timestamptz,
  moderated_by varchar(36) references public.users(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reviews_product_required_for_product_type check (review_type <> 'product' or product_id is not null),
  constraint reviews_product_rating_required check (review_type <> 'product' or product_rating is not null),
  constraint reviews_company_rating_required check (review_type <> 'company' or service_rating is not null)
);

create table if not exists public.review_media (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews(id) on delete cascade,
  storage_path text not null,
  alt_text varchar(255),
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.review_responses (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews(id) on delete cascade,
  responder_user_id varchar(36) references public.users(id) on delete set null,
  body text not null,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists review_transactions_order_id_unique
  on public.review_transactions(order_id) where order_id is not null;
create unique index if not exists review_transactions_external_reference_unique
  on public.review_transactions(external_reference) where external_reference is not null;
create unique index if not exists reviews_transaction_type_unique
  on public.reviews(review_transaction_id, review_type) where review_transaction_id is not null;
create index if not exists review_transactions_product_idx on public.review_transactions(product_id);
create index if not exists review_transactions_source_idx on public.review_transactions(source_channel, sale_channel);
create index if not exists review_transactions_verified_idx on public.review_transactions(verified_at);
create index if not exists review_invitations_transaction_idx on public.review_invitations(review_transaction_id);
create index if not exists review_invitations_expiry_idx on public.review_invitations(expires_at, status);
create index if not exists reviews_product_status_idx on public.reviews(product_id, moderation_status);
create index if not exists reviews_type_status_idx on public.reviews(review_type, moderation_status);
create index if not exists reviews_submitted_idx on public.reviews(submitted_at desc);
create index if not exists review_media_review_idx on public.review_media(review_id, is_public);
create index if not exists review_responses_review_idx on public.review_responses(review_id, is_public);

alter table public.review_transactions enable row level security;
alter table public.review_invitations enable row level security;
alter table public.reviews enable row level security;
alter table public.review_media enable row level security;
alter table public.review_responses enable row level security;

revoke all on public.review_transactions from anon, authenticated;
revoke all on public.review_invitations from anon, authenticated;
revoke all on public.review_responses from anon, authenticated;
revoke all on public.reviews from anon, authenticated;
revoke all on public.review_media from anon, authenticated;

grant select on public.reviews to anon, authenticated;
grant select on public.review_media to anon, authenticated;
grant select on public.review_responses to anon, authenticated;

drop policy if exists reviews_public_approved_select on public.reviews;
create policy reviews_public_approved_select on public.reviews
  for select to anon, authenticated
  using (moderation_status = 'approved');

drop policy if exists review_media_public_select on public.review_media;
create policy review_media_public_select on public.review_media
  for select to anon, authenticated
  using (
    is_public = true
    and exists (
      select 1 from public.reviews r
      where r.id = review_media.review_id and r.moderation_status = 'approved'
    )
  );

drop policy if exists review_responses_public_select on public.review_responses;
create policy review_responses_public_select on public.review_responses
  for select to anon, authenticated
  using (
    is_public = true
    and exists (
      select 1 from public.reviews r
      where r.id = review_responses.review_id and r.moderation_status = 'approved'
    )
  );

comment on table public.review_transactions is 'Verified or manually recorded customer transaction evidence for review invitations.';
comment on table public.review_invitations is 'One-time hashed invitation tokens; raw tokens must never be stored.';
comment on table public.reviews is 'Customer-submitted product or company reviews awaiting moderation.';
comment on table public.review_media is 'Optional customer media with separate public-image consent.';
comment on table public.review_responses is 'Business responses to moderated customer reviews.';
