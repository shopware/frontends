import type { z } from "zod";

import {
  assistantMessagePropsSchema,
  contextualFiltersPropsSchema,
  intentSummaryPropsSchema,
  productComparisonPropsSchema,
  productGridPropsSchema,
} from "./schemas";
import type { ExperienceMode, ExperienceModuleType, RegionName } from "./types";

/**
 * §10. The registry is the security boundary between the plan and Vue.
 *
 * Metadata only. The component for each type is resolved separately in
 * `app/components/experience/moduleComponents.ts`, because the merger must be
 * able to validate a patch on the server where no component exists. §10's entry
 * shape keeps `component` here; splitting it is a deliberate deviation, and the
 * two halves are kept in step by a type-level check on the component map.
 */
export type ModuleRegistryEntry = {
  propsSchema: z.ZodType;
  allowedRegions: readonly RegionName[];
  allowedModes: readonly ExperienceMode[];
  commerceRisk: "none" | "read" | "cart" | "checkout";
  canBeAddedByAI: boolean;
  canBeMovedByAI: boolean;
  canBeHiddenByAI: boolean;
  maxInstances: number;
};

/**
 * Partial by design. §48's first vertical prototype names five modules; the
 * other five types exist in the contract but have no implementation yet, and an
 * operation naming one is rejected as `unknown-module-type`. That is the closed
 * registry working, not a gap: a type becomes renderable only once registered.
 */
export type ModuleRegistry = Partial<
  Record<ExperienceModuleType, ModuleRegistryEntry>
>;

export const moduleRegistry: ModuleRegistry = {
  "intent-summary": {
    propsSchema: intentSummaryPropsSchema,
    allowedRegions: ["top", "main"],
    allowedModes: ["explore", "inspire", "compare", "decide"],
    commerceRisk: "none",
    canBeAddedByAI: true,
    canBeMovedByAI: true,
    canBeHiddenByAI: true,
    maxInstances: 1,
  },

  "product-grid": {
    propsSchema: productGridPropsSchema,
    allowedRegions: ["main", "bottom"],
    allowedModes: ["explore", "inspire", "compare", "decide"],
    commerceRisk: "read",
    canBeAddedByAI: true,
    canBeMovedByAI: true,
    // §10, verbatim. Without this an AI patch can hide the page's only commerce
    // content and leave an empty storefront that still validates.
    canBeHiddenByAI: false,
    maxInstances: 2,
  },

  "product-comparison": {
    propsSchema: productComparisonPropsSchema,
    // Placed above the listing (region "top") so a comparison is seen without
    // scrolling; "main" stays allowed so a patch may still stage it inline.
    allowedRegions: ["top", "main"],
    allowedModes: ["compare", "decide"],
    commerceRisk: "read",
    canBeAddedByAI: true,
    canBeMovedByAI: true,
    canBeHiddenByAI: true,
    maxInstances: 1,
  },

  "contextual-filters": {
    propsSchema: contextualFiltersPropsSchema,
    allowedRegions: ["aside", "top"],
    allowedModes: ["explore", "inspire", "compare", "decide"],
    commerceRisk: "read",
    canBeAddedByAI: true,
    canBeMovedByAI: true,
    canBeHiddenByAI: true,
    maxInstances: 1,
  },

  "assistant-message": {
    propsSchema: assistantMessagePropsSchema,
    allowedRegions: ["top", "aside", "main"],
    allowedModes: [
      "explore",
      "inspire",
      "compare",
      "decide",
      "configure",
      "support",
    ],
    commerceRisk: "none",
    canBeAddedByAI: true,
    canBeMovedByAI: true,
    canBeHiddenByAI: true,
    maxInstances: 1,
  },
};

/**
 * §16 conflict resolution:
 *   security > route policy > explicit user action > commerce state > local rule > AI > default
 *
 * Only the sources the plan's `source` field can hold are ranked. A lower rank
 * may never overwrite what a higher one placed.
 */
export const SOURCE_RANK = {
  default: 0,
  ai: 1,
  rule: 2,
  route: 3,
  user: 4,
} as const;
