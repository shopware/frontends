import { cacheLife, cacheTag } from "next/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createShopwareClient } from "../client";
import { readBreadcrumb, readBreadcrumbOrNothing } from "./breadcrumb";

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

describe("readBreadcrumb", () => {
  it("reads the typed trail in the page language and tags every category", async () => {
    invoke.mockResolvedValue({
      data: [
        { categoryId: "c1", name: "Furniture", path: "Furniture/" },
        { categoryId: "c2", name: "Chairs", path: "Furniture/Chairs/" },
      ],
    });

    const trail = await readBreadcrumb("c2", "category", "language-pl");

    expect(createShopwareClient).toHaveBeenCalledWith({
      languageId: "language-pl",
    });
    expect(invoke).toHaveBeenCalledWith("readBreadcrumb get /breadcrumb/{id}", {
      pathParams: { id: "c2" },
      query: { type: "category" },
    });
    expect(trail).toHaveLength(2);
    expect(cacheLife).toHaveBeenCalledWith("catalog");
    expect(cacheTag).toHaveBeenCalledWith(
      "sw:breadcrumb:c2",
      "sw:breadcrumb:c2:language-pl",
    );
    expect(cacheTag).toHaveBeenCalledWith(
      "sw:category:c1",
      "sw:category:c1:language-pl",
    );
  });

  it("returns no trail for an empty 204 answer", async () => {
    invoke.mockResolvedValue({ data: undefined });

    await expect(readBreadcrumb("p1", "product", null)).resolves.toEqual([]);
  });
});

describe("readBreadcrumbOrNothing", () => {
  it("logs a failed read and renders without a trail", async () => {
    const failure = new Error("offline");
    invoke.mockRejectedValue(failure);
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      readBreadcrumbOrNothing("c1", "category", null),
    ).resolves.toEqual([]);
    expect(error).toHaveBeenCalledWith(
      "[Catalog] reading the breadcrumb failed",
      failure,
    );
    error.mockRestore();
  });
});
