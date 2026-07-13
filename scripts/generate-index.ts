import fs from "fs";
import path from "path";

const lessonsDir = path.join(process.cwd(), "src", "lib", "lessons");
const indexFile = path.join(lessonsDir, "index.ts");

const files = fs.readdirSync(lessonsDir).filter(f => f.match(/^week\d+-day\d+\.ts$/));

let imports = `import { Lesson } from "./types";\n`;
let mapEntries = ``;

for (const file of files) {
  const match = file.match(/^week(\d+)-day(\d+)\.ts$/);
  if (!match) continue;
  const week = match[1];
  const day = match[2];
  const varName = `week${week}day${day}`;
  
  imports += `import { ${varName} } from "./${file.replace(".ts", "")}";\n`;
  mapEntries += `  "week-${week}-day-${day}": ${varName},\n`;
}

const content = `${imports}

const lessonsMap: Record<string, Lesson> = {
${mapEntries}};

export function getLesson(week: number, day: number): Lesson | null {
  const key = \`week-\${week}-day-\${day}\`;
  return lessonsMap[key] || null;
}
`;

fs.writeFileSync(indexFile, content);
console.log("✅ Successfully updated src/lib/lessons/index.ts with " + files.length + " lessons.");
