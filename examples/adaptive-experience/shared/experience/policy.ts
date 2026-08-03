import {
  MAX_MODULE_MOVES_PER_PATCH,
  MAX_OPERATIONS_PER_PATCH,
} from "./schemas";
import type { AdaptationPolicy } from "./types";

/**
 * §19 UX guardrails.
 *
 * The blueprint's stated defaults, in one place so a deployment can tune them
 * without touching the merger. These exist to stop adaptation feeling chaotic:
 * the merger enforces the counted limits, and the lock (checkout, typing,
 * dragging, and so on) is registered by components at runtime.
 */
export const defaultAdaptationPolicy: AdaptationPolicy = {
  /** "do not change structure more frequently than once every 10-20 seconds" */
  minimumPlanLifetimeMs: 10_000,
  /** A module the rules just placed should not vanish under the shopper's cursor. */
  minimumModuleLifetimeMs: 5_000,
  maximumOperationsPerPatch: MAX_OPERATIONS_PER_PATCH,
  maximumModuleMovesPerPatch: MAX_MODULE_MOVES_PER_PATCH,
  maximumStructuralChangesPerMinute: 6,
  /** "do not structurally adapt checkout" */
  protectedRoutes: ["/checkout", "/account"],
  /** "do not hide the cart"; the primary grid is the page's reason to exist. */
  protectedModuleIds: ["primary-product-grid"],
};
