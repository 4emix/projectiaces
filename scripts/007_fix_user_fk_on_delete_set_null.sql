-- Fix: deleting an auth user used to CASCADE-delete all content that user
-- created (board members, events, magazines, hero/about/contact, settings).
-- Change every content table's user_id foreign key to ON DELETE SET NULL so
-- removing a user keeps the content and only clears its ownership reference.
-- Applied to the live Supabase project on 2026-06-22.

alter table about_content drop constraint about_content_user_id_fkey,
  add constraint about_content_user_id_fkey foreign key (user_id) references auth.users(id) on delete set null;

alter table board_members drop constraint board_members_user_id_fkey,
  add constraint board_members_user_id_fkey foreign key (user_id) references auth.users(id) on delete set null;

alter table contact_info drop constraint contact_info_user_id_fkey,
  add constraint contact_info_user_id_fkey foreign key (user_id) references auth.users(id) on delete set null;

alter table events drop constraint events_user_id_fkey,
  add constraint events_user_id_fkey foreign key (user_id) references auth.users(id) on delete set null;

alter table hero_content drop constraint hero_content_user_id_fkey,
  add constraint hero_content_user_id_fkey foreign key (user_id) references auth.users(id) on delete set null;

alter table magazine_articles drop constraint magazine_articles_user_id_fkey,
  add constraint magazine_articles_user_id_fkey foreign key (user_id) references auth.users(id) on delete set null;

alter table site_settings drop constraint site_settings_user_id_fkey,
  add constraint site_settings_user_id_fkey foreign key (user_id) references auth.users(id) on delete set null;

alter table local_committees drop constraint local_committees_user_id_fkey,
  add constraint local_committees_user_id_fkey foreign key (user_id) references auth.users(id) on delete set null;
