-- Career opportunities table
create table if not exists public.career_opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  google_form_url text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Update timestamp trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists career_opportunities_set_updated_at on public.career_opportunities;
create trigger career_opportunities_set_updated_at
before update on public.career_opportunities
for each row execute function public.set_updated_at();

-- Enable RLS
alter table public.career_opportunities enable row level security;

-- Allow anonymous read of active opportunities only
drop policy if exists "Allow anon read active careers" on public.career_opportunities;
create policy if not exists "Allow anon read active careers" on public.career_opportunities
for select to anon using (is_active = true);

-- Allow service role full access (API uses service key)
drop policy if exists "Service role full access careers" on public.career_opportunities;
create policy if not exists "Service role full access careers" on public.career_opportunities
for all to service_role using (true) with check (true);

-- Optional: allow anon to manage via server-guarded endpoints if service key is not available in local dev
-- Remove these three policies in production if not needed
create policy if not exists "Anon insert careers (server-guarded)" on public.career_opportunities
for insert to anon with check (true);
create policy if not exists "Anon update careers (server-guarded)" on public.career_opportunities
for update to anon using (true) with check (true);
create policy if not exists "Anon delete careers (server-guarded)" on public.career_opportunities
for delete to anon using (true);

-- Explicit grants (avoid privilege errors)
grant usage on schema public to anon, authenticated, service_role;
grant select on table public.career_opportunities to anon, authenticated;
grant all on table public.career_opportunities to service_role;
