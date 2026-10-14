"use client";

import { BaseButton } from "@shopware/cms-base-layer-react/client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { CountrySelect } from "@/components/form/CountrySelect";
import { InputField } from "@/components/form/InputField";
import { SelectField } from "@/components/form/SelectField";
import { useContentLang } from "@/i18n/ContentLanguageProvider";
import { useTranslations } from "@/i18n/I18nProvider";
import type { CountryOption } from "@/platform/shopware/reads/countryOptions";

import type {
  CheckoutAddressErrors,
  CheckoutAddressField,
  CheckoutAddressValues,
} from "../checkoutSchema";

export type CustomerAddressProps = {
  values: CheckoutAddressValues;
  errors: CheckoutAddressErrors;
  countries: CountryOption[];
  countriesUnavailable?: boolean;
  onFieldChange: (field: CheckoutAddressField, value: string) => void;
  onFieldBlur: (field: CheckoutAddressField) => void;
  onCountryChange: (countryId: string) => void;
  idPrefix?: string;
  testIdPrefix?: string;
  countryTestId?: string;
  autoCompletePrefix?: string;
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
  idPrefix = "",
  testIdPrefix = "checkout-pi",
  countryTestId = "country-select",
  autoCompletePrefix = "",
  className,
}: CustomerAddressProps) {
  const router = useRouter();
  const [refreshing, startRefresh] = useTransition();
  const t = useTranslations();
  const contentLang = useContentLang();
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
            id={`${idPrefix}first-name`}
            autoComplete={`${autoCompletePrefix}given-name`}
            data-testid={`${testIdPrefix}-first-name-input`}
            label={t("checkout.customerAddress.firstNameLabel")}
            placeholder={t("checkout.customerAddress.firstNamePlaceholder")}
            required
            value={values.firstName}
            onChange={(event) => onFieldChange("firstName", event.target.value)}
            onBlur={() => onFieldBlur("firstName")}
            error={errors.firstName}
          />
          <InputField
            className="sm:basis-1/2"
            id={`${idPrefix}last-name`}
            autoComplete={`${autoCompletePrefix}family-name`}
            data-testid={`${testIdPrefix}-last-name-input`}
            label={t("checkout.customerAddress.lastNameLabel")}
            placeholder={t("checkout.customerAddress.lastNamePlaceholder")}
            required
            value={values.lastName}
            onChange={(event) => onFieldChange("lastName", event.target.value)}
            onBlur={() => onFieldBlur("lastName")}
            error={errors.lastName}
          />
        </div>
        <InputField
          id={`${idPrefix}street`}
          autoComplete={`${autoCompletePrefix}street-address`}
          data-testid={`${testIdPrefix}-street-address-input`}
          label={t("checkout.customerAddress.streetLabel")}
          placeholder={t("checkout.customerAddress.streetPlaceholder")}
          required
          value={values.street}
          onChange={(event) => onFieldChange("street", event.target.value)}
          onBlur={() => onFieldBlur("street")}
          error={errors.street}
        />
        <div className="flex flex-col gap-4 sm:flex-row">
          <InputField
            className="sm:basis-1/2"
            id={`${idPrefix}zipcode`}
            autoComplete={`${autoCompletePrefix}postal-code`}
            data-testid={`${testIdPrefix}-zip-code-input`}
            label={t("checkout.customerAddress.zipcodeLabel")}
            placeholder={t("checkout.customerAddress.zipcodePlaceholder")}
            required
            value={values.zipcode}
            onChange={(event) => onFieldChange("zipcode", event.target.value)}
            onBlur={() => onFieldBlur("zipcode")}
            error={errors.zipcode}
          />
          <InputField
            className="sm:basis-1/2"
            id={`${idPrefix}city`}
            autoComplete={`${autoCompletePrefix}address-level2`}
            data-testid={`${testIdPrefix}-city-input`}
            label={t("checkout.customerAddress.cityLabel")}
            placeholder={t("checkout.customerAddress.cityPlaceholder")}
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
              id={`${idPrefix}country`}
              testId={countryTestId}
              label={t("form.country")}
              placeholder={t("form.chooseCountry")}
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
                {t("listing.retry")}
              </BaseButton>
            ) : null}
          </div>
          {states.length > 0 ? (
            <SelectField
              className="w-full"
              id={`${idPrefix}state`}
              data-testid={`${testIdPrefix}-state-input`}
              label={t("form.state")}
              placeholder={t("form.chooseState")}
              required
              autoComplete={`${autoCompletePrefix}address-level1`}
              optionsLang={contentLang}
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
