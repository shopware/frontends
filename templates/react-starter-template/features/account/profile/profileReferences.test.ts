import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { readSalutations } from "@/platform/shopware/reads/salutations";

import { loadProfileReferences } from "./profileReferences";

vi.mock("server-only", () => ({}));

vi.mock("@/platform/shopware/reads/salutations", () => ({
  readSalutations: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(readSalutations).mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("loadProfileReferences", () => {
  it("passes the salutations on", async () => {
    const salutations = [
      { label: "Mr.", value: "salutation-mr" },
      { label: "Mrs.", value: "salutation-mrs" },
    ];
    vi.mocked(readSalutations).mockResolvedValue(salutations);

    await expect(loadProfileReferences()).resolves.toEqual({
      salutations,
      salutationsUnavailable: false,
    });
  });

  it("logs a failed read and marks the salutations unavailable", async () => {
    const failure = new Error("Store API down");
    vi.mocked(readSalutations).mockRejectedValue(failure);

    await expect(loadProfileReferences()).resolves.toEqual({
      salutations: [],
      salutationsUnavailable: true,
    });
    expect(console.error).toHaveBeenCalledWith(
      "[Profile] reading salutations failed",
      failure,
    );
  });
});
