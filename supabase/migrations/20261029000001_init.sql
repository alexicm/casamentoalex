create extension if not exists "pgcrypto";

create schema if not exists private;

create type public.group_owner as enum ('Alex', 'Paloma');

create type public.official_status as enum (
  'awaiting_response',
  'manually_confirmed',
  'confirmed_via_token',
  'declined',
  'duplicate_flagged'
);

create type public.confirmation_source as enum (
  'import',
  'manual',
  'personal_link',
  'public_form'
);

create type public.matching_state as enum (
  'unmatched',
  'suggested',
  'linked',
  'ambiguous'
);

create type public.review_status as enum (
  'pending_review',
  'linked',
  'discarded',
  'duplicate_flagged'
);

create type public.actor_type as enum ('guest', 'admin', 'system');

create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  couple_names text not null,
  event_date date not null,
  starts_at_local time not null,
  timezone text not null default 'America/Sao_Paulo',
  venue_name text not null,
  venue_address text not null,
  maps_url text not null,
  dress_code_json jsonb not null default '{}'::jsonb,
  rsvp_deadline timestamptz,
  public_enabled boolean not null default true,
  calendar_duration_hours integer not null default 6,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.guests (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  group_owner public.group_owner not null,
  display_name text not null,
  normalized_name text not null,
  seed_key text,
  official_status public.official_status not null default 'awaiting_response',
  confirmation_source public.confirmation_source not null default 'manual',
  invite_token_hash text,
  token_issued_at timestamptz,
  preferred_contact text,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create unique index guests_seed_key_unique
  on public.guests (event_id, seed_key)
  where seed_key is not null and deleted_at is null;

create index guests_event_status_idx
  on public.guests (event_id, official_status)
  where deleted_at is null;

create index guests_normalized_name_idx
  on public.guests (event_id, normalized_name)
  where deleted_at is null;

create table public.rsvp_submissions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  guest_id uuid references public.guests(id) on delete set null,
  submitted_full_name text not null,
  normalized_submitted_name text not null,
  attendance_choice boolean not null,
  optional_contact text,
  matching_state public.matching_state not null default 'unmatched',
  review_status public.review_status not null default 'pending_review',
  submitted_at timestamptz not null default timezone('utc', now()),
  reviewed_at timestamptz,
  reviewer_id uuid,
  request_fingerprint_hash text,
  consent_version text not null,
  deduplication_key text,
  suggested_guest_ids uuid[] not null default '{}'::uuid[]
);

create index rsvp_submissions_review_idx
  on public.rsvp_submissions (event_id, review_status, submitted_at desc);

create index rsvp_submissions_name_idx
  on public.rsvp_submissions (event_id, normalized_submitted_name);

create table public.rsvp_audit_log (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid references public.guests(id) on delete set null,
  submission_id uuid references public.rsvp_submissions(id) on delete set null,
  actor_type public.actor_type not null,
  actor_id uuid,
  action text not null,
  before_json jsonb,
  after_json jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index rsvp_audit_log_created_idx
  on public.rsvp_audit_log (created_at desc);

create table public.admin_profiles (
  user_id uuid primary key,
  role text not null check (role = 'admin'),
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger events_touch_updated_at
  before update on public.events
  for each row execute function public.touch_updated_at();

create trigger guests_touch_updated_at
  before update on public.guests
  for each row execute function public.touch_updated_at();

alter table public.events enable row level security;
alter table public.guests enable row level security;
alter table public.rsvp_submissions enable row level security;
alter table public.rsvp_audit_log enable row level security;
alter table public.admin_profiles enable row level security;

create policy "public can read enabled events"
  on public.events
  for select
  to anon, authenticated
  using (public_enabled = true);

create policy "admins manage events"
  on public.events
  for all
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

create policy "admins read guests"
  on public.guests
  for select
  to authenticated
  using (private.is_admin());

create policy "admins write guests"
  on public.guests
  for all
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

create policy "admins read submissions"
  on public.rsvp_submissions
  for select
  to authenticated
  using (private.is_admin());

create policy "admins write submissions"
  on public.rsvp_submissions
  for all
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

create policy "admins read audit"
  on public.rsvp_audit_log
  for select
  to authenticated
  using (private.is_admin());

create policy "admins read profiles"
  on public.admin_profiles
  for select
  to authenticated
  using (private.is_admin());

revoke all on public.guests from anon;
revoke all on public.rsvp_submissions from anon;
revoke all on public.rsvp_audit_log from anon;
revoke all on public.admin_profiles from anon;

insert into public.events (
  slug,
  couple_names,
  event_date,
  starts_at_local,
  timezone,
  venue_name,
  venue_address,
  maps_url,
  dress_code_json,
  public_enabled,
  calendar_duration_hours
) values (
  'alex-paloma-2026',
  'Alex & Paloma',
  '2026-12-20',
  '17:00',
  'America/Sao_Paulo',
  'BuGú Delícias',
  'Setor J Norte, QNJ 32, Lote 38, Taguatinga, Brasília, DF, CEP 72140-300',
  'https://www.google.com/maps/search/?api=1&query=BuG%C3%BA%20Del%C3%ADcias%20St.%20J%20Norte%20QNJ%2032%20Lote%2038%20Taguatinga%20Bras%C3%ADlia',
  '{"title":"Coquetel elegante","subtitle":"Um visual bonito, leve e confortável para celebrar com a gente.","palette":["oliva","sálvia","terracota","rosé","vinho","tons terrosos"]}'::jsonb,
  true,
  6
) on conflict (slug) do nothing;
