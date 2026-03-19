import { resolve } from "path";
import { config as loadDotenv } from "dotenv";

const ROOT = resolve(import.meta.dirname, "..");

// Load .env into process.env so child processes (claude -p) inherit them
loadDotenv({ path: resolve(ROOT, ".env") });

export function loadFixtures(): Record<string, string> {
  // After dotenv loading, process.env has everything
  return { ...process.env } as Record<string, string>;
}

export function resolvePrompt(
  template: string,
  fixtures: Record<string, string>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return fixtures[key] ?? `{{${key}}}`;
  });
}

export function formatCost(usd?: number, fallback = "N/A"): string {
  return usd != null ? `$${usd.toFixed(4)}` : fallback;
}

export function generateRunId(): string {
  return Date.now().toString(36);
}

export const RESULTS_DIR = resolve(ROOT, "results/raw");
