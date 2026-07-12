-- Migration: Feature expansion
-- Adds: streaks, writing responses, speaking recordings, weekly challenges,
-- peer stats, test date, study sessions, dark mode preference

-- ═══════════════════════════════════════════════════════
-- 1. Profile enhancements
-- ═══════════════════════════════════════════════════════
alter table public.profiles add column if not exists test_date date;
alter table public.profiles add column if not exists dark_mode boolean not null default false;
alter table public.profiles add column if not exists timezone text not null default 'UTC';
alter table public.profiles add column if not exists weekly_email boolean not null default true;

-- ═══════════════════════════════════════════════════════
-- 2. Study sessions (for streak + daily time tracking)
-- ═══════════════════════════════════════════════════════
create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid references public.course_lessons(id) on delete set null,
  skill text check (skill in ('Listening', 'Reading', 'Writing', 'Speaking')),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  created_at timestamptz not null default now()
);
create index if not exists study_sessions_user_id_idx on public.study_sessions(user_id);
create index if not exists study_sessions_started_at_idx on public.study_sessions(started_at);

alter table public.study_sessions enable row level security;
drop policy if exists "session_owner" on public.study_sessions;
create policy "session_owner" on public.study_sessions
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ═══════════════════════════════════════════════════════
-- 3. Writing responses (saved writing attempts)
-- ═══════════════════════════════════════════════════════
create table if not exists public.writing_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid references public.course_lessons(id) on delete set null,
  task_type text not null check (task_type in ('task1', 'task2', 'transfer')),
  response_text text not null default '',
  word_count integer not null default 0 check (word_count >= 0),
  estimated_band jsonb,  -- { overall, task_achievement, coherence, lexical, grammar }
  feedback_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists writing_responses_user_id_idx on public.writing_responses(user_id);

alter table public.writing_responses enable row level security;
drop policy if exists "writing_owner" on public.writing_responses;
create policy "writing_owner" on public.writing_responses
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ═══════════════════════════════════════════════════════
-- 4. Speaking recordings
-- ═══════════════════════════════════════════════════════
create table if not exists public.speaking_recordings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid references public.course_lessons(id) on delete set null,
  storage_path text not null,
  duration_seconds integer not null default 0,
  transcript text,
  estimated_band jsonb,  -- { fluency, lexical, grammar, pronunciation }
  filler_count integer,
  words_per_minute numeric(5,1),
  created_at timestamptz not null default now()
);
create index if not exists speaking_recordings_user_id_idx on public.speaking_recordings(user_id);

alter table public.speaking_recordings enable row level security;
drop policy if exists "recording_owner" on public.speaking_recordings;
create policy "recording_owner" on public.speaking_recordings
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Storage bucket for speaking recordings
insert into storage.buckets (id, name, public)
  values ('speaking-recordings', 'speaking-recordings', false)
  on conflict (id) do update set public = false;
drop policy if exists "user_manages_own_recordings" on storage.objects;
create policy "user_manages_own_recordings" on storage.objects
  for all to authenticated
  using (bucket_id = 'speaking-recordings' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'speaking-recordings' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- ═══════════════════════════════════════════════════════
-- 5. Weekly phrase challenges
-- ═══════════════════════════════════════════════════════
create table if not exists public.phrase_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  phrase_ids uuid[] not null default '{}',
  completed_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start)
);
create index if not exists phrase_challenges_user_id_idx on public.phrase_challenges(user_id);

alter table public.phrase_challenges enable row level security;
drop policy if exists "challenge_owner" on public.phrase_challenges;
create policy "challenge_owner" on public.phrase_challenges
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ═══════════════════════════════════════════════════════
-- 6. Lexical enhancements (spaced repetition)
-- ═══════════════════════════════════════════════════════
alter table public.lexical_entries add column if not exists next_review_at timestamptz;
alter table public.lexical_entries add column if not exists review_interval_days integer not null default 1;
alter table public.lexical_entries add column if not exists ease_factor numeric(3,2) not null default 2.50;

-- ═══════════════════════════════════════════════════════
-- 7. Lesson review enhancements (band contrast)
-- ═══════════════════════════════════════════════════════
-- Add band_contrast column to lesson_reviews for Band 6 vs Band 7 comparison
alter table private.lesson_reviews add column if not exists band_contrast jsonb not null default '[]'::jsonb;

