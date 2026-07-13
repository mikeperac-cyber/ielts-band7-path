import fs from "fs";
import path from "path";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { programme } from "../src/lib/course-plan";

// Delay helper to avoid rate limits
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const LessonSchema = z.object({
  title: z.string().describe("Title of the lesson incorporating the skills (e.g., Listening + Reading (Band 9 Mastery))"),
  topic: z.string().describe("A random, highly academic IELTS topic (e.g., Epigenetics, Urban Architecture, Marine Biology)"),
  audioLabel: z.string().describe("A short description of the audio (e.g., Fast-paced Monologue · 6 min practice)"),
  questions: z.array(z.string()).describe("6 advanced fill-in-the-blank or comprehension questions based on the transcript"),
  phrases: z.array(
    z.object({
      phrase: z.string().describe("An advanced Band 9 vocabulary phrase or idiom"),
      use: z.string().describe("A short explanation of how/when to use it (e.g., 'introduce a counter-intuitive fact')"),
    })
  ).length(3).describe("Exactly 3 high-level phrases"),
  review: z.object({
    answers: z.array(z.string()).describe("The exact answers to the 6 questions"),
    transcript: z.string().describe("A 300-400 word transcript. Use multiple speakers (e.g., Moderator:, Dr. Smith:) for dialogues, or a single speaker (e.g., Lecturer:) for a monologue. Make it highly academic and challenging, reflecting Band 9 difficulty."),
  }),
});

async function generateDay(week: number, day: number, focus: string, skills: string[], duration: string) {
  const fileName = `week${week}-day${day}.ts`;
  const outPath = path.join(process.cwd(), "src", "lib", "lessons", fileName);

  if (fs.existsSync(outPath)) {
    console.log(`Skipping Week ${week} Day ${day} - File exists.`);
    return;
  }

  console.log(`Generating Week ${week} Day ${day}...`);

  const prompt = `
You are an expert IELTS curriculum designer. 
Create a Band 9 Mastery lesson for Week ${week}, Day ${day}.
Focus: ${focus}
Skills to test: ${skills.join(", ")}
Duration: ${duration}

Requirements:
- The content MUST be extremely challenging, targeting a Band 9 level.
- The transcript should be realistic (either a monologue or a multi-speaker debate).
- If it's a dialogue, strictly use speaker labels like "Moderator: ", "Prof. X: ", "Dr. Y: ".
- Provide exactly 6 questions and 6 answers.
- Provide exactly 3 advanced phrases.
`;

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: LessonSchema,
      prompt,
    });

    const fileContent = `import { Lesson } from "./types";

export const week${week}day${day}: Lesson = {
  id: "week-${week}-day-${day}",
  day: "Day ${day}",
  title: ${JSON.stringify(object.title)},
  duration: ${JSON.stringify(duration)},
  topic: ${JSON.stringify(object.topic)},
  audioLabel: ${JSON.stringify(object.audioLabel)},
  questions: ${JSON.stringify(object.questions, null, 4)},
  phrases: ${JSON.stringify(object.phrases, null, 4)},
  review: {
    answers: ${JSON.stringify(object.review.answers, null, 4)},
    transcript: ${JSON.stringify(object.review.transcript)}
  }
};
`;

    fs.writeFileSync(outPath, fileContent);
    console.log(`✅ Saved ${fileName}`);
  } catch (error) {
    console.error(`❌ Failed to generate Week ${week} Day ${day}:`, error);
  }
}

async function main() {
  // To avoid hitting deepseek limits, let's process sequentially with a small delay
  for (const plan of programme) {
    await generateDay(plan.week, plan.day - (plan.week - 1) * 7, plan.focus, plan.skills, plan.duration);
    await delay(1000); // 1 second delay between requests
  }
  console.log("All missing days generated!");
}

main().catch(console.error);
