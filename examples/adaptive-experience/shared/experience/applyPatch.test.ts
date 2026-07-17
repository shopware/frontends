import { describe, expect, it } from "vitest";

import { applyPatch } from "./applyPatch";
import { createDefaultPlan } from "./defaults";
import type { ExperiencePatch, ExperiencePlan } from "./types";

const patch = (
  ...operations: ExperiencePatch["operations"]
): ExperiencePatch => ({
  operations,
});

const compareModePlan = (): ExperiencePlan => {
  const { plan } = applyPatch(
    createDefaultPlan(),
    patch({ type: "set-mode", mode: "compare" }),
    { source: "rule" },
  );
  return plan;
};

describe("applyPatch", () => {
  it("does not mutate the input plan", () => {
    const plan = createDefaultPlan();
    const snapshot = structuredClone(plan);

    applyPatch(plan, patch({ type: "set-mode", mode: "compare" }), {
      source: "rule",
    });

    expect(plan).toEqual(snapshot);
  });

  it("advances the version when the plan changes", () => {
    const plan = createDefaultPlan();

    const { plan: next } = applyPatch(
      plan,
      patch({ type: "set-mode", mode: "compare" }),
      { source: "rule" },
    );

    expect(next.version).toBe(plan.version + 1);
    expect(next.mode).toBe("compare");
  });

  it("keeps the version and plan identity when nothing actually changed", () => {
    const plan = createDefaultPlan();

    const result = applyPatch(
      plan,
      patch({ type: "set-mode", mode: "explore" }),
      { source: "rule" },
    );

    expect(result.plan).toBe(plan);
    expect(result.applied).toHaveLength(1);
    expect(result.rejected).toHaveLength(0);
  });

  it("applies operations in order against the state left by the previous one", () => {
    // ensure-module would be rejected in explore mode, so the preceding
    // set-mode is what makes it legal.
    const { plan } = applyPatch(
      createDefaultPlan(),
      patch(
        { type: "set-mode", mode: "compare" },
        {
          type: "ensure-module",
          moduleId: "comparison",
          moduleType: "comparison-tray",
          region: "main",
        },
      ),
      { source: "rule" },
    );

    expect(plan.regions.main.map((module) => module.id)).toContain(
      "comparison",
    );
  });

  describe("registry validation", () => {
    it("rejects a module in a region its type does not allow", () => {
      const result = applyPatch(
        createDefaultPlan(),
        patch({
          type: "ensure-module",
          moduleId: "grid-2",
          moduleType: "product-grid",
          region: "sidebar",
        }),
        { source: "ai" },
      );

      expect(result.rejected).toEqual([
        {
          operation: expect.objectContaining({ moduleId: "grid-2" }),
          reason: "region-not-allowed",
        },
      ]);
      expect(result.plan.regions.sidebar).toHaveLength(1);
    });

    it("rejects a module whose type is not allowed in the current mode", () => {
      const result = applyPatch(
        createDefaultPlan(),
        patch({
          type: "ensure-module",
          moduleId: "comparison",
          moduleType: "comparison-tray",
          region: "main",
        }),
        { source: "rule" },
      );

      expect(result.rejected[0]?.reason).toBe("mode-not-allowed");
    });

    it("rejects props that do not match the module schema", () => {
      const result = applyPatch(
        createDefaultPlan(),
        patch({
          type: "update-module-props",
          moduleId: "product-grid",
          props: { columns: 99 },
        }),
        { source: "ai" },
      );

      expect(result.rejected[0]?.reason).toBe("invalid-props");
      expect(result.plan.regions.main[0]?.props).toEqual({ columns: 3 });
    });

    it("rejects unknown props rather than letting them reach the renderer", () => {
      const result = applyPatch(
        createDefaultPlan(),
        patch({
          type: "update-module-props",
          moduleId: "product-grid",
          props: { onClick: "alert(1)" },
        }),
        { source: "ai" },
      );

      expect(result.rejected[0]?.reason).toBe("invalid-props");
    });

    it("rejects an operation targeting a module that does not exist", () => {
      const result = applyPatch(
        createDefaultPlan(),
        patch({ type: "hide-module", moduleId: "nope" }),
        { source: "user" },
      );

      expect(result.rejected[0]?.reason).toBe("unknown-module-id");
    });

    it("rejects reusing an existing module id for a different type", () => {
      const result = applyPatch(
        createDefaultPlan(),
        patch({
          type: "ensure-module",
          moduleId: "product-grid",
          moduleType: "assistant-panel",
          region: "main",
        }),
        { source: "ai" },
      );

      expect(result.rejected[0]?.reason).toBe("duplicate-module-id");
    });

    it("drops modules that the new mode does not allow, keeping the plan valid", () => {
      const plan = compareModePlan();
      const { plan: withTray } = applyPatch(
        plan,
        patch({
          type: "ensure-module",
          moduleId: "comparison",
          moduleType: "comparison-tray",
          region: "main",
        }),
        { source: "rule" },
      );

      // filter-panel is not allowed in decide mode, comparison-tray is.
      const { plan: decided } = applyPatch(
        withTray,
        patch({ type: "set-mode", mode: "decide" }),
        { source: "rule" },
      );

      expect(decided.regions.sidebar).toHaveLength(0);
      expect(decided.regions.main.map((module) => module.id)).toContain(
        "comparison",
      );
    });
  });

  describe("idempotency", () => {
    it("treats re-ensuring the same module as an applied no-op", () => {
      const plan = compareModePlan();
      const ensure = patch({
        type: "ensure-module",
        moduleId: "comparison",
        moduleType: "comparison-tray",
        region: "main",
      });

      const first = applyPatch(plan, ensure, { source: "rule" });
      const second = applyPatch(first.plan, ensure, { source: "rule" });

      expect(second.plan).toBe(first.plan);
      expect(second.plan.version).toBe(first.plan.version);
      expect(second.rejected).toHaveLength(0);
      expect(second.plan.regions.main).toHaveLength(2);
    });
  });

  describe("source precedence", () => {
    it("refuses to let a rule overwrite a module the user placed", () => {
      const { plan: userPlan } = applyPatch(
        createDefaultPlan(),
        patch({
          type: "update-module-props",
          moduleId: "product-grid",
          props: { columns: 1 },
        }),
        { source: "user" },
      );

      const result = applyPatch(
        userPlan,
        patch({
          type: "update-module-props",
          moduleId: "product-grid",
          props: { columns: 4 },
        }),
        { source: "rule" },
      );

      expect(result.rejected[0]?.reason).toBe("source-precedence");
      expect(result.plan.regions.main[0]?.props).toEqual({ columns: 1 });
    });

    it("refuses to let AI overwrite a module the user placed", () => {
      const { plan: userPlan } = applyPatch(
        createDefaultPlan(),
        patch({ type: "hide-module", moduleId: "filter-panel" }),
        { source: "user" },
      );
      const { plan: restored } = applyPatch(
        userPlan,
        patch({
          type: "ensure-module",
          moduleId: "filter-panel",
          moduleType: "filter-panel",
          region: "sidebar",
        }),
        { source: "user" },
      );

      const result = applyPatch(
        restored,
        patch({
          type: "update-module-props",
          moduleId: "filter-panel",
          props: { collapsed: true },
        }),
        { source: "ai" },
      );

      expect(result.rejected[0]?.reason).toBe("source-precedence");
    });

    it("lets the user overwrite what a rule placed", () => {
      const plan = compareModePlan();
      const { plan: rulePlan } = applyPatch(
        plan,
        patch({
          type: "ensure-module",
          moduleId: "comparison",
          moduleType: "comparison-tray",
          region: "main",
        }),
        { source: "rule" },
      );

      const result = applyPatch(
        rulePlan,
        patch({ type: "hide-module", moduleId: "comparison" }),
        { source: "user" },
      );

      expect(result.rejected).toHaveLength(0);
      expect(result.plan.regions.main.map((module) => module.id)).not.toContain(
        "comparison",
      );
    });
  });

  describe("overlays", () => {
    it("does not add the same overlay twice", () => {
      const { plan: shown } = applyPatch(
        createDefaultPlan(),
        patch({ type: "show-overlay", overlay: "assistant" }),
        { source: "rule" },
      );
      const again = applyPatch(
        shown,
        patch({ type: "show-overlay", overlay: "assistant" }),
        { source: "rule" },
      );

      expect(again.plan).toBe(shown);
      expect(again.plan.overlays).toEqual(["assistant"]);
    });
  });

  it("reports sales channel switching as not implemented", () => {
    const result = applyPatch(
      createDefaultPlan(),
      patch({ type: "suggest-sales-channel", salesChannelId: "abc" }),
      { source: "ai" },
    );

    expect(result.rejected[0]?.reason).toBe("not-implemented");
    expect(result.applied).toHaveLength(0);
  });

  it("applies the good operations from a partially invalid patch", () => {
    const result = applyPatch(
      createDefaultPlan(),
      patch(
        { type: "set-mode", mode: "compare" },
        {
          type: "ensure-module",
          moduleId: "grid-2",
          moduleType: "product-grid",
          region: "footer",
        },
      ),
      { source: "ai" },
    );

    expect(result.plan.mode).toBe("compare");
    expect(result.applied).toHaveLength(1);
    expect(result.rejected[0]?.reason).toBe("region-not-allowed");
  });

  describe("known gaps in the blueprint", () => {
    // These pin down behaviour the gist does not specify. They are not
    // aspirational - they record what the contract does today so the writeup
    // can argue for a change.
    //
    // Neither is reachable from the UI yet, and neither is what broke "restore
    // standard view": that was the engine resetting the plan without resetting
    // the signals it is projected from, and it is fixed in useExperienceEngine.
    // These two become real when the planner goes live, or when a shopper gets
    // a control that sets the mode directly. See FINDINGS.md.

    it("lets a rule re-add a module the user hid, which is the flapping risk", () => {
      const plan = compareModePlan();
      const { plan: withTray } = applyPatch(
        plan,
        patch({
          type: "ensure-module",
          moduleId: "comparison",
          moduleType: "comparison-tray",
          region: "main",
        }),
        { source: "rule" },
      );
      const { plan: hidden } = applyPatch(
        withTray,
        patch({ type: "hide-module", moduleId: "comparison" }),
        { source: "user" },
      );

      // The user's dismissal leaves no trace once the module is gone, so the
      // same rule immediately puts it back.
      const { plan: reAdded } = applyPatch(
        hidden,
        patch({
          type: "ensure-module",
          moduleId: "comparison",
          moduleType: "comparison-tray",
          region: "main",
        }),
        { source: "rule" },
      );

      expect(reAdded.regions.main.map((module) => module.id)).toContain(
        "comparison",
      );
    });

    it("lets a rule override a mode the user chose, because mode carries no source", () => {
      const { plan: userPlan } = applyPatch(
        compareModePlan(),
        patch({ type: "set-mode", mode: "explore" }),
        { source: "user" },
      );

      const { plan: ruled } = applyPatch(
        userPlan,
        patch({ type: "set-mode", mode: "compare" }),
        { source: "rule" },
      );

      expect(ruled.mode).toBe("compare");
    });
  });
});
