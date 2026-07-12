create extension if not exists pgcrypto;
create schema if not exists private;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  current_band numeric(2,1) check (current_band between 0 and 9),
  target_band numeric(2,1) check (target_band between 0 and 9),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  week smallint not null check (week between 1 and 10),
  day smallint not null check (day between 1 and 70),
  slug text not null unique,
  title text not null,
  skills text[] not null check (cardinality(skills) between 2 and 4),
  duration_minutes smallint not null check (duration_minutes > 0),
  content_path text not null,
  is_mock boolean not null default false,
  is_harder_mock boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (week, day)
);

create table if not exists public.course_assets (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.course_lessons(id) on delete cascade,
  asset_type text not null check (asset_type in ('audio', 'worksheet')),
  storage_path text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists private.lesson_reviews (
  lesson_id uuid primary key references public.course_lessons(id) on delete cascade,
  answer_payload jsonb not null,
  transcript_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.course_lessons(id) on delete cascade,
  status text not null check (status in ('not_started', 'in_progress', 'completed')),
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table if not exists public.skill_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.course_lessons(id) on delete cascade,
  skill text not null check (skill in ('Listening', 'Reading', 'Writing', 'Speaking')),
  response_payload jsonb not null default '{}'::jsonb,
  score numeric(5,2),
  elapsed_seconds integer not null default 0 check (elapsed_seconds >= 0),
  submitted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.lexical_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  phrase text not null,
  skill text not null check (skill in ('Listening', 'Reading', 'Writing', 'Speaking')),
  meaning text,
  own_example text,
  confidence smallint not null default 1 check (confidence between 1 and 5),
  reuse_count integer not null default 0 check (reuse_count >= 0),
  first_used_at timestamptz,
  last_used_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, phrase)
);

create table if not exists public.error_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid references public.course_lessons(id) on delete set null,
  skill text not null check (skill in ('Listening', 'Reading', 'Writing', 'Speaking')),
  error_type text not null,
  mistake text not null,
  correction_rule text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mock_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.course_lessons(id) on delete cascade,
  listening_score numeric(5,2),
  reading_score numeric(5,2),
  writing_band numeric(2,1),
  speaking_band numeric(2,1),
  elapsed_seconds integer not null default 0 check (elapsed_seconds >= 0),
  submitted_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists course_assets_lesson_id_idx on public.course_assets(lesson_id);
create index if not exists lesson_progress_user_id_idx on public.lesson_progress(user_id);
create index if not exists lesson_progress_lesson_id_idx on public.lesson_progress(lesson_id);
create index if not exists skill_attempts_user_id_idx on public.skill_attempts(user_id);
create index if not exists skill_attempts_lesson_id_idx on public.skill_attempts(lesson_id);
create index if not exists lexical_entries_user_id_idx on public.lexical_entries(user_id);
create index if not exists error_logs_user_id_idx on public.error_logs(user_id);
create index if not exists error_logs_lesson_id_idx on public.error_logs(lesson_id);
create index if not exists mock_attempts_user_id_idx on public.mock_attempts(user_id);
create index if not exists mock_attempts_lesson_id_idx on public.mock_attempts(lesson_id);

alter table public.profiles enable row level security;
alter table public.course_lessons enable row level security;
alter table public.course_assets enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.skill_attempts enable row level security;
alter table public.lexical_entries enable row level security;
alter table public.error_logs enable row level security;
alter table public.mock_attempts enable row level security;
alter table private.lesson_reviews enable row level security;

drop policy if exists "profile_owner" on public.profiles;
drop policy if exists "published_lessons" on public.course_lessons;
drop policy if exists "published_lesson_assets" on public.course_assets;
drop policy if exists "progress_owner" on public.lesson_progress;
drop policy if exists "attempt_owner" on public.skill_attempts;
drop policy if exists "lexical_owner" on public.lexical_entries;
drop policy if exists "errors_owner" on public.error_logs;
drop policy if exists "mock_owner" on public.mock_attempts;

create policy "profile_owner" on public.profiles for all to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "published_lessons" on public.course_lessons for select to authenticated using (is_published = true);
create policy "published_lesson_assets" on public.course_assets for select to authenticated using (exists (select 1 from public.course_lessons lessons where lessons.id = course_assets.lesson_id and lessons.is_published = true));
create policy "progress_owner" on public.lesson_progress for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "attempt_owner" on public.skill_attempts for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "lexical_owner" on public.lexical_entries for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "errors_owner" on public.error_logs for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "mock_owner" on public.mock_attempts for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create or replace function public.get_attempt_review(attempt_uuid uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, private
as $$
declare lesson_uuid uuid;
begin
  select lesson_id into lesson_uuid from public.skill_attempts where id = attempt_uuid and user_id = (select auth.uid()) and submitted_at is not null;
  if lesson_uuid is null then raise exception 'Review is available only after a submitted attempt.' using errcode = '42501'; end if;
  return (select jsonb_build_object('answers', answer_payload, 'transcript', transcript_payload) from private.lesson_reviews where lesson_id = lesson_uuid);
end;
$$;

revoke all on function public.get_attempt_review(uuid) from public;
grant execute on function public.get_attempt_review(uuid) to authenticated;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin insert into public.profiles(id, display_name) values (new.id, coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))) on conflict (id) do nothing; return new; end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

insert into storage.buckets (id, name, public) values ('course-media', 'course-media', false) on conflict (id) do update set public = false;
insert into storage.buckets (id, name, public) values ('course-content', 'course-content', false) on conflict (id) do update set public = false;
drop policy if exists "authenticated_can_read_course_media" on storage.objects;
drop policy if exists "authenticated_can_read_course_content" on storage.objects;
create policy "authenticated_can_read_course_media" on storage.objects for select to authenticated using (bucket_id = 'course-media');
create policy "authenticated_can_read_course_content" on storage.objects for select to authenticated using (bucket_id = 'course-content');
