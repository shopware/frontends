import { applyExperiencePatch } from "#shared/experience/applyPatch";
import { createDefaultExperiencePlan } from "#shared/experience/defaults";
import { defaultAdaptationPolicy } from "#shared/experience/policy";
import type {
  ApplyPatchResult,
  ExperienceContext,
  ExperiencePatch,
  ExperiencePlan,
  ExperienceSource,
} from "#shared/experience/types";

function routeKeyFromPath(path: string): string {
  if (path.includes("/adaptive") || path.includes("/search")) return "search";
  if (path.includes("/checkout")) return "checkout";
  return "home";
}

/**
 * Holds the one versioned §7 plan for the session.
 *
 * `useState` rather than Pinia, so the plan survives hydration without a store
 * library. Every change goes through `apply`, which is the §18 merger - no
 * caller can bypass its validation. The initial plan is deterministic (now = 0)
 * so server and client hydrate identically.
 */
export function useExperiencePlan() {
  const route = useRoute();
  const routeKey = routeKeyFromPath(route.path);

  const plan = useState<ExperiencePlan>("experience-plan", () =>
    createDefaultExperiencePlan(routeKey, 0),
  );

  const apply = (
    patch: ExperiencePatch,
    context: ExperienceContext,
    source: ExperienceSource,
    now: number,
  ): ApplyPatchResult => {
    // `toRaw` is load-bearing: `useState` hands back a reactive proxy and the
    // merger clones its input with `structuredClone`, which throws on a proxy.
    const result = applyExperiencePatch(
      toRaw(plan.value),
      patch,
      context,
      defaultAdaptationPolicy,
      { source, now },
    );
    plan.value = result.plan;
    return result;
  };

  const reset = () => {
    plan.value = createDefaultExperiencePlan(routeKey, 0);
  };

  return { plan, apply, reset };
}
