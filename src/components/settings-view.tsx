"use client";

import { CheckCircle2, Download, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function SettingsView({ initialTestDate }: { initialTestDate?: string | null }) {
  const [testDate, setTestDate] = useState(initialTestDate || "");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setSaving(true);
    const supabase = createBrowserSupabaseClient();
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({ test_date: testDate || null }).eq("id", user.id);
        router.refresh();
      }
    }
    setSaving(false);
  };

  return (
    <div className="page-wrap settings-page">
      <div className="page-intro">
        <div>
          <h1>Settings</h1>
          <p>Manage your study profile and account preferences.</p>
        </div>
      </div>
      <section className="settings-grid">
        <article className="panel">
          <h2>Study profile</h2>
          <label>
            Current band
            <input defaultValue="6.0" disabled />
          </label>
          <label>
            Target band
            <input defaultValue="7.0" disabled />
          </label>
          <label>
            Target test date
            <input 
              type="date" 
              value={testDate} 
              onChange={(e) => setTestDate(e.target.value)} 
            />
          </label>
          <button 
            className="primary-button" 
            onClick={handleSave} 
            disabled={saving || testDate === (initialTestDate || "")}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </article>

        <article className="panel">
          <ShieldCheck size={25} />
          <h2>Your progress is private</h2>
          <p>Only your signed-in account can see your lesson attempts, error log, mock results, and lexical tracker.</p>
          <span className="secure-status"><CheckCircle2 size={16} /> Cloud sync ready</span>
        </article>

        <article className="panel">
          <Download size={25} />
          <h2>Export your data</h2>
          <p>Download your learning record before moving devices or whenever you want a personal backup.</p>
          <button className="outline-button"><Download size={16} /> Export progress</button>
        </article>

        <article className="panel">
          <Mail size={25} />
          <h2>Sign-in email</h2>
          <p>Magic-link authentication keeps your account password-free.</p>
          <button className="text-button">Update email preferences</button>
        </article>
      </section>
    </div>
  );
}
