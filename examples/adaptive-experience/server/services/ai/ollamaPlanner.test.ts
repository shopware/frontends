import { afterEach, describe, expect, it, vi } from "vitest";

import { experiencePatchSchema } from "#shared/experience/schemas";
import type { ExperiencePlanningRequest } from "#shared/experience/types";

import { ollamaPlanner } from "./ollamaPlanner";

const baseRequest = (
  overrides: {
    moduleIds?: string[];
    signals?: Partial<ExperiencePlanningRequest["context"]["signals"]>;
  } = {},
): ExperiencePlanningRequest => ({
  requestId: "r1",
  sessionId: "s1",
  planVersion: 1,
  currentPlan: {
    mode: "explore",
    routeKey: "search",
    moduleIds: overrides.moduleIds ?? [
      "primary-product-grid",
      "listing-filters",
    ],
  },
  context: {
    route: { kind: "search" },
    signals: {
      visualInterest: 0.2,
      technicalInterest: 0.2,
      priceSensitivity: 0.1,
      uncertainty: 0.2,
      decisionReadiness: 0.4,
      comparisonIntent: 0.1,
      supportNeed: 0.1,
      ...overrides.signals,
    },
    comparedProductCount: 0,
    viewedProductCount: 3,
    searchCount: 1,
  },
  allowed: {
    canSwitchSalesChannelAutomatically: false,
    canChangeShell: true,
    canMoveModules: true,
    canShowAssistant: true,
  },
});

// The model returns a flat *decision*; the provider expands it into a patch.
const ollamaReply = (decision: unknown) => ({
  ok: true,
  json: async () => ({ message: { content: JSON.stringify(decision) } }),
});

afterEach(() => vi.unstubAllGlobals());

describe("ollamaPlanner", () => {
  it("asks the model for a decision, constrained to a JSON schema, at /api/chat", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      ollamaReply({
        action: "add-assistant",
        message: "I can compare these for you.",
        confidence: 0.8,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await ollamaPlanner.propose(
      baseRequest({ signals: { comparisonIntent: 0.85 } }),
    );

    const call = fetchMock.mock.calls[0];
    if (!call) throw new Error("fetch was not called");
    const [url, init] = call;
    expect(url).toMatch(/\/api\/chat$/);
    const body = JSON.parse(init.body);
    expect(body.format).toBeTruthy(); // structured-output schema is sent
    expect(body.stream).toBe(false);
    // Only the anonymous signals and module ids are sent - no PII, no raw events.
    const sent = JSON.parse(body.messages.at(-1).content);
    expect(sent).toHaveProperty("signals");
    expect(sent).toHaveProperty("moduleIds");
  });

  it("expands an add-assistant decision into a schema-valid patch", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        ollamaReply({
          action: "add-assistant",
          message: "Comparing a few? I can help.",
          confidence: 0.8,
        }),
      ),
    );

    const proposal = await ollamaPlanner.propose(
      baseRequest({ signals: { comparisonIntent: 0.85 } }),
    );

    // The expanded patch is valid against the real contract.
    expect(experiencePatchSchema.safeParse(proposal?.patch).success).toBe(true);
    expect(proposal?.reasonCode).toBe("comparison-intent");
    const patch = proposal?.patch as {
      operations: Array<Record<string, unknown>>;
    };
    const ensure = patch.operations.find(
      (op) => op.type === "ensure-module",
    ) as {
      module: { type: string; region: string; props: { message: string } };
    };
    expect(ensure.module.type).toBe("assistant-message");
    expect(ensure.module.region).toBe("aside");
    expect(ensure.module.props.message).toBe("Comparing a few? I can help.");
  });

  it("labels an add-assistant driven by supportNeed as support-need", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        ollamaReply({
          action: "add-assistant",
          message: "Need a hand?",
          confidence: 0.7,
        }),
      ),
    );
    const proposal = await ollamaPlanner.propose(
      baseRequest({ signals: { supportNeed: 0.8, comparisonIntent: 0.1 } }),
    );
    expect(proposal?.reasonCode).toBe("support-need");
  });

  it("falls back to default copy when the model omits the message", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          ollamaReply({ action: "add-assistant", confidence: 0.6 }),
        ),
    );
    const proposal = await ollamaPlanner.propose(
      baseRequest({ signals: { comparisonIntent: 0.85 } }),
    );
    const patch = proposal?.patch as {
      operations: Array<{ module?: { props?: { message?: string } } }>;
    };
    const message = patch.operations.find((op) => op.module)?.module?.props
      ?.message;
    expect(typeof message).toBe("string");
    expect((message ?? "").length).toBeGreaterThan(0);
  });

  it("expands compact-grid into a density change", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          ollamaReply({ action: "compact-grid", confidence: 0.6 }),
        ),
    );
    const proposal = await ollamaPlanner.propose(
      baseRequest({ signals: { priceSensitivity: 0.9 } }),
    );
    expect(experiencePatchSchema.safeParse(proposal?.patch).success).toBe(true);
    expect(proposal?.reasonCode).toBe("price-sensitivity");
    const patch = proposal?.patch as {
      operations: Array<Record<string, unknown>>;
    };
    expect(patch.operations[0]).toMatchObject({
      type: "set-workspace",
      target: "density",
      value: "compact",
    });
  });

  it("enforces the already-present guard the model sometimes skips", async () => {
    // Model says add an assistant, but one is already on the page.
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        ollamaReply({
          action: "add-assistant",
          message: "Hi",
          confidence: 0.9,
        }),
      ),
    );
    const proposal = await ollamaPlanner.propose(
      baseRequest({
        moduleIds: ["primary-product-grid", "shopping-assistant"],
        signals: { comparisonIntent: 0.9 },
      }),
    );
    expect(proposal).toBeNull();
  });

  it("returns null when the model picks no action", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(ollamaReply({ action: "none", confidence: 0.1 })),
    );
    expect(await ollamaPlanner.propose(baseRequest())).toBeNull();
  });

  it("returns null when the model output does not match the decision schema", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          ollamaReply({ action: "delete-everything", confidence: 0.9 }),
        ),
    );
    expect(await ollamaPlanner.propose(baseRequest())).toBeNull();
  });

  it("never throws when the model is down - it returns null", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("ECONNREFUSED")),
    );
    expect(await ollamaPlanner.propose(baseRequest())).toBeNull();
  });

  it("returns null on a non-OK HTTP response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500 }),
    );
    expect(await ollamaPlanner.propose(baseRequest())).toBeNull();
  });
});
