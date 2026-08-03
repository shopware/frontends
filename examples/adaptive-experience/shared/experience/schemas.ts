import { z } from "zod";

/**
 * Wire contracts for the adaptive experience, per blueprint sections 7, 8, 15,
 * 17 and 19.
 *
 * Schemas are the source of truth; `./types.ts` infers from them. Nothing here
 * imports Vue, Pinia, Shopware or any AI provider, so the renderer, the rules
 * engine and Nitro can all share it (blueprint E1).
 *
 * Where this file deviates from the blueprint the deviation is commented and
 * says why. Silent divergence is what went wrong the first time.
 */

/** §7 */
export const experienceModeSchema = z.enum([
  "explore",
  "inspire",
  "compare",
  "decide",
  "configure",
  "support",
]);

export const headerVariantSchema = z.enum([
  "default",
  "compact",
  "search-first",
]);
export const navigationVariantSchema = z.enum([
  "mega-menu",
  "contextual",
  "hidden",
]);
export const footerVariantSchema = z.enum(["full", "compact", "hidden"]);

/**
 * §7 visual identity, a level above the shell variants: the same plan can wear a
 * different skin for a different audience. "classic" is the §9 default; "genz" is
 * the bold, expressive treatment applied by a rule (high visual browsing) or an
 * explicit user toggle.
 */
export const experienceThemeSchema = z.enum(["classic", "genz"]);

export const regionNameSchema = z.enum(["top", "main", "aside", "bottom"]);

export const experienceModuleTypeSchema = z.enum([
  "intent-summary",
  "product-grid",
  "product-comparison",
  "product-finder",
  "contextual-filters",
  "recommendations",
  "recently-viewed",
  "editorial-advice",
  "accessories",
  "assistant-message",
]);

/** §7. `route` ranks above a local rule and below an explicit user action (§16). */
export const experienceSourceSchema = z.enum([
  "default",
  "route",
  "rule",
  "ai",
  "user",
]);

export const overlayNameSchema = z.enum([
  "assistant",
  "comparisonTray",
  "cartPreview",
]);

/** §7 plan rules: "The plan must have a module-count limit, for example 20." */
export const MAX_MODULES_PER_PLAN = 20;

/** §17 AI patch limits. */
export const MAX_OPERATIONS_PER_PATCH = 5;
export const MAX_SHELL_CHANGES_PER_PATCH = 1;
export const MAX_MODULE_MOVES_PER_PATCH = 2;

export const experienceModuleSchema = z.strictObject({
  id: z.string().min(1).max(100),
  type: experienceModuleTypeSchema,
  priority: z.number().int().min(0).max(1000),
  enabled: z.boolean(),
  props: z.record(z.string(), z.unknown()),
  source: experienceSourceSchema,
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
  minimumLifetimeMs: z.number().int().min(0).max(300_000).optional(),
});

export const experienceRegionsSchema = z.strictObject({
  top: z.array(experienceModuleSchema),
  main: z.array(experienceModuleSchema),
  aside: z.array(experienceModuleSchema),
  bottom: z.array(experienceModuleSchema),
});

export const experienceShellSchema = z.strictObject({
  header: headerVariantSchema,
  navigation: navigationVariantSchema,
  footer: footerVariantSchema,
});

export const experienceWorkspaceSchema = z.strictObject({
  maxWidth: z.enum(["standard", "wide", "full"]),
  density: z.enum(["comfortable", "compact"]),
  columns: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  sidebar: z.enum(["none", "left", "right"]),
  stickyAside: z.boolean(),
});

export const experienceOverlaysSchema = z.strictObject({
  assistant: z.boolean(),
  comparisonTray: z.boolean(),
  cartPreview: z.boolean(),
});

export const experienceMetadataSchema = z.strictObject({
  reason: z.string().min(1).max(200),
  source: experienceSourceSchema,
  generatedAt: z.number().int().nonnegative(),
  expiresAt: z.number().int().nonnegative().optional(),
});

