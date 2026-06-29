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
--   1) In Supabase Dashboard -> Authentication -> Providers/Sign In:
--      DISABLE public email sign-ups (or set to invite-only).
--   2) Insert YOUR admin email(s) below, then run the whole script.
--   3) Also set ADMIN_EMAILS (same addresses, comma-separated) in the app env.
-- =============================================================================

create table if not exists app_admins (
  email text primary key
);

-- >>> EDIT THIS: add the real admin account email(s) <<<
insert into app_admins (email) values
  ('generalboard@iaces.info')
on conflict (email) do nothing;

alter table app_admins enable row level security;
-- Only admins may read the admin list (no public access).
drop policy if exists "admins read app_admins" on app_admins;
create policy "admins read app_admins" on app_admins
  for select to authenticated
  using (lower((auth.jwt() ->> 'email')) in (select lower(email) from app_admins));

create or replace function is_app_admin() returns boolean language sql stable as $$
  select exists (
    select 1 from app_admins a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- Content tables: replace permissive write policies with admin-only ones.
do $$
declare t text;
begin
  foreach t in array array[
    'events','local_committees','announcements','board_members',
    'magazine_articles','hero_content','about_content','contact_info','site_settings'
  ] loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists %I on %I;', 'admin manage '||t, t);
    execute format(
      'create policy %I on %I for all to authenticated using (is_app_admin()) with check (is_app_admin());',
      'admin manage '||t, t
    );
  end loop;
end $$;

-- contact_messages: public may INSERT (the form), only admins may read/update/delete.
drop policy if exists "Authenticated can read messages" on contact_messages;
drop policy if exists "Authenticated can update messages" on contact_messages;
drop policy if exists "Authenticated can delete messages" on contact_messages;
create policy "admins read messages"   on contact_messages for select to authenticated using (is_app_admin());
create policy "admins update messages" on contact_messages for update to authenticated using (is_app_admin()) with check (is_app_admin());
create policy "admins delete messages" on contact_messages for delete to authenticated using (is_app_admin());

-- page_views: public may INSERT (tracking), only admins may read.
drop policy if exists "Authenticated can read page views" on page_views;
create policy "admins read page views" on page_views for select to authenticated using (is_app_admin());

-- NOTE: public SELECT policies on content tables (active rows) are intentionally
-- kept so the website keeps working for visitors.
