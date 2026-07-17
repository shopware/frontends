import { z } from "zod";

import type {
  ExperienceMode,
  ExperienceModuleType,
  ExperienceRegion,
} from "./types";

/**
 * The closed module registry.
 *
 * Metadata only - the Vue component for each type is resolved separately in
 * `app/components/experience/moduleComponents.ts`. Keeping the two apart is what
 * lets the merger validate a patch on the server, where no component exists.
 *
 * Props schemas hold identifiers and display options only. Product data is never
 * carried in the plan; modules fetch it from Shopware when they render.
 */
export type ModuleDefinition = {
  allowedRegions: readonly ExperienceRegion[];
  allowedModes: readonly ExperienceMode[];
  propsSchema: z.ZodType;
  defaultProps: Record<string, unknown>;
  defaultPriority: number;
};

export type ModuleRegistry = Readonly<
  Record<ExperienceModuleType, ModuleDefinition>
>;

export const moduleRegistry: ModuleRegistry = {
  "product-grid": {
    allowedRegions: ["main"],
    allowedModes: ["explore", "compare", "decide"],
    propsSchema: z.strictObject({
      columns: z.number().int().min(1).max(4),
    }),
    defaultProps: { columns: 3 },
    defaultPriority: 10,
  },
  "comparison-tray": {
    allowedRegions: ["main", "sidebar"],
    allowedModes: ["compare", "decide"],
    propsSchema: z.strictObject({
      productIds: z.array(z.string().min(1)).max(4),
    }),
    defaultProps: { productIds: [] },
    defaultPriority: 5,
  },
  "filter-panel": {
    allowedRegions: ["sidebar"],
    allowedModes: ["explore", "compare"],
    propsSchema: z.strictObject({
      collapsed: z.boolean(),
    }),
    defaultProps: { collapsed: false },
    defaultPriority: 10,
  },
  "assistant-panel": {
    allowedRegions: ["main", "sidebar"],
    allowedModes: ["explore", "compare", "decide"],
    propsSchema: z.strictObject({
      message: z.string().max(280),
    }),
    defaultProps: { message: "" },
    defaultPriority: 20,
  },
};

/**
 * Source precedence. An explicit user action outranks a rule or an AI proposal,
 * so a lower-ranked source may never overwrite a module the user placed.
 */
export const SOURCE_RANK = {
  default: 0,
  rule: 1,
  ai: 1,
  user: 2,
} as const;
