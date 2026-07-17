import { applyPatch } from "#shared/experience/applyPatch";
import { createDefaultPlan } from "#shared/experience/defaults";
import type {
  ExperiencePatch,
  ExperiencePlan,
  ExperienceSource,
  PatchResult,
} from "#shared/experience/types";

/**
 * Holds the single versioned plan for the current session.
 *
 * Backed by `useState` rather than Pinia so the plan survives hydration without
 * pulling a store library into the template. The plan is the only thing the
 * renderer reads; every change goes through `dispatch` so no caller can bypass
 * the merger's validation.
 */
export function useExperiencePlan() {
  const plan = useState<ExperiencePlan>("experience-plan", createDefaultPlan);

  /** Applies a patch and returns what the merger accepted and refused. */
  const dispatch = (
    patch: ExperiencePatch,
    source: ExperienceSource,
  ): PatchResult => {
    // `toRaw` is load-bearing. `useState` hands back a reactive proxy, and the
    // merger clones its input with `structuredClone`, which throws on a proxy.
    // Unwrapping here keeps the merger free of Vue rather than teaching it about
    // reactivity.
    const result = applyPatch(toRaw(plan.value), patch, { source });
    plan.value = result.plan;
    return result;
  };

  /** Returns to the standard storefront view. */
  const reset = () => {
    plan.value = createDefaultPlan();
  };

  const isAdapted = computed(
    () => plan.value.version > 0 && plan.value.mode !== "explore",
  );

  return { plan, dispatch, reset, isAdapted };
}
