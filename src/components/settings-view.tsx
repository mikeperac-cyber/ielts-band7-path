"use client";

import { CheckCircle2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export function SettingsView({ initialTestDate, initialCurrentBand }: { initialTestDate?: string | null; initialCurrentBand: number }) {
  const [testDate, setTestDate] = useState(initialTestDate ?? "");
  const [currentBand, setCurrentBand] = useState(initialCurrentBand);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  async function save() {
    setSaving(true); setMessage("");
    const supabase = createBrowserSupabaseClient();
    const { data: { user } } = await supabase!.auth.getUser();
    const { error } = await supabase!.from("profiles").update({ test_date: testDate || null, current_band: currentBand, target_band: 9.0, updated_at: new Date().toISOString() }).eq("id", user!.id);
    setMessage(error ? "Settings could not be saved." : "Settings saved.");
    setSaving(false); router.refresh();
  }
  return <div className="page-wrap settings-page"><div className="page-intro"><div><h1>Settings</h1><p>Manage your starting point. The programme target remains Band 9.</p></div></div><section className="settings-grid">
    <article className="panel"><h2>Study profile</h2><label>Current band<input type="number" min="0" max="9" step="0.5" value={currentBand} onChange={(event) => setCurrentBand(Number(event.target.value))} /></label><label>Programme target<input value="9.0" disabled /></label><label>Target test date<input type="date" value={testDate} onChange={(event) => setTestDate(event.target.value)} /></label><button className="primary-button" type="button" onClick={() => void save()} disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>{message && <p role="status">{message}</p>}</article>
    <article className="panel"><ShieldCheck size={25} /><h2>Your progress is private</h2><p>Only your signed-in account can see lesson attempts, recordings, writing, error rules, and lexical evidence.</p><span className="secure-status"><CheckCircle2 size={16} /> Row-level security enabled</span></article>
  </section></div>;
}
