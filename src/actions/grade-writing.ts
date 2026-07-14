"use server";

import { deepseek } from "@ai-sdk/deepseek";
import { generateObject } from "ai";
import { z } from "zod";
import { finishAiUsage, reserveAiUsage } from "@/lib/ai/quota";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isValidHalfBand, minimumWritingWords } from "@/lib/assessment";

const halfBand = z.number().refine(isValidHalfBand, "Score must be 0–9 in half-band increments.");
const assessmentSchema = z.object({
  criteria: z.object({ taskResponse: halfBand, coherenceCohesion: halfBand, lexicalResource: halfBand, grammaticalRangeAccuracy: halfBand }),
  evidence: z.array(z.object({ criterion: z.string(), excerpt: z.string().max(240), explanation: z.string().max(600) })).min(4).max(8),
  strengths: z.array(z.string().max(400)).min(1).max(4),
  limitingFeatures: z.array(z.string().max(500)).min(1).max(4),
  nextActions: z.array(z.string().max(500)).length(2),
});
const inputSchema = z.object({
  text: z.string().trim().min(1).max(30000),
  taskType: z.enum(["task1", "task2"]),
  lessonId: z.string().uuid(),
  activityId: z.string().min(3).max(160),
  idempotencyKey: z.string().uuid(),
}).superRefine((value, context) => {
  const count = value.text.split(/\s+/).length;
  const minimum = minimumWritingWords(value.taskType);
  if (count < minimum) context.addIssue({ code: "custom", path: ["text"], message: `Write at least ${minimum} words before requesting an assessment.` });
});

export type WritingAssessment = z.infer<typeof assessmentSchema> & { overallPracticeEstimate: number; label: "Unofficial AI practice estimate" };
type WritingResult = { success: true; assessment: WritingAssessment } | { success: false; error: string; retryable: boolean };

export async function gradeWriting(input: z.input<typeof inputSchema>): Promise<WritingResult> {
  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid writing request.", retryable: false };
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Assessment service is unavailable.", retryable: true };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Sign in before requesting paid AI feedback.", retryable: false };

  const wordCount = parsed.data.text.split(/\s+/).length;
  const { data: existing } = await supabase.from("writing_responses").select("estimated_band").eq("user_id", user.id).eq("idempotency_key", parsed.data.idempotencyKey).maybeSingle();
  const previous = assessmentSchema.safeParse(existing?.estimated_band);
  if (previous.success) return { success: true, assessment: withOverall(previous.data) };

  let reservationId = "";
  try {
    reservationId = await reserveAiUsage(supabase, "writing", parsed.data.idempotencyKey);
    const { data: draft, error: draftError } = await supabase.from("writing_responses").insert({
      user_id: user.id, lesson_id: parsed.data.lessonId, activity_id: parsed.data.activityId, task_type: parsed.data.taskType,
      response_text: parsed.data.text, word_count: wordCount, rubric_version: "ielts-public-2026-07", assessment_scope: "practice_estimate", idempotency_key: parsed.data.idempotencyKey,
    }).select("id").single();
    if (draftError || !draft) throw new Error("Your draft could not be saved, so no provider was called.");

    const { object } = await generateObject({
      model: deepseek("deepseek-chat"),
      schema: assessmentSchema,
      system: `Assess IELTS Academic ${parsed.data.taskType === "task1" ? "Task 1" : "Task 2"} writing against the four public criteria. Scores must be 0–9 in half-band increments. Use evidence from the learner's response. Reward precise, natural language and control; never reward rarity alone. Use British English in feedback, while accepting consistently used standard British, American, Australian, or Canadian English. Return exactly two concrete next actions. This is an unofficial practice estimate.`,
      prompt: parsed.data.text,
    });
    const assessment = assessmentSchema.parse(object);
    const { error: updateError } = await supabase.from("writing_responses").update({ estimated_band: assessment, feedback_text: assessment.limitingFeatures.join(" "), provider: "DeepSeek", model: "deepseek-chat", updated_at: new Date().toISOString() }).eq("id", draft.id).eq("user_id", user.id);
    if (updateError) throw new Error("Feedback was generated but could not be saved.");
    await finishAiUsage(supabase, reservationId, "succeeded", "DeepSeek", "deepseek-chat");
    return { success: true, assessment: withOverall(assessment) };
  } catch (error) {
    if (reservationId) await finishAiUsage(supabase, reservationId, "released", "DeepSeek", "deepseek-chat");
    return { success: false, error: error instanceof Error ? error.message : "The provider did not return feedback. Your draft remains saved.", retryable: true };
  }
}

function withOverall(assessment: z.infer<typeof assessmentSchema>): WritingAssessment {
  const values = Object.values(assessment.criteria);
  const overallPracticeEstimate = Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 2) / 2;
  return { ...assessment, overallPracticeEstimate, label: "Unofficial AI practice estimate" };
}
