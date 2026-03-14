import { readFileSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(import.meta.dirname, "..");

export function loadFixtures(): Record<string, string> {
  const envPath = resolve(ROOT, ".env");
  const fixtures: Record<string, string> = {};

  try {
    const lines = readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      fixtures[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
    }
  } catch {
    // .env is optional — env vars can come from the shell
  }

  // Merge with process.env (env vars take precedence)
  return { ...fixtures, ...process.env } as Record<string, string>;
}

export function resolvePrompt(
  template: string,
  fixtures: Record<string, string>,
  runId: string
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (key === "RUN_ID") return runId;
    return fixtures[key] ?? `{{${key}}}`;
  });
}

export function generateRunId(): string {
  return Date.now().toString(36);
}

export const RESULTS_DIR = resolve(ROOT, "results/raw");
