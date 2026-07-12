"use client";

import Link from "next/link";
import { BarChart3, BookOpen, Headphones, Mic2, PenLine, Play, Search, ChevronRight } from "lucide-react";
import { Metric, SectionHeading } from "@/components/app-shell";

const phrases = [
  ["in light of the evidence", "Listening", "High", "Used 2 times", "Today"],
  ["a key factor in", "Speaking", "Medium", "Used 1 time", "2 days ago"],
  ["it can be inferred that", "Reading", "High", "Used 3 times", "Today"],
  ["consequently", "Writing", "Low", "Not yet used", "—"],
];

export function DashboardView() {
  return (
    <div className="page-wrap dashboard-page">
      <div className="page-intro"><div><h1>Your Band 7 Path</h1><p>A 10-week programme that turns focused daily practice into measurable improvement.</p></div><Link className="text-link" href="/programme">View programme <ChevronRight size={17} /></Link></div>
      <section className="week-strip" aria-label="Programme weeks"><div><strong>Week 1 of 10</strong><span>Building foundations</span></div><ol>{Array.from({ length: 10 }, (_, index) => <li className={index === 0 ? "current" : ""} key={index}>{index + 1}</li>)}</ol></section>
      <section className="today-card"><div className="lesson-symbol"><Headphones size={44} /></div><div className="today-main"><span className="eyebrow">WEEK 1 · DAY 1</span><h2>Listening + Speaking</h2><p>Understand main ideas and detail in academic contexts; speak clearly with structure and coherence.</p><div className="lesson-meta"><span>◷ Estimated time <b>90 min</b></span><span>◫ Focus <b>Accuracy & clarity</b></span><span>◎ Outcome <b>Stronger responses</b></span></div><Link className="primary-button" href="/learn/1/1"><Play size={17} fill="currentColor" /> Start today’s lesson</Link><Link className="subtle-link" href="/sample/day-1">Preview sample</Link></div><aside className="today-plan"><h3>Today’s plan</h3>{[["1", "Listening", "30 min"], ["2", "Speaking", "30 min"], ["3", "Skill drill", "15 min"], ["4", "Review & reflect", "15 min"]].map(([number, label, time]) => <div className="plan-step" key={number}><b>{number}</b><span><strong>{label}</strong><small>{time}</small></span></div>)}<div className="focus-note"><strong>Today’s focus</strong><p>Accuracy in understanding; clarity and coherence in speaking.</p></div></aside></section>
      <section className="panel"><SectionHeading title="Your skill progress" action={<Link className="text-link" href="/tracker">See full progress <ChevronRight size={16} /></Link>} /><div className="metrics-grid"><Metric label="Listening" value="58%" detail="Band 6.0 → 6.5" icon={Headphones} /><Metric label="Speaking" value="54%" detail="Band 6.0 → 6.5" icon={Mic2} /><Metric label="Reading" value="62%" detail="Band 6.0 → 7.0" icon={Search} /><Metric label="Writing" value="50%" detail="Band 6.0 → 6.5" icon={PenLine} /></div></section>
      <section className="panel lexical-panel"><SectionHeading title="Recent lexical growth" action={<Link className="text-link" href="/tracker">Open tracker <ChevronRight size={16} /></Link>} /><div className="table-scroll"><table><thead><tr><th>Phrase</th><th>Skill</th><th>Confidence</th><th>Reuse status</th><th>Last used</th></tr></thead><tbody>{phrases.map(([phrase, skill, confidence, reuse, last]) => <tr key={phrase}><td><strong>{phrase}</strong></td><td>{skill}</td><td><span className={`confidence ${confidence.toLowerCase()}`}>{confidence}</span></td><td><span className={reuse.startsWith("Not") ? "status pending" : "status"}>{reuse}</span></td><td>{last}</td></tr>)}</tbody></table></div><Link href="/tracker" className="table-footer">Show all <ChevronRight size={16} /></Link></section>
      <section className="support-band"><BookOpen size={24} /><div><strong>Work with evidence, not guesswork.</strong><p>Every completed lesson turns one mistake into a prevention rule.</p></div><Link href="/error-log" className="text-link">Open error log <ChevronRight size={16} /></Link><BarChart3 className="support-art" size={65} /></section>
    </div>
  );
}
