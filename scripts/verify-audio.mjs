import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const lines = (await readFile(path.join(root, "audio-checksums.sha256"), "utf8")).trim().split(/\r?\n/);
const failures = [];
for (const line of lines) {
  const match = line.match(/^([a-f0-9]{64})\s{2}(.+)$/);
  if (!match) { failures.push(`Malformed checksum line: ${line}`); continue; }
  try {
    const file = await readFile(path.join(root, match[2]));
    const actual = createHash("sha256").update(file).digest("hex");
    if (actual !== match[1]) failures.push(`${match[2]} changed: expected ${match[1]}, received ${actual}`);
  } catch {
    failures.push(`${match[2]} is missing.`);
  }
}
if (lines.length !== 72) failures.push(`Expected 72 frozen MP3 entries; found ${lines.length}.`);
if (failures.length) throw new Error(`Audio integrity check failed:\n${failures.join("\n")}`);
console.log(`Verified ${lines.length} immutable MP3 files with zero checksum differences.`);
