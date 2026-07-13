import fs from "fs";
import path from "path";
import OpenAI from "openai";

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
  const lessonsDir = path.join(process.cwd(), "src", "lib", "lessons");
  const files = fs.readdirSync(lessonsDir).filter(f => f.match(/^week\d+-day\d+\.ts$/));

  for (const file of files) {
    const filePath = path.join(lessonsDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    
    // Extract lessonId and transcript from file content
    const idMatch = content.match(/id:\s*"([^"]+)"/);
    const transcriptMatch = content.match(/transcript:\s*(?:"([^"\\]*(?:\\.[^"\\]*)*)"|`([^`\\]*(?:\\.[^`\\]*)*)`)/s);

    if (idMatch && transcriptMatch) {
      const lessonId = idMatch[1];
      let transcript = transcriptMatch[1] || transcriptMatch[2];
      
      // Unescape newlines
      transcript = transcript.replace(/\\n/g, "\n");

      const outputPath = path.join(process.cwd(), "public", "audio", `${lessonId}.mp3`);
      if (fs.existsSync(outputPath)) {
        console.log(`Audio for ${lessonId} already exists. Skipping.`);
        continue;
      }

      await generateMultiVoiceAudio(lessonId, transcript);
    }
  }
}

main().catch(console.error);
