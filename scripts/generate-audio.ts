import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { week1day1 } from "../src/lib/lessons/week1-day1";
import { week5day1 } from "../src/lib/lessons/week5-day1";
import { week10day1 } from "../src/lib/lessons/week10-day1";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Available OpenAI Voices: alloy, echo, fable, onyx, nova, shimmer
// Onyx and Fable tend to sound slightly more British/Transatlantic.
const availableVoices: ("onyx" | "fable" | "shimmer" | "echo" | "nova" | "alloy")[] = [
  "onyx", "fable", "shimmer", "echo", "nova", "alloy"
];

async function generateMultiVoiceAudio(lessonId: string, transcript: string) {
  const outputPath = path.join(process.cwd(), "public", "audio", `${lessonId}.mp3`);
  
  console.log(`Generating multi-voice audio for ${lessonId}...`);

  const lines = transcript.split("\n").filter(line => line.trim().length > 0);
  
  const speakerVoiceMap = new Map<string, typeof availableVoices[number]>();
  let nextVoiceIndex = 0;
  
  const buffers: Buffer[] = [];

  for (const line of lines) {
    const match = line.match(/^([A-Za-z0-9.\s]+):\s*(.*)/);
    
    let speaker = "Narrator";
    let text = line;

    if (match) {
      speaker = match[1].trim();
      text = match[2].trim();
    }

    if (!speakerVoiceMap.has(speaker)) {
      speakerVoiceMap.set(speaker, availableVoices[nextVoiceIndex % availableVoices.length]);
      nextVoiceIndex++;
    }

    const voice = speakerVoiceMap.get(speaker)!;
    
    console.log(`  - Generating chunk for ${speaker} (Voice: ${voice})...`);
    
    try {
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: voice,
        input: text,
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      buffers.push(buffer);
    } catch (error) {
      console.error(`  - Error generating chunk for ${speaker}:`, error);
    }
  }

  if (buffers.length > 0) {
    const finalBuffer = Buffer.concat(buffers);
    fs.writeFileSync(outputPath, finalBuffer);
    console.log(`Saved multi-voice audio to ${outputPath}`);
  }
}

async function main() {
  const lessons = [week1day1, week5day1, week10day1];
  
  for (const lesson of lessons) {
    if (lesson.review && lesson.review.transcript) {
      await generateMultiVoiceAudio(lesson.id, lesson.review.transcript);
    }
  }
}

main().catch(console.error);
