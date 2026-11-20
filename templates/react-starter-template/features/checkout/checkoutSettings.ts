import type { AddressFieldSettings } from "@/features/account/address/addressSchema";
import { hasUnsafePathChar } from "@/platform/routing/paths";
import type { ShopSettings } from "@/platform/shopware/shopSettings";

export type LegalLinks = {
  terms: string | null;
  revocation: string | null;
};

export type CheckoutSettings = {
  showCustomerComment: boolean;
  requireDataProtectionCheckbox: boolean;
  passwordMinLength: number;
  addressFields: AddressFieldSettings;
  legalLinks: LegalLinks;
};

const WEB_PROTOCOLS = new Set(["http:", "https:"]);

export function toLegalLinkHref(value: string | null): string | null {
  const href = value?.trim() ?? "";
  if (!href || hasUnsafePathChar(href)) return null;
  if (href.startsWith("/")) return href.startsWith("//") ? null : href;
  if (!URL.canParse(href)) return null;
  const url = new URL(href);
  return WEB_PROTOCOLS.has(url.protocol) ? url.href : null;
}

function addressFieldsOf({
  loginRegistration: settings,
}: ShopSettings): AddressFieldSettings {
  return {
    showAdditionalAddressField1: settings.showAdditionalAddressField1,
    additionalAddressField1Required: settings.additionalAddressField1Required,
    showAdditionalAddressField2: settings.showAdditionalAddressField2,
    additionalAddressField2Required: settings.additionalAddressField2Required,
    showPhoneNumberField: settings.showPhoneNumberField,
    phoneNumberFieldRequired: settings.phoneNumberFieldRequired,
  };
}

export function toCheckoutSettings(
  shopSettings: ShopSettings,
  legalLinks: LegalLinks,
): CheckoutSettings {
  return {
    showCustomerComment: shopSettings.cart.showCustomerComment,
    requireDataProtectionCheckbox:
      shopSettings.loginRegistration.requireDataProtectionCheckbox,
    passwordMinLength: shopSettings.loginRegistration.passwordMinLength,
    addressFields: addressFieldsOf(shopSettings),
    legalLinks: {
      terms: toLegalLinkHref(legalLinks.terms),
      revocation: toLegalLinkHref(legalLinks.revocation),
    },
  };
}
