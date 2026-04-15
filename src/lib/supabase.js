import { createClient } from '@supabase/supabase-js'

/**
 * Run in Supabase SQL Editor to create the table:
 *
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
 * Enable RLS on this table in Supabase and add an insert policy for anon role.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Maywood] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Set them in .env for quote submissions.',
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')
