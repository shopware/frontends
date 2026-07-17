import type { Component } from "vue";

import type { ExperienceModuleType } from "#shared/experience/types";

import ExperienceAssistantPanel from "./AssistantPanel.vue";
import ExperienceComparisonTray from "./ComparisonTray.vue";
import ExperienceFilterPanel from "./FilterPanel.vue";
import ExperienceProductGrid from "./ProductGrid.vue";

/**
 * The only place a module type becomes a component.
 *
 * `Record` over the module type union means adding a type to the registry in
 * `#shared/experience/registry` without adding a component here is a type error,
 * so the two registries cannot drift.
 */
export const moduleComponents: Record<ExperienceModuleType, Component> = {
  "product-grid": ExperienceProductGrid,
  "comparison-tray": ExperienceComparisonTray,
  "filter-panel": ExperienceFilterPanel,
  "assistant-panel": ExperienceAssistantPanel,
};
