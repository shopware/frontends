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

export function toCheckoutSettings(
  shopSettings: ShopSettings,
  legalLinks: LegalLinks,
): CheckoutSettings {
  return {
    showCustomerComment: shopSettings.cart.showCustomerComment,
    requireDataProtectionCheckbox:
      shopSettings.loginRegistration.requireDataProtectionCheckbox,
    passwordMinLength: shopSettings.loginRegistration.passwordMinLength,
    legalLinks: {
      terms: toLegalLinkHref(legalLinks.terms),
      revocation: toLegalLinkHref(legalLinks.revocation),
    },
  };
}
