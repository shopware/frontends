import type { ExperiencePlan } from "./types";

/**
 * The plan that reproduces the standard storefront listing view.
 *
 * This is the baseline every adaptation starts from and the exact state a user
 * reset returns to, so it must always render the same page the template shows
 * with adaptation switched off.
 */
export function createDefaultPlan(): ExperiencePlan {
  return {
    version: 0,
    mode: "explore",
    shell: {
      header: "standard",
      navigation: "standard",
      footer: "standard",
    },
    workspace: {
      width: "standard",
      density: "comfortable",
    },
    regions: {
      header: [],
      main: [
        {
          id: "product-grid",
          type: "product-grid",
          priority: 10,
          props: { columns: 3 },
          source: "default",
        },
      ],
      sidebar: [
        {
          id: "filter-panel",
          type: "filter-panel",
          priority: 10,
          props: { collapsed: false },
          source: "default",
        },
      ],
      footer: [],
    },
    overlays: [],
  };
}
