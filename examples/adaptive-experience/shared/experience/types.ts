import type { z } from "zod";

import type {
  adaptationLockReasonSchema,
  adaptationPolicySchema,
  assistantMessagePropsSchema,
  contextualFiltersPropsSchema,
  experienceContextSchema,
  experienceMetadataSchema,
  experienceModeSchema,
  experienceModuleSchema,
  experienceModuleTypeSchema,
  experienceOperationSchema,
  experienceOverlaysSchema,
  experiencePatchSchema,
  experiencePlanningRequestSchema,
  experiencePlanningResponseSchema,
  experiencePlanSchema,
  experienceShellSchema,
  experienceSignalsSchema,
  experienceSourceSchema,
  experienceThemeSchema,
  experienceWorkspaceSchema,
  footerVariantSchema,
  headerVariantSchema,
  intentSummaryPropsSchema,
  navigationVariantSchema,
  overlayNameSchema,
  plannerCapabilitiesSchema,
  plannerReasonCodeSchema,
  productComparisonPropsSchema,
  productGridPropsSchema,
  regionNameSchema,
  routeKindSchema,
} from "./schemas";

export type ExperienceMode = z.infer<typeof experienceModeSchema>;
export type ExperienceTheme = z.infer<typeof experienceThemeSchema>;
export type HeaderVariant = z.infer<typeof headerVariantSchema>;
export type NavigationVariant = z.infer<typeof navigationVariantSchema>;
export type FooterVariant = z.infer<typeof footerVariantSchema>;
export type RegionName = z.infer<typeof regionNameSchema>;
export type ExperienceModuleType = z.infer<typeof experienceModuleTypeSchema>;
export type ExperienceSource = z.infer<typeof experienceSourceSchema>;
export type OverlayName = z.infer<typeof overlayNameSchema>;
export type ExperienceShell = z.infer<typeof experienceShellSchema>;
export type ExperienceWorkspace = z.infer<typeof experienceWorkspaceSchema>;
export type ExperienceOverlays = z.infer<typeof experienceOverlaysSchema>;
export type ExperienceMetadata = z.infer<typeof experienceMetadataSchema>;
export type ExperienceModule = z.infer<typeof experienceModuleSchema>;

/** §8 per-module prop shapes, for the renderer components. */
export type IntentSummaryProps = z.infer<typeof intentSummaryPropsSchema>;
export type ProductGridProps = z.infer<typeof productGridPropsSchema>;
export type ProductComparisonProps = z.infer<
  typeof productComparisonPropsSchema
>;
export type ContextualFiltersProps = z.infer<
  typeof contextualFiltersPropsSchema
>;
export type AssistantMessageProps = z.infer<typeof assistantMessagePropsSchema>;
export type ExperiencePlan = z.infer<typeof experiencePlanSchema>;
export type ExperienceOperation = z.infer<typeof experienceOperationSchema>;
export type ExperiencePatch = z.infer<typeof experiencePatchSchema>;
export type RouteKind = z.infer<typeof routeKindSchema>;
export type ExperienceSignals = z.infer<typeof experienceSignalsSchema>;
export type PlannerCapabilities = z.infer<typeof plannerCapabilitiesSchema>;
export type ExperienceContext = z.infer<typeof experienceContextSchema>;
export type AdaptationPolicy = z.infer<typeof adaptationPolicySchema>;
export type AdaptationLockReason = z.infer<typeof adaptationLockReasonSchema>;
export type PlannerReasonCode = z.infer<typeof plannerReasonCodeSchema>;
export type ExperiencePlanningRequest = z.infer<
  typeof experiencePlanningRequestSchema
>;
export type ExperiencePlanningResponse = z.infer<
  typeof experiencePlanningResponseSchema
>;

/** §16 rules engine. */
export type RuleResult = {
  ruleId: string;
  priority: number;
  patch: ExperiencePatch;
  reason: string;
};

export type ExperienceRule = (
  context: ExperienceContext,
  plan: ExperiencePlan,
) => RuleResult | null;

/** Why the merger refused an operation. §18 returns these alongside the plan. */
export type RejectionReason =
  | "unknown-module-type"
  | "region-not-allowed"
  | "mode-not-allowed"
  | "invalid-props"
  | "invalid-value"
  | "unknown-module-id"
  | "duplicate-module-id"
  | "max-instances"
  | "module-limit-reached"
  | "source-precedence"
  | "ai-not-allowed"
  | "minimum-lifetime"
  | "protected-module"
  | "patch-limit-exceeded"
  | "resulting-plan-invalid"
  | "not-implemented";

export type RejectedOperation = {
  operation: ExperienceOperation;
  reason: RejectionReason;
};

/** §18 `ApplyPatchResult`. */
export type ApplyPatchResult = {
  accepted: ExperienceOperation[];
  rejected: RejectedOperation[];
  plan: ExperiencePlan;
};
