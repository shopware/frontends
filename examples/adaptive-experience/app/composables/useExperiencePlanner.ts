import { applyExperiencePatch } from "#shared/experience/applyPatch";
import { defaultAdaptationPolicy } from "#shared/experience/policy";
import { experiencePlanningResponseSchema } from "#shared/experience/schemas";
import type { ExperiencePatch } from "#shared/experience/types";

export type ShadowProposal = {
  basedOnPlanVersion: number;
  reasonCode: string;
  confidence: number;
  wouldAccept: number;
  wouldReject: string[];
};

/**
 * §21-23 client half of the AI planner loop.
 *
 * Nothing here trusts the network: the response is re-validated even though the
 * endpoint validated it, and the patch is only applied if `basedOnPlanVersion`
 * still matches the live plan (§22 stale-response rejection). In shadow mode
 * (§6) it records what the merger *would* have done and applies nothing.
 */
export function useExperiencePlanner() {
  const appConfig = useAppConfig();
  const timeoutMs = useRuntimeConfig().public.plannerTimeoutMs ?? 2000;
  const { plan, context, propose } = useExperienceEngine();

  const proposals = useState<ShadowProposal[]>(
    "experience-ai-proposals",
    () => [],
  );
  const pending = ref(false);

  // §12/§21 trigger policy: a client cooldown so a burst of signal changes does
  // not spam the endpoint. Kept just above the server's 3s window so a throttled
  // client never re-fires while the server is still cooling down (no 429s).
  const CLIENT_COOLDOWN_MS = 3500;
  const lastRequestAt = useState<number>("experience-ai-lastcall", () => 0);

  const dryRun = (patch: ExperiencePatch) =>
    applyExperiencePatch(
      structuredClone(toRaw(plan.value)),
      patch,
      context.value,
      defaultAdaptationPolicy,
      { source: "ai", now: Date.now() },
    );

  const requestPlan = async () => {
    if (pending.value || !import.meta.client) return;
    const startedAt = Date.now();
    if (startedAt - lastRequestAt.value < CLIENT_COOLDOWN_MS) return;
    lastRequestAt.value = startedAt;
    pending.value = true;

    // Captured before the await: the plan may move while the request is in
    // flight, which is exactly what the stale check needs to notice.
    const requestedVersion = plan.value.planVersion;
    const moduleIds = (["top", "main", "aside", "bottom"] as const).flatMap(
      (region) => plan.value.regions[region].map((m) => m.id),
    );

    try {
      const raw = await $fetch("/api/experience/plan", {
        method: "POST",
        timeout: timeoutMs,
        body: {
          requestId: crypto.randomUUID(),
          sessionId: context.value.sessionId,
          planVersion: requestedVersion,
          currentPlan: {
            mode: plan.value.mode,
            routeKey: plan.value.routeKey,
            moduleIds,
          },
          context: {
            route: { kind: context.value.route.kind },
            signals: context.value.signals,
            comparedProductCount: context.value.comparedProductIds.length,
            viewedProductCount: context.value.viewedProducts.length,
            searchCount: context.value.searches.length,
          },
          allowed: context.value.capabilities,
        },
      });

      const response = experiencePlanningResponseSchema.safeParse(raw);
      if (!response.success || !response.data.patch) return;

      const { patch, basedOnPlanVersion, reasonCode, confidence } =
        response.data;

      if (appConfig.experience.aiShadowMode) {
        const result = dryRun(patch);
        proposals.value = [
          ...proposals.value,
          {
            basedOnPlanVersion,
            reasonCode,
            confidence,
            wouldAccept: result.accepted.length,
            wouldReject: result.rejected.map((entry) => entry.reason),
          },
        ];
        return;
      }

      // §22: only apply if the plan has not moved on since the request.
      if (basedOnPlanVersion === plan.value.planVersion) {
        propose(patch, "ai");
      }
    } catch {
      // A planner that is slow, rate-limited or down must never break the page.
      // The plan simply stays where the local rules left it.
    } finally {
      pending.value = false;
    }
  };

  return { proposals, requestPlan, pending };
}
