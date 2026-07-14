"use client";

import { Bookmark, CheckCircle2, Clock3, Headphones, Loader2, Mic2, Pause, PenLine, Play, RotateCcw, Sparkles, Square } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { gradeWriting, type WritingAssessment } from "@/actions/grade-writing";
import { transcribeAndGradeSpeaking, type SpeakingAssessmentResult } from "@/actions/transcribe-speaking";
import type { ActivityReview, CourseActivity, CourseLessonReviewV2, CourseLessonV2 } from "@/lib/course-content/types";

type Props = { lesson: CourseLessonV2; sample?: boolean; sampleReview?: CourseLessonReviewV2 };
type ResponseValue = string | string[];

const words = (value: string) => value.trim() ? value.trim().split(/\s+/).length : 0;
const formatTime = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

export function LessonPlayer({ lesson, sample = false, sampleReview }: Props) {
  const [activeId, setActiveId] = useState(lesson.activities[0]?.id ?? "");
  const [responses, setResponses] = useState<Record<string, ResponseValue>>({});
  const [attemptIds, setAttemptIds] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Set<string>>(new Set());
  const [reviews, setReviews] = useState<Record<string, ActivityReview>>({});
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("");
  const [savedPhrases, setSavedPhrases] = useState<Set<string>>(new Set());
  const [preparedListening, setPreparedListening] = useState<Set<string>>(new Set());
  const [writingAssessment, setWritingAssessment] = useState<WritingAssessment | null>(null);
  const [speakingAssessment, setSpeakingAssessment] = useState<SpeakingAssessmentResult | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [busy, setBusy] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordingChunks = useRef<BlobPart[]>([]);

  const active = lesson.activities.find((activity) => activity.id === activeId) ?? lesson.activities[0];
  const activeResponse = responses[active?.id ?? ""];

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (!recording) return;
    const interval = window.setInterval(() => setRecordingSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(interval);
  }, [recording]);

  useEffect(() => {
    if (sample || !active || !attemptIds[active.id] || activeResponse === undefined || submitted.has(active.id)) return;
    const timeout = window.setTimeout(() => {
      void fetch(`/api/attempts/${attemptIds[active.id]}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: activeResponse, elapsedSeconds: elapsed }),
      }).then((response) => { if (response.ok) setStatus("Draft saved"); });
    }, 800);
    return () => window.clearTimeout(timeout);
  }, [active, activeResponse, attemptIds, elapsed, sample, submitted]);

  const completeCount = useMemo(() => submitted.size, [submitted]);

  async function ensureAttempt(activity: CourseActivity) {
    if (sample) return "sample";
    if (attemptIds[activity.id]) return attemptIds[activity.id];
    if (!lesson.databaseId) throw new Error("This protected lesson has no database identifier.");
    const response = await fetch("/api/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: lesson.databaseId, activityId: activity.id, skill: activity.skill }),
    });
    if (!response.ok) throw new Error("Could not start the attempt.");
    const payload = await response.json() as { attemptId: string };
    setAttemptIds((current) => ({ ...current, [activity.id]: payload.attemptId }));
    return payload.attemptId;
  }

  function updateResponse(activity: CourseActivity, value: ResponseValue) {
    setRunning(true);
    setStatus("");
    setResponses((current) => ({ ...current, [activity.id]: value }));
    if (!sample) void ensureAttempt(activity).catch((error: Error) => setStatus(error.message));
  }

  async function submitActivity(activity: CourseActivity) {
    setBusy(true);
    setStatus("");
    try {
      const attemptId = await ensureAttempt(activity);
      if (sample) {
        const review = sampleReview?.activityReviews[activity.id];
        if (review) setReviews((current) => ({ ...current, [activity.id]: review }));
      } else {
        const submittedResponse = await fetch(`/api/attempts/${attemptId}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ response: responses[activity.id] ?? "", elapsedSeconds: elapsed }),
        });
        if (!submittedResponse.ok) throw new Error("The attempt could not be submitted.");
        const reviewResponse = await fetch(`/api/review/${attemptId}`, { cache: "no-store" });
        if (!reviewResponse.ok) throw new Error("The protected review could not be unlocked.");
        const review = await reviewResponse.json() as ActivityReview;
        setReviews((current) => ({ ...current, [activity.id]: review }));
      }
      const nextSubmitted = new Set(submitted).add(activity.id);
      setSubmitted(nextSubmitted);
      if (!sample && lesson.databaseId && nextSubmitted.size === lesson.activities.length) {
        await fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lessonId: lesson.databaseId, status: "completed", durationSeconds: elapsed }) });
        setRunning(false);
      }
      setStatus("Attempt submitted. Review unlocked.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function savePhrase(phrase: string) {
    if (sample) { setSavedPhrases((current) => new Set(current).add(phrase)); return; }
    const response = await fetch("/api/lexical", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phrase, skill: active.skill }) });
    if (response.ok) setSavedPhrases((current) => new Set(current).add(phrase));
    else setStatus("Phrase could not be saved.");
  }

  async function assessWriting(activity: Extract<CourseActivity, { kind: "writing" }>) {
    if (sample) return;
    if (!lesson.databaseId) { setStatus("This protected lesson has no database identifier."); return; }
    const text = typeof responses[activity.id] === "string" ? responses[activity.id] as string : "";
    setBusy(true);
    const result = await gradeWriting({ text, taskType: activity.taskType, lessonId: lesson.databaseId, activityId: activity.id, idempotencyKey: crypto.randomUUID() });
    if (result.success) setWritingAssessment(result.assessment);
    else setStatus(result.error);
    setBusy(false);
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recordingChunks.current = [];
      recorder.ondataavailable = (event) => { if (event.data.size) recordingChunks.current.push(event.data); };
      recorder.onstop = async () => {
        const blob = new Blob(recordingChunks.current, { type: recorder.mimeType || "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());
        if (!active || active.kind !== "speaking" || sample) return;
        setBusy(true);
        const form = new FormData();
        form.set("audio", blob, "speaking.webm");
        form.set("durationSeconds", String(recordingSeconds));
        form.set("lessonId", lesson.databaseId ?? "");
        form.set("activityId", active.id);
        form.set("idempotencyKey", crypto.randomUUID());
        const result = await transcribeAndGradeSpeaking(form);
        if (result.success) { setSpeakingAssessment(result); updateResponse(active, result.transcript); }
        else setStatus(result.error);
        setBusy(false);
      };
      recorder.start();
      mediaRecorder.current = recorder;
      setRecordingSeconds(0);
      setRecording(true);
      setRunning(true);
    } catch {
      setStatus("Microphone access is required to record a response.");
    }
  }

  function stopRecording() {
    mediaRecorder.current?.stop();
    setRecording(false);
  }

  if (!active) return null;
  return <div className="lesson-workspace">
    <div className="lesson-stepper" role="tablist" aria-label="Lesson activities">
      {lesson.activities.map((activity) => {
        const Icon = activity.kind === "listening" ? Headphones : activity.kind === "speaking" ? Mic2 : activity.kind === "writing" ? PenLine : BookIcon;
        return <button key={activity.id} type="button" role="tab" aria-selected={active.id === activity.id} className={`lesson-stepper-step ${active.id === activity.id ? "active" : submitted.has(activity.id) ? "done" : ""}`} onClick={() => { setActiveId(activity.id); setWritingAssessment(null); setSpeakingAssessment(null); }}>
          <span className="step-circle">{submitted.has(activity.id) ? <CheckCircle2 size={16} /> : <Icon size={15} />}</span><span className="step-label">{activity.skill}</span>
        </button>;
      })}
    </div>

    <div className="lesson-grid">
      <section className="lesson-paper" aria-live="polite">
        <span className="eyebrow">{active.skill.toUpperCase()} · {active.minutes} MINUTES</span>
        <h1>{active.title}</h1>
        <p className="lead">{active.instructions}</p>

        {active.kind === "listening" && <ListeningPanel key={active.id} activity={active} value={Array.isArray(activeResponse) ? activeResponse : []} prepared={preparedListening.has(active.id)} onPreparationStart={() => setRunning(true)} onPrepared={() => setPreparedListening((current) => new Set(current).add(active.id))} onChange={(value) => updateResponse(active, value)} />}
        {active.kind === "reading" && <ReadingPanel activity={active} value={Array.isArray(activeResponse) ? activeResponse : []} onChange={(value) => updateResponse(active, value)} />}
        {active.kind === "writing" && <WritingPanel activity={active} value={typeof activeResponse === "string" ? activeResponse : ""} onChange={(value) => updateResponse(active, value)} assessment={writingAssessment} onAssess={() => assessWriting(active)} busy={busy} sample={sample} />}
        {active.kind === "speaking" && <SpeakingPanel activity={active} recording={recording} recordingSeconds={recordingSeconds} busy={busy} sample={sample} assessment={speakingAssessment} onStart={startRecording} onStop={stopRecording} />}

        <section className="phrase-bank">
          <div className="phrase-bank-title"><h2>Precision and natural reuse</h2><span>Band 9 control</span></div>
          <div className="phrase-list">{lesson.phrases.map((item) => <article key={item.phrase}><Bookmark size={20} /><div><strong>{item.phrase}</strong><p>Use to {item.use}; check collocation and register.</p></div><button type="button" onClick={() => void savePhrase(item.phrase)} disabled={savedPhrases.has(item.phrase)}>{savedPhrases.has(item.phrase) ? "Saved" : "Save"}</button></article>)}</div>
        </section>

        <button className="primary-button" type="button" disabled={busy || submitted.has(active.id) || (active.kind === "listening" && !preparedListening.has(active.id))} onClick={() => void submitActivity(active)}>{busy ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : submitted.has(active.id) ? "Submitted" : "Submit attempt and unlock review"}</button>
        {status && <p role="status">{status}</p>}
        {reviews[active.id] && <ReviewPanel review={reviews[active.id]} />}
      </section>

      <aside className="lesson-rail">
        <section><Clock3 size={21} /><h2>Your timing</h2><strong className="timer-value">{formatTime(elapsed)}</strong><p>{completeCount} of {lesson.activities.length} activities submitted</p><button className="outline-button" type="button" onClick={() => setRunning((value) => !value)}>{running ? "Pause timer" : "Start timer"}</button></section>
        <section><h2>Assessment status</h2><p>Short Reading and Listening drills report raw accuracy only. AI feedback is an unofficial practice estimate.</p></section>
      </aside>
    </div>
  </div>;
}

