"use server";

import OpenAI from "openai";
import { gradeSpeaking } from "./grade-speaking";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function transcribeAndGradeSpeaking(formData: FormData, durationSeconds: number) {
  try {
    const file = formData.get("audio") as File;
    if (!file) {
      throw new Error("No audio file found in form data.");
    }

    // 1. Transcribe with Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      language: "en",
    });

    const transcript = transcription.text;

    // 2. Pass transcript to the DeepSeek grading logic
    const gradeResult = await gradeSpeaking(transcript, durationSeconds);

    return {
      success: true,
      transcript,
      gradeResult,
    };
  } catch (error) {
    console.error("Transcription Error:", error);
    return {
      success: false,
      transcript: "",
      error: "Failed to transcribe or grade the audio.",
    };
  }
}
