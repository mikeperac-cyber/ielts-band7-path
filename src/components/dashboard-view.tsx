"use client";

import Link from "next/link";
import { BookOpen, ChevronRight, Flame, Headphones, Mic2, PenLine, Play, Search } from "lucide-react";
import { Metric, SectionHeading } from "@/components/app-shell";

export type DashboardData = {
  completedLessons: number;
  totalLessons: number;
  completionPercent: number;
  currentWeek: number;
  studyMinutes: number;
  streak: number;
  phrasesSaved: number;
  errorsLogged: number;
  skillEvidence: Record<"Listening" | "Reading" | "Writing" | "Speaking", number>;
  nextLesson: { week: number; day: number; title: string; skills: string[] } | null;
  recentRule: { skill: string; correction_rule: string } | null;
};

export function DashboardView({ data }: { data: DashboardData }) {
  const next = data.nextLesson;
  return <div className="page-wrap dashboard-page">
    <div className="page-intro"><div><h1>Your Band 9 Path</h1><p>Progress is calculated from stored lesson, attempt, phrase, error, and study evidence.</p></div><div style={{ display: "flex", alignItems: "center", gap: 8 }}><Flame size={20} /><strong>{data.streak}-day streak</strong></div></div>
    <section className="week-strip" aria-label="Programme progress" style={{ "--week-progress": `${data.completionPercent}%` } as React.CSSProperties}><div><strong>Week {data.currentWeek} of 10</strong><span>{data.completedLessons} of {data.totalLessons} lessons complete</span></div><ol>{Array.from({ length: 10 }, (_, index) => { const week = index + 1; const state = week < data.currentWeek ? "done" : week === data.currentWeek ? "current" : ""; return <li key={week} className={state}>{week}</li>; })}</ol></section>

    <section className="today-card">
      <div className="lesson-symbol"><BookOpen size={44} /></div>
      <div className="today-main">{next ? <><span className="eyebrow">WEEK {next.week} · PROGRAMME DAY {next.day}</span><h2>{next.skills.join(" + ")}</h2><p>{next.title}</p>{data.recentRule && <div className="focus-note"><strong>Recent {data.recentRule.skill} prevention rule</strong><p>{data.recentRule.correction_rule}</p></div>}<Link className="primary-button" href={`/learn/${next.week}/${next.day}`}><Play size={17} /> Continue programme</Link></> : <><h2>All regular lessons complete</h2><p>Use your stored error rules and diagnostics to plan the next phase.</p></>}</div>
      <aside className="today-plan"><h3>Evidence brief</h3><p><strong>{data.studyMinutes}</strong> study minutes recorded</p><p><strong>{data.phrasesSaved}</strong> phrases saved</p><p><strong>{data.errorsLogged}</strong> prevention rules logged</p><p>Diagnostics are excluded from official mock totals and band trajectories.</p></aside>
    </section>

    <section className="panel"><SectionHeading title="Skill evidence" action={<Link className="text-link" href="/tracker">Open tracker <ChevronRight size={16} /></Link>} /><div className="metrics-grid">
      <Metric label="Listening" value={`${data.skillEvidence.Listening}`} detail="submitted attempts" icon={Headphones} progress={data.completionPercent} />
      <Metric label="Reading" value={`${data.skillEvidence.Reading}`} detail="submitted attempts" icon={Search} progress={data.completionPercent} />
      <Metric label="Writing" value={`${data.skillEvidence.Writing}`} detail="submitted attempts" icon={PenLine} progress={data.completionPercent} />
      <Metric label="Speaking" value={`${data.skillEvidence.Speaking}`} detail="submitted attempts" icon={Mic2} progress={data.completionPercent} />
    </div></section>
  </div>;
}
