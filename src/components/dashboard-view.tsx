"use client";

import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  ChevronRight,
  Headphones,
  Mic2,
  PenLine,
  Play,
  Search,
  TrendingUp,
  Flame,
} from "lucide-react";
import { Metric, SectionHeading } from "@/components/app-shell";

const SKILL_COLORS: Record<string, string> = {
  Listening: "var(--skill-listening)",
  Speaking:  "var(--skill-speaking)",
  Reading:   "var(--skill-reading)",
  Writing:   "var(--skill-writing)",
};

interface DashboardViewProps {
  dailyBrief?: any;
  userStreak?: any;
  bandTrajectory?: any;
  peerComparison?: any;
}

export function DashboardView({ dailyBrief, userStreak, bandTrajectory, peerComparison }: DashboardViewProps) {
  // Use mock data if no server data is provided (e.g. static export or before DB is fully seeded)
  const streakCount = userStreak?.current_streak || 0;
  const heatmap = userStreak?.heatmap || [];
  const errors = dailyBrief?.error_patterns || [];
  const stalePhrases = dailyBrief?.stale_phrases || [];
  
  // Calculate a mock overall progress percentage based on completed lessons
  const completedToday = dailyBrief?.completed_today || false;

  return (
    <div className="page-wrap dashboard-page">
      {/* Page intro */}
      <div className="page-intro" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1>Your Band 7 Path</h1>
          <p>A 10-week programme that turns focused daily practice into measurable improvement.</p>
        </div>
        
        {/* Streak Counter */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--orange-bg)", color: "var(--orange)", padding: "8px 16px", borderRadius: 99, fontWeight: 700 }}>
          <Flame size={20} fill={streakCount > 0 ? "currentColor" : "none"} />
          <span>{streakCount} Day Streak</span>
        </div>
      </div>

      {/* Week strip */}
      <section
        className="week-strip"
        aria-label="Programme weeks"
        style={{ "--week-progress": "10%" } as React.CSSProperties}
      >
        <div>
          <strong>Week 1 of 10</strong>
          <span>Building foundations</span>
        </div>
        <ol>
          {Array.from({ length: 10 }, (_, i) => (
            <li
              key={i}
              className={i === 0 ? "current" : ""}
              title={`Week ${i + 1}`}
            >
              {i + 1}
            </li>
          ))}
        </ol>
      </section>

      {/* Dynamic Today / Daily Brief card */}
      <section className="today-card">
        <div className="lesson-symbol">
          <Headphones size={44} />
        </div>

        <div className="today-main">
          <span className="eyebrow">WEEK 1 · DAY 1</span>
          <h2>Listening + Speaking</h2>
          
          {errors.length > 0 ? (
            <div style={{ background: "var(--blue-2)", padding: 12, borderRadius: 8, marginTop: 12, marginBottom: 16 }}>
              <strong style={{ display: "block", color: "var(--blue)", fontSize: 13, marginBottom: 4 }}>🎯 Personalised Focus</strong>
              <p style={{ margin: 0, fontSize: 14, color: "var(--text)" }}>
                You've made <b>{errors[0].occurrences} {errors[0].error_type.toLowerCase()}</b> errors recently. Today's listening session will test this specific weakness.
              </p>
            </div>
          ) : (
            <p>Understand main ideas and detail in academic contexts; speak clearly with structure and coherence.</p>
          )}

          <div className="lesson-meta">
            <span>◷ Est. time <b>90 min</b></span>
            <span>◫ Focus <b>Accuracy &amp; clarity</b></span>
            <span>◎ Outcome <b>Stronger responses</b></span>
          </div>
          
          <Link className="primary-button" href="/learn/1/1">
            <Play size={17} fill="currentColor" /> {completedToday ? "Review today's lesson" : "Start today's lesson"}
          </Link>
          <Link className="subtle-link" href="/sample/day-1" style={{ marginLeft: 18 }}>
            Preview sample
          </Link>
        </div>

        <aside className="today-plan">
          <h3>Your Daily Brief</h3>
          
          <div className="plan-step">
            <b>1</b>
            <span>
              <strong>Review Stale Phrases</strong>
              <small>{stalePhrases.length > 0 ? `${stalePhrases.length} phrases need practice` : "No phrases pending"}</small>
            </span>
          </div>
          
          <div className="plan-step">
            <b>2</b>
            <span>
              <strong>Error Patterns</strong>
              <small>{errors.length > 0 ? `${errors[0].error_type} is your main block` : "No recent patterns"}</small>
            </span>
          </div>
          
          <div className="plan-step">
            <b>3</b>
            <span>
              <strong>Study Time</strong>
              <small>{dailyBrief?.study_minutes_this_week || 0} mins this week</small>
            </span>
          </div>

          <div className="focus-note" style={{ marginTop: 24 }}>
            <strong>Today's focus</strong>
            <p>Accuracy in understanding; clarity and coherence in speaking.</p>
          </div>
        </aside>
      </section>

      {/* Heatmap Section */}
      {heatmap.length > 0 && (
        <section className="panel" style={{ marginTop: 16 }}>
          <SectionHeading title="Learning Consistency" />
          <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 8 }}>
            {heatmap.map((day: any) => (
              <div 
                key={day.date} 
                title={`${day.date}: ${day.count} sessions`}
                style={{ 
                  width: 14, 
                  height: 14, 
                  borderRadius: 3, 
                  flexShrink: 0,
                  background: day.count > 0 ? "var(--green)" : "var(--border)",
                  opacity: day.count > 0 ? Math.min(1, 0.4 + (day.count * 0.2)) : 0.3
                }} 
              />
            ))}
          </div>
        </section>
      )}

      {/* Band Trajectory Chart */}
      <section className="panel" style={{ marginTop: 16 }}>
        <SectionHeading
          title="Band Trajectory"
          action={<span style={{ fontSize: 13, color: "var(--muted)" }}>Based on Mock Exams</span>}
        />
        <div style={{ height: 160, display: "flex", alignItems: "flex-end", gap: 24, paddingTop: 20, position: "relative" }}>
          {/* Simple bespoke SVG line chart for band trajectory */}
          {bandTrajectory && bandTrajectory.length > 0 ? (
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: "visible" }}>
              <polyline 
                points={bandTrajectory.map((t: any, i: number) => {
                  const x = (i / Math.max(1, bandTrajectory.length - 1)) * 100;
                  // Normalize band 5-9 to 100-0 (Y is inverted in SVG)
                  const avg = ((t.listening_score / 40 * 9) + (t.reading_score / 40 * 9) + t.writing_band + t.speaking_band) / 4;
                  const y = 100 - ((Math.max(5, Math.min(9, avg)) - 5) / 4 * 100);
                  return `${x},${y}`;
                }).join(" ")}
                fill="none" 
                stroke="var(--blue)" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              {bandTrajectory.map((t: any, i: number) => {
                const x = (i / Math.max(1, bandTrajectory.length - 1)) * 100;
                const avg = ((t.listening_score / 40 * 9) + (t.reading_score / 40 * 9) + t.writing_band + t.speaking_band) / 4;
                const y = 100 - ((Math.max(5, Math.min(9, avg)) - 5) / 4 * 100);
                return (
                  <circle key={i} cx={x} cy={y} r="4" fill="white" stroke="var(--blue)" strokeWidth="2" />
                );
              })}
            </svg>
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}>
              Complete your first Mock Exam on Day 3 to see your trajectory.
            </div>
          )}
        </div>
      </section>

      {/* Peer Comparison */}
      {peerComparison && peerComparison.start_band && (
        <section className="panel" style={{ marginTop: 16, background: "linear-gradient(to right, var(--blue-2), transparent)" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ background: "var(--blue)", color: "white", padding: "12px 16px", borderRadius: 12, fontWeight: 700, fontSize: 24 }}>
              Top {Math.round(100 - peerComparison.your_percentile)}%
            </div>
            <div>
              <h3 style={{ margin: "0 0 4px", fontSize: 16 }}>You are ahead of the curve</h3>
              <p style={{ margin: 0, fontSize: 14, color: "var(--text)" }}>
                Learners who started at Band {peerComparison.start_band} have completed an average of {peerComparison.cohort_avg_completions} sessions. You have completed {peerComparison.your_completions}.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Skill progress panel */}
      <section className="panel" style={{ marginTop: 16 }}>
        <SectionHeading
          title="Your skill progress"
          action={
            <Link className="text-link" href="/tracker">
              See full progress <ChevronRight size={16} />
            </Link>
          }
        />
        <div className="metrics-grid">
          <Metric label="Listening" value="58%" detail="Band 6.0 → 6.5" icon={Headphones} />
          <Metric label="Speaking"  value="54%" detail="Band 6.0 → 6.5" icon={Mic2} />
          <Metric label="Reading"   value="62%" detail="Band 6.0 → 7.0" icon={Search} />
          <Metric label="Writing"   value="50%" detail="Band 6.0 → 6.5" icon={PenLine} />
        </div>
      </section>

      {/* Weekly progress insights */}
      <section className="panel" style={{ marginTop: 16 }}>
        <SectionHeading
          title="This week at a glance"
          action={
            <Link className="text-link" href="/tracker">
              Full tracker <ChevronRight size={16} />
            </Link>
          }
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
          {[
            { icon: TrendingUp, label: "Days completed", value: dailyBrief?.completed_today ? "1" : "0", sub: "of 7 this week" },
            { icon: BookOpen,   label: "Phrases saved",  value: dailyBrief?.total_phrases || "0", sub: "in tracker"   },
            { icon: Search,     label: "Errors logged",  value: dailyBrief?.total_errors || "0", sub: "rules created" },
            { icon: Mic2,       label: "Study time",     value: `${dailyBrief?.study_minutes_this_week || 0}m`, sub: "this week" },
          ].map(({ icon: Icon, label, value, sub }) => (
            <article key={label} className="metric">
              <Icon size={19} />
              <span>{label}</span>
              <strong>{value}</strong>
              <small>{sub}</small>
              <div className="metric-bar">
                <i style={{ "--bar-target": "30%" } as React.CSSProperties} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
