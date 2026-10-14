import { describe, expect, it } from "vitest";

import { REGISTRATION_MIN_LENGTHS } from "@/features/account/registrationSchema";

import { TEMPLATE_SHOP_SETTINGS } from "./shopSettings";

describe("TEMPLATE_SHOP_SETTINGS", () => {
  it("keeps the registration minimum of the form as the password length", () => {
    expect(TEMPLATE_SHOP_SETTINGS.loginRegistration.passwordMinLength).toBe(
      REGISTRATION_MIN_LENGTHS.password,
    );
  });

  it("reproduces the template before it read the settings: the account-type select and no other registration field", () => {
    const { passwordMinLength, showAccountTypeSelection, ...flags } =
      TEMPLATE_SHOP_SETTINGS.loginRegistration;

    expect(showAccountTypeSelection).toBe(true);
    expect(Object.values(flags).every((flag) => flag === false)).toBe(true);
    expect(passwordMinLength).toBe(8);
  });

  it("shows no customer comment and offers no order cancellation", () => {
    expect(TEMPLATE_SHOP_SETTINGS.cart).toEqual({
      enableOrderRefunds: false,
      showCustomerComment: false,
    });
  });
});