-- ═══════════════════════════════════════════════════════
-- 8. Aggregate stats view (for peer comparison, anonymised)
-- ═══════════════════════════════════════════════════════
create or replace view public.cohort_stats as
select
  p.current_band as start_band,
  count(distinct lp.user_id) as learner_count,
  avg(lp.duration_seconds)::integer as avg_session_seconds,
  count(case when lp.status = 'completed' then 1 end)::integer as total_completions,
  percentile_cont(0.5) within group (order by ma.listening_score) as median_listening,
  percentile_cont(0.5) within group (order by ma.reading_score) as median_reading,
  percentile_cont(0.5) within group (order by ma.writing_band) as median_writing,
  percentile_cont(0.5) within group (order by ma.speaking_band) as median_speaking
from public.profiles p
left join public.lesson_progress lp on lp.user_id = p.id
left join public.mock_attempts ma on ma.user_id = p.id
where p.current_band is not null
group by p.current_band;

-- ═══════════════════════════════════════════════════════
-- 9. Streak computation function
-- ═══════════════════════════════════════════════════════
create or replace function public.get_user_streak(target_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  streak integer := 0;
  max_streak integer := 0;
  check_date date;
  has_activity boolean;
  heatmap jsonb;
begin
  -- Only allow users to check their own streak
  if target_user_id != (select auth.uid()) then
    raise exception 'Access denied' using errcode = '42501';
  end if;

  -- Count current streak (consecutive days ending today or yesterday)
  check_date := current_date;
  loop
    select exists(
      select 1 from public.lesson_progress
      where user_id = target_user_id
        and status = 'completed'
        and updated_at::date = check_date
    ) into has_activity;

    if not has_activity and check_date = current_date then
      -- Allow today to not have activity yet (streak from yesterday)
      check_date := check_date - 1;
      continue;
    end if;

    exit when not has_activity;
    streak := streak + 1;
    check_date := check_date - 1;
  end loop;

  -- Build 90-day heatmap
  select jsonb_agg(jsonb_build_object(
    'date', d::date,
    'count', coalesce(c.cnt, 0)
  ) order by d)
  into heatmap
  from generate_series(current_date - 89, current_date, '1 day') d
  left join (
    select updated_at::date as day, count(*)::integer as cnt
    from public.lesson_progress
    where user_id = target_user_id
      and status = 'completed'
      and updated_at >= current_date - 89
    group by updated_at::date
  ) c on c.day = d::date;

  -- Get max streak
  with ordered_days as (
    select distinct updated_at::date as day
    from public.lesson_progress
    where user_id = target_user_id and status = 'completed'
    order by day
  ),
  grouped as (
    select day, day - (row_number() over (order by day))::integer * interval '1 day' as grp
    from ordered_days
  )
  select coalesce(max(cnt), 0) into max_streak
  from (select count(*)::integer as cnt from grouped group by grp) sub;

  return jsonb_build_object(
    'current_streak', streak,
    'max_streak', greatest(max_streak, streak),
    'heatmap', coalesce(heatmap, '[]'::jsonb),
    'today_completed', exists(
      select 1 from public.lesson_progress
      where user_id = target_user_id
        and status = 'completed'
        and updated_at::date = current_date
    )
  );
end;
$$;

revoke all on function public.get_user_streak(uuid) from public;
grant execute on function public.get_user_streak(uuid) to authenticated;

-- ═══════════════════════════════════════════════════════
-- 10. Daily brief function
-- ═══════════════════════════════════════════════════════
create or replace function public.get_daily_brief(target_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
  error_patterns jsonb;
  stale_phrases jsonb;
  recent_scores jsonb;
  total_study_mins integer;
begin
  if target_user_id != (select auth.uid()) then
    raise exception 'Access denied' using errcode = '42501';
  end if;

  -- Top 3 most frequent error types this week
  select coalesce(jsonb_agg(row_to_json(e)::jsonb), '[]'::jsonb)
  into error_patterns
  from (
    select skill, error_type, count(*)::integer as occurrences
    from public.error_logs
    where user_id = target_user_id
      and created_at >= current_date - 7
    group by skill, error_type
    order by count(*) desc
    limit 3
  ) e;

  -- Oldest 5 unreused phrases (saved but never used)
  select coalesce(jsonb_agg(row_to_json(p)::jsonb), '[]'::jsonb)
  into stale_phrases
  from (
    select id, phrase, skill, confidence, created_at
    from public.lexical_entries
    where user_id = target_user_id
      and reuse_count = 0
    order by created_at asc
    limit 5
  ) p;

  -- Latest mock scores
  select coalesce(jsonb_agg(row_to_json(m)::jsonb), '[]'::jsonb)
  into recent_scores
  from (
    select listening_score, reading_score, writing_band, speaking_band, created_at
    from public.mock_attempts
    where user_id = target_user_id
      and submitted_at is not null
    order by created_at desc
    limit 3
  ) m;

  -- Total study minutes this week
  select coalesce(sum(duration_seconds) / 60, 0)::integer
  into total_study_mins
  from public.study_sessions
  where user_id = target_user_id
    and started_at >= current_date - 7;

  return jsonb_build_object(
    'error_patterns', error_patterns,
    'stale_phrases', stale_phrases,
    'recent_scores', recent_scores,
    'study_minutes_this_week', total_study_mins,
    'completed_today', (
      select count(*)::integer from public.lesson_progress
      where user_id = target_user_id
        and status = 'completed'
        and updated_at::date = current_date
    ),
    'total_errors', (
      select count(*)::integer from public.error_logs
      where user_id = target_user_id
    ),
    'total_phrases', (
      select count(*)::integer from public.lexical_entries
      where user_id = target_user_id
    ),
    'phrases_due_review', (
      select count(*)::integer from public.lexical_entries
      where user_id = target_user_id
        and next_review_at is not null
        and next_review_at <= now()
    )
  );
end;
$$;

revoke all on function public.get_daily_brief(uuid) from public;
grant execute on function public.get_daily_brief(uuid) to authenticated;

-- ═══════════════════════════════════════════════════════
-- 11. Band trajectory function
-- ═══════════════════════════════════════════════════════
create or replace function public.get_band_trajectory(target_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if target_user_id != (select auth.uid()) then
    raise exception 'Access denied' using errcode = '42501';
  end if;

  return (
    select coalesce(jsonb_agg(row_to_json(t)::jsonb order by t.submitted_at), '[]'::jsonb)
    from (
      select
        ma.submitted_at,
        cl.week,
        cl.day,
        ma.listening_score,
        ma.reading_score,
        ma.writing_band,
        ma.speaking_band
      from public.mock_attempts ma
      join public.course_lessons cl on cl.id = ma.lesson_id
      where ma.user_id = target_user_id
        and ma.submitted_at is not null
      order by ma.submitted_at
    ) t
  );
end;
$$;

revoke all on function public.get_band_trajectory(uuid) from public;
grant execute on function public.get_band_trajectory(uuid) to authenticated;

-- ═══════════════════════════════════════════════════════
-- 12. Peer comparison function
-- ═══════════════════════════════════════════════════════
create or replace function public.get_peer_comparison(target_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  user_band numeric;
  user_completions integer;
  cohort_avg_completions numeric;
  cohort_size integer;
  user_percentile numeric;
begin
  if target_user_id != (select auth.uid()) then
    raise exception 'Access denied' using errcode = '42501';
  end if;

  select current_band into user_band from public.profiles where id = target_user_id;
  if user_band is null then return '{}'::jsonb; end if;

  select count(*)::integer into user_completions
  from public.lesson_progress
  where user_id = target_user_id and status = 'completed';

  select count(distinct p.id)::integer, avg(sub.cnt)
  into cohort_size, cohort_avg_completions
  from public.profiles p
  left join (
    select user_id, count(*)::integer as cnt
    from public.lesson_progress where status = 'completed'
    group by user_id
  ) sub on sub.user_id = p.id
  where p.current_band = user_band;

  -- Percentile rank within cohort
  select (
    count(case when sub.cnt <= user_completions then 1 end)::numeric / nullif(count(*), 0) * 100
  )::numeric(5,1)
  into user_percentile
  from public.profiles p
  left join (
    select user_id, count(*)::integer as cnt
    from public.lesson_progress where status = 'completed'
    group by user_id
  ) sub on sub.user_id = p.id
  where p.current_band = user_band;

  return jsonb_build_object(
    'start_band', user_band,
    'your_completions', user_completions,
    'cohort_avg_completions', round(coalesce(cohort_avg_completions, 0), 1),
    'cohort_size', cohort_size,
    'your_percentile', coalesce(user_percentile, 50),
    'cohort_stats', (select row_to_json(cs) from public.cohort_stats cs where cs.start_band = user_band)
  );
end;
$$;

revoke all on function public.get_peer_comparison(uuid) from public;
grant execute on function public.get_peer_comparison(uuid) to authenticated;
