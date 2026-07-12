"use server";

import { createServerSupabaseClient as createClient } from "@/lib/supabase/server";
import { generateObject } from "ai";
import { deepseek } from "@ai-sdk/deepseek";
import { z } from "zod";

export async function gradeSpeaking(transcript: string, durationSeconds: number) {
  const wordCount = transcript.trim().split(/\s+/).length;
  const wpm = Math.round((wordCount / durationSeconds) * 60) || 0;
  const fillerCount = (transcript.match(/\b(um|uh|like|you know)\b/gi) || []).length;

  if (wordCount < 10) {
    return {
      success: false,
      estimatedBand: null,
      feedback: "Response is too short to accurately assess. Please speak more.",
      wpm,
      fillerCount
    };
  }

  try {
    // 1. Call DeepSeek for AI Grading
    const { object } = await generateObject({
      model: deepseek("deepseek-chat"),
      system: `You are an expert IELTS examiner. Grade the following spoken transcript based on Fluency and Coherence, Lexical Resource, Grammatical Range and Accuracy, and Pronunciation (inferred from transcript text if possible). 
You must be strictly accurate to the official IELTS Band 7 criteria.
Provide an overall band score (e.g. 6.5, 7.0), sub-scores, and constructive feedback focusing on how to improve to a Band 7 or higher.`,
      prompt: `Transcript: ${transcript}\nDuration: ${durationSeconds} seconds\nWords per minute: ${wpm}\nFiller words detected: ${fillerCount}`,
      schema: z.object({
        overall: z.number().describe("The overall band score (0 to 9, in 0.5 increments)."),
        fluency: z.number(),
        lexical: z.number(),
        grammar: z.number(),
        pronunciation: z.number(),
        feedback: z.string().describe("Detailed feedback on how to improve to Band 7+.")
      }),
    });

    const estimatedBand = {
      overall: object.overall,
      fluency: object.fluency,
      lexical: object.lexical,
      grammar: object.grammar,
      pronunciation: object.pronunciation,
    };
    const feedback = object.feedback;

    // 2. Save to Supabase Database
    const supabase = await createClient();
    if (!supabase) {
      return {
        success: false,
        estimatedBand: null,
        feedback: "Supabase client not configured.",
        wpm,
        fillerCount
      };
    }
    const { data: userData } = await supabase.auth.getUser();

    if (userData?.user) {
      await supabase.from("speaking_recordings").insert({
        user_id: userData.user.id,
        storage_path: "mock-storage-path", // Normally we would upload audio first and get this path
        duration_seconds: durationSeconds,
        transcript: transcript,
        estimated_band: estimatedBand,
        filler_count: fillerCount,
        words_per_minute: wpm,
      });
    }

    // 3. Return to client
    return {
      success: true,
      estimatedBand,
      feedback,
      wpm,
      fillerCount
    };
  } catch (error) {
    console.error("AI Grading Error:", error);
    return {
      success: false,
      estimatedBand: null,
      feedback: "An error occurred while grading your response. Please try again later.",
      wpm,
      fillerCount
    };
  }
}
