import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";
import { chromium } from "playwright";

const port = 3100;
const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], { stdio: "ignore" });

try {
  let ready = false;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try { if ((await fetch(`http://127.0.0.1:${port}/`)).ok) { ready = true; break; } } catch { /* Server is still starting. */ }
    await wait(500);
  }
  if (!ready) throw new Error("Next.js did not start for the end-to-end smoke test.");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "Try Day 1 sample" }).click();
  await page.getByRole("button", { name: "Finish sample attempt" }).click();
  await page.getByRole("heading", { name: "Review your answers" }).waitFor();
  await browser.close();
  console.log("End-to-end sample lesson smoke test passed.");
} finally {
  child.kill();
}
