import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";
import { chromium } from "playwright";

const port = 3100;
const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], { stdio: "ignore" });
let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try { if ((await fetch(`http://127.0.0.1:${port}/`)).ok) { ready = true; break; } } catch { /* Starting. */ }
    await wait(500);
  }
  if (!ready) throw new Error("Next.js did not start for the end-to-end smoke test.");
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const consoleErrors = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: "Reach Band 9 with a daily plan that tells you exactly what to do." }).waitFor();
  await page.getByRole("link", { name: "Try the free audio lesson" }).click();
  const audio = page.locator("audio");
  await audio.waitFor({ state: "attached" });
  await page.waitForFunction(() => { const player = document.querySelector("audio"); return Boolean(player && Number.isFinite(player.duration) && player.duration > 5); });
  await page.clock.install();
  await page.getByRole("button", { name: "Begin 30-second preparation" }).click();
  await page.clock.fastForward(30_000);
  await page.getByRole("button", { name: "Play recording" }).waitFor();
  await page.getByLabel("Maria decided to focus her research on the ________ of local parks.", { exact: true }).fill("history");
  await page.getByRole("button", { name: "Submit attempt and unlock review" }).click();
  await page.getByRole("heading", { name: "Review after submission" }).waitFor();
  await page.getByRole("tab", { name: "Speaking" }).click();
  await page.getByRole("heading", { name: "IELTS Speaking Parts 1–3" }).waitFor();
  await page.goto(`http://127.0.0.1:${port}/programme`, { waitUntil: "domcontentloaded" });
  if (!page.url().includes("course=unavailable")) throw new Error(`Protected course did not fail closed: ${page.url()}`);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`http://127.0.0.1:${port}/sample/day-1`, { waitUntil: "domcontentloaded" });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 1) throw new Error(`Mobile sample has ${overflow}px horizontal overflow.`);
  if (consoleErrors.length) throw new Error(`Browser console errors:\n${consoleErrors.join("\n")}`);
  console.log("End-to-end public sample, review unlock, mobile layout, and fail-closed access checks passed.");
} finally {
  await browser?.close();
  child.kill();
}
