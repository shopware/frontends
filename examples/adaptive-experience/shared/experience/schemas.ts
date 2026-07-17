import { z } from "zod";

/**
 * Wire contracts for the adaptive experience.
 *
 * Schemas are the single source of truth; the types in `./types.ts` are inferred
 * from them. Everything here is plain data - no Vue, no Pinia, no Shopware - so
 * it can be shared between the renderer, the rules engine and the Nitro endpoint.
 */

/** Upper bound on a single patch, so one AI response can never restructure the whole page. */
export const MAX_OPERATIONS_PER_PATCH = 8;

export const experienceModeSchema = z.enum(["explore", "compare", "decide"]);

export const experienceRegionSchema = z.enum([
  "header",
  "main",
  "sidebar",
  "footer",
]);

export const experienceModuleTypeSchema = z.enum([
  "product-grid",
  "comparison-tray",
  "filter-panel",
  "assistant-panel",
]);

export const experienceSourceSchema = z.enum(["default", "rule", "ai", "user"]);

export const experienceOverlaySchema = z.enum([
  "assistant",
  "comparison-tray",
  "cart-preview",
]);

export const headerVariantSchema = z.enum(["standard", "compact"]);
export const navigationVariantSchema = z.enum(["standard", "minimal"]);
export const footerVariantSchema = z.enum(["standard", "minimal"]);

export const experienceShellSchema = z.strictObject({
  header: headerVariantSchema,
  navigation: navigationVariantSchema,
  footer: footerVariantSchema,
});

/**
 * Deviation from the blueprint: no `columns` here.
 *
 * The gist puts `columns` on the workspace, but a grid module already carries
 * its own `columns` prop, which left two fields describing the same thing with
 * no rule for who wins. The renderer never needed the workspace one. Column
 * count belongs to the module that renders a grid; the workspace owns only the
 * space it hands out.
 */
export const experienceWorkspaceSchema = z.strictObject({
  width: z.enum(["standard", "wide", "full"]),
  density: z.enum(["comfortable", "compact"]),
});

export const experienceModuleSchema = z.strictObject({
  id: z.string().min(1).max(64),
  type: experienceModuleTypeSchema,
  priority: z.number().int().min(0).max(100),
  props: z.record(z.string(), z.unknown()),
  source: experienceSourceSchema,
});

export const experienceRegionsSchema = z.strictObject({
  header: z.array(experienceModuleSchema),
  main: z.array(experienceModuleSchema),
  sidebar: z.array(experienceModuleSchema),
  footer: z.array(experienceModuleSchema),
});

export const experiencePlanSchema = z.strictObject({
  version: z.number().int().min(0),
  mode: experienceModeSchema,
  shell: experienceShellSchema,
  workspace: experienceWorkspaceSchema,
  regions: experienceRegionsSchema,
  overlays: z.array(experienceOverlaySchema),
});

const moduleIdSchema = z.string().min(1).max(64);
const propsSchema = z.record(z.string(), z.unknown());

/**
 * The closed operation set. A patch can only ever be a list of these - there is
 * no escape hatch for arbitrary plan mutation, which is what makes an AI-authored
 * patch safe to validate.
 */
export const experienceOperationSchema = z.discriminatedUnion("type", [
  z.strictObject({
    type: z.literal("set-mode"),
    mode: experienceModeSchema,
  }),
  z.strictObject({
    type: z.literal("set-shell"),
    header: headerVariantSchema.optional(),
    navigation: navigationVariantSchema.optional(),
    footer: footerVariantSchema.optional(),
  }),
  z.strictObject({
    type: z.literal("set-workspace"),
    width: experienceWorkspaceSchema.shape.width.optional(),
    density: experienceWorkspaceSchema.shape.density.optional(),
  }),
  z.strictObject({
    type: z.literal("ensure-module"),
    moduleId: moduleIdSchema,
    moduleType: experienceModuleTypeSchema,
    region: experienceRegionSchema,
    priority: z.number().int().min(0).max(100).optional(),
    props: propsSchema.optional(),
  }),
  z.strictObject({
    type: z.literal("move-module"),
    moduleId: moduleIdSchema,
    region: experienceRegionSchema,
    priority: z.number().int().min(0).max(100).optional(),
  }),
  z.strictObject({
    type: z.literal("update-module-props"),
    moduleId: moduleIdSchema,
    props: propsSchema,
  }),
  z.strictObject({
    type: z.literal("hide-module"),
    moduleId: moduleIdSchema,
  }),
  z.strictObject({
    type: z.literal("show-overlay"),
    overlay: experienceOverlaySchema,
  }),
  z.strictObject({
    type: z.literal("hide-overlay"),
    overlay: experienceOverlaySchema,
  }),
  z.strictObject({
    type: z.literal("suggest-sales-channel"),
    salesChannelId: z.string().min(1).max(64),
  }),
]);

export const experiencePatchSchema = z.strictObject({
  operations: z
    .array(experienceOperationSchema)
    .min(1)
    .max(MAX_OPERATIONS_PER_PATCH),
  assistantMessage: z.string().max(280).optional(),
});

export const routeKindSchema = z.enum([
  "listing",
  "product",
  "checkout",
  "other",
]);

/**
 * Everything the local rules engine may look at, derived from the event log.
 *
 * This stays on the client. It holds identifiers because the rules need them to
 * build module props; see `experienceContextSchema` for the reduced projection
 * that is allowed to leave the browser.
 */
export const experienceSignalsSchema = z.strictObject({
  comparisonProductIds: z.array(z.string().min(1)).max(4),
  productsViewed: z.number().int().min(0),
  priceSortCount: z.number().int().min(0),
  routeKind: routeKindSchema,
});

/**
 * The AI-facing projection of the signals: scalars only.
 *
 * Deliberately narrower than `ExperienceSignals` - no product identifiers and no
 * customer identity ever reach the planner endpoint.
 */
export const experienceContextSchema = z.strictObject({
  comparisonIntent: z.number().min(0).max(1),
  priceSensitivity: z.number().min(0).max(1),
  productsViewed: z.number().int().min(0),
  comparisonCount: z.number().int().min(0),
  routeKind: routeKindSchema,
});

export const experiencePlanRequestSchema = z.strictObject({
  planVersion: z.number().int().min(0),
  mode: experienceModeSchema,
  context: experienceContextSchema,
});

export const experiencePlanResponseSchema = z.strictObject({
  /** Version the patch was computed against; the client rejects it if the plan moved on. */
  planVersion: z.number().int().min(0),
  /** Null when the planner had nothing worth proposing, which is the common case. */
  patch: experiencePatchSchema.nullable(),
});
