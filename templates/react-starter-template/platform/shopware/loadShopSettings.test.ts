import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { readShopSettings } from "./reads/shopSettings";
import type { ShopSettings } from "./shopSettings";
import { shopSettingsResponse } from "./shopSettings.fixture";

vi.mock("server-only", () => ({}));

vi.mock("./reads/shopSettings", () => ({
  readShopSettings: vi.fn(),
}));

vi.mock("@/site/shopSettings", () => ({
  TEMPLATE_SHOP_SETTINGS: {
    loginRegistration: {
      passwordMinLength: 10,
      requireDataProtectionCheckbox: true,
      showAccountTypeSelection: false,
      showSalutation: false,
      showTitleField: false,
      showBirthdayField: false,
      birthdayFieldRequired: false,
      requireEmailConfirmation: false,
      requirePasswordConfirmation: false,
      showAdditionalAddressField1: false,
      additionalAddressField1Required: false,
      showAdditionalAddressField2: false,
      additionalAddressField2Required: false,
      showPhoneNumberField: false,
      phoneNumberFieldRequired: false,
    },
    cart: { enableOrderRefunds: true, showCustomerComment: false },
  } satisfies ShopSettings,
}));

const MISSING_ROUTE =
  "[Shopware] GET /store-api/shop-settings is not available (Shopware before 6.7.14), so site/shopSettings.ts is used";
const READ_FAILED =
  "[Shopware] reading the shop settings failed, so site/shopSettings.ts is used";

async function load() {
  const { TEMPLATE_SHOP_SETTINGS } = await import("@/site/shopSettings");
  const { loadShopSettings } = await import("./loadShopSettings");
  const { apiClientError } = await import("@/features/session/session.fixture");
  return { loadShopSettings, fallback: TEMPLATE_SHOP_SETTINGS, apiClientError };
}

beforeEach(() => {
  vi.resetModules();
  vi.mocked(readShopSettings).mockReset();
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("loadShopSettings", () => {
  it("lays the backend's values over site/shopSettings.ts field by field", async () => {
    const answer = shopSettingsResponse({
      loginRegistration: { passwordMinLength: 12, showSalutation: true },
    });
    vi.mocked(readShopSettings).mockResolvedValue({
      ...answer,
      cart: {
        ...answer.cart,
        enableOrderRefunds: "false" as unknown as boolean,
      },
    });
    const { loadShopSettings, fallback } = await load();

    await expect(loadShopSettings()).resolves.toEqual({
      loginRegistration: {
        ...fallback.loginRegistration,
        passwordMinLength: 12,
        requireDataProtectionCheckbox: false,
        showAccountTypeSelection: true,
        showSalutation: true,
      },
      cart: { enableOrderRefunds: true, showCustomerComment: true },
    });
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  it("uses site/shopSettings.ts on a backend without the route and warns once per process", async () => {
    vi.mocked(readShopSettings).mockResolvedValue(null);
    const { loadShopSettings, fallback } = await load();

    await expect(loadShopSettings()).resolves.toEqual(fallback);
    await expect(loadShopSettings()).resolves.toEqual(fallback);

    expect(console.warn).toHaveBeenCalledExactlyOnceWith(MISSING_ROUTE);
    expect(console.error).not.toHaveBeenCalled();
  });

  it("uses site/shopSettings.ts when the read fails and logs only the status and codes, every time", async () => {
    const { loadShopSettings, fallback, apiClientError } = await load();
    vi.mocked(readShopSettings).mockRejectedValue(
      apiClientError(
        [{ code: "FRAMEWORK__ERROR", detail: "secret detail" }],
        503,
      ),
    );

    await expect(loadShopSettings()).resolves.toEqual(fallback);
    await expect(loadShopSettings()).resolves.toEqual(fallback);

    expect(console.error).toHaveBeenCalledTimes(2);
    expect(console.error).toHaveBeenLastCalledWith(READ_FAILED, {
      status: 503,
      codes: ["FRAMEWORK__ERROR"],
    });
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("logs only the name of an error that is not an API error", async () => {
    vi.mocked(readShopSettings).mockRejectedValue(
      new TypeError("fetch failed https://shop.example/store-api"),
    );
    const { loadShopSettings, fallback } = await load();

    await expect(loadShopSettings()).resolves.toEqual(fallback);
    expect(console.error).toHaveBeenCalledExactlyOnceWith(READ_FAILED, {
      name: "TypeError",
    });
  });

  it("returns a copy, so a caller cannot change site/shopSettings.ts", async () => {
    vi.mocked(readShopSettings).mockResolvedValue(null);
    const { loadShopSettings, fallback } = await load();

    const settings = await loadShopSettings();
    settings.cart.enableOrderRefunds = false;

    expect(fallback.cart.enableOrderRefunds).toBe(true);
  });
});
