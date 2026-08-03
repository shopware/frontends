import { z } from "zod";

import type {
  ExperiencePlanningRequest,
  PlannerReasonCode,
} from "#shared/experience/types";

import type { PlannerProposal, PlannerProvider } from "./planner";

/**
 * A planner backed by a local Ollama model.
 *
 * Enable it with `EXPERIENCE_PLANNER=ollama` (see the endpoint and the example's
 * .env.example).
 *
 * The model is asked for a FLAT decision - one action plus a sentence of copy -
 * never the nested patch itself. A small local model (a 3B, the point of running
 * this locally) reliably classifies a handful of 0..1 signals and writes one
 * line of text, but it does *not* reliably synthesise the nested
 * discriminated-union patch: given a nullable patch grammar it lazily takes the
 * `null` branch, and when it does emit operations it invents value shapes
 * (`density: 0.75`, `columns: "2"`). So the model decides, and this provider
 * expands the decision into a real patch in code - exactly what the mock planner
 * already does from the same context.
 *
 * Model output stays untrusted throughout: the copy is only ever interpolated as
 * text (never HTML), the "already present" guards are enforced here rather than
 * trusted from the model, and the endpoint re-validates the expanded patch
 * against `experiencePatchSchema` before it can reach the page.
 */
const OLLAMA_URL = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "qwen2.5:3b";
const TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS) || 12_000;

/**
 * The narrow surface the model must return. Passed to Ollama as `format`, so the
 * output is grammar-constrained to it. A flat object with one enum and two short
 * optional strings is something a 3B model gets right; a nested patch is not.
 */
const decisionSchema = z.object({
  action: z.enum(["add-assistant", "compact-grid", "add-summary", "none"]),
  message: z.string().max(200).optional(),
  headline: z.string().max(120).optional(),
  confidence: z.number().min(0).max(1),
});
type Decision = z.infer<typeof decisionSchema>;
const decisionJsonSchema = z.toJSONSchema(decisionSchema);

const SYSTEM_PROMPT = `You tune a storefront listing page for one anonymous shopper.

You get session signals (each 0..1) and the ids of modules already on the page. Pick the ONE best action, or "none".

Choose "action":
- "add-assistant"  when comparisonIntent >= 0.5 OR supportNeed >= 0.5, AND no module id contains "assistant". Also write "message": one short, friendly sentence to show them.
- "compact-grid"   when priceSensitivity >= 0.6 (and neither of the above applies).
- "add-summary"    when uncertainty >= 0.6 AND no module id contains "intent". Also write "headline": a short orienting headline.
- "none"           when nothing above applies, or the relevant module already exists.

Return { "action", "message"?, "headline"?, "confidence": 0..1 }. Pick exactly one action.`;

async function decide(
  request: ExperiencePlanningRequest,
): Promise<Decision | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        format: decisionJsonSchema,
        options: { temperature: 0.2 },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: JSON.stringify({
              moduleIds: request.currentPlan.moduleIds,
              signals: request.context.signals,
            }),
          },
        ],
      }),
    });
    if (!res.ok) {
      console.warn(`[experience] ollama HTTP ${res.status}`);
      return null;
    }
    const data = (await res.json()) as { message?: { content?: string } };
    const content = data.message?.content;
    if (!content) return null;
    const parsed = decisionSchema.safeParse(JSON.parse(content));
    return parsed.success ? parsed.data : null;
  } finally {
    clearTimeout(timer);
  }
}

/** Trim, cap, and fall back so the page never renders an empty or oversized string. */
const copy = (value: string | undefined, max: number, fallback: string) => {
  const trimmed = (value ?? "").trim();
  return trimmed ? trimmed.slice(0, max) : fallback;
};

/**
 * Turn a decision into a real patch. Returns null for "none" and for the guards
 * the model is asked to apply but sometimes skips (proposing a module that is
 * already on the page), so a redundant proposal never reaches the endpoint.
 */
function expand(
  decision: Decision,
  request: ExperiencePlanningRequest,
): { patch: unknown; reasonCode: PlannerReasonCode } | null {
  const has = (needle: string) =>
    request.currentPlan.moduleIds.some((id) => id.includes(needle));
  const { comparisonIntent, supportNeed } = request.context.signals;

  switch (decision.action) {
    case "add-assistant": {
      if (has("assistant")) return null;
      return {
        reasonCode:
          supportNeed > comparisonIntent ? "support-need" : "comparison-intent",
        patch: {
          operations: [
            {
              type: "ensure-module",
              module: {
                id: "assistant",
                type: "assistant-message",
                region: "aside",
                priority: 20,
                props: {
                  message: copy(
                    decision.message,
                    200,
                    "Want a hand narrowing these down? I can line up a few side by side.",
                  ),
                  // Fixed, wired actions - not model output. The component maps
                  // each label to a real behaviour; the model only writes the copy.
                  quickActions: ["Sort by price", "Clear comparison"],
                },
              },
            },
            { type: "show-overlay", overlay: "assistant" },
          ],
        },
      };
    }
    case "compact-grid":
      return {
        reasonCode: "price-sensitivity",
        patch: {
          operations: [
            { type: "set-workspace", target: "density", value: "compact" },
          ],
        },
      };
    case "add-summary": {
      if (has("intent")) return null;
      return {
        reasonCode: "uncertainty",
        patch: {
          operations: [
            {
              type: "ensure-module",
              module: {
                id: "ai-intent-summary",
                type: "intent-summary",
                region: "top",
                priority: 30,
                props: {
                  headline: copy(
                    decision.headline,
                    120,
                    "Here is what matches your search so far.",
                  ),
                },
              },
            },
          ],
        },
      };
    }
    default:
      return null;
  }
}

export const ollamaPlanner: PlannerProvider = {
  name: `ollama:${OLLAMA_MODEL}`,
  propose: async (request): Promise<PlannerProposal> => {
    try {
      const decision = await decide(request);
      if (!decision || decision.action === "none") return null;

      const expanded = expand(decision, request);
      if (!expanded) return null;

      return {
        patch: expanded.patch,
        confidence: Math.min(Math.max(decision.confidence, 0), 1),
        reasonCode: expanded.reasonCode,
      };
    } catch (error) {
      // Model down, slow (aborted), or unparseable output must never break the
      // page - the plan simply stays where the local rules left it.
      console.warn(
        `[experience] ollama planner failed: ${(error as Error).message}`,
      );
      return null;
    }
  },
};
