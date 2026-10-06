"use client";

import { BaseButton } from "@shopware/cms-base-layer-react/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { CountrySelect } from "@/components/form/CountrySelect";
import { InputField } from "@/components/form/InputField";
import { SelectField } from "@/components/form/SelectField";
import type { SelectOption } from "@/components/form/SelectField";
import type { CountryOption } from "@/platform/shopware/reads/countryOptions";

import { emptyAddressValues, validateAddress } from "../addressSchema";
import type { AddressField, AddressValues } from "../addressSchema";
import { SECONDARY_BUTTON_CLASS } from "./addressButtonClasses";

const t = {
  account: {
    address: {
      saveButton: "Save address",
    },
  },
  form: {
    salutation: "Salutation",
    chooseSalutation: "Choose salutation...",
    firstName: "First name",
    firstNamePlaceholder: "Enter first name...",
    lastName: "Last name",
    lastNamePlaceholder: "Enter last name...",
    streetAddress: "Street address",
    streetPlaceholder: "Enter street...",
    postalCode: "ZIP / Postal code",
    postalCodePlaceholder: "Enter zip code...",
    city: "City",
    cityPlaceholder: "Enter city...",
    country: "Country",
    chooseCountry: "Choose country...",
    state: "State",
    chooseState: "Choose state",
    cancel: "Cancel",
    requiredFieldsNote: "Fields marked with asterisks (*) are required.",
  },
  errors: {
    error: "An error occurred. Please try again.",
  },
  listing: {
    retry: "Try again",
  },
};

export const ADDRESS_LIST_PATH = "/account/address";

type Touched = Partial<Record<AddressField, boolean>>;

export type AddressFormProps = {
  countries: CountryOption[];
  salutations: SelectOption[];
  countriesUnavailable?: boolean;
  salutationsUnavailable?: boolean;
  initialValues?: AddressValues;
  busy?: boolean;
  onSubmit: (values: AddressValues) => Promise<void>;
};

export function AddressForm({
  countries,
  salutations,
  countriesUnavailable = false,
  salutationsUnavailable = false,
  initialValues = emptyAddressValues,
  busy = false,
  onSubmit,
}: AddressFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<AddressValues>(initialValues);
  const [touched, setTouched] = useState<Touched>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [refreshing, startRefresh] = useTransition();
  const [focusRequest, setFocusRequest] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const pendingRef = useRef(false);

  const states =
    countries.find((country) => country.id === values.countryId)?.states ?? [];
  const countryHasStates = states.length > 0;
  const errors = validateAddress(values, { countryHasStates });
  const referencesUnavailable = countriesUnavailable || salutationsUnavailable;
  const inactive = pending || busy;

  const errorFor = (field: AddressField) =>
    submitted || touched[field] ? errors[field] : undefined;

  const touch = (field: AddressField) => () =>
    setTouched((current) => ({ ...current, [field]: true }));

  const inputHandler =
    (field: AddressField) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { value } = event.target;
      setValues((current) => ({ ...current, [field]: value }));
    };

  const handleCountryChange = useCallback((countryId: string) => {
    setValues((current) =>
      current.countryId === countryId
        ? current
        : { ...current, countryId, countryStateId: "" },
    );
  }, []);

  useEffect(() => {
    if (focusRequest === 0) return;
    formRef.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus();
  }, [focusRequest]);

  function retryReferences() {
    if (refreshing) return;
    startRefresh(() => {
      router.refresh();
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pendingRef.current || busy) return;
    setSubmitted(true);
    if (Object.keys(validateAddress(values, { countryHasStates })).length) {
      setFocusRequest((count) => count + 1);
      return;
    }

    pendingRef.current = true;
    setPending(true);
    try {
      await onSubmit(values);
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  }

  return (
    <form
      ref={formRef}
      className="flex flex-col gap-4"
      noValidate
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <SelectField
        id="salutation"
        label={t.form.salutation}
        placeholder={t.form.chooseSalutation}
        required
        autoComplete="honorific-prefix"
        options={salutations}
        value={values.salutationId}
        onChange={inputHandler("salutationId")}
        onBlur={touch("salutationId")}
        error={
          salutationsUnavailable ? t.errors.error : errorFor("salutationId")
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row">
        <InputField
          className="sm:basis-1/2"
          id="first-name"
          label={t.form.firstName}
          placeholder={t.form.firstNamePlaceholder}
          required
          autoComplete="given-name"
          value={values.firstName}
          onChange={inputHandler("firstName")}
          onBlur={touch("firstName")}
          error={errorFor("firstName")}
        />
        <InputField
          className="sm:basis-1/2"
          id="last-name"
          label={t.form.lastName}
          placeholder={t.form.lastNamePlaceholder}
          required
          autoComplete="family-name"
          value={values.lastName}
          onChange={inputHandler("lastName")}
          onBlur={touch("lastName")}
          error={errorFor("lastName")}
        />
      </div>

      <InputField
        id="street"
        label={t.form.streetAddress}
        placeholder={t.form.streetPlaceholder}
        required
        autoComplete="street-address"
        value={values.street}
        onChange={inputHandler("street")}
        onBlur={touch("street")}
        error={errorFor("street")}
      />

      <div className="flex flex-col gap-4 sm:flex-row">
        <InputField
          className="sm:basis-1/2"
          id="zipcode"
          label={t.form.postalCode}
          placeholder={t.form.postalCodePlaceholder}
          required
          autoComplete="postal-code"
          value={values.zipcode}
          onChange={inputHandler("zipcode")}
          onBlur={touch("zipcode")}
          error={errorFor("zipcode")}
        />
        <InputField
          className="sm:basis-1/2"
          id="city"
          label={t.form.city}
          placeholder={t.form.cityPlaceholder}
          required
          autoComplete="address-level2"
          value={values.city}
          onChange={inputHandler("city")}
          onBlur={touch("city")}
          error={errorFor("city")}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
        <CountrySelect
          className="w-full"
          id="country"
          label={t.form.country}
          placeholder={t.form.chooseCountry}
          countries={countries}
          value={values.countryId}
          onChange={handleCountryChange}
          onBlur={touch("countryId")}
          error={errorFor("countryId")}
          loadError={countriesUnavailable}
          required
        />
        {countryHasStates ? (
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
            onChange={inputHandler("countryStateId")}
            onBlur={touch("countryStateId")}
            error={errorFor("countryStateId")}
          />
        ) : null}
      </div>

      {referencesUnavailable ? (
        <BaseButton
          variant="secondary"
          size="small"
          className="w-fit"
          aria-busy={refreshing}
          onClick={retryReferences}
        >
          {t.listing.retry}
        </BaseButton>
      ) : null}

      <p className="text-sm text-surface-on-surface-variant">
        {t.form.requiredFieldsNote}
      </p>

      <div className="mt-6 flex gap-4">
        <BaseButton
          type="submit"
          aria-busy={inactive}
          aria-disabled={inactive || undefined}
          className="aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
        >
          {t.account.address.saveButton}
        </BaseButton>
        <Link href={ADDRESS_LIST_PATH} className={SECONDARY_BUTTON_CLASS}>
          {t.form.cancel}
        </Link>
      </div>
    </form>
  );
}
