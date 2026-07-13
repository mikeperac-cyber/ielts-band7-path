"use client";

import {
  Bookmark,
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  Headphones,
  Mic2,
  Pause,
  PenLine,
  Play,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  BookOpen,
  FlaskConical,
  Star,
  Loader2,
  Sparkles,
  Square
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Lesson } from "@/lib/lessons/types";
import { BandContrastTable } from "./band-contrast-table";
import { gradeWriting } from "@/actions/grade-writing";
import { transcribeAndGradeSpeaking } from "@/actions/transcribe-speaking";

type LessonPlayerProps = {
  sample?: boolean;
  audioSrc?: string;
  stalePhrases?: { phrase: string; skill: string }[];
  lesson: Lesson;
};

type LessonSection = "listening" | "speaking" | "study" | "review";

const playbackRates = [0.8, 1, 1.25, 1.5] as const;
const demoListeningAudio = "/sample-listening.mp3";

interface StepConfig {
  id: LessonSection;
  label: string;
  icon: typeof Headphones;
  shortLabel: string;
}

const steps: StepConfig[] = [
  { id: "listening", label: "Listening",  shortLabel: "Listen",  icon: Headphones },
  { id: "speaking",  label: "Speaking",   shortLabel: "Speak",   icon: Mic2 },
  { id: "study",     label: "Study",      shortLabel: "Study",   icon: FlaskConical },
  { id: "review",    label: "Review",     shortLabel: "Review",  icon: Star },
];

const sectionOrder: LessonSection[] = ["listening", "speaking", "study", "review"];

