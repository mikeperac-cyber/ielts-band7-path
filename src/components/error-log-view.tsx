"use client";

import { AlertTriangle, CheckCircle2, Plus } from "lucide-react";
import { useState } from "react";

type Skill = "Listening" | "Reading" | "Writing" | "Speaking";

interface ErrorEntry {
  skill: Skill;
  type: string;
  mistake: string;
  rule: string;
}

const starterErrors: ErrorEntry[] = [
  {
    skill:   "Listening",
    type:    "Distractor",
    mistake: "Selected the first date mentioned",
    rule:    "Wait for the speaker's final correction.",
  },
  {
    skill:   "Writing",
    type:    "Task response",
    mistake: "Ideas did not address both parts",
    rule:    "Underline every task requirement before planning.",
  },
  {
    skill:   "Reading",
    type:    "Evidence",
    mistake: "Chose a related sentence, not the answer",
    rule:    "Locate and paraphrase the exact evidence.",
  },
];

const SKILL_CLASS: Record<Skill, string> = {
  Listening: "listening",
  Reading:   "reading",
  Writing:   "writing",
  Speaking:  "speaking",
};

export function ErrorLogView() {
  const [errors, setErrors] = useState<ErrorEntry[]>(starterErrors);
  const [open,   setOpen]   = useState(false);
  const [draft,  setDraft]  = useState<ErrorEntry>({
    skill:   "Listening",
    type:    "",
    mistake: "",
    rule:    "",
  });

  const updateDraft = (key: keyof ErrorEntry, value: string) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const add = () => {
    if (!draft.type || !draft.mistake || !draft.rule) return;
    setErrors((all) => [...all, { ...draft }]);
    setDraft({ skill: "Listening", type: "", mistake: "", rule: "" });
    setOpen(false);
  };

  return (
    <div className="page-wrap error-page">
      {/* Page intro */}
      <div className="page-intro">
        <div>
          <h1>Error Log</h1>
          <p>Every mistake should become one precise rule for your next attempt.</p>
        </div>
        <button className="primary-button" onClick={() => setOpen(true)}>
          <Plus size={17} /> Add error
        </button>
      </div>

      {/* Band 7 rule callout */}
      <section className="error-principle">
        <AlertTriangle size={25} />
        <div>
          <strong>Band 7 rule</strong>
          <p>
            Do not only record the correct answer. Write the cause of the mistake and the
            action that prevents it next time.
          </p>
        </div>
      </section>

      {/* Add error form */}
      {open && (
        <section className="error-form panel">
          <h2>Turn a mistake into a rule</h2>
          <div>
            <select
              value={draft.skill}
              onChange={(e) => updateDraft("skill", e.target.value as Skill)}
              aria-label="Skill"
            >
              <option>Listening</option>
              <option>Reading</option>
              <option>Writing</option>
              <option>Speaking</option>
            </select>
            <input
              placeholder="Error type (e.g. Distractor)"
              value={draft.type}
              onChange={(e) => updateDraft("type", e.target.value)}
            />
            <input
              placeholder="What happened?"
              value={draft.mistake}
              onChange={(e) => updateDraft("mistake", e.target.value)}
            />
            <input
              placeholder="Your prevention rule"
              value={draft.rule}
              onChange={(e) => updateDraft("rule", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
            />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button className="primary-button" onClick={add}>
              Save rule
            </button>
            <button className="text-button" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
        </section>
      )}

      {/* Error list */}
      <section className="error-list">
        {errors.map((entry, index) => (
          <article
            key={`${entry.skill}-${index}`}
            data-skill={entry.skill}
          >
            <div className="error-count">{index + 1}</div>
            <span className={`skill-tag ${SKILL_CLASS[entry.skill]}`}>
              {entry.skill}
            </span>
            <div>
              <h2>{entry.type}</h2>
              <p><b>What happened:</b> {entry.mistake}</p>
            </div>
            <div className="prevention">
              <CheckCircle2 size={18} />
              <p><b>Next-time rule:</b> {entry.rule}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
