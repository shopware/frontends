import { cacheLife, cacheTag } from "next/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClientError } from "@/features/session/session.fixture";

import { createShopwareClient } from "../client";
import { shopSettingsResponse } from "../shopSettings.fixture";
import { readShopSettings } from "./shopSettings";

vi.mock("server-only", () => ({}));

vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

vi.mock("../client", () => ({
  createShopwareClient: vi.fn(),
}));

const invoke = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(createShopwareClient).mockReturnValue({
    invoke,
  } as unknown as ReturnType<typeof createShopwareClient>);
});

describe("readShopSettings", () => {
  it("reads GET /shop-settings anonymously without a language and caches it for hours under one tag", async () => {
    const answer = shopSettingsResponse();
    invoke.mockResolvedValue({ data: answer, status: 200 });

    await expect(readShopSettings()).resolves.toBe(answer);

    expect(createShopwareClient).toHaveBeenCalledExactlyOnceWith();
    expect(invoke).toHaveBeenCalledExactlyOnceWith(
      "getShopSettings get /shop-settings",
    );
    expect(cacheLife).toHaveBeenCalledExactlyOnceWith("hours");
    expect(cacheTag).toHaveBeenCalledExactlyOnceWith("sw:shop-settings");
  });

  it("resolves null for the 404 of a backend before 6.7.14, which has no such route", async () => {
    invoke.mockRejectedValue(apiClientError([{ code: "0" }], 404));

    await expect(readShopSettings()).resolves.toBeNull();
  });

  it.each([
    ["a server error", apiClientError([{ code: "FRAMEWORK__ERROR" }], 500)],
    ["a 401 for a wrong access key", apiClientError([{ code: "0" }], 401)],
    [
      "a timeout",
      new DOMException(
        "The operation was aborted due to timeout",
        "TimeoutError",
      ),
    ],
  ])(
    "lets %s reject, so the failure is not cached",
    async (_label, failure) => {
      invoke.mockRejectedValue(failure);

      await expect(readShopSettings()).rejects.toBe(failure);
    },
  );
});
