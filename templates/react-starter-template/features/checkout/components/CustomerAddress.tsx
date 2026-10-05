"use client";

import { BaseButton } from "@shopware/cms-base-layer-react/client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { CountrySelect } from "@/components/form/CountrySelect";
import { InputField } from "@/components/form/InputField";
import { SelectField } from "@/components/form/SelectField";
import type { CountryOption } from "@/platform/shopware/reads/countryOptions";

import type {
  CheckoutErrors,
  CheckoutField,
  CheckoutValues,
} from "../checkoutSchema";

const t = {
  checkout: {
    customerAddress: {
      firstNamePlaceholder: "Enter first name",
      firstNameLabel: "First name",
      lastNamePlaceholder: "Enter last name",
      lastNameLabel: "Last name",
      streetPlaceholder: "Enter street address",
      streetLabel: "Street address",
      zipcodePlaceholder: "Enter ZIP code",
      zipcodeLabel: "Zip Code",
      cityPlaceholder: "Enter city name",
      cityLabel: "City",
    },
  },
  form: {
    country: "Country",
    chooseCountry: "Choose country...",
    state: "State",
    chooseState: "Choose state",
  },
  listing: {
    retry: "Try again",
  },
};

export type CustomerAddressProps = {
  values: Pick<
    CheckoutValues,
    | "firstName"
    | "lastName"
    | "street"
    | "zipcode"
    | "city"
    | "countryId"
    | "countryStateId"
  >;
  errors: CheckoutErrors;
  countries: CountryOption[];
  countriesUnavailable?: boolean;
  onFieldChange: (field: CheckoutField, value: string) => void;
  onFieldBlur: (field: CheckoutField) => void;
  onCountryChange: (countryId: string) => void;
  className?: string;
};

export function CustomerAddress({
  values,
  errors,
  countries,
  countriesUnavailable = false,
  onFieldChange,
  onFieldBlur,
  onCountryChange,
  className,
}: CustomerAddressProps) {
  const router = useRouter();
  const [refreshing, startRefresh] = useTransition();
  const copy = t.checkout.customerAddress;
  const states =
    countries.find((country) => country.id === values.countryId)?.states ?? [];

  function retryCountries() {
    if (refreshing) return;
    startRefresh(() => {
      router.refresh();
    });
  }

  return (
    <div className={className}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <InputField
            className="sm:basis-1/2"
            id="first-name"
            autoComplete="given-name"
            data-testid="checkout-pi-first-name-input"
            label={copy.firstNameLabel}
            placeholder={copy.firstNamePlaceholder}
            required
            value={values.firstName}
            onChange={(event) => onFieldChange("firstName", event.target.value)}
            onBlur={() => onFieldBlur("firstName")}
            error={errors.firstName}
          />
          <InputField
            className="sm:basis-1/2"
            id="last-name"
            autoComplete="family-name"
            data-testid="checkout-pi-last-name-input"
            label={copy.lastNameLabel}
            placeholder={copy.lastNamePlaceholder}
            required
            value={values.lastName}
            onChange={(event) => onFieldChange("lastName", event.target.value)}
            onBlur={() => onFieldBlur("lastName")}
            error={errors.lastName}
          />
        </div>
        <InputField
          id="street"
          autoComplete="street-address"
          data-testid="checkout-pi-street-address-input"
          label={copy.streetLabel}
          placeholder={copy.streetPlaceholder}
          required
          value={values.street}
          onChange={(event) => onFieldChange("street", event.target.value)}
          onBlur={() => onFieldBlur("street")}
          error={errors.street}
        />
        <div className="flex flex-col gap-4 sm:flex-row">
          <InputField
            className="sm:basis-1/2"
            id="zipcode"
            autoComplete="postal-code"
            data-testid="checkout-pi-zip-code-input"
            label={copy.zipcodeLabel}
            placeholder={copy.zipcodePlaceholder}
            required
            value={values.zipcode}
            onChange={(event) => onFieldChange("zipcode", event.target.value)}
            onBlur={() => onFieldBlur("zipcode")}
            error={errors.zipcode}
          />
          <InputField
            className="sm:basis-1/2"
            id="city"
            autoComplete="address-level2"
            data-testid="checkout-pi-city-input"
            label={copy.cityLabel}
            placeholder={copy.cityPlaceholder}
            required
            value={values.city}
            onChange={(event) => onFieldChange("city", event.target.value)}
            onBlur={() => onFieldBlur("city")}
            error={errors.city}
          />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <div className="w-full">
            <CountrySelect
              className="w-full"
              id="country"
              label={t.form.country}
              placeholder={t.form.chooseCountry}
              countries={countries}
              value={values.countryId}
              onChange={onCountryChange}
              onBlur={() => onFieldBlur("countryId")}
              error={errors.countryId}
              loadError={countriesUnavailable}
              required
            />
            {countriesUnavailable ? (
              <BaseButton
                variant="secondary"
                size="small"
                className="mt-2"
                aria-busy={refreshing}
                onClick={retryCountries}
              >
                {t.listing.retry}
              </BaseButton>
            ) : null}
          </div>
          {states.length > 0 ? (
            <SelectField
              className="w-full"
              id="state"
              data-testid="checkout-pi-state-input"
              label={t.form.state}
              placeholder={t.form.chooseState}
              required
              autoComplete="address-level1"
              options={states.map((state) => ({
                label: state.name,
                value: state.id,
              }))}
              value={values.countryStateId}
              onChange={(event) =>
                onFieldChange("countryStateId", event.target.value)
              }
              onBlur={() => onFieldBlur("countryStateId")}
              error={errors.countryStateId}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
