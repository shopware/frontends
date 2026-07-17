import { checkGuardrails } from "#shared/experience/guardrails";
import { localRules } from "#shared/experience/rules";
import type {
  ExperiencePatch,
  ExperienceSource,
} from "#shared/experience/types";

/**
 * Drives the loop: events -> signals -> rules -> guardrails -> merger -> plan.
 *
 * Every patch, wherever it came from, goes through `propose`, so the checkout
 * lock and stale-version check cannot be skipped by adding a new caller.
 */
export function useExperienceEngine() {
  const { plan, dispatch, reset: resetPlan } = useExperiencePlan();
  const { signals, track, reset: resetSignals } = useExperienceSignals();

  const rejections = useState<string[]>("experience-rejections", () => []);

  const propose = (
    patch: ExperiencePatch,
    source: ExperienceSource,
    patchPlanVersion = plan.value.version,
  ) => {
    const verdict = checkGuardrails({
      patch,
      source,
      routeKind: signals.value.routeKind,
      patchPlanVersion,
      currentPlanVersion: plan.value.version,
    });

    if (!verdict.allowed) {
      rejections.value = [...rejections.value, verdict.reason];
      return { applied: false as const, reason: verdict.reason };
    }

    const result = dispatch(patch, source);
    if (result.rejected.length) {
      rejections.value = [
        ...rejections.value,
        ...result.rejected.map((entry) => entry.reason),
      ];
    }
    return { applied: true as const, result };
  };

  /**
   * Runs every rule against the current signals. Rules are evaluated in order and
   * each sees the plan left by the previous one, so a rule that depends on the
   * mode another rule just set behaves predictably.
   */
  const evaluateRules = () => {
    for (const rule of localRules) {
      const patch = rule.evaluate(signals.value, plan.value);
      if (patch) propose(patch, "rule");
    }
  };

  /**
   * Restores the standard view, for real.
   *
   * Order matters only for clarity, not correctness: the rule pass that watches
   * the signals runs after both have settled. What matters is that the signals
   * go first conceptually - clearing the plan alone would leave the rules with
   * the same inputs and they would rebuild the adapted view immediately.
   */
  const reset = () => {
    resetSignals();
    resetPlan();
  };

  return { plan, signals, track, propose, evaluateRules, reset, rejections };
}
