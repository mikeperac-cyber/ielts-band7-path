"use client";

import { AlertTriangle, CheckCircle2, Plus } from "lucide-react";
import { useState, type FormEvent } from "react";

type Skill = "Listening" | "Reading" | "Writing" | "Speaking";

export interface ErrorEntry {
  id?: string;
  skill: Skill;
  type: string;
  mistake: string;
  rule: string;
}

const SKILL_CLASS: Record<Skill, string> = {
  Listening: "listening",
  Reading:   "reading",
  Writing:   "writing",
  Speaking:  "speaking",
};

export function ErrorLogView({ initialErrors }: { initialErrors: ErrorEntry[] }) {
  const [errors, setErrors] = useState<ErrorEntry[]>(initialErrors);
  const [open,   setOpen]   = useState(false);
  const [draft,  setDraft]  = useState<ErrorEntry>({
    skill:   "Listening",
    type:    "",
    mistake: "",
    rule:    "",
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const updateDraft = (key: keyof ErrorEntry, value: string) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const add = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    const newError = {
      ...draft,
      type: draft.type.trim(),
      mistake: draft.mistake.trim(),
      rule: draft.rule.trim(),
    };
    if (!newError.type || !newError.mistake || !newError.rule) {
      setMessage("Complete all three fields to save a prevention rule.");
      return;
    }

    setSaving(true);
    setMessage("");
    setErrors((all) => [newError, ...all]);
    setDraft({ skill: "Listening", type: "", mistake: "", rule: "" });
    setOpen(false);

    try {
      const response = await fetch("/api/errors", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ skill: newError.skill, errorType: newError.type, mistake: newError.mistake, correctionRule: newError.rule }) });
      if (!response.ok) throw new Error("Save failed");
      const saved = await response.json() as { id?: string };
      if (saved.id) setErrors((all) => all.map((entry) => entry === newError ? { ...entry, id: saved.id } : entry));
      setMessage("Prevention rule saved.");
    } catch {
      setErrors((all) => all.filter((e) => e !== newError));
      setMessage("The prevention rule could not be saved.");
    } finally {
      setSaving(false);
    }
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

      {/* Band 9 rule callout */}
      <section className="error-principle">
        <AlertTriangle size={25} />
        <div>
          <strong>Band 9 rule</strong>
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
          <form onSubmit={add} aria-label="Add prevention rule">
            <div className="error-form-fields">
              <label>Skill
                <select value={draft.skill} onChange={(e) => updateDraft("skill", e.target.value as Skill)}>
                  <option>Listening</option>
                  <option>Reading</option>
                  <option>Writing</option>
                  <option>Speaking</option>
                </select>
              </label>
              <label>Error type
                <input autoFocus placeholder="e.g. Distractor" value={draft.type} onChange={(e) => updateDraft("type", e.target.value)} />
              </label>
              <label>What happened?
                <input placeholder="Describe the mistake" value={draft.mistake} onChange={(e) => updateDraft("mistake", e.target.value)} />
              </label>
              <label>Next-time rule
                <input placeholder="How will you prevent it?" value={draft.rule} onChange={(e) => updateDraft("rule", e.target.value)} />
              </label>
            </div>
            <div className="error-form-actions">
              <button className="primary-button" type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save rule"}
              </button>
              <button className="text-button" type="button" onClick={() => setOpen(false)} disabled={saving}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Error list */}
      <section className="error-list">
        {errors.map((entry, index) => (
          <article
            key={entry.id ?? `${entry.skill}-${index}`}
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
      {errors.length === 0 && <div className="empty-state"><h2>No errors logged yet</h2><p>Add a mistake only when you can turn it into a precise prevention rule.</p></div>}
      {message && <p role="status">{message}</p>}
    </div>
  );
}
