import type { ExperiencePlan } from "./types";

/**
 * §9. The application must always have a working plan without AI and without
 * localStorage. This is what a shopper sees with adaptation switched off, and
 * exactly what an explicit reset returns to.
 *
 * `now` is injected rather than read from the clock so the function stays pure
 * and its output is comparable in tests.
 */
export function createDefaultExperiencePlan(
  routeKey = "home",
  now = 0,
): ExperiencePlan {
  return {
    schemaVersion: 1,
    planVersion: 1,
    mode: "explore",
    theme: "classic",
    routeKey,
    shell: {
      header: "default",
      navigation: "mega-menu",
      footer: "full",
    },
    workspace: {
      maxWidth: "standard",
      density: "comfortable",
      columns: 1,
      sidebar: "none",
      stickyAside: false,
    },
    regions: {
      top: [],
      main: [
        {
          id: "primary-product-grid",
          type: "product-grid",
          priority: 100,
          enabled: true,
          props: { limit: 12, sort: "relevance" },
          source: "default",
          createdAt: now,
          updatedAt: now,
        },
      ],
      aside: [],
      bottom: [],
    },
    overlays: {
      assistant: false,
      comparisonTray: false,
      cartPreview: false,
    },
    metadata: {
      reason: "default-plan",
      source: "default",
      generatedAt: now,
    },
  };
}
