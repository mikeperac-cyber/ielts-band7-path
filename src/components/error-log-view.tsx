"use client";

import { AlertTriangle, CheckCircle2, Plus } from "lucide-react";
import { useState } from "react";

const starterErrors = [
  ["Listening", "Distractor", "Selected the first date mentioned", "Wait for the speaker’s final correction."],
  ["Writing", "Task response", "Ideas did not address both parts", "Underline every task requirement before planning."],
  ["Reading", "Evidence", "Chose a related sentence, not the answer", "Locate and paraphrase the exact evidence."],
];

export function ErrorLogView() {
  const [errors, setErrors] = useState(starterErrors);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(["Listening", "", "", ""]);
  const add = () => { if (!draft[1] || !draft[2] || !draft[3]) return; setErrors((all) => [...all, draft]); setDraft(["Listening", "", "", ""]); setOpen(false); };
  return <div className="page-wrap error-page"><div className="page-intro"><div><h1>Error Log</h1><p>Every mistake should become one precise rule for your next attempt.</p></div><button className="primary-button" onClick={() => setOpen(true)}><Plus size={17} /> Add error</button></div><section className="error-principle"><AlertTriangle size={25} /><div><strong>Band 7 rule</strong><p>Do not only record the correct answer. Write the cause of the mistake and the action that prevents it next time.</p></div></section>{open && <section className="error-form panel"><h2>Turn a mistake into a rule</h2><div><select value={draft[0]} onChange={(event) => setDraft((item) => [event.target.value, item[1], item[2], item[3]])}><option>Listening</option><option>Reading</option><option>Writing</option><option>Speaking</option></select><input placeholder="Error type" value={draft[1]} onChange={(event) => setDraft((item) => [item[0], event.target.value, item[2], item[3]])} /><input placeholder="What happened?" value={draft[2]} onChange={(event) => setDraft((item) => [item[0], item[1], event.target.value, item[3]])} /><input placeholder="Your prevention rule" value={draft[3]} onChange={(event) => setDraft((item) => [item[0], item[1], item[2], event.target.value])} /></div><button className="primary-button" onClick={add}>Save rule</button></section>}<section className="error-list">{errors.map(([skill, type, mistake, rule], index) => <article key={`${skill}-${index}`}><div className="error-count">{index + 1}</div><span className="skill-tag">{skill}</span><div><h2>{type}</h2><p><b>What happened:</b> {mistake}</p></div><div className="prevention"><CheckCircle2 size={18} /><p><b>Next-time rule:</b> {rule}</p></div></article>)}</section></div>;
}
