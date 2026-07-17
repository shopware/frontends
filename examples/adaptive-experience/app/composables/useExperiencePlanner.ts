import { applyPatch } from "#shared/experience/applyPatch";
import { toAiContext } from "#shared/experience/rules";
import { experiencePlanResponseSchema } from "#shared/experience/schemas";
import type { ExperiencePatch } from "#shared/experience/types";

export type ShadowProposal = {
  requestedVersion: number;
  patch: ExperiencePatch;
  /** What the merger would have done, without touching the live plan. */
  wouldApply: number;
  wouldReject: string[];
};

/**
 * Client half of the AI planner loop.
 *
 * Nothing here trusts the network: the response is re-validated even though the
 * endpoint already validated it, because the schema is cheap and this composable
 * is the last gate before a patch reaches the plan.
 */
export function useExperiencePlanner() {
  const appConfig = useAppConfig();
  const { plan, signals, propose } = useExperienceEngine();

  const proposals = useState<ShadowProposal[]>(
    "experience-ai-proposals",
    () => [],
  );
  const pending = ref(false);

  const requestPlan = async () => {
    if (pending.value) return;
    pending.value = true;

    // Captured before the await: the plan may move while the request is in
    // flight, and that is exactly what the stale check needs to notice.
    const requestedVersion = plan.value.version;

    try {
      const raw = await $fetch("/api/experience/plan", {
        method: "POST",
        body: {
          planVersion: requestedVersion,
          mode: plan.value.mode,
          context: toAiContext(signals.value),
        },
        timeout: 2000,
      });

      const response = experiencePlanResponseSchema.safeParse(raw);
      if (!response.success || !response.data.patch) return;

      const patch = response.data.patch;

      if (appConfig.experience.aiShadowMode) {
        proposals.value = [
          ...proposals.value,
          buildShadowProposal(response.data.planVersion, patch),
        ];
        return;
      }

      propose(patch, "ai", response.data.planVersion);
    } catch {
      // A planner that is slow, rate-limited or down must never break the page.
      // The plan simply stays where the local rules left it.
    } finally {
      pending.value = false;
    }
  };

  /**
   * Runs the patch against a throwaway copy so shadow mode reports what would
   * have happened, not just what was proposed. A proposal the merger would have
   * rejected is not evidence the model is doing well.
   */
  const buildShadowProposal = (
    requestedVersion: number,
    patch: ExperiencePatch,
  ): ShadowProposal => {
    const dryRun = applyPatchDryRun(patch);
    return {
      requestedVersion,
      patch,
      wouldApply: dryRun.applied.length,
      wouldReject: dryRun.rejected.map((entry) => entry.reason),
    };
  };

  const applyPatchDryRun = (patch: ExperiencePatch) =>
    applyPatch(structuredClone(toRaw(plan.value)), patch, { source: "ai" });

  return { proposals, requestPlan, pending };
}
