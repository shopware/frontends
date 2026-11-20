import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resolveLanguageId } from "@/platform/shopware/reads/languages";
import { readSalutations } from "@/platform/shopware/reads/salutations";

import { loadProfileReferences } from "./profileReferences";

vi.mock("server-only", () => ({}));

vi.mock("@/platform/shopware/reads/languages", () => ({
  resolveLanguageId: vi.fn(),
}));

vi.mock("@/platform/shopware/reads/salutations", () => ({
  readSalutations: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(readSalutations).mockReset();
  vi.mocked(resolveLanguageId).mockReset();
  vi.mocked(resolveLanguageId).mockResolvedValue(null);
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

    await expect(loadProfileReferences("en-GB")).resolves.toEqual({
      salutations,
      salutationsUnavailable: false,
    });
    expect(readSalutations).toHaveBeenCalledWith(null);
  });

  it("reads the salutations in the Shopware language of the locale", async () => {
    vi.mocked(resolveLanguageId).mockResolvedValue("language-de");
    vi.mocked(readSalutations).mockResolvedValue([]);

    await loadProfileReferences("de-DE");

    expect(resolveLanguageId).toHaveBeenCalledWith("de-DE");
    expect(readSalutations).toHaveBeenCalledWith("language-de");
  });

  it("logs a failed read and marks the salutations unavailable", async () => {
    const failure = new Error("Store API down");
    vi.mocked(readSalutations).mockRejectedValue(failure);

    await expect(loadProfileReferences("en-GB")).resolves.toEqual({
      salutations: [],
      salutationsUnavailable: true,
    });
    expect(console.error).toHaveBeenCalledWith(
      "[Profile] reading salutations failed",
      failure,
    );
  });
});
