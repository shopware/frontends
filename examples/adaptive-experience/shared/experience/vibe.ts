import type { ExperiencePatch, ExperienceTheme } from "./types";

/**
 * The Gen Z transformation as one coordinated patch (§7/§18).
 *
 * "Gen Z" is not a colour swap - it is a whole experience the assistant offers
 * and the shopper accepts. Switching in reskins (theme), opens up the canvas
 * (wide, two immersive columns, no filter sidebar) and adds a curated header;
 * switching out is the exact inverse, restoring the route baseline. Both go
 * through the merger like any other patch, so the guardrails and the keystone
 * (the product grid can never be hidden) still hold.
 */
export const VIBE_HEADER_ID = "vibe-header";
export const ASSISTANT_MODULE_ID = "assistant";

export function vibePatch(next: ExperienceTheme): ExperiencePatch {
  if (next === "genz") {
    return {
      // Five operations is the §19 ceiling. `sidebar: none` already frees the
      // main column to full width, so an explicit maxWidth op is not needed.
      operations: [
        { type: "set-theme", theme: "genz" },
        { type: "set-workspace", target: "columns", value: 2 },
        { type: "set-workspace", target: "sidebar", value: "none" },
        {
          type: "ensure-module",
          module: {
            id: VIBE_HEADER_ID,
            type: "intent-summary",
            region: "top",
            priority: 40,
            props: {
              headline: "Picked for your vibe",
              detail: "A bolder view, tuned to how you browse.",
            },
            // The shopper toggles this on and off directly, so the anti-flap
            // window must never hold it in place on the way back out.
            minimumLifetimeMs: 0,
          },
        },
        // Keep the assistant visible once the filter sidebar collapses. Harmless
        // if it is not on the page yet - the merger drops an orphan move.
        {
          type: "move-module",
          moduleId: ASSISTANT_MODULE_ID,
          region: "top",
          priority: 15,
        },
      ],
    };
  }

  return {
    operations: [
      { type: "set-theme", theme: "classic" },
      { type: "set-workspace", target: "columns", value: 1 },
      { type: "set-workspace", target: "sidebar", value: "left" },
      { type: "hide-module", moduleId: VIBE_HEADER_ID },
      {
        type: "move-module",
        moduleId: ASSISTANT_MODULE_ID,
        region: "aside",
        priority: 20,
      },
    ],
  };
}