export const experiencePlanSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    planVersion: z.number().int().nonnegative(),
    mode: experienceModeSchema,
    /** §7 visual skin, driven by a rule or the user toggle. */
    theme: experienceThemeSchema,
    /** §7: identifies route context, e.g. `search`, `category`, `product`, `home`. */
    routeKey: z.string().min(1).max(100),
    shell: experienceShellSchema,
    workspace: experienceWorkspaceSchema,
    regions: experienceRegionsSchema,
    overlays: experienceOverlaysSchema,
    metadata: experienceMetadataSchema,
  })
  .refine(
    (plan) =>
      Object.values(plan.regions).reduce(
        (total, modules) => total + modules.length,
        0,
      ) <= MAX_MODULES_PER_PLAN,
    { message: `A plan may hold at most ${MAX_MODULES_PER_PLAN} modules` },
  )
  .refine(
    (plan) => {
      const ids = Object.values(plan.regions).flatMap((modules) =>
        modules.map((module) => module.id),
      );
      return new Set(ids).size === ids.length;
    },
    { message: "Module ids must be unique across regions" },
  );

/** §8 module prop schemas. `strict()` so invented props cannot pass. */
export const intentSummaryPropsSchema = z.strictObject({
  headline: z.string().min(1).max(140),
  detail: z.string().max(280).optional(),
});

export const productGridPropsSchema = z.strictObject({
  listingKey: z.string().min(1).max(100).optional(),
  categoryId: z.string().max(100).optional(),
  productIds: z.array(z.string().max(100)).max(24).optional(),
  sort: z.enum(["relevance", "price-asc", "price-desc", "newest"]).optional(),
  limit: z.number().int().min(1).max(24).default(12),
  filterPreset: z.string().max(100).optional(),
});

export const productComparisonPropsSchema = z.strictObject({
  productIds: z.array(z.string().max(100)).min(2).max(4),
  attributeGroups: z.array(z.string().max(100)).max(10).optional(),
});

export const contextualFiltersPropsSchema = z.strictObject({
  listingKey: z.string().min(1).max(100).optional(),
  collapsed: z.boolean().default(false),
});

export const assistantMessagePropsSchema = z.strictObject({
  message: z.string().min(1).max(280),
  quickActions: z.array(z.string().max(80)).max(4).optional(),
});

/** §15. Signals are 0..1 heuristics, calculated deterministically. */
export const routeKindSchema = z.enum([
  "home",
  "search",
  "category",
  "product",
  "cart",
  "checkout",
  "account",
]);

const unitInterval = z.number().min(0).max(1);

export const experienceSignalsSchema = z.strictObject({
  visualInterest: unitInterval,
  technicalInterest: unitInterval,
  priceSensitivity: unitInterval,
  uncertainty: unitInterval,
  decisionReadiness: unitInterval,
  comparisonIntent: unitInterval,
  supportNeed: unitInterval,
});

export const plannerCapabilitiesSchema = z.strictObject({
  canSwitchSalesChannelAutomatically: z.boolean(),
  canChangeShell: z.boolean(),
  canMoveModules: z.boolean(),
  canShowAssistant: z.boolean(),
});

export const experienceContextSchema = z.strictObject({
  sessionId: z.string().min(1).max(100),
  startedAt: z.number().int().nonnegative(),
  lastActivityAt: z.number().int().nonnegative(),
  route: z.strictObject({
    name: z.string().max(100).optional(),
    path: z.string().max(2000),
    kind: routeKindSchema,
  }),
  searches: z
    .array(
      z.strictObject({
        query: z.string().max(200),
        timestamp: z.number().int().nonnegative(),
      }),
    )
    .max(50),
  viewedProducts: z
    .array(
      z.strictObject({
        productId: z.string().max(100),
        timestamp: z.number().int().nonnegative(),
        count: z.number().int().positive(),
      }),
    )
    .max(100),
  comparedProductIds: z.array(z.string().max(100)).max(4),
  cartProductIds: z.array(z.string().max(100)).max(100),
  activeFilters: z.record(z.string(), z.unknown()),
  activeCategoryId: z.string().max(100).optional(),
  signals: experienceSignalsSchema,
  capabilities: plannerCapabilitiesSchema,
});

