"use client";

import {
  Bookmark,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  EyeOff,
  Headphones,
  Pause,
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

const playbackRates = [1, 1.25, 1.5] as const;
const demoListeningAudio = "/sample-listening.mp3";

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
          <button className="active" type="button">Listening</button>
          <button type="button">Speaking</button>
          <button type="button">Study</button>
          <button type="button">Review</button>
        </nav>
      </header>
      <div className="lesson-grid">
        <section className="lesson-paper">
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
          {finished && (
            <section className="review-reveal">
              <span className="eyebrow">ATTEMPT COMPLETE</span>
              <h2>Review your answers</h2>
              <ol>{sampleLesson.review.answers.map((answer, index) => <li key={answer}><b>{index + 1}.</b> {answer}</li>)}</ol>
              <details><summary>Show sample transcript and explanation</summary><p>{sampleLesson.review.transcript}</p></details>
            </section>
          )}
        </section>
        <aside className="lesson-rail">
          <section><Clock3 size={21} /><h2>Timing guidance</h2><p>You have 30 minutes for this task.</p><ol className="timing-list"><li><b>Listen</b><span>~7 min</span></li><li><b>Complete notes</b><span>~13 min</span></li><li><b>Check</b><span>~5 min</span></li><li><b>Review</b><span>~5 min</span></li></ol></section>
          <section><Clock3 size={21} /><h2>Your timing</h2><strong className="timer-value">{formatTime(elapsedSeconds)}</strong><p>Recommended total: 30 min</p><button className="outline-button" type="button" onClick={startTimer}>Start timer</button></section>
          <section className="finish-box"><CheckCircle2 size={21} /><h2>Finish attempt</h2><p>When you finish, you can review answers with explanations and see the full transcript.</p><button className="primary-button full" type="button" onClick={finishAttempt}>{sample ? "Finish sample attempt" : "Finish attempt"}</button></section>
        </aside>
      </div>
    </div>
  );
}
