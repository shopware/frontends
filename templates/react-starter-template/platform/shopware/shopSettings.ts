import type { operations } from "#shopware";

export type ShopSettingsResponse =
  operations["getShopSettings get /shop-settings"]["response"];

export type LoginRegistrationSettings = Pick<
  ShopSettingsResponse["loginRegistration"],
  | "passwordMinLength"
  | "requireDataProtectionCheckbox"
  | "showAccountTypeSelection"
  | "showSalutation"
  | "showTitleField"
  | "showBirthdayField"
  | "birthdayFieldRequired"
  | "requireEmailConfirmation"
  | "requirePasswordConfirmation"
  | "showAdditionalAddressField1"
  | "additionalAddressField1Required"
  | "showAdditionalAddressField2"
  | "additionalAddressField2Required"
  | "showPhoneNumberField"
  | "phoneNumberFieldRequired"
>;

export type CartSettings = Pick<
  ShopSettingsResponse["cart"],
  "enableOrderRefunds" | "showCustomerComment"
>;

export type ShopSettings = {
  loginRegistration: LoginRegistrationSettings;
  cart: CartSettings;
};

type SettingValue = boolean | number | string;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function hasSameType(
  value: unknown,
  like: SettingValue,
): value is SettingValue {
  return typeof value === typeof like;
}

function mergeGroup<T extends Record<string, SettingValue>>(
  remote: unknown,
  fallback: T,
): T {
  const merged: Record<string, SettingValue> = { ...fallback };
  if (!isRecord(remote)) return merged as T;
  for (const [key, like] of Object.entries(fallback)) {
    const value = remote[key];
    if (hasSameType(value, like)) merged[key] = value;
  }
  return merged as T;
}

export function mergeShopSettings(
  remote: unknown,
  fallback: ShopSettings,
): ShopSettings {
  const groups = isRecord(remote) ? remote : {};
  return {
    loginRegistration: mergeGroup(
      groups.loginRegistration,
      fallback.loginRegistration,
    ),
    cart: mergeGroup(groups.cart, fallback.cart),
  };
}
