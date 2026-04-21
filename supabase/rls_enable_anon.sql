-- Run in Supabase SQL Editor if form inserts fail (RLS blocking anon).
-- Ensures anonymous (browser anon key) can INSERT and SELECT on lead tables.

-- quote_requests
drop policy if exists "Enable insert for all users" on public.quote_requests;
drop policy if exists "Enable read for all users" on public.quote_requests;
create policy "Enable insert for all users" on public.quote_requests for insert to anon with check (true);
create policy "Enable read for all users" on public.quote_requests for select to anon using (true);

-- consultation_bookings
drop policy if exists "Enable insert for all users" on public.consultation_bookings;
drop policy if exists "Enable read for all users" on public.consultation_bookings;
create policy "Enable insert for all users" on public.consultation_bookings for insert to anon with check (true);
create policy "Enable read for all users" on public.consultation_bookings for select to anon using (true);

-- calculator_leads
drop policy if exists "Enable insert for all users" on public.calculator_leads;
drop policy if exists "Enable read for all users" on public.calculator_leads;
create policy "Enable insert for all users" on public.calculator_leads for insert to anon with check (true);
create policy "Enable read for all users" on public.calculator_leads for select to anon using (true);

-- partner_applications
drop policy if exists "Enable insert for all users" on public.partner_applications;
drop policy if exists "Enable read for all users" on public.partner_applications;
create policy "Enable insert for all users" on public.partner_applications for insert to anon with check (true);
create policy "Enable read for all users" on public.partner_applications for select to anon using (true);

-- portfolio_projects (admin + public reads)
drop policy if exists "Enable insert for all users" on public.portfolio_projects;
drop policy if exists "Enable read for all users" on public.portfolio_projects;
create policy "Enable insert for all users" on public.portfolio_projects for insert to anon with check (true);
create policy "Enable read for all users" on public.portfolio_projects for select to anon using (true);
