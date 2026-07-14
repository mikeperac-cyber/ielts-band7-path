-- IELTS Academic Band 9 Path: protected content V2, attempt review locking,
-- diagnostic labelling, and atomic AI usage reservations.

alter table public.profiles alter column target_band set default 9.0;
update public.profiles set target_band = 9.0 where target_band is distinct from 9.0;

alter table public.course_lessons add column if not exists content_schema_version integer not null default 2 check (content_schema_version = 2);
alter table public.course_lessons add column if not exists rubric_version text not null default 'ielts-public-2026-07';
alter table public.course_lessons add column if not exists assessment_kind text not null default 'lesson' check (assessment_kind in ('lesson', 'diagnostic'));
update public.course_lessons set assessment_kind = case when is_mock then 'diagnostic' else 'lesson' end;

alter table public.skill_attempts add column if not exists activity_id text;
alter table public.skill_attempts add column if not exists content_schema_version integer not null default 2;
alter table public.skill_attempts add column if not exists rubric_version text not null default 'ielts-public-2026-07';
alter table public.skill_attempts add column if not exists updated_at timestamptz not null default now();
create index if not exists skill_attempts_activity_id_idx on public.skill_attempts(activity_id);

alter table public.writing_responses add column if not exists activity_id text;
alter table public.writing_responses add column if not exists rubric_version text not null default 'ielts-public-2026-07';
alter table public.writing_responses add column if not exists assessment_scope text not null default 'practice_estimate' check (assessment_scope = 'practice_estimate');
alter table public.writing_responses add column if not exists provider text;
alter table public.writing_responses add column if not exists model text;
alter table public.writing_responses add column if not exists idempotency_key uuid;
create unique index if not exists writing_response_idempotency_idx on public.writing_responses(user_id, idempotency_key) where idempotency_key is not null;

alter table public.speaking_recordings alter column storage_path drop not null;
alter table public.speaking_recordings add column if not exists activity_id text;
alter table public.speaking_recordings add column if not exists rubric_version text not null default 'ielts-public-2026-07';
alter table public.speaking_recordings add column if not exists assessment_scope text not null default 'partial_practice_estimate' check (assessment_scope = 'partial_practice_estimate');
alter table public.speaking_recordings add column if not exists transcription_provider text;
alter table public.speaking_recordings add column if not exists transcription_model text;
alter table public.speaking_recordings add column if not exists grading_provider text;
alter table public.speaking_recordings add column if not exists grading_model text;
alter table public.speaking_recordings add column if not exists pause_count integer;
alter table public.speaking_recordings add column if not exists idempotency_key uuid;
create unique index if not exists speaking_recording_idempotency_idx on public.speaking_recordings(user_id, idempotency_key) where idempotency_key is not null;

create table if not exists public.ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  feature text not null check (feature in ('writing', 'speaking')),
  idempotency_key uuid not null,
  status text not null default 'pending' check (status in ('pending', 'succeeded', 'released')),
  provider text,
  model text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, idempotency_key)
);
alter table public.ai_usage_events enable row level security;
drop policy if exists "ai_usage_owner_read" on public.ai_usage_events;
create policy "ai_usage_owner_read" on public.ai_usage_events for select to authenticated using ((select auth.uid()) = user_id);
create index if not exists ai_usage_daily_idx on public.ai_usage_events(user_id, feature, created_at);

create or replace function public.reserve_ai_usage(feature_name text, request_key uuid, daily_limit integer default 5)
returns uuid language plpgsql security definer set search_path = public as $$
declare existing_id uuid; reservation_id uuid; used integer;
begin
  if feature_name not in ('writing', 'speaking') or daily_limit < 1 then raise exception 'Invalid quota request.' using errcode = '22023'; end if;
  perform pg_advisory_xact_lock(hashtextextended((select auth.uid())::text || feature_name || current_date::text, 0));
  select id into existing_id from public.ai_usage_events where user_id = (select auth.uid()) and idempotency_key = request_key;
  if existing_id is not null then return existing_id; end if;
  select count(*) into used from public.ai_usage_events where user_id = (select auth.uid()) and feature = feature_name and status in ('pending', 'succeeded') and created_at >= current_date and created_at < current_date + 1;
  if used >= daily_limit then raise exception 'Daily assessment limit reached.' using errcode = 'P0001'; end if;
  insert into public.ai_usage_events(user_id, feature, idempotency_key) values ((select auth.uid()), feature_name, request_key) returning id into reservation_id;
  return reservation_id;
end; $$;
revoke all on function public.reserve_ai_usage(text, uuid, integer) from public;
grant execute on function public.reserve_ai_usage(text, uuid, integer) to authenticated;

create or replace function public.finish_ai_usage(reservation_uuid uuid, final_status text, provider_name text, model_name text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if final_status not in ('succeeded', 'released') then raise exception 'Invalid final status.' using errcode = '22023'; end if;
  update public.ai_usage_events set status = final_status, provider = provider_name, model = model_name, updated_at = now() where id = reservation_uuid and user_id = (select auth.uid()) and status = 'pending';
end; $$;
revoke all on function public.finish_ai_usage(uuid, text, text, text) from public;
grant execute on function public.finish_ai_usage(uuid, text, text, text) to authenticated;

create or replace function public.get_attempt_review(attempt_uuid uuid)
returns jsonb language plpgsql security definer set search_path = public, private as $$
declare lesson_uuid uuid; selected_activity text; review jsonb;
begin
  select lesson_id, activity_id into lesson_uuid, selected_activity from public.skill_attempts where id = attempt_uuid and user_id = (select auth.uid()) and submitted_at is not null;
  if lesson_uuid is null then raise exception 'Review is available only after a submitted attempt.' using errcode = '42501'; end if;
  select answer_payload -> 'activityReviews' -> selected_activity into review from private.lesson_reviews where lesson_id = lesson_uuid;
  if review is null then raise exception 'Review is unavailable for this activity.' using errcode = '22023'; end if;
  return review;
end; $$;
revoke all on function public.get_attempt_review(uuid) from public;
grant execute on function public.get_attempt_review(uuid) to authenticated;

create or replace function public.publish_lesson_review(lesson_uuid uuid, answers jsonb, transcript jsonb default '{}'::jsonb)
returns void language sql security definer set search_path = public, private as $$
  insert into private.lesson_reviews(lesson_id, answer_payload, transcript_payload, updated_at)
  values (lesson_uuid, answers, transcript, now())
  on conflict (lesson_id) do update
  set answer_payload = excluded.answer_payload,
      transcript_payload = excluded.transcript_payload,
      updated_at = now();
$$;
revoke all on function public.publish_lesson_review(uuid, jsonb, jsonb) from public;
grant execute on function public.publish_lesson_review(uuid, jsonb, jsonb) to service_role;

create or replace function public.record_phrase_reuse(phrase_text text)
returns void language sql security definer set search_path = public as $$
  update public.lexical_entries set reuse_count = reuse_count + 1, last_used_at = now(), first_used_at = coalesce(first_used_at, now()), confidence = least(5, confidence + 1), updated_at = now() where user_id = (select auth.uid()) and phrase = phrase_text;
$$;
revoke all on function public.record_phrase_reuse(text) from public;
grant execute on function public.record_phrase_reuse(text) to authenticated;
