import "server-only";

import { deepseek } from "@ai-sdk/deepseek";
import { generateObject } from "ai";
import { z } from "zod";
import { isValidHalfBand } from "@/lib/assessment";

const halfBand = z.number().refine(isValidHalfBand, "Score must be 0–9 in half-band increments.");
export const speakingAssessmentSchema = z.object({
  criteria: z.object({ fluencyCoherence: halfBand, lexicalResource: halfBand, grammaticalRangeAccuracy: halfBand }),
  evidence: z.array(z.object({ criterion: z.string(), excerpt: z.string().max(240), explanation: z.string().max(600) })).min(3).max(7),
  strengths: z.array(z.string().max(400)).min(1).max(4),
  limitingFeatures: z.array(z.string().max(500)).min(1).max(4),
  nextActions: z.array(z.string().max(500)).length(2),
  feedback: z.string().max(1200),
});

export async function gradeSpeakingTranscript(transcript: string, metrics: { durationSeconds: number; wordsPerMinute: number; pauseCount: number }) {
  const { object } = await generateObject({
    model: deepseek("deepseek-chat"),
    schema: speakingAssessmentSchema,
    system: "Assess only Fluency and Coherence, Lexical Resource, and Grammatical Range and Accuracy against the public IELTS Speaking descriptors. Do not infer or score pronunciation from a transcript. Do not calculate an overall Speaking band. Use half-band increments, cite transcript evidence, and return exactly two concrete next actions. Label the result as partial and unofficial in the feedback. Use British English while accepting consistent standard English variants.",
    prompt: `Transcript:\n${transcript}\n\nMeasured duration: ${metrics.durationSeconds}s\nRate: ${metrics.wordsPerMinute} words/min\nPauses over 0.8s between timestamped segments: ${metrics.pauseCount}`,
  });
  return speakingAssessmentSchema.parse(object);
}
