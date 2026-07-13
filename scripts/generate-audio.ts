import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { week1day1 } from "../src/lib/lessons/week1-day1";
import { week5day1 } from "../src/lib/lessons/week5-day1";
import { week10day1 } from "../src/lib/lessons/week10-day1";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateAudioForLesson(lessonId: string, transcript: string) {
  const outputPath = path.join(process.cwd(), "public", "audio", `${lessonId}.mp3`);
  
  if (fs.existsSync(outputPath)) {
    console.log(`Audio for ${lessonId} already exists. Skipping.`);
    return;
  }

  console.log(`Generating audio for ${lessonId}...`);
  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: transcript,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);
    console.log(`Saved audio to ${outputPath}`);
  } catch (error) {
    console.error(`Error generating audio for ${lessonId}:`, error);
  }
}

async function main() {
  const lessons = [week1day1, week5day1, week10day1];
  
  for (const lesson of lessons) {
    // Only generate for those that have a transcript
    if (lesson.review && lesson.review.transcript) {
      await generateAudioForLesson(lesson.id, lesson.review.transcript);
    }
  }
}

main().catch(console.error);
