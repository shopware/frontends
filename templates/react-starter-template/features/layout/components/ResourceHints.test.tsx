import { connection } from "next/server";
import { preconnect } from "react-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { resourceHintOrigins } from "@/features/layout/resourceHintOrigins";

import { ResourceHints } from "./ResourceHints";

vi.mock("server-only", () => ({}));
vi.mock("next/server", () => ({ connection: vi.fn(async () => {}) }));
vi.mock("react-dom", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-dom")>()),
  preconnect: vi.fn(),
}));
vi.mock("@/features/layout/resourceHintOrigins", () => ({
  resourceHintOrigins: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ResourceHints", () => {
  it("preconnects to the media origin and, without credentials, to the Store API", async () => {
    vi.mocked(resourceHintOrigins).mockReturnValue({
      media: "https://cdn.shopware.store",
      storeApi: "https://demo-frontends.shopware.store",
    });

    await expect(ResourceHints()).resolves.toBeNull();

    expect(vi.mocked(preconnect).mock.calls).toEqual([
      ["https://cdn.shopware.store"],
      ["https://demo-frontends.shopware.store", { crossOrigin: "anonymous" }],
    ]);
  });

  it("reads the origins only after opting out of prerendering", async () => {
    const order: string[] = [];
    vi.mocked(connection).mockImplementationOnce(async () => {
      order.push("connection");
    });
    vi.mocked(resourceHintOrigins).mockImplementation(() => {
      order.push("origins");
      return { media: null, storeApi: null };
    });

    await ResourceHints();

    expect(order).toEqual(["connection", "origins"]);
  });

  it("sends no hint for an origin it does not have", async () => {
    vi.mocked(resourceHintOrigins).mockReturnValue({
      media: null,
      storeApi: null,
    });

    await ResourceHints();

    expect(preconnect).not.toHaveBeenCalled();
  });
});
