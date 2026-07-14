"use client";

import { Check, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

export type TrackerSkill = "Listening" | "Reading" | "Writing" | "Speaking";
type Skill = TrackerSkill;
export type TrackerStatus = "Reused" | "Ready" | "Learning";
type Status = TrackerStatus;

export interface TrackerPhrase {
  phrase:     string;
  skill:      Skill;
  confidence: number; // 1–5
  use:        string;
  status:     Status;
}
type Phrase = TrackerPhrase;

const SKILL_COLORS: Record<Skill, string> = {
  Listening: "var(--skill-listening)",
  Speaking:  "var(--skill-speaking)",
  Reading:   "var(--skill-reading)",
  Writing:   "var(--skill-writing)",
};

const SKILL_BG: Record<Skill, string> = {
  Listening: "var(--skill-listening-bg)",
  Speaking:  "var(--skill-speaking-bg)",
  Reading:   "var(--skill-reading-bg)",
  Writing:   "var(--skill-writing-bg)",
};

const SKILLS: Array<"All" | Skill> = ["All", "Listening", "Reading", "Writing", "Speaking"];

/** Animated dot confidence row */
function DotConfidence({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span className="dot-confidence" aria-label={`Confidence ${value} of ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <i
          key={i}
          className={i < value ? "filled" : ""}
          style={i < value ? { animationDelay: `${i * 60}ms` } : undefined}
        />
      ))}
    </span>
  );
}

/** Filter chip button */
function FilterChip({
  label,
  active,
  onClick,
  color,
  bg,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
  bg?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        alignItems: "center",
        background: active ? (bg ?? "var(--blue-2)") : "#fff",
        border: `1px solid ${active ? (color ?? "var(--blue)") : "#c1d3e4"}`,
        borderRadius: 99,
        color: active ? (color ?? "var(--blue)") : "#385773",
        cursor: "pointer",
        display: "inline-flex",
        fontSize: 12,
        fontWeight: 700,
        gap: 4,
        padding: "5px 14px",
        transition: "all 200ms cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {label}
    </button>
  );
}

export function TrackerView({ initialPhrasesFromDb }: { initialPhrasesFromDb?: Phrase[] }) {
  const [phrases,   setPhrases]   = useState<Phrase[]>(initialPhrasesFromDb ?? []);
  const [query,     setQuery]     = useState("");
  const [filter,    setFilter]    = useState<"All" | Skill>("All");
  const [adding,    setAdding]    = useState(false);
  const [newPhrase, setNewPhrase] = useState("");
  const [newSkill, setNewSkill] = useState<Skill>("Writing");
  const [message, setMessage] = useState("");

  const filtered = useMemo(
    () =>
      phrases.filter(
        (p) =>
          p.phrase.toLowerCase().includes(query.toLowerCase()) &&
          (filter === "All" || p.skill === filter)
      ),
    [phrases, query, filter]
  );

  const save = async () => {
    if (!newPhrase.trim()) return;
    const response = await fetch("/api/lexical", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phrase: newPhrase.trim(), skill: newSkill }) });
    if (!response.ok) { setMessage("The phrase could not be saved."); return; }
    setPhrases((items) => [
      {
        phrase:     newPhrase.trim().toLowerCase(),
        skill:      newSkill,
        confidence: 1,
        use:        "Add your own example",
        status:     "Learning",
      },
      ...items,
    ]);
    setNewPhrase("");
    setAdding(false);
  };

  const logReuse = async (phrase: string) => {
    const response = await fetch("/api/lexical", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phrase }) });
    if (!response.ok) { setMessage("Reuse evidence could not be saved."); return; }
    setPhrases((items) =>
      items.map((p) =>
        p.phrase === phrase
          ? { ...p, confidence: Math.min(5, p.confidence + 1), status: "Reused" }
          : p
      )
    );
  };

  return (
    <div className="page-wrap tracker-page">
      {/* Page intro */}
      <div className="page-intro">
        <div>
          <h1>Lexical Tracker</h1>
          <p>Save useful language, practise it in context, then record every successful reuse.</p>
        </div>
        <button className="primary-button" onClick={() => setAdding(true)}>
          <Plus size={17} /> Add phrase
        </button>
      </div>

      {/* Summary cards */}
      <section className="tracker-summary">
        <article>
          <span>Saved phrases</span>
          <strong>{phrases.length}</strong>
          <small>Stored privately</small>
        </article>
        <article>
          <span>Reused successfully</span>
          <strong>{phrases.filter((phrase) => phrase.status === "Reused").length}</strong>
          <small>With recorded evidence</small>
        </article>
        <article>
          <span>Ready for exam use</span>
          <strong>{phrases.filter((phrase) => phrase.confidence >= 4).length}</strong>
          <small>Confidence 4–5</small>
        </article>
        <article>
          <span>Next review</span>
          <strong>{phrases.filter((phrase) => phrase.status !== "Reused").length}</strong>
          <small>Need natural reuse</small>
        </article>
      </section>

      {/* Add phrase inline form */}
      {adding && (
        <section className="add-phrase">
          <div>
            <h2>Add a phrase</h2>
            <p>Give it a function and practise it in your own sentence afterwards.</p>
          </div>
          <input
            autoFocus
            placeholder="e.g. a decisive factor in"
            value={newPhrase}
            onChange={(e) => setNewPhrase(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") void save(); }}
          />
          <select value={newSkill} onChange={(event) => setNewSkill(event.target.value as Skill)} aria-label="Phrase skill">{SKILLS.filter((skill) => skill !== "All").map((skill) => <option key={skill}>{skill}</option>)}</select>
          <button className="primary-button" onClick={() => void save()}>
            Save phrase
          </button>
          <button className="text-button" onClick={() => setAdding(false)}>
            Cancel
          </button>
        </section>
      )}

      {/* Table panel */}
      <section className="panel tracker-table">
        {/* Filter chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {SKILLS.map((s) => (
            <FilterChip
              key={s}
              label={s}
              active={filter === s}
              onClick={() => setFilter(s)}
              color={s !== "All" ? SKILL_COLORS[s as Skill] : undefined}
              bg={s !== "All" ? SKILL_BG[s as Skill] : undefined}
            />
          ))}
        </div>

        {/* Search + actions */}
        <div className="tracker-tools">
          <label>
            <Search size={17} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search phrases"
            />
          </label>
        </div>

        {/* Phrase table */}
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Phrase</th>
                <th>Skill</th>
                <th>Confidence</th>
                <th>Latest evidence</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.phrase}>
                  <td>
                    <strong>{item.phrase}</strong>
                  </td>
                  <td>
                    <span
                      style={{
                        alignItems: "center",
                        background: SKILL_BG[item.skill],
                        borderRadius: 99,
                        color: SKILL_COLORS[item.skill],
                        display: "inline-flex",
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 10px",
                      }}
                    >
                      {item.skill}
                    </span>
                  </td>
                  <td>
                    <DotConfidence value={item.confidence} />
                  </td>
                  <td>{item.use}</td>
                  <td>
                    <span className={`status ${item.status.toLowerCase()}`}>
                      {item.status === "Reused" && <Check size={14} />}
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button className="row-action" onClick={() => void logReuse(item.phrase)}>
                      Log reuse
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "32px 0", color: "var(--muted)" }}>
                    No phrases match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      {message && <p role="status">{message}</p>}
    </div>
  );
}
