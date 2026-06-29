-- =============================================================================
-- Lock content writes & PII reads to an explicit admin allowlist.
--
-- WHY: today every *authenticated* Supabase user can write content and read
-- contact_messages / page_views (the RLS policies use `auth.role() =
-- 'authenticated'` or `auth.uid() = user_id`). Combined with the public anon
-- key, if email sign-ups are enabled in Supabase anyone could register and gain
-- write/PII access. This script restricts those operations to admin emails.
--
-- BEFORE RUNNING:
--   1) Supabase Dashboard -> Authentication -> Sign In / Providers:
--      DISABLE public email sign-ups (or set invite-only).
--   2) Put YOUR admin email(s) in the INSERT below, then run the WHOLE script.
--   3) Also set ADMIN_EMAILS (same addresses, comma-separated) in the app env.
--
-- Safe to re-run. Public SELECT of active content is preserved, so the public
-- site keeps working; only writes + PII reads become admin-only.
-- =============================================================================

create table if not exists app_admins (
  email text primary key
);

-- >>> EDIT THIS: add the real admin account email(s) <<<
insert into app_admins (email) values
  ('generalboard@iaces.info')
on conflict (email) do nothing;

-- SECURITY DEFINER so it reads app_admins bypassing RLS — otherwise the
-- app_admins read policy (which references app_admins) recurses infinitely.
create or replace function is_app_admin() returns boolean
  language sql stable security definer set search_path = public, pg_temp as $$
  select exists (
    select 1 from app_admins a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

alter table app_admins enable row level security;
drop policy if exists "admins read app_admins" on app_admins;
create policy "admins read app_admins" on app_admins
  for select to authenticated
  using (is_app_admin());  -- non-recursive: uses the definer function

-- ---------------------------------------------------------------------------
-- Content tables: drop ALL existing non-SELECT (write) policies, then add a
-- single admin-only write policy. Public SELECT policies are left untouched.
-- ---------------------------------------------------------------------------
do $$
declare
  r record;
  content_tables text[] := array[
    'events','local_committees','announcements','board_members',
    'magazine_articles','hero_content','about_content','contact_info','site_settings'
  ];
  t text;
begin
  -- remove every existing write/ALL policy on these tables
  for r in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename = any(content_tables)
      and cmd <> 'SELECT'
  loop
    execute format('drop policy if exists %I on %I;', r.policyname, r.tablename);
  end loop;

  -- add one admin-only write policy per table
  foreach t in array content_tables loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists %I on %I;', 'admin manage '||t, t);
    execute format(
      'create policy %I on %I for all to authenticated using (is_app_admin()) with check (is_app_admin());',
      'admin manage '||t, t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- contact_messages: keep public INSERT (the contact form); admins-only read/edit.
-- ---------------------------------------------------------------------------
drop policy if exists "Authenticated can read messages"   on contact_messages;
drop policy if exists "Authenticated can update messages" on contact_messages;
drop policy if exists "Authenticated can delete messages" on contact_messages;
drop policy if exists "admins read messages"   on contact_messages;
drop policy if exists "admins update messages" on contact_messages;
drop policy if exists "admins delete messages" on contact_messages;
create policy "admins read messages"   on contact_messages for select to authenticated using (is_app_admin());
create policy "admins update messages" on contact_messages for update to authenticated using (is_app_admin()) with check (is_app_admin());
create policy "admins delete messages" on contact_messages for delete to authenticated using (is_app_admin());

-- ---------------------------------------------------------------------------
-- page_views: keep public INSERT (tracking); admins-only read.
-- ---------------------------------------------------------------------------
drop policy if exists "Authenticated can read page views" on page_views;
drop policy if exists "admins read page views" on page_views;
create policy "admins read page views" on page_views for select to authenticated using (is_app_admin());

-- Quick check (optional): list remaining write policies — should be admin-only.
-- select tablename, policyname, cmd from pg_policies
-- where schemaname='public' and cmd <> 'SELECT' order by tablename;
