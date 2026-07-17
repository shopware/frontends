import {
  experiencePatchSchema,
  experiencePlanRequestSchema,
} from "#shared/experience/schemas";

import { mockPlanner } from "../../services/ai/planner";

/**
 * The only place AI may touch the experience.
 *
 * Both directions are validated. The request is checked so a malformed context
 * never reaches the provider, and the provider's answer is checked because model
 * output is untrusted until it parses as a patch. The client never sees anything
 * that has not been through `experiencePatchSchema`.
 */

const COOLDOWN_MS = 3000;
const MAX_BODY_BYTES = 2048;

// In-memory and therefore per-instance: good enough to prove the loop, but a
// real deployment needs shared storage or the cooldown is per-lambda.
const lastCallBySession = new Map<string, number>();

export default defineEventHandler(async (event) => {
  const raw = await readRawBody(event);
  if (raw && raw.length > MAX_BODY_BYTES) {
    throw createError({ statusCode: 413, statusMessage: "Context too large" });
  }

  const parsedRequest = experiencePlanRequestSchema.safeParse(
    raw ? JSON.parse(raw.toString()) : undefined,
  );
  if (!parsedRequest.success) {
    throw createError({ statusCode: 400, statusMessage: "Invalid context" });
  }

  const sessionKey =
    getCookie(event, "sw-context-token") ??
    getRequestIP(event, { xForwardedFor: true }) ??
    "anonymous";
  const now = Date.now();
  const last = lastCallBySession.get(sessionKey);
  if (last !== undefined && now - last < COOLDOWN_MS) {
    throw createError({ statusCode: 429, statusMessage: "Cooling down" });
  }
  lastCallBySession.set(sessionKey, now);

  const proposal = await mockPlanner.propose(parsedRequest.data);
  if (proposal === null) {
    return { planVersion: parsedRequest.data.planVersion, patch: null };
  }

  const parsedPatch = experiencePatchSchema.safeParse(proposal);
  if (!parsedPatch.success) {
    // The provider returned something outside the contract. Drop it and say so,
    // rather than passing a partially-valid object to the client.
    console.warn(
      `[experience] ${mockPlanner.name} returned an invalid patch`,
      parsedPatch.error.issues,
    );
    throw createError({ statusCode: 502, statusMessage: "Invalid proposal" });
  }

  return {
    // Echoed back so the client can reject this patch if the plan moved on
    // while the request was in flight.
    planVersion: parsedRequest.data.planVersion,
    patch: parsedPatch.data,
  };
});
