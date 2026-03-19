import { readFileSync } from "fs";
import { resolve } from "path";
import yaml from "js-yaml";
import type { TaskDefinition } from "./types.js";

export function loadTasks(file = "definitions.yaml"): TaskDefinition[] {
  const raw = readFileSync(resolve(import.meta.dirname, file), "utf-8");
  return yaml.load(raw) as TaskDefinition[];
}
