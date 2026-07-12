"use client";

import { Check, Download, Plus, Search, SlidersHorizontal, Target, CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";

type Skill   = "Listening" | "Reading" | "Writing" | "Speaking";
type Status  = "Reused" | "Ready" | "Learning";

interface Phrase {
  phrase:     string;
  skill:      Skill;
  confidence: number; // 1–5
  use:        string;
  status:     Status;
}

const initialPhrases: Phrase[] = [
  { phrase: "in light of the evidence",  skill: "Reading",  confidence: 4, use: "Used in a Reading explanation", status: "Reused"   },
  { phrase: "a key factor in",           skill: "Speaking", confidence: 3, use: "Used in Part 3 practice",       status: "Reused"   },
  { phrase: "it can be inferred that",   skill: "Reading",  confidence: 4, use: "Saved from Day 2",              status: "Ready"    },
  { phrase: "consequently",              skill: "Writing",  confidence: 2, use: "Needs an original example",     status: "Learning" },
  { phrase: "a marked contrast",         skill: "Writing",  confidence: 3, use: "Used in Task 1 planning",       status: "Ready"    },
];

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

export function TrackerView() {
  const [phrases,   setPhrases]   = useState<Phrase[]>(initialPhrases);
  const [query,     setQuery]     = useState("");
  const [filter,    setFilter]    = useState<"All" | Skill>("All");
  const [adding,    setAdding]    = useState(false);
  const [newPhrase, setNewPhrase] = useState("");

  const filtered = useMemo(
    () =>
      phrases.filter(
        (p) =>
          p.phrase.toLowerCase().includes(query.toLowerCase()) &&
          (filter === "All" || p.skill === filter)
      ),
    [phrases, query, filter]
  );

  const save = () => {
    if (!newPhrase.trim()) return;
    setPhrases((items) => [
      {
        phrase:     newPhrase.trim().toLowerCase(),
        skill:      "Writing",
        confidence: 1,
        use:        "Add your own example",
        status:     "Learning",
      },
      ...items,
    ]);
    setNewPhrase("");
    setAdding(false);
  };

  const logReuse = (phrase: string) => {
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

      {/* Weekly Phrase Sprint Challenge */}
      <section className="panel" style={{ background: "linear-gradient(to right, #fef3c7, #fffbeb)", border: "1px solid #fde68a" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ background: "#f59e0b", color: "white", padding: 10, borderRadius: 12 }}>
              <Target size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: 18, margin: "0 0 4px", color: "#92400e" }}>Weekly Phrase Sprint</h2>
              <p style={{ margin: 0, fontSize: 14, color: "#b45309" }}>Use these 5 phrases in your Speaking or Writing sessions this week to earn your badge.</p>
            </div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#d97706", background: "#fef3c7", padding: "4px 12px", borderRadius: 99, border: "1px solid #fcd34d" }}>
            3/5 completed
          </span>
        </div>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
          {[
            { p: "in light of the evidence", done: true },
            { p: "a decisive factor in", done: true },
            { p: "it can be inferred that", done: false },
            { p: "consequently", done: false },
            { p: "a marked contrast", done: true },
          ].map((item, i) => (
            <div key={i} style={{ 
              flexShrink: 0, 
              background: item.done ? "#10b981" : "white", 
              color: item.done ? "white" : "var(--text)",
              border: `1px solid ${item.done ? "#059669" : "#fcd34d"}`,
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
            }}>
              {item.done && <CheckCircle2 size={16} />}
              {item.p}
            </div>
          ))}
        </div>
      </section>

      {/* Summary cards */}
      <section className="tracker-summary">
        <article>
          <span>Saved phrases</span>
          <strong>{phrases.length}</strong>
          <small>+3 this week</small>
        </article>
        <article>
          <span>Reused successfully</span>
          <strong>12</strong>
          <small>Across 4 skills</small>
        </article>
        <article>
          <span>Ready for exam use</span>
          <strong>7</strong>
          <small>Confidence 4–5</small>
        </article>
        <article>
          <span>Next review</span>
          <strong>Tomorrow</strong>
          <small>4 phrases due</small>
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
            onKeyDown={(e) => e.key === "Enter" && save()}
          />
          <button className="primary-button" onClick={save}>
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
          <button>
            <SlidersHorizontal size={16} /> Filters
          </button>
          <button>
            <Download size={16} /> Export
          </button>
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
                    <button className="row-action" onClick={() => logReuse(item.phrase)}>
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
    </div>
  );
}
