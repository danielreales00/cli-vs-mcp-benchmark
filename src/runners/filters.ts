import type { TaskDefinition } from "../tasks/types.js";

export interface Filters {
  layer: number | null;
  service: string | null;
  variant: ("cli" | "mcp") | null;
  id: string | null;
  tasks: string | null;
}

export function parseFilters(argv: string[]): Filters {
  const get = (prefix: string) => argv.find((a) => a.startsWith(prefix))?.split("=")[1] ?? null;

  const layerStr = get("--layer=");
  return {
    layer: layerStr ? Number(layerStr) : null,
    service: get("--service="),
    variant: get("--variant=") as Filters["variant"],
    id: get("--id="),
    tasks: get("--tasks="),
  };
}

export function applyFilters(tasks: TaskDefinition[], filters: Filters): TaskDefinition[] {
  return tasks.filter((task) => {
    if (filters.layer !== null && task.layer !== filters.layer) return false;
    if (filters.service && task.service !== filters.service) return false;
    if (filters.id && task.id !== filters.id) return false;
    return true;
  });
}

export function getVariantsForTask(
  task: TaskDefinition,
  variantFilter: Filters["variant"]
): Array<"cli" | "mcp"> {
  const variants: Array<"cli" | "mcp"> =
    task.path === "both"
      ? ["cli", "mcp"]
      : task.path === "cli_only"
        ? ["cli"]
        : ["mcp"];

  if (variantFilter) return variants.filter((v) => v === variantFilter);
  return variants;
}
