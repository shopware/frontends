import {
  evaluateLocalRules,
  localRules,
  vibeOfferRule,
} from "#shared/experience/rules";
import type {
  ApplyPatchResult,
  ExperiencePatch,
  ExperienceSource,
  ExperienceTheme,
} from "#shared/experience/types";
import { vibePatch } from "#shared/experience/vibe";

const MAX_RULE_PASSES = 8;

/**
 * §20 orchestrator: events -> context/signals -> rules -> merger -> plan.
 *
 * Every patch, from any source, goes through `apply` on the plan composable,
 * which is the §18 merger. The checkout route-lock, patch limits, AI capability
 * flags and source precedence all live in the merger, so they cannot be skipped
 * by adding a caller here.
 */
export function useExperienceEngine() {
  const { plan, apply, reset: resetPlan } = useExperiencePlan();
  const {
    context,
    track,
    reset: resetContext,
    comparedProductIds,
    isCompared,
    canCompareMore,
  } = useExperienceContext();

  const rejections = useState<string[]>("experience-rejections", () => []);

  // The shopper's explicit skin choice. Once set, it outranks the adaptive
  // style rule (§16 user > rule), so the storefront never overrides a deliberate
  // toggle on the next signal change.
  const manualTheme = useState<ExperienceTheme | null>(
    "experience-manual-theme",
    () => null,
  );

  const now = () => (import.meta.client ? Date.now() : 0);

  const record = (result: ApplyPatchResult) => {
    if (result.rejected.length) {
      rejections.value = [
        ...rejections.value,
        ...result.rejected.map((entry) => entry.reason),
      ];
    }
    return result;
  };

  /** Applies a single proposed patch through the merger. */
  const propose = (patch: ExperiencePatch, source: ExperienceSource) =>
    record(apply(patch, context.value, source, now()));

  /**
   * Runs the local rules to a fixed point. Each pass evaluates every rule
   * against the current plan, applies the results in priority order, then
   * re-evaluates; it stops once a full pass changes nothing. The merger is
   * idempotent, so this always settles.
   */
  const evaluateRules = () => {
    // Drop the adaptive style rule once the shopper has toggled a skin, so their
    // choice is not overwritten on the next signal change.
    const rules = manualTheme.value
      ? localRules.filter((rule) => rule !== vibeOfferRule)
      : localRules;
    for (let pass = 0; pass < MAX_RULE_PASSES; pass++) {
      const results = evaluateLocalRules(rules, context.value, plan.value);
      if (!results.length) break;
      const before = plan.value.planVersion;
      for (const result of results) {
        record(apply(result.patch, context.value, "rule", now()));
      }
      if (plan.value.planVersion === before) break;
    }
  };

  /**
   * The Gen Z transformation, accepted by the shopper (§16 user source) - from
   * the assistant's "Switch it up" or the header toggle. Records the choice so
   * the offer rule stands down, then applies the whole bundle (theme + immersive
   * layout) through the merger like any other patch.
   */
  const theme = computed(() => plan.value.theme);
  const setVibe = (next: ExperienceTheme) => {
    manualTheme.value = next;
    propose(vibePatch(next), "user");
  };

  /** Restores the standard view: clear the source signals, then the plan. */
  const reset = () => {
    resetContext();
    resetPlan();
    manualTheme.value = null;
    rejections.value = [];
  };

  return {
    plan,
    context,
    track,
    propose,
    evaluateRules,
    reset,
    rejections,
    theme,
    setVibe,
    comparedProductIds,
    isCompared,
    canCompareMore,
  };
}
