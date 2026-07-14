"use server";

import OpenAI from "openai";
import { z } from "zod";
import { finishAiUsage, reserveAiUsage } from "@/lib/ai/quota";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { gradeSpeakingTranscript, speakingAssessmentSchema } from "./grade-speaking";
import { SPEAKING_PARTIAL_LABEL } from "@/lib/assessment";

const metadataSchema = z.object({ durationSeconds: z.coerce.number().int().min(5).max(180), lessonId: z.string().uuid(), activityId: z.string().min(3).max(160), idempotencyKey: z.string().uuid() });
const allowedMimeTypes = new Set(["audio/webm", "audio/ogg", "audio/mp4", "audio/mpeg", "audio/wav", "audio/x-wav"]);
type Assessment = z.infer<typeof speakingAssessmentSchema>;
export type SpeakingAssessmentResult = { success: true; transcript: string; assessment: Assessment & { pronunciation: "not assessed"; label: typeof SPEAKING_PARTIAL_LABEL }; metrics: { durationSeconds: number; wordsPerMinute: number; pauseCount: number } } | { success: false; error: string; retryable: boolean };

export async function transcribeAndGradeSpeaking(formData: FormData): Promise<SpeakingAssessmentResult> {
  const metadata = metadataSchema.safeParse({ durationSeconds: formData.get("durationSeconds"), lessonId: formData.get("lessonId"), activityId: formData.get("activityId"), idempotencyKey: formData.get("idempotencyKey") });
  const file = formData.get("audio");
  if (!metadata.success) return { success: false, error: metadata.error.issues[0]?.message ?? "Invalid recording metadata.", retryable: false };
  if (!(file instanceof File) || !allowedMimeTypes.has(file.type) || file.size === 0 || file.size > 25 * 1024 * 1024) return { success: false, error: "Use a supported 5–180 second recording no larger than 25 MB.", retryable: false };

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Assessment service is unavailable.", retryable: true };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Sign in before requesting paid AI feedback.", retryable: false };

  const { data: existing } = await supabase.from("speaking_recordings").select("transcript,estimated_band,duration_seconds,words_per_minute,pause_count").eq("user_id", user.id).eq("idempotency_key", metadata.data.idempotencyKey).maybeSingle();
  const previous = speakingAssessmentSchema.safeParse(existing?.estimated_band);
  if (existing?.transcript && previous.success) return successResult(existing.transcript, previous.data, { durationSeconds: Number(existing.duration_seconds), wordsPerMinute: Number(existing.words_per_minute), pauseCount: Number(existing.pause_count) });

  let reservationId = "";
  const storagePath = `${user.id}/${metadata.data.idempotencyKey}.${file.type.includes("webm") ? "webm" : "audio"}`;
  try {
    reservationId = await reserveAiUsage(supabase, "speaking", metadata.data.idempotencyKey);
    const { data: draft, error: draftError } = await supabase.from("speaking_recordings").insert({
      user_id: user.id, lesson_id: metadata.data.lessonId, activity_id: metadata.data.activityId, storage_path: storagePath,
      duration_seconds: metadata.data.durationSeconds, rubric_version: "ielts-public-2026-07", assessment_scope: "partial_practice_estimate", idempotency_key: metadata.data.idempotencyKey,
    }).select("id").single();
    if (draftError || !draft) throw new Error("Your recording could not be saved, so no provider was called.");
    const { error: uploadError } = await supabase.storage.from("speaking-recordings").upload(storagePath, file, { contentType: file.type, upsert: false });
    if (uploadError) throw new Error("Your recording could not be stored, so no provider was called.");

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const transcription = await openai.audio.transcriptions.create({ file, model: "whisper-1", language: "en", response_format: "verbose_json", timestamp_granularities: ["segment"] });
    const transcript = transcription.text.trim();
    if (transcript.split(/\s+/).length < 10) throw new Error("The recording contains too little speech for a responsible estimate.");
    const segments = transcription.segments ?? [];
    const pauseCount = segments.slice(1).filter((segment, index) => segment.start - segments[index].end >= 0.8).length;
    const wordsPerMinute = Math.round((transcript.split(/\s+/).length / metadata.data.durationSeconds) * 60);
    const assessment = await gradeSpeakingTranscript(transcript, { durationSeconds: metadata.data.durationSeconds, wordsPerMinute, pauseCount });
    const { error: updateError } = await supabase.from("speaking_recordings").update({ transcript, estimated_band: assessment, words_per_minute: wordsPerMinute, pause_count: pauseCount, transcription_provider: "OpenAI", transcription_model: "whisper-1", grading_provider: "DeepSeek", grading_model: "deepseek-chat" }).eq("id", draft.id).eq("user_id", user.id);
    if (updateError) throw new Error("Feedback was generated but could not be saved.");
    await finishAiUsage(supabase, reservationId, "succeeded", "OpenAI + DeepSeek", "whisper-1 + deepseek-chat");
    return successResult(transcript, assessment, { durationSeconds: metadata.data.durationSeconds, wordsPerMinute, pauseCount });
  } catch (error) {
    if (reservationId) await finishAiUsage(supabase, reservationId, "released", "OpenAI + DeepSeek", "whisper-1 + deepseek-chat");
    return { success: false, error: error instanceof Error ? error.message : "The providers did not return feedback. Your recording remains saved.", retryable: true };
  }
}

function successResult(transcript: string, assessment: Assessment, metrics: { durationSeconds: number; wordsPerMinute: number; pauseCount: number }): SpeakingAssessmentResult {
  return { success: true, transcript, assessment: { ...assessment, pronunciation: "not assessed", label: SPEAKING_PARTIAL_LABEL }, metrics };
}