function formatTime(seconds: number) {
  const total = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/** Animated waveform bars – shown when playing */
function Waveform({ playing }: { playing: boolean }) {
  return (
    <div className={`audio-waveform ${playing ? "" : "paused"}`} aria-hidden="true">
      {[...Array(5)].map((_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}

export function LessonPlayer({ sample = false, audioSrc, stalePhrases, lesson }: LessonPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [answers, setAnswers]         = useState<string[]>(Array(lesson.questions.length).fill(""));
  const [notes, setNotes]             = useState("");
  const [started, setStarted]         = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [finished, setFinished]       = useState(false);
  const [saved, setSaved]             = useState<string[]>([]);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [isMuted, setIsMuted]         = useState(false);
  const [audioTime, setAudioTime]     = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<(typeof playbackRates)[number]>(1);
  const [audioError, setAudioError]   = useState("");
  const [showNotes, setShowNotes]     = useState(true);
  const [markedForReview, setMarkedForReview] = useState(false);
  const [activeSection, setActiveSection] = useState<LessonSection>("listening");
  const [speakingNotes, setSpeakingNotes] = useState("");
  const [studyText, setStudyText] = useState("");
  const [isSavingStudy, setIsSavingStudy] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [readingTimeActive, setReadingTimeActive] = useState(false);
  const [readingTimeRemaining, setReadingTimeRemaining] = useState(30);
  const [aiFeedback, setAiFeedback] = useState("");
  const [aiBand, setAiBand] = useState<number | null>(null);

  // Speaking Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [speakingResult, setSpeakingResult] = useState<any>(null);

  const complete = useMemo(() => answers.filter(Boolean).length, [answers]);
  const source   = audioSrc ?? demoListeningAudio;

  // Section completion tracking
  const completedSections = useMemo<Set<LessonSection>>(() => {
    const s = new Set<LessonSection>();
    if (finished) { s.add("listening"); }
    if (activeSection === "review" || activeSection === "study") { s.add("speaking"); }
    return s;
  }, [finished, activeSection]);

  // Elapsed timer
  useEffect(() => {
    if (!started || finished) return;
    const timer = window.setInterval(() => setElapsedSeconds((v) => v + 1), 1000);
    return () => window.clearInterval(timer);
  }, [finished, started]);

  // Reading time countdown
  useEffect(() => {
    if (!readingTimeActive || readingTimeRemaining <= 0) return;
    const timer = window.setInterval(() => {
      setReadingTimeRemaining((prev) => {
        if (prev <= 1) {
          setReadingTimeActive(false);
          // auto-play when time is up
          audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [readingTimeActive, readingTimeRemaining]);

  // Playback rate sync
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  // Pause audio when leaving listening tab
  useEffect(() => {
    if (activeSection !== "listening") audioRef.current?.pause();
  }, [activeSection]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === "Space") {
        e.preventDefault();
        togglePlayback();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        rewind();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        if (audioRef.current) audioRef.current.currentTime = Math.min(audioDuration, audioRef.current.currentTime + 5);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [audioDuration]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateAnswer = useCallback((index: number, value: string) => {
    setAnswers((items) => items.map((item, i) => (i === index ? value : item)));
  }, []);

  const startTimer = () => setStarted(true);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || !source) {
      setAudioError("This lesson's audio is not available until its private course release has been published.");
      return;
    }
    setAudioError("");
    startTimer();

    // Handle Reading Time Gap
    if (readingTimeRemaining > 0 && !readingTimeActive && !isPlaying && activeSection === "listening") {
      setReadingTimeActive(true);
      return;
    }
    if (readingTimeActive) {
      // Skip reading time if they click while active
      setReadingTimeActive(false);
      setReadingTimeRemaining(0);
    }

    try {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch {
      setAudioError("The recording could not play. Please check your sound settings and try again.");
    }
  };

  const rewind = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(audioRef.current.muted);
  };

  const changeRate = () => {
    const currentIndex = playbackRates.indexOf(playbackRate);
    setPlaybackRate(playbackRates[(currentIndex + 1) % playbackRates.length]);
  };

  const seekAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Number(e.target.value);
    setAudioTime(Number(e.target.value));
  };

  const finishAttempt = async () => {
    audioRef.current?.pause();
    setFinished(true);
    setActiveSection("speaking");
    
    // Save progress to DB (Fire and forget, optimistic)
    if (!sample && !isSavingProgress) {
      setIsSavingProgress(true);
      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId: "mock-lesson-id", // In a real scenario, pass actual lessonId
            status: "completed",
            durationSeconds: elapsedSeconds
          })
        });
      } catch (err) {
        console.error("Failed to save progress", err);
      }
    }
  };

  const clearAnswers = () => {
    setAnswers(Array(lesson.questions.length).fill(""));
    setNotes("");
    setMarkedForReview(false);
  };

  const toggleSaved = (phrase: string) => {
    setSaved((all) =>
      all.includes(phrase) ? all.filter((p) => p !== phrase) : [...all, phrase]
    );
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        await handleAudioUpload(blob);
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      // Reset timer if we are starting fresh
      setElapsedSeconds(0);
      setStarted(true);
    } catch (err) {
      console.error("Microphone access denied", err);
      alert("Microphone access denied or not available. Please allow microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(t => t.stop());
      setIsRecording(false);
    }
  };

  const handleAudioUpload = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm"); 
      
      const res = await transcribeAndGradeSpeaking(formData, elapsedSeconds || 1);
      if (res.success) {
        setSpeakingResult(res);
      } else {
        alert("Error grading response: " + (res.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred during transcription.");
    } finally {
      setIsTranscribing(false);
    }
  };

  // Audio seek slider progress CSS variable
  const audioProgressPct = audioDuration > 0 ? (audioTime / audioDuration) * 100 : 0;

  // Determine step state for the stepper
  const getStepState = (step: LessonSection): "done" | "active" | "locked" => {
    const idx = sectionOrder.indexOf(step);
    const activeIdx = sectionOrder.indexOf(activeSection);
    if (completedSections.has(step) || idx < activeIdx) return "done";
    if (step === activeSection) return "active";
    return "locked";
  };

  return (
    <div className="lesson-workspace">
      {/* Section stepper */}
      <div className="lesson-stepper" role="tablist" aria-label="Lesson sections">
        {steps.map((step, i) => {
          const state = getStepState(step.id);
          const Icon  = step.icon;
          return (
            <>
              <button
                key={step.id}
                role="tab"
                aria-selected={activeSection === step.id}
                aria-controls={`section-${step.id}`}
                className={`lesson-stepper-step ${state}`}
                onClick={() => {
                  // Only allow navigating back or to active; don't jump past unlocked
                  const targetIdx = sectionOrder.indexOf(step.id);
                  const activeIdx = sectionOrder.indexOf(activeSection);
                  if (targetIdx <= activeIdx || state === "done") {
                    setActiveSection(step.id);
                  }
                }}
                type="button"
              >
                <span className="step-circle" aria-hidden="true">
                  {state === "done" ? <CheckCircle2 size={16} /> : <Icon size={15} />}
                </span>
                <span className="step-label">{step.shortLabel}</span>
              </button>
              {i < steps.length - 1 && (
                <div
                  key={`conn-${i}`}
                  className={`stepper-connector ${getStepState(sectionOrder[i + 1]) === "locked" ? "" : "done"}`}
                  aria-hidden="true"
                />
              )}
            </>
          );
        })}
      </div>

      <div className="lesson-grid">
        {/* Main content area */}
        <section
          className="lesson-paper"
          id={`section-${activeSection}`}
          role="tabpanel"
          aria-label={`${activeSection} section`}
        >
          {/* ── LISTENING ── */}
          {activeSection === "listening" && (
            <>
              <span className="eyebrow">LISTENING · SECTION 4</span>
              <h1>Listening — Note completion</h1>
              <p className="lead">
                You will hear part of a lecture. Complete the notes below.{" "}
                Write <b>ONE WORD ONLY</b> for each answer.
              </p>

              {/* Hidden HTML audio element */}
              {source && (
                <audio
                  ref={audioRef}
                  className="audio-element"
                  preload="metadata"
                  src={source}
                  onCanPlay={() => setAudioError("")}
                  onDurationChange={(e) => {
                    const d = e.currentTarget.duration;
                    setAudioDuration(Number.isFinite(d) ? d : 0);
                  }}
                  onEnded={() => setIsPlaying(false)}
                  onError={() => setAudioError("The recording could not be loaded. Please refresh.")}
                  onPause={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  onTimeUpdate={(e) => setAudioTime(e.currentTarget.currentTime)}
                />
              )}

              {/* Redesigned audio player */}
              <div className="audio-player" aria-label="Listening audio player">
                {/* Play / Pause */}
                <button
                  className="audio-play"
                  type="button"
                  onClick={togglePlayback}
                  aria-label={readingTimeActive ? "Skip reading time" : isPlaying ? "Pause" : "Play"}
                >
                  {readingTimeActive ? <SkipForward size={22} fill="currentColor" /> : isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
                </button>

                {/* Waveform + seek or Reading Time */}
                {readingTimeActive ? (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--blue-2)", color: "var(--blue)", padding: "0 16px", borderRadius: 99, fontSize: 13, fontWeight: 700, border: "1px solid var(--blue)", height: 32 }}>
                    <span>Reading time: {readingTimeRemaining}s remaining</span>
                    <button onClick={togglePlayback} style={{ color: "var(--blue)", textDecoration: "underline", fontSize: 12 }}>Skip</button>
                  </div>
                ) : (
                  <div className="audio-track">
                    <span>
                      {formatTime(audioTime)} /{" "}
                      {audioDuration > 0 ? formatTime(audioDuration) : "--:--"}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={audioDuration || 100}
                      value={audioTime}
                      onChange={seekAudio}
                      aria-label="Seek audio"
                      style={{ "--audio-progress": `${audioProgressPct}%` } as React.CSSProperties}
                    />
                  </div>
                )}

                {/* Animated waveform */}
                <Waveform playing={isPlaying} />

                {/* Controls */}
                <button type="button" onClick={rewind} aria-label="Rewind 5 seconds">
                  <RotateCcw size={17} /> 5s
                </button>
                <button
                  type="button"
                  onClick={changeRate}
                  aria-label={`Speed: ${playbackRate}x`}
                  style={{ fontWeight: 800, fontSize: 12 }}
                >
                  {playbackRate}×
                </button>
                <button type="button" onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
                  {isMuted ? <VolumeX size={19} /> : <Volume2 size={19} />}
                </button>
                <span className="replay">{sample ? "Sample audio" : "Course audio"}</span>
              </div>

              {audioError && <p className="audio-error" role="alert">{audioError}</p>}

              {/* Question / notes grid */}
              <div className="question-notes-grid">
                <div className="questions-sheet">
                  <div className="question-topic">
                    Topic: <b>{lesson.topic}</b>
                  </div>
                  {lesson.questions.map((question, index) => (
                    <label className="question-row" key={question}>
                      <span>{index + 1}.</span>
                      <p>{question.replace("________", "")}</p>
                      <input
                        value={answers[index]}
                        onChange={(e) => updateAnswer(index, e.target.value)}
                        aria-label={`Answer to question ${index + 1}`}
                      />
                    </label>
                  ))}
                  <footer>
                    <button
                      className={markedForReview ? "marked" : ""}
                      type="button"
                      onClick={() => setMarkedForReview((v) => !v)}
                    >
                      <Bookmark size={16} />
                      {markedForReview ? "Marked" : "Mark for review"}
                    </button>
                    <span style={{ marginLeft: "auto" }}>Answered: {complete}/{lesson.questions.length}</span>
                    <button type="button" onClick={clearAnswers}>
                      Clear
                    </button>
                  </footer>
                </div>

                {showNotes ? (
                  <div className="notes-sheet">
                    <div>
                      <h2>Notes while listening</h2>
                      <button type="button" onClick={() => setShowNotes(false)}>
                        <EyeOff size={15} /> Hide
                      </button>
                    </div>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      aria-label="Notes while listening"
                      placeholder="Note keywords, numbers, and corrections here…"
                    />
                  </div>
                ) : (
                  <button className="show-notes" type="button" onClick={() => setShowNotes(true)}>
                    <Eye size={15} /> Show notes
                  </button>
                )}
              </div>

              {/* Phrase bank */}
              <section className="phrase-bank">
                <div className="phrase-bank-title">
                  <h2>Phrases for Listening</h2>
                  <button
                    type="button"
                    onClick={() => setSaved(lesson.phrases.map((p) => p.phrase))}
                  >
                    <Bookmark size={16} /> Save all
                  </button>
                </div>
                <div className="phrase-list">
                  {lesson.phrases.map((item) => (
                    <article key={item.phrase}>
                      <Headphones size={22} />
                      <div>
                        <strong>{item.phrase}</strong>
                        <p>Use to {item.use}.</p>
                      </div>
                      <button
                        type="button"
                        className={saved.includes(item.phrase) ? "saved" : ""}
                        onClick={() => toggleSaved(item.phrase)}
                      >
                        {saved.includes(item.phrase) ? (
                          <><CheckCircle2 size={15} /> Saved</>
                        ) : (
                          <><Bookmark size={15} /> Save</>
                        )}
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* ── SPEAKING ── */}
          {activeSection === "speaking" && (
            <section className="speaking-section">
              <span className="eyebrow">SPEAKING · PARTS 2–3</span>
              <h1>Speaking — Develop and justify ideas</h1>
              <p className="lead">
                Use your listening topic as the bridge. Prepare for one minute, speak for up
                to two minutes, then answer the follow-up questions with clear reasons and examples.
              </p>
              <div className="speaking-grid">
                <article className="speaking-card speaking-cue">
                  <Mic2 size={24} />
                  <span>Part 2 cue card</span>
                  <h2>Describe a green public space that is important in a city.</h2>
                  <p>
                    You should say where it is, what people do there, why it is useful,
                    and explain how it could be improved.
                  </p>
                  
                  {isTranscribing ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: "var(--blue-2)", borderRadius: 8, color: "var(--blue)", fontWeight: 600 }}>
                      <Loader2 size={18} className="animate-spin" /> Analyzing your pronunciation & grammar...
                    </div>
                  ) : speakingResult ? (
                    <div style={{ padding: 16, background: "var(--wash)", border: "1px solid var(--blue)", borderRadius: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <div style={{ background: "var(--blue)", color: "#fff", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: "bold" }}>
                          {speakingResult.gradeResult.estimatedBand?.overall ?? "?"}
                        </div>
                        <h3 style={{ margin: 0, fontSize: 16, color: "var(--navy)" }}>Speaking Analysis</h3>
                      </div>
                      <p style={{ fontSize: 13, color: "var(--muted)", fontStyle: "italic", marginBottom: 12 }}>
                        "{speakingResult.transcript}"
                      </p>
                      <p style={{ margin: 0, color: "var(--text)", fontSize: 14, whiteSpace: "pre-wrap" }}>
                        {speakingResult.gradeResult.feedback}
                      </p>
                      <button className="outline-button" style={{ marginTop: 16, width: "100%" }} onClick={() => setSpeakingResult(null)}>
                        Record Again
                      </button>
                    </div>
                  ) : isRecording ? (
                    <button className="primary-button" style={{ background: "var(--red)", border: "none" }} type="button" onClick={stopRecording}>
                      <Square size={17} fill="currentColor" /> Stop & Analyze ({formatTime(elapsedSeconds)})
                    </button>
                  ) : (
                    <button className="primary-button" type="button" onClick={startRecording}>
                      <Mic2 size={17} /> Record Answer
                    </button>
                  )}
                </article>
                <article className="speaking-card">
                  <PenLine size={24} />
                  <span>Planning notes</span>
                  <textarea
                    value={speakingNotes}
                    onChange={(e) => setSpeakingNotes(e.target.value)}
                    aria-label="Speaking planning notes"
                    placeholder={"1. Place and purpose\n2. Benefits for residents\n3. One improvement\nUseful phrase: One aspect worth highlighting is…"}
                  />
                </article>
              </div>
              <section className="speaking-followups">
                <h2>Part 3 follow-up questions</h2>
                <ol>
                  <li>Why do some cities fail to protect public spaces?</li>
                  <li>Should governments or local residents be responsible for maintaining parks?</li>
                  <li>How might urban design affect people&apos;s health in the future?</li>
                </ol>
              </section>
              <section className="phrase-bank">
                <div className="phrase-bank-title">
                  <h2>Phrases for Speaking</h2>
                  <span>Band 9+ control</span>
                </div>
                {stalePhrases && stalePhrases.length > 0 && (
                  <div style={{ background: "var(--orange-bg)", padding: 12, borderRadius: 8, marginBottom: 16 }}>
                    <strong style={{ display: "block", color: "var(--orange)", fontSize: 13, marginBottom: 4 }}>🎯 Challenge: Use these today</strong>
                    <p style={{ margin: 0, fontSize: 14, color: "var(--text)" }}>
                      You saved these phrases previously but haven't used them yet. Try fitting them into your answers!
                    </p>
                    <ul style={{ margin: "8px 0 0", paddingLeft: 20, fontSize: 14 }}>
                      {stalePhrases.map((p) => (
                        <li key={p.phrase}><b>{p.phrase}</b></li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="phrase-list">
                  {[
                    ["One aspect worth highlighting is", "focus the examiner on your main idea"],
                    ["This is mainly because", "give a direct reason"],
                    ["A good example of this would be", "support your answer naturally"],
                  ].map(([phrase, use]) => (
                    <article key={phrase}>
                      <Mic2 size={22} />
                      <div>
                        <strong>{phrase}</strong>
                        <p>Use to {use}.</p>
                      </div>
                      <button
                        type="button"
                        className={saved.includes(phrase) ? "saved" : ""}
                        onClick={() => toggleSaved(phrase)}
                      >
                        {saved.includes(phrase) ? (
                          <><CheckCircle2 size={15} /> Saved</>
                        ) : (
                          <><Bookmark size={15} /> Save</>
                        )}
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            </section>
          )}

          {/* ── STUDY ── */}
          {activeSection === "study" && (
            <section className="study-section">
              <span className="eyebrow">STUDY · TRANSFER</span>
              <h1>Study — Turn answers into reusable language</h1>
              <p className="lead">
                Compare your listening notes with the speaking phrases. Your goal is to reuse
                precise vocabulary without sounding memorised.
              </p>
              <div className="review-reveal">
                <BookOpen size={22} style={{ color: "#125237", marginBottom: 8 }} />
                <h2>Today&apos;s transfer task</h2>
                <p>
                  Write three original sentences based on the lesson&apos;s topic using:{" "}
                  {lesson.phrases.map((p, i) => (
                    <span key={i}>
                      <b>{p.phrase}</b>{i < lesson.phrases.length - 1 ? ", " : "."}
                    </span>
                  ))}
                </p>
                <div style={{ position: "relative", marginTop: 16 }}>
                  <textarea
                    value={studyText}
                    onChange={(e) => setStudyText(e.target.value)}
                    style={{ height: 180, width: "100%", background: "#fff", border: "1px solid #add8be", borderRadius: 6, padding: "10px 14px", resize: "vertical", paddingBottom: 40 }}
                    aria-label="Transfer task writing"
                    placeholder="Write your three sentences here…"
                  />
                  <div style={{ position: "absolute", bottom: 12, right: 12, display: "flex", gap: 12, alignItems: "center" }}>
                    {lastSaved && (
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>
                        Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                    <button
                      className="primary-button"
                      type="button"
                      disabled={isSavingStudy || !studyText.trim()}
                      onClick={async () => {
                        setIsSavingStudy(true);
                        setAiFeedback("");
                        try {
                          const result = await gradeWriting(studyText, "transfer");
                          if (result.success) {
                            setAiFeedback(result.feedback);
                            setAiBand(result.estimatedBand?.overall ?? null);
                            setLastSaved(new Date());
                          }
                        } catch (err) {
                          console.error(err);
                        } finally {
                          setIsSavingStudy(false);
                        }
                      }}
                      style={{ padding: "4px 12px", fontSize: 13, minHeight: "auto", transition: "all 0.3s ease" }}
                    >
                      {isSavingStudy ? <><Loader2 size={15} className="animate-spin" /> AI Analyzing...</> : <><Sparkles size={15} /> Save & Get AI Feedback</>}
                    </button>
                  </div>
                </div>
                {aiFeedback && (
                  <div style={{ marginTop: 24, padding: 20, background: "linear-gradient(135deg, var(--blue-2), var(--wash))", border: "1px solid var(--blue)", borderRadius: 12, animation: "fade-up 0.5s ease" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <div style={{ background: "var(--blue)", color: "#fff", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: "bold" }}>
                        {aiBand}
                      </div>
                      <h3 style={{ margin: 0, fontSize: 16, color: "var(--navy)" }}>AI Assessment</h3>
                    </div>
                    <p style={{ margin: 0, color: "var(--text)", fontSize: 15, lineHeight: 1.6 }}>{aiFeedback}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── REVIEW ── */}
          {activeSection === "review" && (
            <section className="review-reveal">
              <span className="eyebrow">{finished ? "ATTEMPT COMPLETE" : "REVIEW LOCKED"}</span>
              <h2>{finished ? "Review your answers" : "Finish the listening attempt first"}</h2>
              {finished ? (
                <>
                  <ol>
                    {lesson.review.answers.map((answer, index) => (
                      <li key={answer}>
                        <b>{index + 1}.</b> {answer}
                      </li>
                    ))}
                  </ol>
                  <details>
                    <summary>Show sample transcript and explanation</summary>
                    <p>{lesson.review.transcript}</p>
                  </details>
                  
                  {/* Band 7.5 vs 7 Contrast Table */}
                  <BandContrastTable 
                    contrasts={[
                      {
                        band6: "Parks are good for health.",
                        band7: "Urban green spaces demonstrably improve residents' psychological wellbeing.",
                        reasoning: "Band 9 uses precise vocabulary ('urban green spaces', 'demonstrably improve') and complex noun phrases ('psychological wellbeing') instead of basic, vague words ('parks', 'good', 'health')."
                      },
                      {
                        band6: "Cities need parks because they clean the air.",
                        band7: "Parks play a crucial role in mitigating urban air pollution.",
                        reasoning: "Band 9 employs topic-specific collocation ('mitigating air pollution', 'crucial role') and avoids simplistic causal links ('because they clean')."
                      }
                    ]} 
                  />

                  <button
                    className="primary-button"
                    type="button"
                    onClick={() => setActiveSection("speaking")}
                    style={{ marginTop: 20 }}
                  >
                    Continue to Speaking
                  </button>
                </>
              ) : (
                <p>
                  Complete the listening task and click <b>Finish attempt</b>. The answer key,
                  transcript, and speaking bridge will then open.
                </p>
              )}
            </section>
          )}
        </section>

        {/* ── RAIL ── */}
        <aside className="lesson-rail">
          <section>
            <Clock3 size={21} />
            <h2>Timing guidance</h2>
            <p>
              {activeSection === "speaking"
                ? "You have 30 minutes for the speaking task."
                : "You have 30 minutes for this task."}
            </p>
            <ol className="timing-list">
              {activeSection === "speaking" ? (
                <>
                  <li><b>Plan</b>  <span>1 min</span></li>
                  <li><b>Part 2</b><span>2 min</span></li>
                  <li><b>Part 3</b><span>8 min</span></li>
                  <li><b>Self-review</b><span>5 min</span></li>
                </>
              ) : (
                <>
                  <li><b>Listen</b>        <span>~7 min</span></li>
                  <li><b>Complete notes</b><span>~13 min</span></li>
                  <li><b>Check</b>         <span>~5 min</span></li>
                  <li><b>Review</b>        <span>~5 min</span></li>
                </>
              )}
            </ol>
          </section>

          <section>
            <Clock3 size={21} />
            <h2>Your timing</h2>
            <strong className="timer-value">{formatTime(elapsedSeconds)}</strong>
            <p>Recommended total: 30 min</p>
            <button className="outline-button" type="button" onClick={startTimer}>
              {started ? "Timer running" : "Start timer"}
            </button>
          </section>

          <section className="finish-box">
            <CheckCircle2 size={21} />
            <h2>{activeSection === "speaking" ? "Complete speaking" : "Finish attempt"}</h2>
            <p>
              {activeSection === "speaking"
                ? "When you finish, review your structure, fluency, and phrase reuse."
                : "When you finish listening, the lesson will move into Speaking."}
            </p>
            <button
              className={`primary-button full${complete === lesson.questions.length && activeSection === "listening" ? " pulse-cta" : ""}`}
              type="button"
              onClick={
                activeSection === "speaking"
                  ? () => setActiveSection("review")
                  : finishAttempt
              }
            >
              {activeSection === "speaking"
                ? "Go to review"
                : sample
                  ? "Finish sample attempt"
                  : "Finish attempt"}
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}
