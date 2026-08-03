import { describe, expect, it } from "vitest";

import { applyExperiencePatch } from "./applyPatch";
import { createDefaultContext, deriveSignals } from "./context";
import { createDefaultExperiencePlan } from "./defaults";
import { defaultAdaptationPolicy } from "./policy";
import {
  comparisonRule,
  comparisonSyncRule,
  evaluateLocalRules,
  leaveCompareRule,
  localRules,
  priceSensitivityRule,
  vibeOfferRule,
} from "./rules";
import type { ExperienceContext, ExperiencePlan } from "./types";

const ctx = (over: Partial<ExperienceContext> = {}): ExperienceContext => ({
  ...createDefaultContext("s", 0),
  ...over,
});

/** One pass of the §20 engine loop: evaluate against the plan, merge in priority order. */
function runEngine(
  context: ExperienceContext,
  startPlan: ExperiencePlan,
  now: number,
): ExperiencePlan {
  let plan = startPlan;
  for (const result of evaluateLocalRules(localRules, context, plan)) {
    plan = applyExperiencePatch(
      plan,
      result.patch,
      context,
      defaultAdaptationPolicy,
      { source: "rule", now },
    ).plan;
  }
  return plan;
}

describe("comparisonRule", () => {
  it("switches to compare and stages the tray at two products", () => {
    const result = comparisonRule(
      ctx({ comparedProductIds: ["a", "b"] }),
      createDefaultExperiencePlan("search", 0),
    );
    expect(result?.ruleId).toBe("comparison-intent");
    expect(result?.priority).toBe(100);
    expect(result?.patch.operations[0]).toEqual({
      type: "set-mode",
      mode: "compare",
    });
  });

  it("does not fire below two products, or once already comparing", () => {
    const plan = createDefaultExperiencePlan("search", 0);
    expect(comparisonRule(ctx({ comparedProductIds: ["a"] }), plan)).toBeNull();
    expect(
      comparisonRule(ctx({ comparedProductIds: ["a", "b"] }), {
        ...plan,
        mode: "compare",
      }),
    ).toBeNull();
  });
});

describe("comparisonSyncRule", () => {
  const comparing = runEngine(
    ctx({ comparedProductIds: ["a", "b"] }),
    createDefaultExperiencePlan("search", 0),
    0,
  );

  it("updates the tray ids when the selection changes", () => {
    const result = comparisonSyncRule(
      ctx({ comparedProductIds: ["a", "b", "c"] }),
      comparing,
    );
    expect(result?.patch.operations[0]).toEqual({
      type: "update-module-props",
      moduleId: "product-comparison",
      props: { productIds: ["a", "b", "c"] },
    });
  });

  it("hides the tray when fewer than two remain", () => {
    const result = comparisonSyncRule(
      ctx({ comparedProductIds: ["a"] }),
      comparing,
    );
    expect(result?.patch.operations[0]).toEqual({
      type: "hide-module",
      moduleId: "product-comparison",
    });
  });

  it("does nothing when not comparing or when there is no tray", () => {
    const plain = createDefaultExperiencePlan("search", 0);
    expect(
      comparisonSyncRule(ctx({ comparedProductIds: ["a", "b"] }), plain),
    ).toBeNull();
    expect(
      comparisonSyncRule(ctx({ comparedProductIds: ["a", "b"] }), {
        ...comparing,
        mode: "explore",
      }),
    ).toBeNull();
  });
});

describe("leaveCompareRule", () => {
  const comparing = runEngine(
    ctx({ comparedProductIds: ["a", "b"] }),
    createDefaultExperiencePlan("search", 0),
    0,
  );

  it("returns to explore once nothing is staged", () => {
    const result = leaveCompareRule(ctx({ comparedProductIds: [] }), comparing);
    expect(result?.patch.operations).toContainEqual({
      type: "set-mode",
      mode: "explore",
    });
  });

  it("fires when fewer than two products remain, since you cannot compare one", () => {
    expect(
      leaveCompareRule(ctx({ comparedProductIds: ["a"] }), comparing)?.ruleId,
    ).toBe("leave-compare");
  });

  it("does not fire while two or more are staged", () => {
    expect(
      leaveCompareRule(ctx({ comparedProductIds: ["a", "b"] }), comparing),
    ).toBeNull();
  });
});

