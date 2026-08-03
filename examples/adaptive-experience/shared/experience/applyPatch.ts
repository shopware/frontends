import {
  type ModuleRegistry,
  moduleRegistry as defaultRegistry,
  SOURCE_RANK,
} from "./registry";
import {
  experiencePlanSchema,
  experienceWorkspaceSchema,
  footerVariantSchema,
  headerVariantSchema,
  MAX_MODULES_PER_PLAN,
  MAX_SHELL_CHANGES_PER_PATCH,
  navigationVariantSchema,
} from "./schemas";
import type {
  AdaptationPolicy,
  ApplyPatchResult,
  ExperienceContext,
  ExperienceModule,
  ExperienceOperation,
  ExperiencePatch,
  ExperiencePlan,
  ExperienceSource,
  RegionName,
  RejectedOperation,
  RejectionReason,
} from "./types";

/**
 * Not in §18's signature, which is `(plan, patch, context, policy)`. The merger
 * still has to know who authored the patch to resolve §16's precedence, and it
 * must not read the clock if it is to stay pure and testable, so both arrive
 * here. Documented rather than smuggled in.
 */
export type ApplyPatchOptions = {
  source: ExperienceSource;
  now: number;
  registry?: ModuleRegistry;
};

const REGIONS: RegionName[] = ["top", "main", "aside", "bottom"];

function locate(
  plan: ExperiencePlan,
  moduleId: string,
): { module: ExperienceModule; region: RegionName } | undefined {
  for (const region of REGIONS) {
    const module = plan.regions[region].find((entry) => entry.id === moduleId);
    if (module) return { module, region };
  }
  return undefined;
}

function countModules(plan: ExperiencePlan): number {
  return REGIONS.reduce(
    (total, region) => total + plan.regions[region].length,
    0,
  );
}

function countOfType(plan: ExperiencePlan, type: string): number {
  return REGIONS.reduce(
    (total, region) =>
      total + plan.regions[region].filter((m) => m.type === type).length,
    0,
  );
}

/** Props are JSON by contract, so a structural compare is enough. */
function isSameProps(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b || a === null || b === null) return false;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
      return false;
    }
    return a.every((item, i) => isSameProps(item, b[i]));
  }
  if (typeof a !== "object") return false;
  const left = a as Record<string, unknown>;
  const right = b as Record<string, unknown>;
  const keys = Object.keys(left);
  if (keys.length !== Object.keys(right).length) return false;
  return keys.every(
    (k) => Object.hasOwn(right, k) && isSameProps(left[k], right[k]),
  );
}

/** §18 step 6: priorities order modules within one region and nowhere else. */
function normalizePriorities(plan: ExperiencePlan): void {
  for (const region of REGIONS) {
    plan.regions[region].sort(
      (a, b) => a.priority - b.priority || a.id.localeCompare(b.id),
    );
    plan.regions[region].forEach((module, index) => {
      module.priority = (index + 1) * 10;
    });
  }
}

/**
 * §18. Applies a patch to a plan and reports what it accepted and refused.
 *
 * Pure: the input plan is never mutated, and the current plan is never replaced
 * until the complete next plan has passed validation (step 7). Operations are
 * dropped individually rather than failing the whole patch, so a partly useful
 * proposal is still worth applying.
 *
 * `planVersion` advances only when the plan actually changed (step 8), so
 * idempotent rules cannot churn the version and invalidate in-flight AI
 * responses through the stale check.
 */
