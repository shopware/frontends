import { describe, expect, it } from "vitest";

import { applyPatch } from "./applyPatch";
import { createDefaultPlan } from "./defaults";
import { localRules, toAiContext } from "./rules";
import type { ExperiencePlan, ExperienceSignals } from "./types";

const signals = (
  overrides: Partial<ExperienceSignals> = {},
): ExperienceSignals => ({
  comparisonProductIds: [],
  productsViewed: 0,
  priceSortCount: 0,
  routeKind: "listing",
  ...overrides,
});

/** Runs the whole rule set the way the engine does, and returns the final plan. */
function runRules(
  input: ExperienceSignals,
  plan: ExperiencePlan = createDefaultPlan(),
): ExperiencePlan {
  let current = plan;
  for (const rule of localRules) {
    const patch = rule.evaluate(input, current);
    if (patch) current = applyPatch(current, patch, { source: "rule" }).plan;
  }
  return current;
}

describe("local rules", () => {
  it("does nothing on a fresh session", () => {
    const plan = createDefaultPlan();

    expect(runRules(signals(), plan)).toBe(plan);
  });

  it("does not switch to compare mode for a single staged product", () => {
    const plan = runRules(signals({ comparisonProductIds: ["a"] }));

    expect(plan.mode).toBe("explore");
  });

  describe("the acceptance scenario: listing -> add two products -> compare", () => {
    const plan = runRules(signals({ comparisonProductIds: ["a", "b"] }));

    it("switches to compare mode", () => {
      expect(plan.mode).toBe("compare");
    });

    it("puts the comparison tray in the main region", () => {
      expect(plan.regions.main.map((module) => module.id)).toContain(
        "comparison",
      );
    });

    it("passes the staged ids to the tray without any product data", () => {
      const tray = plan.regions.main.find(
        (module) => module.id === "comparison",
      );

      expect(tray?.props).toEqual({ productIds: ["a", "b"] });
    });

    it("keeps the product grid alongside it", () => {
      expect(plan.regions.main.map((module) => module.id)).toContain(
        "product-grid",
      );
    });
  });

  it("returns to explore once the shopper empties the tray", () => {
    const compared = runRules(signals({ comparisonProductIds: ["a", "b"] }));
    const emptied = runRules(signals({ comparisonProductIds: [] }), compared);

    expect(emptied.mode).toBe("explore");
  });

  it("drops the tray on the way back to explore, since it may not exist there", () => {
    const compared = runRules(signals({ comparisonProductIds: ["a", "b"] }));
    const emptied = runRules(signals({ comparisonProductIds: [] }), compared);

    expect(emptied.regions.main.map((module) => module.id)).not.toContain(
      "comparison",
    );
  });

  it("densifies the workspace once price sorting repeats", () => {
    const plan = runRules(signals({ priceSortCount: 2 }));

    expect(plan.workspace).toEqual({ width: "wide", density: "compact" });
    expect(plan.shell).toEqual({
      header: "compact",
      navigation: "minimal",
      footer: "standard",
    });
  });

  it("fits more products on screen by widening the grid module itself", () => {
    const plan = runRules(signals({ priceSortCount: 2 }));
    const grid = plan.regions.main.find(
      (module) => module.id === "product-grid",
    );

    expect(grid?.props).toEqual({ columns: 4 });
  });

  it("leaves the workspace alone after a single price sort", () => {
    const plan = runRules(signals({ priceSortCount: 1 }));

    expect(plan.workspace.density).toBe("comfortable");
  });

  it("settles: a second identical pass changes nothing", () => {
    const input = signals({
      comparisonProductIds: ["a", "b"],
      priceSortCount: 2,
    });
    const first = runRules(input);
    const second = runRules(input, first);

    expect(second).toBe(first);
  });
});

describe("toAiContext", () => {
  it("drops product ids so they never leave the browser", () => {
    const context = toAiContext(
      signals({ comparisonProductIds: ["prod-1", "prod-2"] }),
    );

    expect(JSON.stringify(context)).not.toContain("prod-1");
  });

  it("reduces the staged selection to a bounded intent score", () => {
    expect(
      toAiContext(signals({ comparisonProductIds: [] })).comparisonIntent,
    ).toBe(0);
    expect(
      toAiContext(signals({ comparisonProductIds: ["a"] })).comparisonIntent,
    ).toBe(0.5);
    expect(
      toAiContext(signals({ comparisonProductIds: ["a", "b", "c", "d"] }))
        .comparisonIntent,
    ).toBe(1);
  });

  it("clamps price sensitivity rather than letting it grow unbounded", () => {
    expect(toAiContext(signals({ priceSortCount: 99 })).priceSensitivity).toBe(
      1,
    );
  });
});