/** §17 patch format. */
export const experienceOperationSchema = z.discriminatedUnion("type", [
  z.strictObject({
    type: z.literal("set-mode"),
    mode: experienceModeSchema,
  }),
  z.strictObject({
    type: z.literal("set-theme"),
    theme: experienceThemeSchema,
  }),
  z.strictObject({
    type: z.literal("set-shell"),
    target: z.enum(["header", "navigation", "footer"]),
    value: z.string().max(50),
  }),
  z.strictObject({
    type: z.literal("set-workspace"),
    target: z.enum([
      "maxWidth",
      "density",
      "columns",
      "sidebar",
      "stickyAside",
    ]),
    value: z.union([z.string().max(50), z.number(), z.boolean()]),
  }),
  z.strictObject({
    type: z.literal("ensure-module"),
    module: z.strictObject({
      id: z.string().min(1).max(100),
      type: experienceModuleTypeSchema,
      region: regionNameSchema,
      priority: z.number().int().min(0).max(1000),
      props: z.record(z.string(), z.unknown()),
      // Lets a rule declare a module's own §19 minimum lifetime. Inherently
      // user-driven modules (the comparison tray) set 0 so a change reflecting
      // the shopper's own action is never blocked by the anti-flap window.
      minimumLifetimeMs: z.number().int().min(0).max(300_000).optional(),
    }),
  }),
  z.strictObject({
    type: z.literal("move-module"),
    moduleId: z.string().min(1).max(100),
    region: regionNameSchema,
    priority: z.number().int().min(0).max(1000),
  }),
  z.strictObject({
    type: z.literal("update-module-props"),
    moduleId: z.string().min(1).max(100),
    props: z.record(z.string(), z.unknown()),
  }),
  z.strictObject({
    type: z.literal("hide-module"),
    moduleId: z.string().min(1).max(100),
  }),
  z.strictObject({
    type: z.literal("show-overlay"),
    overlay: overlayNameSchema,
  }),
  z.strictObject({
    type: z.literal("hide-overlay"),
    overlay: overlayNameSchema,
  }),
  z.strictObject({
    type: z.literal("suggest-sales-channel"),
    channelId: z.string().min(1).max(100),
    reasonCode: z.string().min(1).max(100),
  }),
]);

export const experiencePatchSchema = z.strictObject({
  operations: z
    .array(experienceOperationSchema)
    .min(1)
    .max(MAX_OPERATIONS_PER_PATCH),
  assistantMessage: z.string().max(280).optional(),
  quickActions: z.array(z.string().max(80)).max(4).optional(),
});

/** §19 UX guardrails. */
export const adaptationPolicySchema = z.strictObject({
  minimumPlanLifetimeMs: z.number().int().nonnegative(),
  minimumModuleLifetimeMs: z.number().int().nonnegative(),
  maximumOperationsPerPatch: z.number().int().positive(),
  maximumModuleMovesPerPatch: z.number().int().nonnegative(),
  maximumStructuralChangesPerMinute: z.number().int().nonnegative(),
  protectedRoutes: z.array(z.string().max(200)),
  protectedModuleIds: z.array(z.string().max(100)),
});

export const adaptationLockReasonSchema = z.enum([
  "checkout",
  "user-typing",
  "modal-open",
  "dragging",
  "payment-pending",
  "sales-channel-switch",
  "critical-request",
]);

/** §4 endpoint contract. */
export const plannerReasonCodeSchema = z.enum([
  "comparison-intent",
  "price-sensitivity",
  "uncertainty",
  "support-need",
  "no-action",
]);

export const experiencePlanningRequestSchema = z.strictObject({
  requestId: z.string().min(1).max(100),
  sessionId: z.string().min(1).max(100),
  planVersion: z.number().int().nonnegative(),
  currentPlan: z.strictObject({
    mode: experienceModeSchema,
    routeKey: z.string().min(1).max(100),
    moduleIds: z.array(z.string().max(100)).max(MAX_MODULES_PER_PLAN),
  }),
  context: z.strictObject({
    route: z.strictObject({ kind: routeKindSchema }),
    signals: experienceSignalsSchema,
    comparedProductCount: z.number().int().nonnegative(),
    viewedProductCount: z.number().int().nonnegative(),
    searchCount: z.number().int().nonnegative(),
  }),
  allowed: plannerCapabilitiesSchema,
});

export const experiencePlanningResponseSchema = z.strictObject({
  requestId: z.string().min(1).max(100),
  /** §4: required, so a response cannot blindly overwrite a newer plan. */
  basedOnPlanVersion: z.number().int().nonnegative(),
  patch: experiencePatchSchema.nullable(),
  confidence: unitInterval,
  reasonCode: plannerReasonCodeSchema,
  expiresAt: z.string().max(40),
});
