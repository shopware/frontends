import type { z } from "zod";

import type {
  experienceContextSchema,
  experienceModeSchema,
  experienceModuleSchema,
  experienceModuleTypeSchema,
  experienceOperationSchema,
  experienceOverlaySchema,
  experiencePatchSchema,
  experiencePlanRequestSchema,
  experiencePlanResponseSchema,
  experiencePlanSchema,
  experienceRegionSchema,
  experienceShellSchema,
  experienceSignalsSchema,
  experienceSourceSchema,
  experienceWorkspaceSchema,
  routeKindSchema,
} from "./schemas";

export type ExperienceMode = z.infer<typeof experienceModeSchema>;
export type ExperienceRegion = z.infer<typeof experienceRegionSchema>;
export type ExperienceModuleType = z.infer<typeof experienceModuleTypeSchema>;
export type ExperienceSource = z.infer<typeof experienceSourceSchema>;
export type ExperienceOverlay = z.infer<typeof experienceOverlaySchema>;
export type ExperienceShell = z.infer<typeof experienceShellSchema>;
export type ExperienceWorkspace = z.infer<typeof experienceWorkspaceSchema>;
export type ExperienceModule = z.infer<typeof experienceModuleSchema>;
export type ExperiencePlan = z.infer<typeof experiencePlanSchema>;
export type ExperienceOperation = z.infer<typeof experienceOperationSchema>;
export type ExperiencePatch = z.infer<typeof experiencePatchSchema>;
export type RouteKind = z.infer<typeof routeKindSchema>;
export type ExperienceSignals = z.infer<typeof experienceSignalsSchema>;
export type ExperienceContext = z.infer<typeof experienceContextSchema>;
export type ExperiencePlanRequest = z.infer<typeof experiencePlanRequestSchema>;
export type ExperiencePlanResponse = z.infer<
  typeof experiencePlanResponseSchema
>;

/** Why the merger refused an operation. Surfaced for logging and shadow-mode analysis. */
export type RejectionReason =
  | "region-not-allowed"
  | "mode-not-allowed"
  | "invalid-props"
  | "unknown-module-id"
  | "duplicate-module-id"
  | "source-precedence"
  | "not-implemented";

export type RejectedOperation = {
  operation: ExperienceOperation;
  reason: RejectionReason;
};

export type PatchResult = {
  plan: ExperiencePlan;
  applied: ExperienceOperation[];
  rejected: RejectedOperation[];
};
