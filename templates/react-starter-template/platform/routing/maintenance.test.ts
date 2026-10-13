import { describe, expect, it, vi } from "vitest";

import { apiClientError } from "@/features/session/session.fixture";

import { createMaintenanceMonitor, isMaintenanceError } from "./maintenance";

const MAINTENANCE = {
  code: "FRAMEWORK__API_SALES_CHANNEL_MAINTENANCE_MODE",
  status: "503",
};

describe("isMaintenanceError", () => {
  it("recognises the maintenance answer of the Store API", () => {
    expect(isMaintenanceError(apiClientError([MAINTENANCE], 503))).toBe(true);
  });

  it.each([
    ["another 503", apiClientError([{ code: "X", status: "503" }], 503)],
    ["the code with another status", apiClientError([MAINTENANCE], 500)],
    ["a plain error", new Error("down")],
    ["nothing", undefined],
  ])("rejects %s", (_, error) => {
    expect(isMaintenanceError(error)).toBe(false);
  });
});

function clock() {
  let time = 0;
  return {
    now: () => time,
    advance(ms: number) {
      time += ms;
    },
  };
}

describe("createMaintenanceMonitor", () => {
  it("probes once on a cold start and shares the probe", async () => {
    const probe = vi.fn(async () => true);
    const monitor = createMaintenanceMonitor({ probe, now: clock().now });

    const [first, second] = await Promise.all([
      monitor.isActive(),
      monitor.isActive(),
    ]);

    expect([first, second]).toEqual([true, true]);
    expect(probe).toHaveBeenCalledTimes(1);
  });

  it("answers from memory and refreshes in the background once the answer is old", async () => {
    const time = clock();
    const probe = vi.fn(async () => false);
    const monitor = createMaintenanceMonitor({
      probe,
      now: time.now,
      ttlMs: 1000,
    });
    await monitor.isActive();
    probe.mockResolvedValue(true);
    const waitUntil = vi.fn();

    expect(await monitor.isActive(waitUntil)).toBe(false);
    expect(waitUntil).not.toHaveBeenCalled();

    time.advance(1000);
    expect(await monitor.isActive(waitUntil)).toBe(false);
    expect(waitUntil).toHaveBeenCalledTimes(1);
    await waitUntil.mock.calls[0]?.[0];
    expect(await monitor.isActive()).toBe(true);
  });

  it("treats a failing probe as open and takes reported answers", async () => {
    const monitor = createMaintenanceMonitor({
      probe: async () => {
        throw new Error("offline");
      },
      now: clock().now,
    });

    expect(await monitor.isActive()).toBe(false);
    monitor.report(true);
    expect(await monitor.isActive()).toBe(true);
  });
});