const BookIcon = PenLine;

function ListeningPanel({ activity, value, prepared, onPreparationStart, onPrepared, onChange }: { activity: Extract<CourseActivity, { kind: "listening" }>; value: string[]; prepared: boolean; onPreparationStart: () => void; onPrepared: () => void; onChange: (value: string[]) => void }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [preparationStarted, setPreparationStarted] = useState(prepared);
  const [preparationRemaining, setPreparationRemaining] = useState(prepared ? 0 : 30);

  useEffect(() => {
    if (!preparationStarted || prepared) return;
    const interval = window.setInterval(() => setPreparationRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(interval);
  }, [preparationStarted, prepared]);

  useEffect(() => {
    if (preparationStarted && preparationRemaining === 0 && !prepared) onPrepared();
  }, [onPrepared, preparationRemaining, preparationStarted, prepared]);

  return <>
    <audio ref={audio} src={activity.audioUrl} preload="metadata" onEnded={() => setPlaying(false)} onError={() => setPlaying(false)} />
    {!preparationStarted ? <section className="listening-preparation" aria-labelledby={`${activity.id}-preparation-title`}>
      <Clock3 size={24} aria-hidden="true" />
      <div><h2 id={`${activity.id}-preparation-title`}>Introduction complete</h2><p>When you are ready, begin the required 30-second preparation gap. The recording and answer fields will stay locked until it finishes.</p></div>
      <button type="button" className="outline-button" onClick={() => { setPreparationStarted(true); onPreparationStart(); }}>Begin 30-second preparation</button>
    </section> : <>
      <section className={`listening-preparation ${prepared ? "complete" : "counting"}`} aria-label="Listening preparation">
        <Clock3 size={24} aria-hidden="true" />
        <div><h2>{prepared ? "Preparation complete" : "Read the questions"}</h2><p>{prepared ? "The listening exercise is now unlocked." : "Use this time to inspect the questions. The recording will unlock when the countdown reaches zero."}</p></div>
        {prepared ? <strong className="preparation-ready" role="status">Ready</strong> : <strong className="preparation-timer" role="timer" aria-label={`${preparationRemaining} seconds remaining`}>{formatTime(preparationRemaining)}</strong>}
      </section>
      {prepared ? <div className="audio-controls"><button type="button" className="audio-main-button" onClick={async () => { if (!audio.current) return; if (audio.current.paused) { await audio.current.play(); setPlaying(true); } else { audio.current.pause(); setPlaying(false); } }}>{playing ? <Pause size={20} /> : <Play size={20} />} {playing ? "Pause" : "Play recording"}</button><button type="button" onClick={() => { if (audio.current) audio.current.currentTime = Math.max(0, audio.current.currentTime - 5); }}><RotateCcw size={16} /> 5s</button></div> : null}
      <QuestionList questions={activity.questions} value={value} disabled={!prepared} onChange={onChange} />
    </>}
  </>;
}

function ReadingPanel({ activity, value, onChange }: { activity: Extract<CourseActivity, { kind: "reading" }>; value: string[]; onChange: (value: string[]) => void }) {
  return <><article className="review-reveal"><h2>Passage</h2>{activity.passage.split(/\n\n+/).map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)}</article><QuestionList questions={activity.questions} value={value} onChange={onChange} /></>;
}