export function applyExperiencePatch(
  currentPlan: ExperiencePlan,
  patch: ExperiencePatch,
  context: ExperienceContext,
  policy: AdaptationPolicy,
  options: ApplyPatchOptions,
): ApplyPatchResult {
  const registry = options.registry ?? defaultRegistry;
  const { source, now } = options;
  const accepted: ExperienceOperation[] = [];
  const rejected: RejectedOperation[] = [];

  const reject = (operation: ExperienceOperation, reason: RejectionReason) =>
    rejected.push({ operation, reason });

  const fail = (reason: RejectionReason): ApplyPatchResult => ({
    accepted: [],
    rejected: patch.operations.map((operation) => ({ operation, reason })),
    plan: currentPlan,
  });

  // §18 step 4: route lock. §19: "do not structurally adapt checkout". The
  // shopper is the one actor still allowed to change their own view.
  if (
    source !== "user" &&
    policy.protectedRoutes.some((route) => context.route.path.startsWith(route))
  ) {
    return fail("protected-module");
  }

  // §17 patch limits.
  if (patch.operations.length > policy.maximumOperationsPerPatch) {
    return fail("patch-limit-exceeded");
  }
  const shellChanges = patch.operations.filter(
    (o) => o.type === "set-shell",
  ).length;
  const moves = patch.operations.filter((o) => o.type === "move-module").length;
  if (
    shellChanges > MAX_SHELL_CHANGES_PER_PATCH ||
    moves > policy.maximumModuleMovesPerPatch
  ) {
    return fail("patch-limit-exceeded");
  }

  const draft: ExperiencePlan = structuredClone(currentPlan);
  let changed = false;

  const mayWrite = (module: ExperienceModule) =>
    SOURCE_RANK[source] >= SOURCE_RANK[module.source];

  /** §19: a module the rules just placed must not vanish under the shopper. */
  const withinMinimumLifetime = (module: ExperienceModule) => {
    if (source === "user") return false;
    const minimum = module.minimumLifetimeMs ?? policy.minimumModuleLifetimeMs;
    return now - module.createdAt < minimum;
  };

  for (const operation of patch.operations) {
    switch (operation.type) {
      case "set-mode": {
        if (draft.mode === operation.mode) {
          accepted.push(operation);
          break;
        }
        draft.mode = operation.mode;
        // Keep the plan registry-valid: a module that may not appear in the new
        // mode is disabled rather than deleted, so the shopper's own modules
        // survive a mode change and can come back.
        for (const region of REGIONS) {
          for (const module of draft.regions[region]) {
            const entry = registry[module.type];
            if (entry && !entry.allowedModes.includes(operation.mode)) {
              module.enabled = false;
              module.updatedAt = now;
            } else if (entry) {
              module.enabled = true;
            }
          }
        }
        accepted.push(operation);
        changed = true;
        break;
      }

      case "set-theme": {
        if (draft.theme === operation.theme) {
          accepted.push(operation);
          break;
        }
        draft.theme = operation.theme;
        accepted.push(operation);
        changed = true;
        break;
      }

      case "set-shell": {
        const schema =
          operation.target === "header"
            ? headerVariantSchema
            : operation.target === "navigation"
              ? navigationVariantSchema
              : footerVariantSchema;
        const parsed = schema.safeParse(operation.value);
        if (!parsed.success) {
          reject(operation, "invalid-value");
          break;
        }
        if (draft.shell[operation.target] !== parsed.data) {
          draft.shell[operation.target] = parsed.data as never;
          changed = true;
        }
        accepted.push(operation);
        break;
      }

      case "set-workspace": {
        const shape = experienceWorkspaceSchema.shape;
        const parsed = shape[operation.target].safeParse(operation.value);
        if (!parsed.success) {
          reject(operation, "invalid-value");
          break;
        }
        if (draft.workspace[operation.target] !== parsed.data) {
          draft.workspace[operation.target] = parsed.data as never;
          changed = true;
        }
        accepted.push(operation);
        break;
      }

      case "ensure-module": {
        const spec = operation.module;
        const entry = registry[spec.type];
        if (!entry) {
          reject(operation, "unknown-module-type");
          break;
        }
        const existing = locate(draft, spec.id);
        if (existing) {
          // Idempotent: a rule may re-propose this on every pass.
          if (existing.module.type !== spec.type) {
            reject(operation, "duplicate-module-id");
          } else {
            accepted.push(operation);
          }
          break;
        }
        if (source === "ai" && !entry.canBeAddedByAI) {
          reject(operation, "ai-not-allowed");
          break;
        }
        if (!entry.allowedRegions.includes(spec.region)) {
          reject(operation, "region-not-allowed");
          break;
        }
        if (!entry.allowedModes.includes(draft.mode)) {
          reject(operation, "mode-not-allowed");
          break;
        }
        if (countOfType(draft, spec.type) >= entry.maxInstances) {
          reject(operation, "max-instances");
          break;
        }
        if (countModules(draft) >= MAX_MODULES_PER_PLAN) {
          reject(operation, "module-limit-reached");
          break;
        }
        const parsedProps = entry.propsSchema.safeParse(spec.props);
        if (!parsedProps.success) {
          reject(operation, "invalid-props");
          break;
        }
        draft.regions[spec.region].push({
          id: spec.id,
          type: spec.type,
          priority: spec.priority,
          enabled: true,
          props: parsedProps.data as Record<string, unknown>,
          source,
          createdAt: now,
          updatedAt: now,
          ...(spec.minimumLifetimeMs !== undefined
            ? { minimumLifetimeMs: spec.minimumLifetimeMs }
            : {}),
        });
        accepted.push(operation);
        changed = true;
        break;
      }

      case "move-module": {
        const found = locate(draft, operation.moduleId);
        if (!found) {
          reject(operation, "unknown-module-id");
          break;
        }
        const entry = registry[found.module.type];
        if (!entry) {
          reject(operation, "unknown-module-type");
          break;
        }
        if (source === "ai" && !entry.canBeMovedByAI) {
          reject(operation, "ai-not-allowed");
          break;
        }
        if (!mayWrite(found.module)) {
          reject(operation, "source-precedence");
          break;
        }
        if (!entry.allowedRegions.includes(operation.region)) {
          reject(operation, "region-not-allowed");
          break;
        }
        if (withinMinimumLifetime(found.module)) {
          reject(operation, "minimum-lifetime");
          break;
        }
        if (
          found.region === operation.region &&
          found.module.priority === operation.priority
        ) {
          accepted.push(operation);
          break;
        }
        draft.regions[found.region] = draft.regions[found.region].filter(
          (m) => m.id !== operation.moduleId,
        );
        draft.regions[operation.region].push({
          ...found.module,
          priority: operation.priority,
          source,
          updatedAt: now,
        });
        accepted.push(operation);
        changed = true;
        break;
      }

      case "update-module-props": {
        const found = locate(draft, operation.moduleId);
        if (!found) {
          reject(operation, "unknown-module-id");
          break;
        }
        const entry = registry[found.module.type];
        if (!entry) {
          reject(operation, "unknown-module-type");
          break;
        }
        if (!mayWrite(found.module)) {
          reject(operation, "source-precedence");
          break;
        }
        const merged = { ...found.module.props, ...operation.props };
        const parsedProps = entry.propsSchema.safeParse(merged);
        if (!parsedProps.success) {
          reject(operation, "invalid-props");
          break;
        }
        const target = draft.regions[found.region].find(
          (m) => m.id === operation.moduleId,
        );
        if (target) {
          const next = parsedProps.data as Record<string, unknown>;
          if (!isSameProps(target.props, next) || target.source !== source) {
            target.props = next;
            target.source = source;
            target.updatedAt = now;
            changed = true;
          }
        }
        accepted.push(operation);
        break;
      }

      case "hide-module": {
        const found = locate(draft, operation.moduleId);
        if (!found) {
          reject(operation, "unknown-module-id");
          break;
        }
        const entry = registry[found.module.type];
        if (!entry) {
          reject(operation, "unknown-module-type");
          break;
        }
        // §19 protected ids, and §10's per-type flag. Together these are what
        // stop a validated patch from emptying the page.
        if (
          source !== "user" &&
          policy.protectedModuleIds.includes(found.module.id)
        ) {
          reject(operation, "protected-module");
          break;
        }
        if (source === "ai" && !entry.canBeHiddenByAI) {
          reject(operation, "ai-not-allowed");
          break;
        }
        if (!mayWrite(found.module)) {
          reject(operation, "source-precedence");
          break;
        }
        if (withinMinimumLifetime(found.module)) {
          reject(operation, "minimum-lifetime");
          break;
        }
        draft.regions[found.region] = draft.regions[found.region].filter(
          (m) => m.id !== operation.moduleId,
        );
        accepted.push(operation);
        changed = true;
        break;
      }

      case "show-overlay":
      case "hide-overlay": {
        const next = operation.type === "show-overlay";
        if (draft.overlays[operation.overlay] !== next) {
          draft.overlays[operation.overlay] = next;
          changed = true;
        }
        accepted.push(operation);
        break;
      }

      case "suggest-sales-channel": {
        // Blueprint phase 9. The operation is part of the contract; acting on it
        // is not built.
        reject(operation, "not-implemented");
        break;
      }
    }
  }

  if (!changed) {
    return { accepted, rejected, plan: currentPlan };
  }

  normalizePriorities(draft);
  draft.planVersion = currentPlan.planVersion + 1;
  draft.metadata = {
    reason: patch.operations.map((o) => o.type).join(","),
    source,
    generatedAt: now,
  };

  // §18 step 7. The last line of defence: if the operations combined to produce
  // something the contract forbids, nothing is applied.
  const validated = experiencePlanSchema.safeParse(draft);
  if (!validated.success) {
    return fail("resulting-plan-invalid");
  }

  return { accepted, rejected, plan: validated.data };
}
