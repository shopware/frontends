"use client";

import { useTranslations } from "@/i18n/I18nProvider";
import type { CountryOption } from "@/platform/shopware/reads/countryOptions";

import type {
  CheckoutAddressErrors,
  CheckoutAddressField,
  CheckoutAddressValues,
} from "../checkoutSchema";
import { CustomerAddress } from "./CustomerAddress";

const FIELDS_ID = "checkout-shipping-address-fields";

export type DifferentShippingAddressProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  values: CheckoutAddressValues;
  errors: CheckoutAddressErrors;
  countries: CountryOption[];
  countriesUnavailable?: boolean;
  onFieldChange: (field: CheckoutAddressField, value: string) => void;
  onFieldBlur: (field: CheckoutAddressField) => void;
  onCountryChange: (countryId: string) => void;
  className?: string;
};

export function DifferentShippingAddress({
  checked,
  onCheckedChange,
  values,
  errors,
  countries,
  countriesUnavailable = false,
  onFieldChange,
  onFieldBlur,
  onCountryChange,
  className,
}: DifferentShippingAddressProps) {
  const t = useTranslations();
  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="different-shipping"
          checked={checked}
          onChange={(event) => onCheckedChange(event.target.checked)}
          aria-controls={checked ? FIELDS_ID : undefined}
          data-testid="checkout-custom-shipping-address-checkbox"
          className="mt-1 size-4 shrink-0 accent-brand-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline-outline-focus"
        />
        <label
          htmlFor="different-shipping"
          className="text-sm text-surface-on-surface"
        >
          {t("checkout.addresses.differentShipping")}
        </label>
      </div>
      {checked ? (
        <fieldset id={FIELDS_ID} className="mt-4 min-w-0">
          <legend className="mb-4 leading-normal font-bold text-surface-on-surface">
            {t("checkout.shippingAddressLabel")}
          </legend>
          <CustomerAddress
            values={values}
            errors={errors}
            countries={countries}
            countriesUnavailable={countriesUnavailable}
            onFieldChange={onFieldChange}
            onFieldBlur={onFieldBlur}
            onCountryChange={onCountryChange}
            idPrefix="shipping-"
            testIdPrefix="checkout-shipping"
            countryTestId="checkout-shipping-country-select"
            autoCompletePrefix="shipping "
          />
        </fieldset>
      ) : null}
    </div>
  );
}
