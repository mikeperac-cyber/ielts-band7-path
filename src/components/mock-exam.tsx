"use client";

import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flag,
  Pause,
  Play,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const sections: Array<[string, string, number]> = [
  ["Listening", "30 min",      30 * 60],
  ["Reading",   "60 min",      60 * 60],
  ["Writing",   "60 min",      60 * 60],
  ["Speaking",  "11–14 min",   14 * 60],
];

const answers = [
  "To introduce a new community library service",
  "Residents requested better access to resources",
  "3",
  "Thursday",
  "six",
];

function formatHMS(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Colour state based on remaining time */
function timerClass(remaining: number): string {
  if (remaining <= 10 * 60) return "critical";
  if (remaining <= 30 * 60) return "warning";
  return "";
}

export function MockExam({ harder = false }: { harder?: boolean }) {
  const [active,   setActive]   = useState(0);
  const [running,  setRunning]  = useState(false);
  const [time,     setTime]     = useState(2 * 60 * 60 + 45 * 60);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState<Set<number>>(new Set());
  const [current,  setCurrent]  = useState(0); // current question in grid

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(
      () => setTime((v) => Math.max(0, v - 1)),
      1000
    );
    return () => clearInterval(timer);
  }, [running]);

  const clockClass = useMemo(() => timerClass(time), [time]);

  const handleAnswer = (idx: number) => {
    setSelected(idx);
    setAnswered((prev) => new Set(prev).add(current));
  };

  return (
    <div className="mock-layout">
      {/* Header */}
      <header className="mock-header">
        <div>
          <span className="mock-logo">IELTS</span>
          <h1>Full Mock {harder ? "2" : "1"} · Academic IELTS</h1>
        </div>
        <div className={`mock-clock ${clockClass}`}>
          <Clock3 size={21} />
          <span>
            Time remaining
            <strong aria-live="polite" aria-label={`${formatHMS(time)} remaining`}>
              {formatHMS(time)}
            </strong>
          </span>
          <button className="danger-button" type="button">
            End test
          </button>
        </div>
      </header>

      {/* Sidebar – section selector */}
      <aside className="mock-sidebar" aria-label="Exam sections">
        {sections.map(([label, duration], index) => (
          <button
            key={label}
            className={active === index ? "active" : ""}
            onClick={() => setActive(index)}
            type="button"
            aria-current={active === index ? "true" : undefined}
          >
            <span>{index + 1}</span>
            <div>
              <strong>{label}</strong>
              <small>{duration}</small>
              <em>{index === 0 ? `${answered.size} answered` : "Not started"}</em>
              {index === 0 && (
                <i>
                  {Array.from({ length: 20 }, (_, q) => (
                    <b
                      key={q}
                      className={[
                        q === current ? "current" : "",
                        answered.has(q) ? "answered" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {q + 1}
                    </b>
                  ))}
                </i>
              )}
            </div>
          </button>
        ))}
      </aside>

      {/* Paper */}
      <main className="mock-paper" aria-label={`${sections[active][0]} paper`}>
        <span className="eyebrow">SECTION {active + 1}</span>
        <h2>{active === 0 ? "Questions 1–10" : `${sections[active][0]} paper`}</h2>

        {active === 0 ? (
          <>
            <p>
              Complete the notes below. Write{" "}
              <b>NO MORE THAN THREE WORDS AND/OR A NUMBER</b> for each answer.
            </p>

            {/* Multiple choice Q1 */}
            <div className="mock-question">
              <b>1</b>
              <div>
                <p>What is the main purpose of the talk?</p>
                {[
                  answers[0],
                  answers[1],
                  "To explain how to volunteer in the library",
                  "To evaluate existing library resources",
                ].map((answer, index) => (
                  <label key={answer}>
                    <input
                      type="radio"
                      name="mock-q1"
                      checked={current === 0 && selected === index}
                      onChange={() => handleAnswer(index)}
                    />{" "}
                    <span>{String.fromCharCode(65 + index)}</span> {answer}
                  </label>
                ))}
              </div>
            </div>

            {/* Multiple choice Q2 */}
            <div className="mock-question">
              <b>2</b>
              <div>
                <p>According to the speaker, why has the service been introduced?</p>
                {[
                  "There is an increase in library membership.",
                  "The town council has a new cultural strategy.",
                  "Residents requested better access to resources.",
                  "Schools are reducing their library opening hours.",
                ].map((answer, index) => (
                  <label key={answer}>
                    <input
                      type="radio"
                      name="mock-q2"
                      onChange={() => {
                        setCurrent(1);
                        setAnswered((prev) => new Set(prev).add(1));
                      }}
                    />{" "}
                    <span>{String.fromCharCode(65 + index)}</span> {answer}
                  </label>
                ))}
              </div>
            </div>

            {/* Form completion Q3–6 */}
            <div className="form-completion">
              <h3>Community Library Service</h3>
              {[
                "New service starts on",
                "Mobile library visits will be once a",
                "People can borrow up to",
                "The service is funded by a grant from",
              ].map((label, index) => (
                <label key={label}>
                  {label}{" "}
                  <input
                    aria-label={label}
                    onChange={() => {
                      setCurrent(index + 2);
                      setAnswered((prev) => new Set(prev).add(index + 2));
                    }}
                  />{" "}
                  <b>{index + 3}</b>
                </label>
              ))}
            </div>
          </>
        ) : (
          <div className="mock-placeholder">
            <Flag size={30} />
            <h3>{sections[active][0]} begins when you select this section.</h3>
            <p>
              In the released course, this paper is delivered from the protected lesson release
              with its official timing.
            </p>
            <button
              className="primary-button"
              type="button"
              onClick={() => setRunning(true)}
            >
              <Play size={16} fill="currentColor" /> Begin section
            </button>
          </div>
        )}

        {/* Paper footer */}
        <footer>
          <button type="button">
            <ChevronLeft size={16} /> Previous
          </button>
          <span>
            <Bookmark size={16} /> Mark for review
          </span>
          <button
            type="button"
            onClick={() => setActive((v) => Math.min(3, v + 1))}
          >
            Next <ChevronRight size={16} />
          </button>
        </footer>
      </main>

      {/* Notes panel */}
      <aside className="mock-notes" aria-label="Exam notes">
        <div>
          <h2>Notes</h2>
          <button type="button">Clear</button>
        </div>
        <textarea aria-label="Mock exam notes" placeholder="Your notes here…" />
        <section>
          <Flag size={20} />
          <h3>Exam rules</h3>
          <ul>
            <li>Do not open another tab or application.</li>
            <li>Do not use a dictionary.</li>
            <li>Do not leave the test screen.</li>
          </ul>
          <button
            className="outline-button"
            type="button"
            onClick={() => setRunning((v) => !v)}
            style={{ marginTop: 12 }}
          >
            {running ? (
              <><Pause size={15} /> Pause timer</>
            ) : (
              <><Play size={15} fill="currentColor" /> Start timer</>
            )}
          </button>
        </section>
      </aside>

      {/* Bottom footer */}
      <footer className="mock-footer">
        {sections.map(([label, duration], index) => (
          <span
            key={label}
            className={active === index ? "active" : ""}
            onClick={() => setActive(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setActive(index)}
          >
            <b>{index + 1}</b>
            {label}
            <small>{duration}</small>
          </span>
        ))}
        <strong>
          <Clock3 size={19} /> Official total{" "}
          <b>2 h 45 m</b>
        </strong>
      </footer>
    </div>
  );
}
