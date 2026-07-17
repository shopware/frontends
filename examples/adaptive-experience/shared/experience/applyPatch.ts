import {
  type ModuleRegistry,
  moduleRegistry as defaultRegistry,
  SOURCE_RANK,
} from "./registry";
import type {
  ExperienceModule,
  ExperienceOperation,
  ExperiencePatch,
  ExperiencePlan,
  ExperienceRegion,
  ExperienceSource,
  PatchResult,
  RejectedOperation,
} from "./types";

export type ApplyPatchOptions = {
  /** Who authored the patch. Decides what it is allowed to overwrite. */
  source: ExperienceSource;
  registry?: ModuleRegistry;
};

const REGIONS: ExperienceRegion[] = ["header", "main", "sidebar", "footer"];

function locateModule(
  plan: ExperiencePlan,
  moduleId: string,
): { module: ExperienceModule; region: ExperienceRegion } | undefined {
  for (const region of REGIONS) {
    const module = plan.regions[region].find((entry) => entry.id === moduleId);
    if (module) return { module, region };
  }
  return undefined;
}

function sortRegion(modules: ExperienceModule[]): void {
  modules.sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id));
}

/**
 * Structural comparison for module props.
 *
 * Props are JSON values by contract (the registry's schemas only admit
 * primitives, arrays and plain objects), so this stays small. It exists to keep
 * a rule that re-proposes identical props from counting as a change.
 */
function isSameProps(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b || a === null || b === null) return false;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
      return false;
    }
    return a.every((item, index) => isSameProps(item, b[index]));
  }
  if (typeof a !== "object") return false;
  const left = a as Record<string, unknown>;
  const right = b as Record<string, unknown>;
  const leftKeys = Object.keys(left);
  if (leftKeys.length !== Object.keys(right).length) return false;
  return leftKeys.every(
    (key) => Object.hasOwn(right, key) && isSameProps(left[key], right[key]),
  );
}

/**
 * Applies a validated patch to a plan.
 *
 * Pure: the input plan is never mutated. Operations apply in order, each against
 * the state left by the previous one, and any operation the registry or source
 * precedence disallows is dropped rather than failing the whole patch - a
 * partially useful patch is still worth applying, and the rejects are reported
 * for shadow-mode analysis.
 *
 * Invariant: the returned plan always satisfies the registry (every module sits
 * in an allowed region and an allowed mode, with props matching its schema).
 *
 * The version only advances when the plan actually changed, so idempotent rules
 * re-proposing the same operation cannot churn the version and invalidate
 * in-flight AI responses.
 */
