"use server";

import { createServerSupabaseClient as createClient } from "@/lib/supabase/server";

export async function gradeWriting(text: string, taskType: "task1" | "task2" | "transfer") {
  // 1. Simulate AI API delay
  await new Promise((resolve) => setTimeout(resolve, 2500));

  // 2. Generate Mock AI Feedback
  const wordCount = text.trim().split(/\s+/).length;
  
  let band = 6.0;
  let feedback = "This is a good attempt, but it lacks complex sentence structures.";
  
  if (wordCount > 50) {
    band = 7.0;
    feedback = "Excellent use of topic-specific vocabulary and clear cohesion. Try to incorporate more passive structures.";
  }
  if (wordCount > 100) {
    band = 7.5;
    feedback = "Strong lexical resource and well-developed ideas. A very solid band 7+ response.";
  }
  if (wordCount < 10) {
    band = 5.0;
    feedback = "Response is too short to accurately assess. Please write more.";
  }

  const estimatedBand = {
    overall: band,
    task_achievement: band,
    coherence: band,
    lexical: band + 0.5,
    grammar: band - 0.5,
  };

  // 3. Save to Supabase Database
  const supabase = await createClient();
  if (!supabase) {
    return {
      success: false,
      estimatedBand: null,
      feedback: "Supabase client not configured.",
    };
  }
  const { data: userData } = await supabase.auth.getUser();

  if (userData.user) {
    await supabase.from("writing_responses").insert({
      user_id: userData.user.id,
      task_type: taskType,
      response_text: text,
      word_count: wordCount,
      estimated_band: estimatedBand,
      feedback_text: feedback,
    });
  }

  // 4. Return to client
  return {
    success: true,
    estimatedBand,
    feedback,
  };
}
