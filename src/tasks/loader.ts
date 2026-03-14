import { readFileSync } from "fs";
import { resolve } from "path";
import yaml from "js-yaml";
import type { TaskDefinition } from "./types.js";

export function loadTasks(): TaskDefinition[] {
  const raw = readFileSync(resolve(import.meta.dirname, "definitions.yaml"), "utf-8");
  return yaml.load(raw) as TaskDefinition[];
}