export function applyPatch(
  plan: ExperiencePlan,
  patch: ExperiencePatch,
  options: ApplyPatchOptions,
): PatchResult {
  const registry = options.registry ?? defaultRegistry;
  const source = options.source;
  const draft: ExperiencePlan = structuredClone(plan);
  const applied: ExperienceOperation[] = [];
  const rejected: RejectedOperation[] = [];
  let changed = false;

  const reject = (
    operation: ExperienceOperation,
    reason: RejectedOperation["reason"],
  ) => {
    rejected.push({ operation, reason });
  };

  const mayWrite = (module: ExperienceModule) =>
    SOURCE_RANK[source] >= SOURCE_RANK[module.source];

  for (const operation of patch.operations) {
    switch (operation.type) {
      case "set-mode": {
        if (draft.mode === operation.mode) {
          applied.push(operation);
          break;
        }
        draft.mode = operation.mode;
        // Keep the plan registry-valid: a module that may not appear in the new
        // mode is dropped regardless of who placed it, since leaving it would
        // break the invariant the renderer relies on.
        for (const region of REGIONS) {
          draft.regions[region] = draft.regions[region].filter((module) =>
            registry[module.type].allowedModes.includes(operation.mode),
          );
        }
        applied.push(operation);
        changed = true;
        break;
      }

      case "set-shell": {
        const next = {
          header: operation.header ?? draft.shell.header,
          navigation: operation.navigation ?? draft.shell.navigation,
          footer: operation.footer ?? draft.shell.footer,
        };
        if (
          next.header !== draft.shell.header ||
          next.navigation !== draft.shell.navigation ||
          next.footer !== draft.shell.footer
        ) {
          draft.shell = next;
          changed = true;
        }
        applied.push(operation);
        break;
      }

      case "set-workspace": {
        const next = {
          width: operation.width ?? draft.workspace.width,
          density: operation.density ?? draft.workspace.density,
        };
        if (
          next.width !== draft.workspace.width ||
          next.density !== draft.workspace.density
        ) {
          draft.workspace = next;
          changed = true;
        }
        applied.push(operation);
        break;
      }

      case "ensure-module": {
        const definition = registry[operation.moduleType];
        const existing = locateModule(draft, operation.moduleId);
        if (existing) {
          // Idempotent by design: a rule may re-propose this every tick.
          if (existing.module.type !== operation.moduleType) {
            reject(operation, "duplicate-module-id");
          } else {
            applied.push(operation);
          }
          break;
        }
        if (!definition.allowedRegions.includes(operation.region)) {
          reject(operation, "region-not-allowed");
          break;
        }
        if (!definition.allowedModes.includes(draft.mode)) {
          reject(operation, "mode-not-allowed");
          break;
        }
        const props = { ...definition.defaultProps, ...operation.props };
        const parsedProps = definition.propsSchema.safeParse(props);
        if (!parsedProps.success) {
          reject(operation, "invalid-props");
          break;
        }
        draft.regions[operation.region].push({
          id: operation.moduleId,
          type: operation.moduleType,
          priority: operation.priority ?? definition.defaultPriority,
          props: parsedProps.data as Record<string, unknown>,
          source,
        });
        sortRegion(draft.regions[operation.region]);
        applied.push(operation);
        changed = true;
        break;
      }

      case "move-module": {
        const found = locateModule(draft, operation.moduleId);
        if (!found) {
          reject(operation, "unknown-module-id");
          break;
        }
        if (!mayWrite(found.module)) {
          reject(operation, "source-precedence");
          break;
        }
        const definition = registry[found.module.type];
        if (!definition.allowedRegions.includes(operation.region)) {
          reject(operation, "region-not-allowed");
          break;
        }
        const samePlace =
          found.region === operation.region &&
          (operation.priority === undefined ||
            operation.priority === found.module.priority);
        if (samePlace) {
          applied.push(operation);
          break;
        }
        draft.regions[found.region] = draft.regions[found.region].filter(
          (module) => module.id !== operation.moduleId,
        );
        const moved: ExperienceModule = {
          ...found.module,
          priority: operation.priority ?? found.module.priority,
          source,
        };
        draft.regions[operation.region].push(moved);
        sortRegion(draft.regions[operation.region]);
        applied.push(operation);
        changed = true;
        break;
      }

      case "update-module-props": {
        const found = locateModule(draft, operation.moduleId);
        if (!found) {
          reject(operation, "unknown-module-id");
          break;
        }
        if (!mayWrite(found.module)) {
          reject(operation, "source-precedence");
          break;
        }
        const definition = registry[found.module.type];
        const merged = { ...found.module.props, ...operation.props };
        const parsedProps = definition.propsSchema.safeParse(merged);
        if (!parsedProps.success) {
          reject(operation, "invalid-props");
          break;
        }
        const target = draft.regions[found.region].find(
          (module) => module.id === operation.moduleId,
        );
        if (target) {
          const nextProps = parsedProps.data as Record<string, unknown>;
          // A rule re-proposing the props it already applied must not advance
          // the version, or every rule pass would invalidate in-flight AI
          // responses via the stale check.
          if (
            !isSameProps(target.props, nextProps) ||
            target.source !== source
          ) {
            target.props = nextProps;
            target.source = source;
            changed = true;
          }
        }
        applied.push(operation);
        break;
      }

      case "hide-module": {
        const found = locateModule(draft, operation.moduleId);
        if (!found) {
          reject(operation, "unknown-module-id");
          break;
        }
        if (!mayWrite(found.module)) {
          reject(operation, "source-precedence");
          break;
        }
        draft.regions[found.region] = draft.regions[found.region].filter(
          (module) => module.id !== operation.moduleId,
        );
        applied.push(operation);
        changed = true;
        break;
      }

      case "show-overlay": {
        if (!draft.overlays.includes(operation.overlay)) {
          draft.overlays = [...draft.overlays, operation.overlay];
          changed = true;
        }
        applied.push(operation);
        break;
      }

      case "hide-overlay": {
        if (draft.overlays.includes(operation.overlay)) {
          draft.overlays = draft.overlays.filter(
            (overlay) => overlay !== operation.overlay,
          );
          changed = true;
        }
        applied.push(operation);
        break;
      }

      case "suggest-sales-channel": {
        // Part of the contract, but sales channel switching is a later phase.
        reject(operation, "not-implemented");
        break;
      }
    }
  }

  if (!changed) {
    return { plan, applied, rejected };
  }

  draft.version = plan.version + 1;
  return { plan: draft, applied, rejected };
}
