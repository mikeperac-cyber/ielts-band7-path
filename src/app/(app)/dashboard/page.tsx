import { DashboardView, type DashboardData } from "@/components/dashboard-view";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type LessonRow = { id: string; week: number; day: number; title: string; skills: string[] };
type AttemptRow = { skill: keyof DashboardData["skillEvidence"] };

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) redirect("/?course=unavailable");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/dashboard");
  const userId = user.id;
  const [lessonsResult, progressResult, attemptsResult, sessionsResult, phrasesResult, errorsResult, streakResult] = await Promise.all([
    supabase.from("course_lessons").select("id,week,day,title,skills").eq("is_published", true).eq("assessment_kind", "lesson").order("day"),
    supabase.from("lesson_progress").select("lesson_id").eq("user_id", userId).eq("status", "completed"),
    supabase.from("skill_attempts").select("skill").eq("user_id", userId).not("submitted_at", "is", null),
    supabase.from("study_sessions").select("duration_seconds").eq("user_id", userId),
    supabase.from("lexical_entries").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("error_logs").select("skill,correction_rule", { count: "exact" }).eq("user_id", userId).order("created_at", { ascending: false }).limit(1),
    supabase.rpc("get_user_streak", { target_user_id: userId }),
  ]);
  const lessons = (lessonsResult.data ?? []) as LessonRow[];
  const completedIds = new Set((progressResult.data ?? []).map((item) => item.lesson_id));
  const nextLesson = lessons.find((lesson) => !completedIds.has(lesson.id)) ?? null;
  const skillEvidence: DashboardData["skillEvidence"] = { Listening: 0, Reading: 0, Writing: 0, Speaking: 0 };
  for (const attempt of (attemptsResult.data ?? []) as AttemptRow[]) skillEvidence[attempt.skill] += 1;
  const completedLessons = completedIds.size;
  const totalLessons = lessons.length;
  const data: DashboardData = {
    completedLessons, totalLessons, completionPercent: totalLessons ? Math.round(completedLessons / totalLessons * 100) : 0,
    currentWeek: nextLesson?.week ?? 10,
    studyMinutes: Math.round((sessionsResult.data ?? []).reduce((sum, item) => sum + Number(item.duration_seconds ?? 0), 0) / 60),
    streak: Number((streakResult.data as { current_streak?: number } | null)?.current_streak ?? 0), phrasesSaved: phrasesResult.count ?? 0, errorsLogged: errorsResult.count ?? 0,
    skillEvidence,
    nextLesson: nextLesson ? { week: nextLesson.week, day: nextLesson.day, title: nextLesson.title, skills: nextLesson.skills } : null,
    recentRule: (errorsResult.data?.[0] as DashboardData["recentRule"] | undefined) ?? null,
  };
  return <DashboardView data={data} />;
}
