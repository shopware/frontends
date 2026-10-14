import type { Schemas } from "#shopware";
import type { Translate } from "@/i18n/translate";

export type CheckoutTermsField = "tos" | "revocation" | "dataProtection";

export type CheckoutTermsValues = Record<CheckoutTermsField, boolean>;

export type CheckoutTermsErrors = Partial<Record<CheckoutTermsField, string>>;

export type CheckoutTermsRequirements = {
  revocation: boolean;
  dataProtection: boolean;
};

export const emptyCheckoutTerms: CheckoutTermsValues = {
  tos: false,
  revocation: false,
  dataProtection: false,
};

function isDigitalLineItem(item: Schemas["LineItem"]): boolean {
  const payload = item.payload as { productType?: unknown } | undefined;
  return (
    payload?.productType === "digital" ||
    (item.states ?? []).includes("is-download")
  );
}

export function hasDigitalLineItem(
  lineItems: readonly Schemas["LineItem"][] | undefined,
): boolean {
  return (lineItems ?? []).some(
    (item) => isDigitalLineItem(item) || hasDigitalLineItem(item.children),
  );
}

export function validateCheckoutTerms(
  values: CheckoutTermsValues,
  requirements: CheckoutTermsRequirements,
  t: Translate,
): CheckoutTermsErrors {
  const errors: CheckoutTermsErrors = {};
  if (!values.tos) errors.tos = t("checkout.terms.tosRequired");
  if (requirements.revocation && !values.revocation) {
    errors.revocation = t("checkout.terms.revocationRequired");
  }
  if (requirements.dataProtection && !values.dataProtection) {
    errors.dataProtection = t("checkout.terms.dataProtectionRequired");
  }
  return errors;
}