function QuestionList({ questions, value, disabled = false, onChange }: { questions: Array<{ id: string; prompt: string; answerLimit?: string; options?: string[] }>; value: string[]; disabled?: boolean; onChange: (value: string[]) => void }) {
  return <ol className={`question-list ${disabled ? "is-locked" : ""}`}>{questions.map((question, index) => <li key={question.id}><span>{question.prompt}</span>{question.options ? <fieldset disabled={disabled}><legend className="sr-only">Choose one answer</legend>{question.options.map((option) => <label key={option}><input type="radio" name={question.id} value={option} checked={value[index] === option} onChange={() => onChange(questions.map((_, itemIndex) => itemIndex === index ? option : value[itemIndex] ?? ""))} /> {option}</label>)}</fieldset> : <><label className="sr-only" htmlFor={question.id}>Answer</label><input id={question.id} aria-label={question.prompt} disabled={disabled} value={value[index] ?? ""} onChange={(event) => onChange(questions.map((_, itemIndex) => itemIndex === index ? event.target.value : value[itemIndex] ?? ""))} /><small>{question.answerLimit}</small></>}</li>)}</ol>;
}

function WritingPanel({ activity, value, onChange, assessment, onAssess, busy, sample }: { activity: Extract<CourseActivity, { kind: "writing" }>; value: string; onChange: (value: string) => void; assessment: WritingAssessment | null; onAssess: () => void; busy: boolean; sample: boolean }) {
  return <><article className="review-reveal"><h2>Prompt</h2><p>{activity.prompt}</p></article><textarea className="writing-area" value={value} onChange={(event) => onChange(event.target.value)} aria-label="Writing response" placeholder={`Write at least ${activity.minimumWords} words…`} /><p>{words(value)} words · minimum {activity.minimumWords}</p>{sample ? <p>Sign in to use cost-controlled AI practice feedback.</p> : <button type="button" className="outline-button" disabled={busy || words(value) < activity.minimumWords} onClick={onAssess}><Sparkles size={16} /> Get unofficial AI practice estimate</button>}{assessment && <article className="review-reveal"><h2>Practice estimate</h2><p>Task response {assessment.criteria.taskResponse.toFixed(1)} · Coherence {assessment.criteria.coherenceCohesion.toFixed(1)} · Lexical {assessment.criteria.lexicalResource.toFixed(1)} · Grammar {assessment.criteria.grammaticalRangeAccuracy.toFixed(1)}</p><p>{assessment.limitingFeatures.join(" ")}</p><ol>{assessment.nextActions.map((action) => <li key={action}>{action}</li>)}</ol></article>}</>;
}

