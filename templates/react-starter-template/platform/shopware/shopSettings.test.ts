import { describe, expect, it } from "vitest";

import { mergeShopSettings } from "./shopSettings";
import type { ShopSettings } from "./shopSettings";
import { shopSettingsResponse } from "./shopSettings.fixture";

const fallback: ShopSettings = {
  loginRegistration: {
    passwordMinLength: 8,
    requireDataProtectionCheckbox: false,
    showAccountTypeSelection: true,
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
  cart: { enableOrderRefunds: false, showCustomerComment: false },
};

describe("mergeShopSettings", () => {
  it.each([null, undefined, "shop_settings", 42, []])(
    "falls back to every value for the answer %j",
    (remote) => {
      expect(mergeShopSettings(remote, fallback)).toEqual(fallback);
    },
  );

  it("takes the picked fields from the answer, like the demo's salutation and customer comment", () => {
    const merged = mergeShopSettings(
      shopSettingsResponse({
        loginRegistration: {
          passwordMinLength: 12,
          showAccountTypeSelection: false,
          requireDataProtectionCheckbox: true,
        },
        cart: { enableOrderRefunds: true },
      }),
      fallback,
    );

    expect(merged).toEqual({
      loginRegistration: {
        ...fallback.loginRegistration,
        passwordMinLength: 12,
        showAccountTypeSelection: false,
        requireDataProtectionCheckbox: true,
        showSalutation: true,
      },
      cart: { enableOrderRefunds: true, showCustomerComment: true },
    });
  });

  it("keeps only the fields of ShopSettings, so apiAlias and the other settings never reach a client component", () => {
    const merged = mergeShopSettings(shopSettingsResponse(), fallback);

    expect(Object.keys(merged)).toEqual(["loginRegistration", "cart"]);
    expect(Object.keys(merged.loginRegistration).sort()).toEqual(
      Object.keys(fallback.loginRegistration).sort(),
    );
    expect(Object.keys(merged.cart).sort()).toEqual([
      "enableOrderRefunds",
      "showCustomerComment",
    ]);
  });

  it("falls back field by field when a field is missing or has another type", () => {
    const merged = mergeShopSettings(
      {
        loginRegistration: {
          passwordMinLength: "12",
          showSalutation: 1,
          showTitleField: true,
          requireEmailConfirmation: null,
        },
        cart: { enableOrderRefunds: "true" },
      },
      fallback,
    );

    expect(merged).toEqual({
      loginRegistration: {
        ...fallback.loginRegistration,
        showTitleField: true,
      },
      cart: fallback.cart,
    });
  });

  it("falls back for a whole group the answer lacks or sends in another shape", () => {
    expect(
      mergeShopSettings(
        {
          loginRegistration: [true],
          cart: null,
        },
        fallback,
      ),
    ).toEqual(fallback);
    expect(
      mergeShopSettings(
        {
          general: { shopName: "Demostore" },
          cart: { showCustomerComment: true },
        },
        fallback,
      ),
    ).toEqual({
      loginRegistration: fallback.loginRegistration,
      cart: { enableOrderRefunds: false, showCustomerComment: true },
    });
  });

  it("returns new objects, so a caller cannot change the fallback", () => {
    const merged = mergeShopSettings(null, fallback);

    expect(merged.loginRegistration).not.toBe(fallback.loginRegistration);
    expect(merged.cart).not.toBe(fallback.cart);
    merged.cart.enableOrderRefunds = true;
    expect(fallback.cart.enableOrderRefunds).toBe(false);
  });
});
