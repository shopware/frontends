import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { apiError } from "@/features/checkout/checkoutTestDoubles";
import { loadShopSettings } from "@/platform/shopware/loadShopSettings";
import { resolveLanguageId } from "@/platform/shopware/reads/languages";
import { readSalutations } from "@/platform/shopware/reads/salutations";
import { shopSettings } from "@/platform/shopware/shopSettings.fixture";

import { loadRegistrationReferences } from "./registrationReferences";

vi.mock("server-only", () => ({}));

vi.mock("@/platform/shopware/loadShopSettings", () => ({
  loadShopSettings: vi.fn(),
}));

vi.mock("@/platform/shopware/reads/languages", () => ({
  resolveLanguageId: vi.fn(),
}));

vi.mock("@/platform/shopware/reads/salutations", () => ({
  readSalutations: vi.fn(),
}));

const salutations = [
  { label: "Mr.", value: "salutation-mr" },
  { label: "Mrs.", value: "salutation-mrs" },
];

beforeEach(() => {
  vi.mocked(loadShopSettings).mockReset();
  vi.mocked(loadShopSettings).mockResolvedValue(shopSettings());
  vi.mocked(resolveLanguageId).mockReset();
  vi.mocked(resolveLanguageId).mockResolvedValue(null);
  vi.mocked(readSalutations).mockReset();
  vi.mocked(readSalutations).mockResolvedValue(salutations);
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 11, 31, 23, 30));
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("loadRegistrationReferences", () => {
  it("passes only the registration settings on and reads no salutations the form hides", async () => {
    const settings = shopSettings({
      loginRegistration: { passwordMinLength: 10 },
      cart: { enableOrderRefunds: true },
    });
    vi.mocked(loadShopSettings).mockResolvedValue(settings);

    await expect(loadRegistrationReferences("en-GB")).resolves.toEqual({
      settings: settings.loginRegistration,
      salutations: [],
      salutationsUnavailable: false,
      birthYearMax: 2026,
    });
    expect(readSalutations).not.toHaveBeenCalled();
  });

  it("reads the salutations in the Shopware language of the locale when the form shows them", async () => {
    const settings = shopSettings({
      loginRegistration: { showSalutation: true },
    });
    vi.mocked(loadShopSettings).mockResolvedValue(settings);
    vi.mocked(resolveLanguageId).mockResolvedValue("language-de");

    await expect(loadRegistrationReferences("de-DE")).resolves.toEqual({
      settings: settings.loginRegistration,
      salutations,
      salutationsUnavailable: false,
      birthYearMax: 2026,
    });
    expect(resolveLanguageId).toHaveBeenCalledWith("de-DE");
    expect(readSalutations).toHaveBeenCalledExactlyOnceWith("language-de");
  });

  it("logs only a summary of a failed salutation read and marks them unavailable", async () => {
    vi.mocked(loadShopSettings).mockResolvedValue(
      shopSettings({ loginRegistration: { showSalutation: true } }),
    );
    vi.mocked(readSalutations).mockRejectedValue(
      apiError(
        [{ code: "FRAMEWORK__ERROR", status: "500", detail: "secret detail" }],
        500,
      ),
    );

    await expect(loadRegistrationReferences("en-GB")).resolves.toMatchObject({
      salutations: [],
      salutationsUnavailable: true,
    });
    expect(console.error).toHaveBeenCalledExactlyOnceWith(
      "[Registration] reading salutations failed",
      { status: 500, codes: ["FRAMEWORK__ERROR"] },
    );
  });

  it("takes the newest birth year from the server clock", async () => {
    vi.setSystemTime(new Date(2027, 0, 1, 0, 5));

    await expect(loadRegistrationReferences("en-GB")).resolves.toMatchObject({
      birthYearMax: 2027,
    });
  });
});