function SpeakingPanel({ activity, recording, recordingSeconds, busy, sample, assessment, onStart, onStop }: { activity: Extract<CourseActivity, { kind: "speaking" }>; recording: boolean; recordingSeconds: number; busy: boolean; sample: boolean; assessment: SpeakingAssessmentResult | null; onStart: () => void; onStop: () => void }) {
  return <><section className="speaking-followups"><h2>Part 1</h2><ol>{activity.part1.map((question) => <li key={question}>{question}</li>)}</ol><h2>Part 2 cue card</h2><p><strong>{activity.part2.topic}</strong></p><ul>{activity.part2.prompts.map((prompt) => <li key={prompt}>{prompt}</li>)}</ul><p>Preparation: 1 minute · Talk: up to 2 minutes</p><h2>Part 3</h2><ol>{activity.part3.map((question) => <li key={question}>{question}</li>)}</ol></section>{sample ? <p>Recording and paid assessment require an account.</p> : <button type="button" className="primary-button" disabled={busy} onClick={recording ? onStop : onStart}>{recording ? <><Square size={16} /> Stop ({formatTime(recordingSeconds)})</> : <><Mic2 size={16} /> Record response</>}</button>}{assessment?.success && <article className="review-reveal"><h2>Unofficial partial Speaking estimate</h2><p>Fluency and Coherence {assessment.assessment.criteria.fluencyCoherence.toFixed(1)} · Lexical Resource {assessment.assessment.criteria.lexicalResource.toFixed(1)} · Grammar {assessment.assessment.criteria.grammaticalRangeAccuracy.toFixed(1)}</p><p><strong>Pronunciation: not assessed.</strong> No official overall Speaking band is shown.</p><p>{assessment.assessment.feedback}</p></article>}</>;
}

function ReviewPanel({ review }: { review: ActivityReview }) {
  return <section className="review-reveal"><span className="eyebrow">PROTECTED REVIEW</span><h2>Review after submission</h2>{review.acceptableAnswers && <ol>{review.acceptableAnswers.map((answers, index) => <li key={`${index}-${answers[0]}`}>{index + 1}. {answers.join(" / ")}{review.explanations?.[index] ? ` — ${review.explanations[index]}` : ""}</li>)}</ol>}{review.transcript && <details><summary>Show transcript</summary><p>{review.transcript}</p></details>}{review.modelResponse && <details><summary>Show model response</summary><p>{review.modelResponse}</p></details>}</section>;
}
