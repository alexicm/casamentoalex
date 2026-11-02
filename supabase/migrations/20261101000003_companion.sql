alter table public.guests
  add column if not exists bringing_companion boolean not null default false,
  add column if not exists companion_name text,
  add column if not exists companion_is_child boolean not null default false;

alter table public.rsvp_submissions
  add column if not exists bringing_companion boolean not null default false,
  add column if not exists companion_name text,
  add column if not exists companion_is_child boolean not null default false;

create unique index if not exists rsvp_submissions_guest_unique
  on public.rsvp_submissions (event_id, guest_id)
  where guest_id is not null;
