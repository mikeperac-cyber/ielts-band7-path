"use client";

import Link from "next/link";
import { CheckCircle2, Clock3, ShieldAlert } from "lucide-react";

export function MockExam({ harder = false, week }: { harder?: boolean; week: number }) {
  return <main className="page-wrap">
    <div className="page-intro"><div><span className="eyebrow">WEEK {week} · {harder ? "HARDER " : ""}CHECKPOINT</span><h1>Timed diagnostic checkpoint</h1><p>This is a structured performance check, not a complete IELTS mock examination.</p></div></div>
    <section className="panel"><ShieldAlert size={28} /><h2>Honest assessment scope</h2><p>The current checkpoint does not contain complete 40-question Listening and Reading papers or a complete scored four-skill examination. It therefore produces no official mock total, Reading band conversion, or overall band trajectory.</p></section>
    <section className="panel"><h2>Use this checkpoint to collect evidence</h2><div className="metrics-grid">
      <article className="metric"><Clock3 size={20} /><strong>Listening</strong><small>Record raw accuracy and error categories only</small></article>
      <article className="metric"><Clock3 size={20} /><strong>Reading</strong><small>Record raw accuracy and evidence errors only</small></article>
      <article className="metric"><Clock3 size={20} /><strong>Writing</strong><small>Practise one official task format at a time</small></article>
      <article className="metric"><Clock3 size={20} /><strong>Speaking</strong><small>Practise Parts 1–3; pronunciation remains unscored by AI</small></article>
    </div></section>
    <section className="panel"><CheckCircle2 size={24} /><h2>Checkpoint protocol</h2><ol><li>Complete the week’s regular lessons first.</li><li>Set your own timer and work without reference materials.</li><li>Log every repeated mistake as a prevention rule.</li><li>Do not record the result as an official IELTS band.</li></ol><Link className="primary-button" href="/programme">Return to programme</Link></section>
  </main>;
}