describe("priceSensitivityRule", () => {
  const sensitive = ctx({
    signals: deriveSignals({
      comparedProductCount: 0,
      repeatedProductViews: 0,
      technicalFilterCount: 0,
      priceSortCount: 2,
      searchCount: 0,
      productViewCount: 0,
      cartProductCount: 0,
    }),
  });

  it("densifies the workspace once price sensitivity is high enough", () => {
    const result = priceSensitivityRule(
      sensitive,
      createDefaultExperiencePlan("search", 0),
    );
    expect(result?.ruleId).toBe("price-sensitivity");
    expect(result?.patch.operations).toContainEqual({
      type: "set-workspace",
      target: "columns",
      value: 3,
    });
  });

  it("does not fire once the workspace is already dense", () => {
    const dense = createDefaultExperiencePlan("search", 0);
    dense.workspace.density = "compact";
    dense.workspace.columns = 3;
    expect(priceSensitivityRule(sensitive, dense)).toBeNull();
  });

  it("does not fire below the sensitivity threshold", () => {
    const mild = ctx({
      signals: deriveSignals({
        comparedProductCount: 0,
        repeatedProductViews: 0,
        technicalFilterCount: 0,
        priceSortCount: 1,
        searchCount: 0,
        productViewCount: 0,
        cartProductCount: 0,
      }),
    });
    expect(
      priceSensitivityRule(mild, createDefaultExperiencePlan("search", 0)),
    ).toBeNull();
  });
});

describe("vibeOfferRule", () => {
  const zeros = {
    comparedProductCount: 0,
    repeatedProductViews: 0,
    technicalFilterCount: 0,
    priceSortCount: 0,
    searchCount: 0,
    productViewCount: 0,
    cartProductCount: 0,
  };
  const visual = ctx({
    signals: deriveSignals({ ...zeros, productViewCount: 5 }),
  });

  it("offers the vibe via an assistant once visual browsing is high", () => {
    const result = vibeOfferRule(
      visual,
      createDefaultExperiencePlan("search", 0),
    );
    expect(result?.ruleId).toBe("vibe-offer");
    const op = result?.patch.operations[0];
    expect(op?.type).toBe("ensure-module");
    expect(op).toMatchObject({
      module: { type: "assistant-message", id: "assistant" },
    });
    // It offers - it does not flip the theme itself.
    expect(result?.patch.operations.some((o) => o.type === "set-theme")).toBe(
      false,
    );
  });

  it("does not fire below the threshold, once genz, or with an assistant already up", () => {
    const mild = ctx({
      signals: deriveSignals({ ...zeros, productViewCount: 1 }),
    });
    expect(
      vibeOfferRule(mild, createDefaultExperiencePlan("search", 0)),
    ).toBeNull();

    const already = createDefaultExperiencePlan("search", 0);
    already.theme = "genz";
    expect(vibeOfferRule(visual, already)).toBeNull();

    const withAssistant = createDefaultExperiencePlan("search", 0);
    withAssistant.regions.aside.push({
      id: "assistant",
      type: "assistant-message",
      priority: 20,
      enabled: true,
      props: { message: "hi" },
      source: "rule",
      createdAt: 0,
      updatedAt: 0,
    });
    expect(vibeOfferRule(visual, withAssistant)).toBeNull();
  });
});

describe("evaluateLocalRules", () => {
  it("returns matching rules sorted by descending priority", () => {
    const results = evaluateLocalRules(
      localRules,
      ctx({ comparedProductIds: ["a", "b"] }),
      createDefaultExperiencePlan("search", 0),
    );
    expect(results.map((r) => r.ruleId)).toEqual(["comparison-intent"]);
  });
});

describe("the engine loop (integration through the merger)", () => {
  it("acceptance: listing -> add two products -> compare", () => {
    const plan = runEngine(
      ctx({ comparedProductIds: ["a", "b"] }),
      createDefaultExperiencePlan("search", 0),
      0,
    );
    expect(plan.mode).toBe("compare");
    expect(plan.regions.top.map((m) => m.id)).toContain("product-comparison");
    expect(plan.overlays.comparisonTray).toBe(true);
  });

  it("converges: a second identical pass changes nothing", () => {
    const first = runEngine(
      ctx({ comparedProductIds: ["a", "b"] }),
      createDefaultExperiencePlan("search", 0),
      0,
    );
    const second = runEngine(
      ctx({ comparedProductIds: ["a", "b"] }),
      first,
      1_000_000,
    );
    expect(second.planVersion).toBe(first.planVersion);
  });

  it("empties the tray and returns to explore when nothing is staged", () => {
    const comparing = runEngine(
      ctx({ comparedProductIds: ["a", "b"] }),
      createDefaultExperiencePlan("search", 0),
      0,
    );
    const emptied = runEngine(
      ctx({ comparedProductIds: [] }),
      comparing,
      1_000_000,
    );
    expect(emptied.mode).toBe("explore");
    expect(emptied.regions.top.map((m) => m.id)).not.toContain(
      "product-comparison",
    );
  });
});
