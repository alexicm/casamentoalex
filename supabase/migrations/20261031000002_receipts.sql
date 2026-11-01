alter table public.rsvp_submissions
  add column if not exists receipt_token_hash text,
  add column if not exists idempotency_key text;

create unique index if not exists rsvp_submissions_idempotency_idx
  on public.rsvp_submissions (event_id, idempotency_key)
  where idempotency_key is not null;

create index if not exists rsvp_submissions_receipt_idx
  on public.rsvp_submissions (receipt_token_hash)
  where receipt_token_hash is not null;
