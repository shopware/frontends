import {
  experiencePatchSchema,
  experiencePlanningRequestSchema,
  experiencePlanningResponseSchema,
} from "#shared/experience/schemas";

import { ollamaPlanner } from "../../services/ai/ollamaPlanner";
import { mockPlanner } from "../../services/ai/planner";

// The deterministic mock is the default; opt into a local model with
// `EXPERIENCE_PLANNER=ollama` (see the example's .env.example). Both return
// untrusted output that the validation below still gates.
const planner =
  process.env.EXPERIENCE_PLANNER === "ollama" ? ollamaPlanner : mockPlanner;

/**
 * §4/§23: the one controlled AI integration point.
 *
 * Both directions are validated. The request is checked so a malformed context
 * never reaches the provider; the provider's patch is checked because model
 * output is untrusted until it parses; and the whole response is re-validated
 * before it leaves. The client never sees anything outside the contract.
 */

const COOLDOWN_MS = 3000;
const MAX_BODY_BYTES = 4096;

// In-memory, therefore per-instance: enough to prove the loop, but a real
// deployment needs shared storage or the cooldown is per-lambda.
const lastCallBySession = new Map<string, number>();

export default defineEventHandler(async (event) => {
  const raw = await readRawBody(event);
  if (raw && raw.length > MAX_BODY_BYTES) {
    throw createError({ statusCode: 413, statusMessage: "Context too large" });
  }

  const parsedRequest = experiencePlanningRequestSchema.safeParse(
    raw ? JSON.parse(raw.toString()) : undefined,
  );
  if (!parsedRequest.success) {
    throw createError({ statusCode: 400, statusMessage: "Invalid request" });
  }
  const request = parsedRequest.data;

  const sessionKey =
    getCookie(event, "sw-context-token") ??
    request.sessionId ??
    getRequestIP(event, { xForwardedFor: true }) ??
    "anonymous";
  const now = Date.now();
  const last = lastCallBySession.get(sessionKey);
  if (last !== undefined && now - last < COOLDOWN_MS) {
    throw createError({ statusCode: 429, statusMessage: "Cooling down" });
  }
  lastCallBySession.set(sessionKey, now);

  const expiresAt = new Date(now + COOLDOWN_MS).toISOString();
  const proposal = await planner.propose(request);

  if (proposal === null) {
    return {
      requestId: request.requestId,
      basedOnPlanVersion: request.planVersion,
      patch: null,
      confidence: 0,
      reasonCode: "no-action" as const,
      expiresAt,
    };
  }

  const parsedPatch = experiencePatchSchema.safeParse(proposal.patch);
  if (!parsedPatch.success) {
    // The provider returned something outside the contract. Drop it rather than
    // pass a partially-valid object on.
    console.warn(
      `[experience] ${planner.name} returned an invalid patch`,
      parsedPatch.error.issues,
    );
    throw createError({ statusCode: 502, statusMessage: "Invalid proposal" });
  }

  const response = experiencePlanningResponseSchema.safeParse({
    requestId: request.requestId,
    basedOnPlanVersion: request.planVersion,
    patch: parsedPatch.data,
    confidence: Math.min(Math.max(proposal.confidence, 0), 1),
    reasonCode: proposal.reasonCode,
    expiresAt,
  });
  if (!response.success) {
    throw createError({ statusCode: 500, statusMessage: "Invalid response" });
  }

  return response.data;
});
