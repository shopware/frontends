import type { Component } from "vue";

import type { ExperienceModuleType } from "#shared/experience/types";

import ExperienceAssistantMessage from "./AssistantMessageModule.vue";
import ExperienceContextualFilters from "./ContextualFiltersModule.vue";
import ExperienceIntentSummary from "./IntentSummaryModule.vue";
import ExperienceProductComparison from "./ProductComparisonModule.vue";
import ExperienceProductGrid from "./ProductGridModule.vue";

/**
 * §10/§12: the only place a module type becomes a Vue component.
 *
 * Partial by design - it mirrors the module registry, which currently registers
 * five of the ten contract types (§48's first vertical prototype). A type absent
 * here is also absent from the registry, so the merger rejects any patch naming
 * it before it could ever reach `<component :is>`.
 */
export const moduleComponents: Partial<
  Record<ExperienceModuleType, Component>
> = {
  "intent-summary": ExperienceIntentSummary,
  "product-grid": ExperienceProductGrid,
  "product-comparison": ExperienceProductComparison,
  "contextual-filters": ExperienceContextualFilters,
  "assistant-message": ExperienceAssistantMessage,
};
