"use client";

import {
  Bookmark,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  EyeOff,
  Headphones,
  Mic2,
  Pause,
  PenLine,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { sampleLesson } from "@/lib/sample-lesson";

type LessonPlayerProps = {
  sample?: boolean;
  audioSrc?: string;
};

type LessonSection = "listening" | "speaking" | "study" | "review";

const playbackRates = [1, 1.25, 1.5] as const;
const demoListeningAudio = "/sample-listening.mp3";
const lessonSections: Array<{ id: LessonSection; label: string }> = [
  { id: "listening", label: "Listening" },
  { id: "speaking", label: "Speaking" },
  { id: "study", label: "Study" },
  { id: "review", label: "Review" },
];

function formatTime(seconds: number) {
  const total = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function LessonPlayer({ sample = false, audioSrc }: LessonPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [answers, setAnswers] = useState<string[]>(Array(sampleLesson.questions.length).fill(""));
  const [notes, setNotes] = useState("");
  const [started, setStarted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [finished, setFinished] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioTime, setAudioTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<(typeof playbackRates)[number]>(1);
  const [audioError, setAudioError] = useState("");
  const [showNotes, setShowNotes] = useState(true);
  const [markedForReview, setMarkedForReview] = useState(false);
  const [activeSection, setActiveSection] = useState<LessonSection>("listening");
  const [speakingNotes, setSpeakingNotes] = useState("");
  const complete = useMemo(() => answers.filter(Boolean).length, [answers]);
  const source = audioSrc ?? demoListeningAudio;

  useEffect(() => {
    if (!started || finished) return;
    const timer = window.setInterval(() => setElapsedSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [finished, started]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    if (activeSection !== "listening") audioRef.current?.pause();
  }, [activeSection]);

  const updateAnswer = (index: number, value: string) => {
    setAnswers((items) => items.map((item, itemIndex) => itemIndex === index ? value : item));
  };

  const startTimer = () => setStarted(true);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || !source) {
      setAudioError("This lesson’s audio is not available until its private course release has been published.");
      return;
    }
    setAudioError("");
    startTimer();
    try {
      if (audio.paused) await audio.play();
      else audio.pause();
    } catch {
      setAudioError("The recording could not play in this browser. Please check your sound settings and try again.");
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

  const finishAttempt = () => {
    audioRef.current?.pause();
    setFinished(true);
    setActiveSection("speaking");
  };

  const clearAnswers = () => {
    setAnswers(Array(sampleLesson.questions.length).fill(""));
    setNotes("");
    setMarkedForReview(false);
  };

  const progress = audioDuration > 0 ? Math.min(100, (audioTime / audioDuration) * 100) : 0;

  return (
    <div className="lesson-workspace">
      <header className="lesson-tabs">
        <div>
          <strong>Day 1 · Listening + Speaking</strong>
          <span>90 min plan <ChevronDown size={15} /></span>
        </div>
        <nav aria-label="Lesson sections">
          {lessonSections.map((section) => (
            <button
              aria-current={activeSection === section.id ? "page" : undefined}
              className={activeSection === section.id ? "active" : ""}
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              type="button"
            >
              {section.label}
            </button>
          ))}
        </nav>
      </header>
      <div className="lesson-grid">
        <section className="lesson-paper">
          {activeSection === "listening" && (
            <>
              <span className="eyebrow">LISTENING · SECTION 4</span>
              <h1>Listening — Note completion</h1>
              <p className="lead">You will hear part of a lecture. Complete the notes below. Write <b>ONE WORD ONLY</b> for each answer.</p>
              {source && (
                <audio
                  ref={audioRef}
                  className="audio-element"
                  preload="metadata"
                  src={source}
                  onCanPlay={() => setAudioError("")}
                  onDurationChange={(event) => {
                    const duration = event.currentTarget.duration;
                    setAudioDuration(Number.isFinite(duration) ? duration : 0);
                  }}
                  onEnded={() => setIsPlaying(false)}
                  onError={() => setAudioError("The recording could not be loaded. Please refresh and try again.")}
                  onPause={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  onTimeUpdate={(event) => setAudioTime(event.currentTarget.currentTime)}
                />
              )}
              <div className="audio-player" aria-label="Listening audio player">
                <button className="audio-play" type="button" onClick={togglePlayback} aria-label={isPlaying ? "Pause listening audio" : "Play listening audio"}>
                  {isPlaying ? <Pause size={23} fill="currentColor" /> : <Play size={23} fill="currentColor" />}
                </button>
                <div className="audio-track" aria-label="Audio progress">
                  <span>{formatTime(audioTime)} / {audioDuration > 0 ? formatTime(audioDuration) : "--:--"}</span>
                  <i style={{ width: `${progress}%` }} />
                </div>
                <span className="replay">{sample ? "Original sample audio" : "Course audio"}</span>
                <button type="button" onClick={toggleMute} aria-label={isMuted ? "Turn sound on" : "Mute audio"}>{isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}</button>
                <button type="button" onClick={changeRate} aria-label={`Change playback speed, currently ${playbackRate} times`}>{playbackRate}× <ChevronDown size={14} /></button>
                <button type="button" onClick={rewind}><RotateCcw size={17} /> Rewind 5s</button>
              </div>
              {audioError && <p className="audio-error" role="alert">{audioError}</p>}
              <div className="question-notes-grid">
                <div className="questions-sheet">
                  <div className="question-topic">Topic: The development of <b>urban green spaces</b></div>
                  {sampleLesson.questions.map((question, index) => (
                    <label className="question-row" key={question}>
                      <span>{index + 1}.</span>
                      <p>{question.replace("________", "")}</p>
                      <input value={answers[index]} onChange={(event) => updateAnswer(index, event.target.value)} aria-label={`Answer to question ${index + 1}`} />
                    </label>
                  ))}
                  <footer>
                    <button className={markedForReview ? "marked" : ""} type="button" onClick={() => setMarkedForReview((value) => !value)}><Bookmark size={16} /> {markedForReview ? "Marked for review" : "Mark for review"}</button>
                    <span>Answered: {complete}/6</span>
                    <button type="button" onClick={clearAnswers}>Clear answers</button>
                  </footer>
                </div>
                {showNotes && (
                  <div className="notes-sheet">
                    <div>
                      <h2>Notes while listening</h2>
                      <button type="button" onClick={() => setShowNotes(false)}><EyeOff size={15} /> Hide</button>
                    </div>
                    <textarea value={notes} onChange={(event) => setNotes(event.target.value)} aria-label="Notes while listening" placeholder="Use this space to note keywords, numbers, and corrections." />
                  </div>
                )}
                {!showNotes && <button className="show-notes" type="button" onClick={() => setShowNotes(true)}><Eye size={15} /> Show notes</button>}
              </div>
              <section className="phrase-bank">
                <div className="phrase-bank-title">
                  <h2>Common phrases for Listening</h2>
                  <button type="button" onClick={() => setSaved(sampleLesson.phrases.map((item) => item.phrase))}><Bookmark size={16} /> Save all to Lexical Tracker</button>
                </div>
                <div className="phrase-list">
                  {sampleLesson.phrases.map((item) => (
                    <article key={item.phrase}>
                      <Headphones size={22} />
                      <div><strong>{item.phrase}</strong><p>Use to {item.use}.</p></div>
                      <button type="button" onClick={() => setSaved((all) => all.includes(item.phrase) ? all.filter((phrase) => phrase !== item.phrase) : [...all, item.phrase])}>{saved.includes(item.phrase) ? <><CheckCircle2 size={15} /> Saved</> : <><Bookmark size={15} /> Save</>}</button>
                    </article>
                  ))}
                </div>
              </section>
            </>
          )}

          {activeSection === "speaking" && (
            <section className="speaking-section">
              <span className="eyebrow">SPEAKING · PARTS 2-3</span>
              <h1>Speaking — Develop and justify ideas</h1>
              <p className="lead">Use your listening topic as the bridge. Prepare for one minute, speak for up to two minutes, then answer follow-up questions with clear reasons and examples.</p>
              <div className="speaking-grid">
                <article className="speaking-card speaking-cue">
                  <Mic2 size={24} />
                  <span>Part 2 cue card</span>
                  <h2>Describe a green public space that is important in a city.</h2>
                  <p>You should say where it is, what people do there, why it is useful, and explain how it could be improved.</p>
                  <button className="primary-button" type="button" onClick={startTimer}><Play size={17} fill="currentColor" /> Start speaking timer</button>
                </article>
                <article className="speaking-card">
                  <PenLine size={24} />
                  <span>Planning notes</span>
                  <textarea value={speakingNotes} onChange={(event) => setSpeakingNotes(event.target.value)} aria-label="Speaking planning notes" placeholder="1. Place and purpose&#10;2. Benefits for residents&#10;3. One improvement&#10;Useful phrase: One aspect worth highlighting is..." />
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
                <div className="phrase-bank-title"><h2>Common phrases for Speaking</h2><span>Band 7+ control</span></div>
                <div className="phrase-list">
                  {[
                    ["One aspect worth highlighting is", "focus the examiner on your main idea"],
                    ["This is mainly because", "give a direct reason"],
                    ["A good example of this would be", "support your answer naturally"],
                  ].map(([phrase, use]) => (
                    <article key={phrase}>
                      <Mic2 size={22} />
                      <div><strong>{phrase}</strong><p>Use to {use}.</p></div>
                      <button type="button" onClick={() => setSaved((all) => all.includes(phrase) ? all.filter((item) => item !== phrase) : [...all, phrase])}>{saved.includes(phrase) ? <><CheckCircle2 size={15} /> Saved</> : <><Bookmark size={15} /> Save</>}</button>
                    </article>
                  ))}
                </div>
              </section>
            </section>
          )}

          {activeSection === "study" && (
            <section className="study-section">
              <span className="eyebrow">STUDY · TRANSFER</span>
              <h1>Study — Turn answers into reusable language</h1>
              <p className="lead">Compare your listening notes with the speaking phrases. Your goal is to reuse precise vocabulary without sounding memorised.</p>
              <div className="review-reveal">
                <h2>Today’s transfer task</h2>
                <p>Write three original sentences about urban green spaces using: <b>it is important to note that</b>, <b>this leads to</b>, and <b>a good example of this would be</b>.</p>
              </div>
            </section>
          )}

          {activeSection === "review" && (
            <section className="review-reveal">
              <span className="eyebrow">{finished ? "ATTEMPT COMPLETE" : "REVIEW LOCKED"}</span>
              <h2>{finished ? "Review your answers" : "Finish the listening attempt first"}</h2>
              {finished ? (
                <>
                  <ol>{sampleLesson.review.answers.map((answer, index) => <li key={answer}><b>{index + 1}.</b> {answer}</li>)}</ol>
                  <details><summary>Show sample transcript and explanation</summary><p>{sampleLesson.review.transcript}</p></details>
                  <button className="primary-button" type="button" onClick={() => setActiveSection("speaking")}>Continue to Speaking</button>
                </>
              ) : (
                <p>Complete the listening task and click Finish attempt. Then the answer key, transcript, and speaking bridge will open.</p>
              )}
            </section>
          )}
        </section>
        <aside className="lesson-rail">
          <section><Clock3 size={21} /><h2>Timing guidance</h2><p>{activeSection === "speaking" ? "You have 30 minutes for the speaking task." : "You have 30 minutes for this task."}</p><ol className="timing-list">{activeSection === "speaking" ? <><li><b>Plan</b><span>1 min</span></li><li><b>Part 2</b><span>2 min</span></li><li><b>Part 3</b><span>8 min</span></li><li><b>Self-review</b><span>5 min</span></li></> : <><li><b>Listen</b><span>~7 min</span></li><li><b>Complete notes</b><span>~13 min</span></li><li><b>Check</b><span>~5 min</span></li><li><b>Review</b><span>~5 min</span></li></>}</ol></section>
          <section><Clock3 size={21} /><h2>Your timing</h2><strong className="timer-value">{formatTime(elapsedSeconds)}</strong><p>Recommended total: 30 min</p><button className="outline-button" type="button" onClick={startTimer}>Start timer</button></section>
          <section className="finish-box"><CheckCircle2 size={21} /><h2>{activeSection === "speaking" ? "Complete speaking" : "Finish attempt"}</h2><p>{activeSection === "speaking" ? "When you finish, review your structure, fluency, and phrase reuse." : "When you finish listening, the lesson will move into Speaking."}</p><button className="primary-button full" type="button" onClick={activeSection === "speaking" ? () => setActiveSection("review") : finishAttempt}>{activeSection === "speaking" ? "Go to review" : sample ? "Finish sample attempt" : "Finish attempt"}</button></section>
        </aside>
      </div>
    </div>
  );
}
