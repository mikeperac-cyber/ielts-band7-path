"use client";

import { Bookmark, CheckCircle2, ChevronDown, Clock3, Eye, Headphones, Play, RotateCcw, Volume2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { sampleLesson } from "@/lib/sample-lesson";

function formatTime(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function LessonPlayer({ sample = false }: { sample?: boolean }) {
  const [answers, setAnswers] = useState<string[]>(Array(sampleLesson.questions.length).fill(""));
  const [notes, setNotes] = useState("");
  const [started, setStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [finished, setFinished] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const complete = useMemo(() => answers.filter(Boolean).length, [answers]);

  useEffect(() => {
    if (!started || finished) return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [started, finished]);

  const updateAnswer = (index: number, value: string) => setAnswers((items) => items.map((item, itemIndex) => itemIndex === index ? value : item));

  return (
    <div className="lesson-workspace">
      <header className="lesson-tabs"><div><strong>Day 1 · Listening + Speaking</strong><span>90 min plan <ChevronDown size={15} /></span></div><nav><a className="active">Listening</a><a>Speaking</a><a>Study</a><a>Review</a></nav></header>
      <div className="lesson-grid">
        <section className="lesson-paper">
          <span className="eyebrow">LISTENING · SECTION 2</span><h1>Listening — Note completion</h1><p className="lead">You will hear part of a lecture. Complete the notes below. Write <b>ONE WORD ONLY</b> for each answer.</p>
          <div className="audio-player"><button className="audio-play" onClick={() => setStarted(true)} aria-label="Start listening audio"><Play size={23} fill="currentColor" /></button><div className="audio-track"><span>{formatTime(seconds)} / 07:15</span><i style={{ width: `${Math.min(100, seconds / 4.35)}%` }} /></div><span className="replay">Replays left: 2</span><button aria-label="Adjust volume"><Volume2 size={20} /></button><button>1.0× <ChevronDown size={14} /></button><button><RotateCcw size={17} /> Rewind 5s</button></div>
          <div className="question-notes-grid"><div className="questions-sheet"><div className="question-topic">Topic: The development of <b>urban green spaces</b></div>{sampleLesson.questions.map((question, index) => <label className="question-row" key={question}><span>{index + 1}.</span><p>{question.replace("________", "")}</p><input value={answers[index]} onChange={(event) => updateAnswer(index, event.target.value)} aria-label={`Answer to question ${index + 1}`} /></label>)}<footer><span><Bookmark size={16} /> Mark for review</span><span>Answered: {complete}/6</span><button onClick={() => { setAnswers(Array(sampleLesson.questions.length).fill("")); setNotes(""); }}>Clear answers</button></footer></div><div className="notes-sheet"><div><h2>Notes while listening</h2><span><Eye size={15} /> Hide</span></div><textarea value={notes} onChange={(event) => setNotes(event.target.value)} aria-label="Notes while listening" placeholder="Use this space to note keywords, numbers, and corrections." /></div></div>
          <section className="phrase-bank"><div className="phrase-bank-title"><h2>Common phrases for Listening</h2><span><Bookmark size={16} /> Save all to Lexical Tracker</span></div><div className="phrase-list">{sampleLesson.phrases.map((item) => <article key={item.phrase}><Headphones size={22} /><div><strong>{item.phrase}</strong><p>Use to {item.use}.</p></div><button onClick={() => setSaved((all) => all.includes(item.phrase) ? all.filter((phrase) => phrase !== item.phrase) : [...all, item.phrase])}>{saved.includes(item.phrase) ? <><CheckCircle2 size={15} /> Saved</> : <><Bookmark size={15} /> Save</>}</button></article>)}</div></section>
          {finished && <section className="review-reveal"><span className="eyebrow">ATTEMPT COMPLETE</span><h2>Review your answers</h2><ol>{sampleLesson.review.answers.map((answer, index) => <li key={answer}><b>{index + 1}.</b> {answer}</li>)}</ol><details><summary>Show sample transcript and explanation</summary><p>{sampleLesson.review.transcript}</p></details></section>}
        </section>
        <aside className="lesson-rail"><section><Clock3 size={21} /><h2>Timing guidance</h2><p>You have 30 minutes for this task.</p><ol className="timing-list"><li><b>Listen</b><span>~7 min</span></li><li><b>Complete notes</b><span>~13 min</span></li><li><b>Check</b><span>~5 min</span></li><li><b>Review</b><span>~5 min</span></li></ol></section><section><Clock3 size={21} /><h2>Your timing</h2><strong className="timer-value">{formatTime(seconds)}</strong><p>Recommended total: 30 min</p><button className="outline-button" onClick={() => setStarted(true)}>Start timer</button></section><section className="finish-box"><CheckCircle2 size={21} /><h2>Finish attempt</h2><p>When you finish, you can review answers with explanations and see the full transcript.</p><button className="primary-button full" onClick={() => setFinished(true)}>{sample ? "Finish sample attempt" : "Finish attempt"}</button></section></aside>
      </div>
    </div>
  );
}
