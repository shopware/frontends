import { describe, expect, it } from "vitest";

import { applyExperiencePatch } from "./applyPatch";
import { createDefaultContext } from "./context";
import { createDefaultExperiencePlan } from "./defaults";
import { defaultAdaptationPolicy } from "./policy";
import type {
  ExperienceContext,
  ExperiencePatch,
  ExperiencePlan,
  ExperienceSource,
} from "./types";

// Far past the default plan's module lifetimes (createdAt 0), so minimum-lifetime
// never interferes unless a test opts in with its own `now`.
const NOW = 1_000_000;

const ctx = (over: Partial<ExperienceContext> = {}): ExperienceContext => ({
  ...createDefaultContext("s", 0),
  ...over,
});

const patch = (
  ...operations: ExperiencePatch["operations"]
): ExperiencePatch => ({ operations });

const apply = (
  plan: ExperiencePlan,
  p: ExperiencePatch,
  opts: {
    source?: ExperienceSource;
    now?: number;
    context?: ExperienceContext;
  } = {},
) =>
  applyExperiencePatch(
    plan,
    p,
    opts.context ?? ctx(),
    defaultAdaptationPolicy,
    {
      source: opts.source ?? "rule",
      now: opts.now ?? NOW,
    },
  );

const comparePlanWith = (moduleId = "cmp") =>
  apply(
    createDefaultExperiencePlan("search", 0),
    patch(
      { type: "set-mode", mode: "compare" },
      {
        type: "ensure-module",
        module: {
          id: moduleId,
          type: "product-comparison",
          region: "main",
          priority: 10,
          props: { productIds: ["a", "b"] },
        },
      },
    ),
    { source: "rule" },
  ).plan;

