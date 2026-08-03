import { describe, expect, it } from "vitest";

import { applyExperiencePatch } from "./applyPatch";
import { createDefaultContext } from "./context";
import { createDefaultExperiencePlan } from "./defaults";
import { defaultAdaptationPolicy } from "./policy";
import type { ExperiencePatch, ExperiencePlan, RegionName } from "./types";
import { VIBE_HEADER_ID, vibePatch } from "./vibe";

const context = createDefaultContext("s", 0);
const apply = (plan: ExperiencePlan, patch: ExperiencePatch, now = 1000) =>
  applyExperiencePatch(plan, patch, context, defaultAdaptationPolicy, {
    source: "user",
    now,
  }).plan;

const REGIONS: RegionName[] = ["top", "main", "aside", "bottom"];
const gridStillThere = (plan: ExperiencePlan) =>
  REGIONS.some((region) =>
    plan.regions[region].some(
      (module) => module.type === "product-grid" && module.enabled,
    ),
  );

describe("vibePatch", () => {
  it("genz opens the immersive feed: skin, two columns, no sidebar, vibe header", () => {
    const plan = apply(
      createDefaultExperiencePlan("search", 0),
      vibePatch("genz"),
    );
    expect(plan.theme).toBe("genz");
    expect(plan.workspace.columns).toBe(2);
    expect(plan.workspace.sidebar).toBe("none");
    expect(plan.regions.top.map((m) => m.id)).toContain(VIBE_HEADER_ID);
  });

  it("classic reverts the whole transform", () => {
    const genz = apply(
      createDefaultExperiencePlan("search", 0),
      vibePatch("genz"),
    );
    const back = apply(genz, vibePatch("classic"), 500_000);
    expect(back.theme).toBe("classic");
    expect(back.workspace.sidebar).toBe("left");
    expect(back.workspace.columns).toBe(1);
    expect(back.regions.top.map((m) => m.id)).not.toContain(VIBE_HEADER_ID);
  });

  it("keeps the product grid through the transform (the keystone)", () => {
    const plan = apply(
      createDefaultExperiencePlan("search", 0),
      vibePatch("genz"),
    );
    expect(gridStillThere(plan)).toBe(true);
  });
});
