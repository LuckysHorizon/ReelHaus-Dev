-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  auth_uid uuid, -- link to auth.users if used
  name text,
  email text,
  phone text,
  role text default 'student',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create events table
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  cover_image_url text,
  start_datetime timestamptz,
  end_datetime timestamptz,
  seats_total int default 0,
  seats_available int default 0,
  price_cents int default 0,
  currency text default 'INR',
  template_id uuid,
  is_active boolean default true,
  created_by uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create registration status enum
create type registration_status as enum ('pending','payment_initiated','paid','failed','refunded');

-- Create registrations table
create table if not exists public.registrations (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade,
  user_id uuid,
  name text,
  email text,
  phone text,
  roll_no text,
  tickets int default 1,
  ticket_details jsonb, -- array of per-ticket names/rolls/emails
  status registration_status default 'pending',
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create payment status enum
create type payment_status as enum ('initiated','succeeded','failed','refunded');

-- Create payments table
create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  registration_id uuid references public.registrations(id) on delete cascade,
  provider text,
  provider_order_id text,
  provider_payment_id text,
  amount_cents int,
  currency text,
  status payment_status default 'initiated',
  raw_event jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create exports table
create table if not exists public.exports (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id),
  file_url text,
  generated_at timestamptz default now(),
  generated_by uuid
);

-- Create audit_log table for admin actions
create table if not exists public.audit_log (
  id uuid primary key default uuid_generate_v4(),
  admin_id uuid,
  action text not null,
  resource_type text,
  resource_id uuid,
  details jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz default now()
);

-- Create indexes for better performance
create index if not exists idx_events_is_active on public.events(is_active);
create index if not exists idx_events_start_datetime on public.events(start_datetime);
create index if not exists idx_registrations_event_id on public.registrations(event_id);
create index if not exists idx_registrations_status on public.registrations(status);
create index if not exists idx_payments_registration_id on public.payments(registration_id);
create index if not exists idx_payments_provider_payment_id on public.payments(provider_payment_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.registrations enable row level security;
alter table public.payments enable row level security;
alter table public.exports enable row level security;
alter table public.audit_log enable row level security;

-- Events policies
create policy "Public can view active events" on public.events
  for select using (is_active = true);

create policy "Admins can manage events" on public.events
  for all using (auth.role() = 'service_role');

-- Registrations policies
create policy "Users can view their own registrations" on public.registrations
  for select using (auth.uid()::text = user_id);

create policy "Admins can manage registrations" on public.registrations
  for all using (auth.role() = 'service_role');

-- Payments policies
create policy "Admins can manage payments" on public.payments
  for all using (auth.role() = 'service_role');

-- Exports policies
create policy "Admins can manage exports" on public.exports
  for all using (auth.role() = 'service_role');

-- Audit log policies
create policy "Admins can manage audit log" on public.audit_log
  for all using (auth.role() = 'service_role');

-- Profiles policies
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid()::text = auth_uid);

create policy "Admins can manage profiles" on public.profiles
  for all using (auth.role() = 'service_role');

-- Functions for updated_at timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.events
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.registrations
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.payments
  for each row execute procedure public.handle_updated_at();

-- Function to atomically decrement seats
create or replace function public.decrement_event_seats(event_uuid uuid, seats_to_decrement int)
returns boolean as $$
begin
  update public.events 
  set seats_available = seats_available - seats_to_decrement,
      updated_at = now()
  where id = event_uuid 
    and seats_available >= seats_to_decrement
    and is_active = true;
  
  return found;
end;
$$ language plpgsql;

-- Function to increment seats (for refunds)
create or replace function public.increment_event_seats(event_uuid uuid, seats_to_increment int)
returns boolean as $$
begin
  update public.events 
  set seats_available = seats_available + seats_to_increment,
      updated_at = now()
  where id = event_uuid;
  
  return found;
end;
$$ language plpgsql;