describe("applyExperiencePatch (§18 merger)", () => {
  it("never mutates the input plan (§18: clone first)", () => {
    const plan = createDefaultExperiencePlan("search", 0);
    const snapshot = structuredClone(plan);
    apply(plan, patch({ type: "set-mode", mode: "compare" }));
    expect(plan).toEqual(snapshot);
  });

  it("advances planVersion only when the plan changed (step 8)", () => {
    const plan = createDefaultExperiencePlan("search", 0);
    const changed = apply(plan, patch({ type: "set-mode", mode: "compare" }));
    expect(changed.plan.planVersion).toBe(plan.planVersion + 1);

    const noop = apply(plan, patch({ type: "set-mode", mode: "explore" }));
    expect(noop.plan).toBe(plan);
    expect(noop.accepted).toHaveLength(1);
    expect(noop.rejected).toHaveLength(0);
  });

  it("normalizes priorities within a region (step 6)", () => {
    const plan = createDefaultExperiencePlan("search", 0);
    const result = apply(plan, patch({ type: "set-mode", mode: "compare" }));
    const grid = result.plan.regions.main.find(
      (m) => m.id === "primary-product-grid",
    );
    expect(grid?.priority).toBe(10);
  });

  describe("shell and workspace values are validated", () => {
    const plan = createDefaultExperiencePlan("search", 0);

    it("applies a valid shell change", () => {
      const r = apply(
        plan,
        patch({ type: "set-shell", target: "header", value: "compact" }),
      );
      expect(r.plan.shell.header).toBe("compact");
    });

    it("rejects an out-of-enum shell value", () => {
      const r = apply(
        plan,
        patch({ type: "set-shell", target: "header", value: "bogus" }),
      );
      expect(r.rejected[0]?.reason).toBe("invalid-value");
      expect(r.plan).toBe(plan);
    });

    it("applies a valid workspace change and rejects an invalid one", () => {
      expect(
        apply(
          plan,
          patch({ type: "set-workspace", target: "columns", value: 3 }),
        ).plan.workspace.columns,
      ).toBe(3);
      expect(
        apply(
          plan,
          patch({ type: "set-workspace", target: "columns", value: 9 }),
        ).rejected[0]?.reason,
      ).toBe("invalid-value");
    });
  });

  describe("ensure-module registry validation (§10)", () => {
    const plan = createDefaultExperiencePlan("search", 0);
    const comparison = (region: string, id = "cmp") =>
      patch({
        type: "ensure-module",
        module: {
          id,
          type: "product-comparison",
          region: region as never,
          priority: 10,
          props: { productIds: ["a", "b"] },
        },
      });

    it("adds a module allowed in the current mode", () => {
      const r = apply(
        plan,
        patch(
          { type: "set-mode", mode: "compare" },
          comparison("main").operations[0]!,
        ),
      );
      expect(r.plan.regions.main.map((m) => m.id)).toContain("cmp");
    });

    it("rejects a module not allowed in the current mode", () => {
      expect(apply(plan, comparison("main")).rejected[0]?.reason).toBe(
        "mode-not-allowed",
      );
    });

    it("rejects a module in a region its type does not allow", () => {
      // product-comparison allows top and main; "aside" is neither.
      expect(apply(plan, comparison("aside")).rejected[0]?.reason).toBe(
        "region-not-allowed",
      );
    });

    it("rejects a module type absent from the registry", () => {
      const r = apply(
        plan,
        patch({
          type: "ensure-module",
          module: {
            id: "x",
            type: "recommendations",
            region: "main",
            priority: 10,
            props: {},
          },
        }),
      );
      expect(r.rejected[0]?.reason).toBe("unknown-module-type");
    });

    it("rejects props that violate the type's schema", () => {
      const r = apply(
        plan,
        patch({
          type: "ensure-module",
          module: {
            id: "g2",
            type: "product-grid",
            region: "main",
            priority: 20,
            props: { limit: 99 },
          },
        }),
      );
      expect(r.rejected[0]?.reason).toBe("invalid-props");
    });

    it("enforces maxInstances", () => {
      const r = apply(
        plan,
        patch(
          { type: "set-mode", mode: "compare" },
          {
            type: "ensure-module",
            module: {
              id: "c1",
              type: "product-comparison",
              region: "main",
              priority: 10,
              props: { productIds: ["a", "b"] },
            },
          },
          {
            type: "ensure-module",
            module: {
              id: "c2",
              type: "product-comparison",
              region: "main",
              priority: 20,
              props: { productIds: ["c", "d"] },
            },
          },
        ),
      );
      expect(r.plan.regions.main.map((m) => m.id)).toContain("c1");
      expect(r.rejected.map((e) => e.reason)).toContain("max-instances");
    });
  });

  describe("AI safety — the keystone the spike originally missed", () => {
    it("refuses to let AI hide the product grid (canBeHiddenByAI:false)", () => {
      const withSecondGrid = apply(
        createDefaultExperiencePlan("search", 0),
        patch({
          type: "ensure-module",
          module: {
            id: "grid-2",
            type: "product-grid",
            region: "main",
            priority: 20,
            props: { limit: 6 },
          },
        }),
        { source: "rule" },
      ).plan;

      const r = apply(
        withSecondGrid,
        patch({ type: "hide-module", moduleId: "grid-2" }),
        {
          source: "ai",
        },
      );
      expect(r.rejected[0]?.reason).toBe("ai-not-allowed");
      expect(r.plan.regions.main.map((m) => m.id)).toContain("grid-2");
    });

    it("refuses to let AI hide a protected module id (§19)", () => {
      const r = apply(
        createDefaultExperiencePlan("search", 0),
        patch({ type: "hide-module", moduleId: "primary-product-grid" }),
        { source: "ai" },
      );
      expect(r.rejected[0]?.reason).toBe("protected-module");
    });

    it("still lets the shopper hide their own view", () => {
      const withSecondGrid = apply(
        createDefaultExperiencePlan("search", 0),
        patch({
          type: "ensure-module",
          module: {
            id: "grid-2",
            type: "product-grid",
            region: "bottom",
            priority: 20,
            props: { limit: 6 },
          },
        }),
        { source: "rule" },
      ).plan;

      const r = apply(
        withSecondGrid,
        patch({ type: "hide-module", moduleId: "grid-2" }),
        {
          source: "user",
        },
      );
      expect(r.plan.regions.bottom.map((m) => m.id)).not.toContain("grid-2");
    });

    it("reports sales channel switching as not implemented (§9 phase)", () => {
      const plan = createDefaultExperiencePlan("search", 0);
      const r = apply(
        plan,
        patch({
          type: "suggest-sales-channel",
          channelId: "outlet",
          reasonCode: "x",
        }),
      );
      expect(r.rejected[0]?.reason).toBe("not-implemented");
      expect(r.accepted).toHaveLength(0);
      expect(r.plan).toBe(plan);
    });
  });

  describe("route lock (§19: do not adapt checkout)", () => {
    const checkout = ctx({ route: { path: "/checkout", kind: "checkout" } });

    it("freezes out rule and AI patches on a protected route", () => {
      const r = apply(
        createDefaultExperiencePlan("checkout", 0),
        patch({ type: "set-mode", mode: "compare" }),
        { source: "rule", context: checkout },
      );
      expect(r.rejected[0]?.reason).toBe("protected-module");
      expect(r.plan.mode).toBe("explore");
    });

    it("still lets the shopper change their own view mid-checkout", () => {
      const r = apply(
        createDefaultExperiencePlan("checkout", 0),
        patch({ type: "set-mode", mode: "compare" }),
        { source: "user", context: checkout },
      );
      expect(r.plan.mode).toBe("compare");
    });
  });

  describe("patch limits (§17)", () => {
    const plan = createDefaultExperiencePlan("search", 0);

    it("rejects a patch over the operation limit", () => {
      const ops = Array.from({ length: 6 }, () => ({
        type: "set-mode" as const,
        mode: "compare" as const,
      }));
      expect(apply(plan, patch(...ops)).rejected[0]?.reason).toBe(
        "patch-limit-exceeded",
      );
    });

    it("rejects more than one shell change per patch", () => {
      const r = apply(
        plan,
        patch(
          { type: "set-shell", target: "header", value: "compact" },
          { type: "set-shell", target: "footer", value: "compact" },
        ),
      );
      expect(r.rejected[0]?.reason).toBe("patch-limit-exceeded");
    });

    it("rejects more than two module moves per patch", () => {
      const r = apply(
        plan,
        patch(
          { type: "move-module", moduleId: "a", region: "main", priority: 10 },
          { type: "move-module", moduleId: "b", region: "main", priority: 10 },
          { type: "move-module", moduleId: "c", region: "main", priority: 10 },
        ),
      );
      expect(r.rejected[0]?.reason).toBe("patch-limit-exceeded");
    });
  });

  describe("source precedence (§16)", () => {
    it("refuses to let a rule overwrite what the user placed", () => {
      const userPlaced = apply(
        createDefaultExperiencePlan("search", 0),
        patch({
          type: "ensure-module",
          module: {
            id: "cf",
            type: "contextual-filters",
            region: "aside",
            priority: 10,
            props: { collapsed: false },
          },
        }),
        { source: "user" },
      ).plan;

      const r = apply(
        userPlaced,
        patch({
          type: "update-module-props",
          moduleId: "cf",
          props: { collapsed: true },
        }),
        { source: "rule" },
      );
      expect(r.rejected[0]?.reason).toBe("source-precedence");
      const cf = r.plan.regions.aside.find((m) => m.id === "cf");
      expect(cf?.props.collapsed).toBe(false);
    });
  });

  describe("minimum lifetime (§19)", () => {
    const placed = apply(
      createDefaultExperiencePlan("search", 0),
      patch({
        type: "ensure-module",
        module: {
          id: "cf",
          type: "contextual-filters",
          region: "aside",
          priority: 10,
          props: { collapsed: false },
        },
      }),
      { source: "rule", now: 1000 },
    ).plan;

    it("refuses to move a rule-placed module still inside its lifetime", () => {
      const r = apply(
        placed,
        patch({
          type: "move-module",
          moduleId: "cf",
          region: "top",
          priority: 10,
        }),
        {
          source: "rule",
          now: 2000,
        },
      );
      expect(r.rejected[0]?.reason).toBe("minimum-lifetime");
    });

    it("allows the move once the lifetime has elapsed", () => {
      const r = apply(
        placed,
        patch({
          type: "move-module",
          moduleId: "cf",
          region: "top",
          priority: 10,
        }),
        {
          source: "rule",
          now: 8000,
        },
      );
      expect(r.plan.regions.top.map((m) => m.id)).toContain("cf");
    });
  });

  it("disables rather than deletes a module the new mode disallows", () => {
    const compare = comparePlanWith("cmp");
    const r = apply(compare, patch({ type: "set-mode", mode: "explore" }), {
      source: "rule",
    });
    const cmp = r.plan.regions.main.find((m) => m.id === "cmp");
    expect(cmp).toBeDefined();
    expect(cmp?.enabled).toBe(false);
    const grid = r.plan.regions.main.find(
      (m) => m.id === "primary-product-grid",
    );
    expect(grid?.enabled).toBe(true);
  });

  it("does not toggle an overlay that is already in the target state", () => {
    const shown = apply(
      createDefaultExperiencePlan("search", 0),
      patch({ type: "show-overlay", overlay: "assistant" }),
    );
    expect(shown.plan.overlays.assistant).toBe(true);
    const again = apply(
      shown.plan,
      patch({ type: "show-overlay", overlay: "assistant" }),
    );
    expect(again.plan).toBe(shown.plan);
  });

  it("applies the good operations from a partially invalid patch", () => {
    const r = apply(
      createDefaultExperiencePlan("search", 0),
      patch(
        { type: "set-mode", mode: "compare" },
        {
          type: "ensure-module",
          module: {
            id: "cmp",
            type: "product-comparison",
            // "aside" is not in product-comparison's allowedRegions (top, main),
            // so this half of the patch is rejected while set-mode still applies.
            region: "aside",
            priority: 10,
            props: { productIds: ["a", "b"] },
          },
        },
      ),
    );
    expect(r.plan.mode).toBe("compare");
    expect(r.accepted).toHaveLength(1);
    expect(r.rejected[0]?.reason).toBe("region-not-allowed");
  });
});
