"use server";

import { createServerSupabaseClient as createClient } from "@/lib/supabase/server";

export async function gradeSpeaking(transcript: string, durationSeconds: number) {
  // 1. Simulate AI API delay (e.g. processing audio and grading)
  await new Promise((resolve) => setTimeout(resolve, 3500));

  // 2. Generate Mock AI Feedback
  const wordCount = transcript.trim().split(/\s+/).length;
  const wpm = (wordCount / durationSeconds) * 60;
  
  let band = 6.0;
  let feedback = "Good fluency, but a few hesitations.";
  let fillerCount = 5;
  
  if (wpm > 120 && wordCount > 50) {
    band = 7.0;
    feedback = "Very natural pace with minimal hesitation. Good use of idiomatic language.";
    fillerCount = 2;
  }
  
  if (wpm > 140 && wordCount > 100) {
    band = 8.0;
    feedback = "Exceptional fluency and coherent development of ideas without noticeable effort.";
    fillerCount = 0;
  }

  const estimatedBand = {
    fluency: band + 0.5,
    lexical: band,
    grammar: band - 0.5,
    pronunciation: band,
  };

  // 3. Save to Supabase Database
  const supabase = await createClient();
  if (!supabase) {
    return {
      success: false,
      estimatedBand: null,
      feedback: "Supabase client not configured.",
      wpm: 0,
      fillerCount: 0
    };
  }
  const { data: userData } = await supabase.auth.getUser();

  if (userData.user) {
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

  // 4. Return to client
  return {
    success: true,
    estimatedBand,
    feedback,
    wpm,
    fillerCount
  };
}
