"use server";

import { createServerSupabaseClient as createClient } from "@/lib/supabase/server";
import { generateObject } from "ai";
import { deepseek } from "@ai-sdk/deepseek";
import { z } from "zod";

export async function gradeWriting(text: string, taskType: "task1" | "task2" | "transfer") {
  const wordCount = text.trim().split(/\s+/).length;

  if (wordCount < 10) {
    return {
      success: false,
      estimatedBand: null,
      feedback: "Response is too short to accurately assess. Please write more.",
    };
  }

  try {
    // 1. Call DeepSeek for AI Grading
    const { object } = await generateObject({
      model: deepseek("deepseek-chat"),
      system: `You are an expert IELTS examiner. Grade the following text based on Task Achievement, Coherence, Lexical Resource, and Grammar. 
You must be strictly accurate to the official IELTS Band 9 criteria. The task type is: ${taskType}.
Provide an overall band score (e.g. 6.5, 7.0), sub-scores, and constructive feedback focusing on how to improve to a Band 9 or higher.`,
      prompt: text,
      schema: z.object({
        overall: z.number().describe("The overall band score (0 to 9, in 0.5 increments)."),
        task_achievement: z.number(),
        coherence: z.number(),
        lexical: z.number(),
        grammar: z.number(),
        feedback: z.string().describe("Detailed feedback on how to improve to Band 9+.")
      }),
    });

    const estimatedBand = {
      overall: object.overall,
      task_achievement: object.task_achievement,
      coherence: object.coherence,
      lexical: object.lexical,
      grammar: object.grammar,
    };
    const feedback = object.feedback;

    // 2. Save to Supabase Database
    const supabase = await createClient();
    if (!supabase) {
      return {
        success: false,
        estimatedBand: null,
        feedback: "Supabase client not configured.",
      };
    }
    const { data: userData } = await supabase.auth.getUser();

    if (userData?.user) {
      await supabase.from("writing_responses").insert({
        user_id: userData.user.id,
        task_type: taskType,
        response_text: text,
        word_count: wordCount,
        estimated_band: estimatedBand,
        feedback_text: feedback,
      });
    }

    // 3. Return to client
    return {
      success: true,
      estimatedBand,
      feedback,
    };
  } catch (error) {
    console.error("AI Grading Error:", error);
    return {
      success: false,
      estimatedBand: null,
      feedback: "An error occurred while grading your response. Please try again later.",
    };
  }
}
