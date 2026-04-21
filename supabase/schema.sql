-- Maywood: run sections in Supabase SQL Editor.
-- 1) Tables  2) RLS policies  3) Create Storage bucket "portfolio-images" (public) in Dashboard.

-- --- Tables ---
create table if not exists quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  phone text,
  email text,
  property_type text,
  scope text[],
  area text,
  area_unit text,
  location text,
  estimate_low numeric,
  estimate_high numeric,
  source text default 'instant-quote',
  contacted boolean not null default false
);

create table if not exists consultation_bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  phone text,
  email text,
  preferred_date text,
  time_slot text,
  preferred_center text,
  project_note text,
  status text not null default 'pending',
  source text,
  contacted boolean not null default false
);

create table if not exists calculator_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  phone text,
  email text,
  source text,
  contacted boolean not null default false
);

create table if not exists partner_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  company text,
  partner_type text,
  phone text,
  email text,
  city text,
  about text,
  status text not null default 'new',
  contacted boolean not null default false
);

create table if not exists portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  category text,
  location text,
  year integer,
  featured boolean not null default false,
  image_url text,
  storage_path text
);

-- Add missing columns if you created tables earlier without them:
alter table consultation_bookings add column if not exists contacted boolean not null default false;
alter table calculator_leads add column if not exists contacted boolean not null default false;
alter table partner_applications add column if not exists contacted boolean not null default false;

-- --- RLS ---
alter table quote_requests enable row level security;
alter table consultation_bookings enable row level security;
alter table calculator_leads enable row level security;
alter table partner_applications enable row level security;
alter table portfolio_projects enable row level security;

-- quote_requests
drop policy if exists "Allow public insert" on quote_requests;
drop policy if exists "Allow public read" on quote_requests;
drop policy if exists "Allow public update" on quote_requests;
drop policy if exists "Allow public delete" on quote_requests;
create policy "Allow public insert" on quote_requests for insert to anon with check (true);
create policy "Allow public read" on quote_requests for select to anon using (true);
create policy "Allow public update" on quote_requests for update to anon using (true);
create policy "Allow public delete" on quote_requests for delete to anon using (true);

-- consultation_bookings
drop policy if exists "Allow public insert" on consultation_bookings;
drop policy if exists "Allow public read" on consultation_bookings;
drop policy if exists "Allow public update" on consultation_bookings;
drop policy if exists "Allow public delete" on consultation_bookings;
create policy "Allow public insert" on consultation_bookings for insert to anon with check (true);
create policy "Allow public read" on consultation_bookings for select to anon using (true);
create policy "Allow public update" on consultation_bookings for update to anon using (true);
create policy "Allow public delete" on consultation_bookings for delete to anon using (true);

-- calculator_leads
drop policy if exists "Allow public insert" on calculator_leads;
drop policy if exists "Allow public read" on calculator_leads;
drop policy if exists "Allow public update" on calculator_leads;
drop policy if exists "Allow public delete" on calculator_leads;
create policy "Allow public insert" on calculator_leads for insert to anon with check (true);
create policy "Allow public read" on calculator_leads for select to anon using (true);
create policy "Allow public update" on calculator_leads for update to anon using (true);
create policy "Allow public delete" on calculator_leads for delete to anon using (true);

-- partner_applications
drop policy if exists "Allow public insert" on partner_applications;
drop policy if exists "Allow public read" on partner_applications;
drop policy if exists "Allow public update" on partner_applications;
drop policy if exists "Allow public delete" on partner_applications;
create policy "Allow public insert" on partner_applications for insert to anon with check (true);
create policy "Allow public read" on partner_applications for select to anon using (true);
create policy "Allow public update" on partner_applications for update to anon using (true);
create policy "Allow public delete" on partner_applications for delete to anon using (true);

-- portfolio_projects
drop policy if exists "Allow public insert" on portfolio_projects;
drop policy if exists "Allow public read" on portfolio_projects;
drop policy if exists "Allow public update" on portfolio_projects;
drop policy if exists "Allow public delete" on portfolio_projects;
create policy "Allow public insert" on portfolio_projects for insert to anon with check (true);
create policy "Allow public read" on portfolio_projects for select to anon using (true);
create policy "Allow public update" on portfolio_projects for update to anon using (true);
create policy "Allow public delete" on portfolio_projects for delete to anon using (true);
