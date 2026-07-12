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
} from "lucide-react";
import { Metric, SectionHeading } from "@/components/app-shell";

const phrases = [
  ["in light of the evidence", "Listening", "High",   "Used 2 times",  "Today"],
  ["a key factor in",          "Speaking",  "Medium", "Used 1 time",   "2 days ago"],
  ["it can be inferred that",  "Reading",   "High",   "Used 3 times",  "Today"],
  ["consequently",             "Writing",   "Low",    "Not yet used",  "—"],
];

const SKILL_COLORS: Record<string, string> = {
  Listening: "var(--skill-listening)",
  Speaking:  "var(--skill-speaking)",
  Reading:   "var(--skill-reading)",
  Writing:   "var(--skill-writing)",
};

export function DashboardView() {
  return (
    <div className="page-wrap dashboard-page">

      {/* Page intro */}
      <div className="page-intro">
        <div>
          <h1>Your Band 7 Path</h1>
          <p>A 10-week programme that turns focused daily practice into measurable improvement.</p>
        </div>
        <Link className="text-link" href="/programme">
          View programme <ChevronRight size={17} />
        </Link>
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

      {/* Today card */}
      <section className="today-card">
        <div className="lesson-symbol">
          <Headphones size={44} />
        </div>

        <div className="today-main">
          <span className="eyebrow">WEEK 1 · DAY 1</span>
          <h2>Listening + Speaking</h2>
          <p>
            Understand main ideas and detail in academic contexts; speak clearly with
            structure and coherence.
          </p>
          <div className="lesson-meta">
            <span>◷ Est. time <b>90 min</b></span>
            <span>◫ Focus <b>Accuracy &amp; clarity</b></span>
            <span>◎ Outcome <b>Stronger responses</b></span>
          </div>
          <Link className="primary-button" href="/learn/1/1">
            <Play size={17} fill="currentColor" /> Start today&apos;s lesson
          </Link>
          <Link className="subtle-link" href="/sample/day-1" style={{ marginLeft: 18 }}>
            Preview sample
          </Link>
        </div>

        <aside className="today-plan">
          <h3>Today&apos;s plan</h3>
          {[
            ["1", "Listening",      "30 min"],
            ["2", "Speaking",       "30 min"],
            ["3", "Skill drill",    "15 min"],
            ["4", "Review &amp; reflect", "15 min"],
          ].map(([number, label, time]) => (
            <div className="plan-step" key={number}>
              <b>{number}</b>
              <span>
                <strong dangerouslySetInnerHTML={{ __html: label }} />
                <small>{time}</small>
              </span>
            </div>
          ))}
          <div className="focus-note">
            <strong>Today&apos;s focus</strong>
            <p>Accuracy in understanding; clarity and coherence in speaking.</p>
          </div>
        </aside>
      </section>

      {/* Skill progress panel */}
      <section className="panel">
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

      {/* Lexical tracker panel */}
      <section className="panel lexical-panel">
        <SectionHeading
          title="Recent lexical growth"
          action={
            <Link className="text-link" href="/tracker">
              Open tracker <ChevronRight size={16} />
            </Link>
          }
        />
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Phrase</th>
                <th>Skill</th>
                <th>Confidence</th>
                <th>Reuse status</th>
                <th>Last used</th>
              </tr>
            </thead>
            <tbody>
              {phrases.map(([phrase, skill, confidence, reuse, last]) => (
                <tr key={phrase}>
                  <td><strong>{phrase}</strong></td>
                  <td>
                    <span
                      className="skill-badge"
                      style={{
                        background: `color-mix(in srgb, ${SKILL_COLORS[skill]} 12%, white)`,
                        color: SKILL_COLORS[skill],
                      }}
                    >
                      {skill}
                    </span>
                  </td>
                  <td>
                    <span className={`confidence ${confidence.toLowerCase()}`}>
                      {confidence}
                    </span>
                  </td>
                  <td>
                    <span className={reuse.startsWith("Not") ? "status pending" : "status reused"}>
                      {reuse}
                    </span>
                  </td>
                  <td>{last}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link href="/tracker" className="table-footer">
          Show all phrases <ChevronRight size={16} />
        </Link>
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
            { icon: TrendingUp, label: "Days completed", value: "1",    sub: "of 7 this week" },
            { icon: BookOpen,   label: "Phrases saved",  value: "12",   sub: "+3 this week"   },
            { icon: Search,     label: "Errors logged",  value: "4",    sub: "2 resolved"     },
            { icon: Mic2,       label: "Mocks attempted",value: "0",    sub: "Mock on Day 3"  },
          ].map(({ icon: Icon, label, value, sub }) => (
            <article
              key={label}
              className="metric"
            >
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

      {/* Support band */}
      <section className="support-band">
        <BookOpen size={24} />
        <div>
          <strong>Work with evidence, not guesswork.</strong>
          <p>Every completed lesson turns one mistake into a prevention rule.</p>
        </div>
        <Link href="/error-log" className="text-link">
          Open error log <ChevronRight size={16} />
        </Link>
        <BarChart3 className="support-art" size={65} />
      </section>
    </div>
  );
}
