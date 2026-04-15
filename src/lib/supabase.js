// Tables: quote_requests | showroom_visits | partner_applications | contact_messages
// Remember to enable RLS and add anon INSERT policies for all tables in Supabase dashboard

import { createClient } from '@supabase/supabase-js'

/**
 * Run in Supabase SQL Editor to create the tables:
 *
 * -- quote_requests (existing)
 * create table quote_requests (
 *   id uuid primary key default gen_random_uuid(),
 *   created_at timestamptz not null default now(),
 *   property_type text,
 *   project_scope text[],
 *   area_sqft text,
 *   budget_range text,
 *   location text,
 *   full_name text,
 *   phone text,
 *   email text,
 *   status text not null default 'new'
 * );
 *
 * -- showroom_visits
 * create table showroom_visits (
 *   id uuid primary key default gen_random_uuid(),
 *   created_at timestamptz not null default now(),
 *   full_name text,
 *   phone text,
 *   preferred_location text,
 *   preferred_date date,
 *   preferred_time_slot text,
 *   project_note text,
 *   status text not null default 'pending'
 * );
 *
 * -- partner_applications
 * create table partner_applications (
 *   id uuid primary key default gen_random_uuid(),
 *   created_at timestamptz not null default now(),
 *   full_name text,
 *   company_name text,
 *   partner_type text,
 *   phone text,
 *   email text,
 *   city text,
 *   business_description text,
 *   status text not null default 'new'
 * );
 *
 * -- contact_messages
 * create table contact_messages (
 *   id uuid primary key default gen_random_uuid(),
 *   created_at timestamptz not null default now(),
 *   full_name text,
 *   phone text,
 *   email text,
 *   message text,
 *   source_page text,
 *   status text not null default 'unread'
 * );
 *
 * Enable RLS on each table in Supabase and add an insert policy for the anon role.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Maywood] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Set them in .env for quote submissions.',
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')
