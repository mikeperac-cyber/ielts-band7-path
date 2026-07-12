"use client";

import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const submit = async (event: React.FormEvent) => { event.preventDefault(); const supabase = createBrowserSupabaseClient(); if (!supabase) { setState("error"); setMessage("Add your Supabase environment variables to enable magic-link sign-in."); return; } setState("loading"); const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard` } }); if (error) { setState("error"); setMessage(error.message); } else { setState("sent"); } };
  return <form className="sign-in-card" onSubmit={submit}>{state === "sent" ? <div className="sent-state"><CheckCircle2 size={34} /><h2>Check your inbox</h2><p>We sent a secure sign-in link to <b>{email}</b>.</p></div> : <><span className="form-icon"><Mail size={22} /></span><h1>Continue your Band 7 Path</h1><p>Sign in to unlock the full course and sync your progress securely across devices.</p><label>Email address<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>{state === "error" && <p className="form-error">{message}</p>}<button className="primary-button full" disabled={state === "loading"}>{state === "loading" ? "Sending secure link…" : <>Send magic link <ArrowRight size={17} /></>}</button><small>By continuing, you agree to use the programme for personal study.</small></>}</form>;
}
