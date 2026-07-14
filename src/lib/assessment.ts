export const DAILY_AI_LIMIT = 5;
export const SPEAKING_PARTIAL_LABEL = "Unofficial partial Speaking practice estimate" as const;

export function normaliseAnswer(value: string) {
  return value.normalize("NFKC").trim().toLocaleLowerCase("en-GB").replace(/[’']/g, "'").replace(/\s+/g, " ").replace(/[.,;:!?]+$/g, "");
}

export function isValidHalfBand(value: number) {
  return Number.isFinite(value) && value >= 0 && value <= 9 && Number.isInteger(value * 2);
}

export function minimumWritingWords(taskType: "task1" | "task2") {
  return taskType === "task1" ? 150 : 250;
}

export function quotaAvailable(used: number, limit = DAILY_AI_LIMIT) {
  return Number.isInteger(used) && used >= 0 && used < limit;
}
