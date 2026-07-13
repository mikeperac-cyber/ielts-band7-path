import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Available OpenAI Voices: alloy, echo, fable, onyx, nova, shimmer
// The user explicitly requested STRICTLY British accents.
// - Onyx: Deep, authoritative, British/Transatlantic.
// - Fable: British, friendly, animated.
// - Echo: Neutral, slightly British/Transatlantic.
const availableVoices: ("onyx" | "fable" | "echo")[] = [
  "onyx", "fable", "echo"
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
    
    // Dynamically import the module
    const fileUrl = "file://" + filePath.replace(/\\/g, "/");
    const module = await import(fileUrl);
    
    // Find the lesson object (usually the only exported value)
    const exportName = Object.keys(module)[0];
    const lesson = module[exportName];

    if (lesson && lesson.id && lesson.review && lesson.review.transcript) {
      const lessonId = lesson.id;
      const transcript = lesson.review.transcript;
      
      const outputPath = path.join(process.cwd(), "public", "audio", lessonId + ".mp3");
      if (fs.existsSync(outputPath)) {
        console.log("Audio for " + lessonId + " already exists. Skipping.");
        continue;
      }

      await generateMultiVoiceAudio(lessonId, transcript);
    }
  }
}

main().catch(console.error);
