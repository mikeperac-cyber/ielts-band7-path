"use client";

import { Check, Download, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

type Phrase = { phrase: string; skill: string; confidence: number; use: string; status: "Reused" | "Ready" | "Learning" };
const initialPhrases: Phrase[] = [
  { phrase: "in light of the evidence", skill: "Reading", confidence: 4, use: "Used in a Reading explanation", status: "Reused" },
  { phrase: "a key factor in", skill: "Speaking", confidence: 3, use: "Used in Part 3 practice", status: "Reused" },
  { phrase: "it can be inferred that", skill: "Reading", confidence: 4, use: "Saved from Day 2", status: "Ready" },
  { phrase: "consequently", skill: "Writing", confidence: 2, use: "Needs an original example", status: "Learning" },
  { phrase: "a marked contrast", skill: "Writing", confidence: 3, use: "Used in Task 1 planning", status: "Ready" },
];

export function TrackerView() {
  const [phrases, setPhrases] = useState(initialPhrases);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All skills");
  const [adding, setAdding] = useState(false);
  const [newPhrase, setNewPhrase] = useState("");
  const filtered = useMemo(() => phrases.filter((item) => item.phrase.includes(query.toLowerCase()) && (filter === "All skills" || item.skill === filter)), [phrases, query, filter]);
  const save = () => { if (!newPhrase.trim()) return; setPhrases((items) => [{ phrase: newPhrase.trim().toLowerCase(), skill: "Writing", confidence: 1, use: "Add your own example", status: "Learning" }, ...items]); setNewPhrase(""); setAdding(false); };
  return <div className="page-wrap tracker-page"><div className="page-intro"><div><h1>Lexical Tracker</h1><p>Save useful language, practise it in context, then record every successful reuse.</p></div><button className="primary-button" onClick={() => setAdding(true)}><Plus size={17} /> Add phrase</button></div><section className="tracker-summary"><article><span>Saved phrases</span><strong>{phrases.length}</strong><small>+3 this week</small></article><article><span>Reused successfully</span><strong>12</strong><small>Across 4 skills</small></article><article><span>Ready for exam use</span><strong>7</strong><small>Confidence 4–5</small></article><article><span>Next review</span><strong>Tomorrow</strong><small>4 phrases due</small></article></section>{adding && <section className="add-phrase"><div><h2>Add a phrase</h2><p>Give it a function and practise it in your own sentence afterwards.</p></div><input autoFocus placeholder="e.g. a decisive factor in" value={newPhrase} onChange={(event) => setNewPhrase(event.target.value)} onKeyDown={(event) => event.key === "Enter" && save()} /><button className="primary-button" onClick={save}>Save phrase</button><button className="text-button" onClick={() => setAdding(false)}>Cancel</button></section>}<section className="panel tracker-table"><div className="tracker-tools"><label><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search phrases" /></label><select value={filter} onChange={(event) => setFilter(event.target.value)}><option>All skills</option><option>Reading</option><option>Writing</option><option>Listening</option><option>Speaking</option></select><button><SlidersHorizontal size={16} /> Filters</button><button><Download size={16} /> Export</button></div><div className="table-scroll"><table><thead><tr><th>Phrase</th><th>Skill</th><th>Confidence</th><th>Latest evidence</th><th>Status</th><th>Action</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.phrase}><td><strong>{item.phrase}</strong></td><td>{item.skill}</td><td><span className="dot-confidence">{Array.from({ length: 5 }, (_, index) => <i key={index} className={index < item.confidence ? "filled" : ""} />)}</span></td><td>{item.use}</td><td><span className={`status ${item.status.toLowerCase()}`}>{item.status === "Reused" && <Check size={14} />}{item.status}</span></td><td><button className="row-action" onClick={() => setPhrases((items) => items.map((phrase) => phrase.phrase === item.phrase ? { ...phrase, confidence: Math.min(5, phrase.confidence + 1), status: "Reused" } : phrase))}>Log reuse</button></td></tr>)}</tbody></table></div></section></div>;
}
