"use client";

import {
  BaseButton,
  useCmsActions,
} from "@shopware/cms-base-layer-react/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { CountrySelect } from "@/components/form/CountrySelect";
import { InputField } from "@/components/form/InputField";
import { SelectField } from "@/components/form/SelectField";
import { resolveRedirectTarget } from "@/features/account/redirect";
import {
  emptyRegistrationValues,
  toRegistrationInput,
  validateRegistration,
} from "@/features/account/registrationSchema";
import type {
  AccountType,
  RegistrationField,
  RegistrationValues,
} from "@/features/account/registrationSchema";
import { useSessionActions } from "@/features/session/components/SessionActionsContext";
import type { CountryOption } from "@/platform/shopware/reads/countryOptions";

const t = {
  account: {
    signUpHeader: "Create an account",
    signUpSubHeader: "Register to get started",
    yourAddress: "Your address",
    messages: {
      signUpSuccess:
        "Thank you for signing up! You will receive a confirmation email shortly. Click on the link in it to complete the sign-up.",
    },
  },
  form: {
    accountType: {
      title: "Account type",
      private: "Private",
      business: "Company",
    },
    firstName: "First name",
    lastName: "Last name",
    email: "Email address",
    password: "Password",
    vatId: "VAT ID",
    company: "Company",
    streetAddress: "Street address",
    postalCode: "ZIP / Postal code",
    city: "City",
    country: "Country",
    chooseCountry: "Choose country...",
    state: "State",
    chooseState: "Choose state",
    submit: "Submit",
    requiredFieldsNote: "Fields marked with asterisks (*) are required.",
    minLengthHint: "At least {min} characters",
  },
  listing: {
    retry: "Try again",
  },
};

function minLengthHint(min: number): string {
  return t.form.minLengthHint.replace("{min}", String(min));
}

const ACCOUNT_TYPE_OPTIONS = [
  { label: t.form.accountType.private, value: "private" },
  { label: t.form.accountType.business, value: "business" },
];

type Touched = Partial<Record<RegistrationField, boolean>>;

export type RegistrationFormProps = {
  countries: CountryOption[];
  countriesUnavailable?: boolean;
  companyOnly?: boolean;
  redirectUrl?: string | null;
};

function initialValues(companyOnly: boolean): RegistrationValues {
  return {
    ...emptyRegistrationValues,
    accountType: companyOnly ? "business" : "private",
  };
}

function toAccountType(value: string): AccountType {
  return value === "business" ? "business" : "private";
}

export function RegistrationForm({
  countries,
  countriesUnavailable = false,
  companyOnly = false,
  redirectUrl = null,
}: RegistrationFormProps) {
  const router = useRouter();
  const { register } = useSessionActions();
  const { notify } = useCmsActions();
  const [values, setValues] = useState<RegistrationValues>(() =>
    initialValues(companyOnly),
  );
  const [touched, setTouched] = useState<Touched>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [navigating, startNavigation] = useTransition();
  const [refreshing, startRefresh] = useTransition();
  const [doubleOptInCount, setDoubleOptInCount] = useState(0);
  const [focusRequest, setFocusRequest] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const successBoxRef = useRef<HTMLOutputElement>(null);

  const busy = pending || navigating;
  const doubleOptInPending = doubleOptInCount > 0;

  const business = values.accountType === "business";
  const selectedCountry =
    countries.find((country) => country.id === values.countryId) ?? null;
  const states = selectedCountry?.states ?? [];
  const countryHasStates = states.length > 0;
  const errors = validateRegistration(values, { countryHasStates });

  const errorFor = (field: RegistrationField) =>
    submitted || touched[field] ? errors[field] : undefined;

  const setField = <K extends RegistrationField>(
    field: K,
    value: RegistrationValues[K],
  ) => setValues((current) => ({ ...current, [field]: value }));

  const touch = (field: RegistrationField) => () =>
    setTouched((current) => ({ ...current, [field]: true }));

  const inputHandler =
    (field: RegistrationField) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setField(field, event.target.value);

  const handleCountryChange = useCallback((countryId: string) => {
    setValues((current) =>
      current.countryId === countryId
        ? current
        : { ...current, countryId, countryStateId: "" },
    );
  }, []);

  useEffect(() => {
    if (doubleOptInCount === 0) return;
    successBoxRef.current?.scrollIntoView?.({ block: "nearest" });
  }, [doubleOptInCount]);

  useEffect(() => {
    if (focusRequest === 0) return;
    formRef.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus();
  }, [focusRequest]);

  function retryCountries() {
    if (refreshing) return;
    startRefresh(() => {
      router.refresh();
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setSubmitted(true);
    if (
      Object.keys(validateRegistration(values, { countryHasStates })).length
    ) {
      setFocusRequest((count) => count + 1);
      return;
    }

    setPending(true);
    try {
      const result = await register(toRegistrationInput(values));
      if (!result.ok) return;
      if (result.doubleOptIn) {
        setValues(initialValues(companyOnly));
        setTouched({});
        setSubmitted(false);
        setDoubleOptInCount((count) => count + 1);
        return;
      }
      const target = resolveRedirectTarget(redirectUrl);
      startNavigation(() => {
        router.push(target);
      });
    } catch (cause) {
      notify({
        type: "error",
        message: cause instanceof Error ? cause.message : String(cause),
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <output ref={successBoxRef} aria-live="polite" className="block">
        {doubleOptInPending ? (
          <span className="mb-4 block border-t border-b border-states-success bg-states-success-container px-4 py-3 text-states-on-success-container">
            {t.account.messages.signUpSuccess}
          </span>
        ) : null}
      </output>
      <div className="mb-6">
        <h2 id="sign-up-heading" className="text-2xl font-bold">
          {t.account.signUpHeader}
        </h2>
        <p className="text-sm text-surface-on-surface-variant">
          {t.account.signUpSubHeader}
        </p>
        <p className="mt-2 text-sm text-surface-on-surface-variant">
          {t.form.requiredFieldsNote}
        </p>
      </div>
      <form
        ref={formRef}
        className="relative w-full"
        data-testid="registration-form"
        aria-labelledby="sign-up-heading"
        noValidate
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
      >
        <div className="mb-10 grid grid-cols-12 gap-5">
          {companyOnly ? null : (
            <SelectField
              className="col-span-12"
              id="accountType"
              data-testid="registration-account-type-select"
              label={t.form.accountType.title}
              options={ACCOUNT_TYPE_OPTIONS}
              value={values.accountType}
              onChange={(event) =>
                setField("accountType", toAccountType(event.target.value))
              }
              onBlur={touch("accountType")}
              error={errorFor("accountType")}
            />
          )}
          <InputField
            className="col-span-12 md:col-span-4"
            id="firstName"
            data-testid="registration-first-name-input"
            label={t.form.firstName}
            hint={minLengthHint(3)}
            required
            autoComplete="given-name"
            value={values.firstName}
            onChange={inputHandler("firstName")}
            onBlur={touch("firstName")}
            error={errorFor("firstName")}
          />
          <InputField
            className="col-span-12 md:col-span-4"
            id="lastName"
            data-testid="registration-last-name-input"
            label={t.form.lastName}
            hint={minLengthHint(3)}
            required
            autoComplete="family-name"
            value={values.lastName}
            onChange={inputHandler("lastName")}
            onBlur={touch("lastName")}
            error={errorFor("lastName")}
          />
          <InputField
            className="col-span-12 md:col-span-6"
            id="emailAddress"
            data-testid="registration-email-input"
            type="email"
            label={t.form.email}
            required
            autoComplete="email"
            value={values.email}
            onChange={inputHandler("email")}
            onBlur={touch("email")}
            error={errorFor("email")}
          />
          <InputField
            className="col-span-12 md:col-span-4"
            id="password"
            data-testid="registration-password-input"
            type="password"
            label={t.form.password}
            hint={minLengthHint(8)}
            required
            autoComplete="new-password"
            value={values.password}
            onChange={inputHandler("password")}
            onBlur={touch("password")}
            error={errorFor("password")}
          />
          {business ? (
            <InputField
              className="col-span-12 md:col-span-4"
              id="vatId"
              data-testid="registration-vatid-input"
              label={t.form.vatId}
              value={values.vatId}
              onChange={inputHandler("vatId")}
              onBlur={touch("vatId")}
              error={errorFor("vatId")}
            />
          ) : null}
        </div>

        <h3
          id="address-heading"
          className="mb-5 block border-b border-outline-outline-variant pb-2 font-bold"
        >
          {t.account.yourAddress}
        </h3>
        <fieldset
          className="mb-5 grid min-w-0 grid-cols-12 gap-5"
          aria-labelledby="address-heading"
        >
          {business ? (
            <InputField
              className="col-span-12 md:col-span-4"
              id="company"
              data-testid="registration-company-input"
              label={t.form.company}
              required
              autoComplete="organization"
              value={values.company}
              onChange={inputHandler("company")}
              onBlur={touch("company")}
              error={errorFor("company")}
            />
          ) : null}
          <InputField
            className="col-span-12 md:col-span-4"
            id="street"
            data-testid="registration-street-input"
            label={t.form.streetAddress}
            hint={minLengthHint(3)}
            required
            autoComplete="street-address"
            value={values.street}
            onChange={inputHandler("street")}
            onBlur={touch("street")}
            error={errorFor("street")}
          />
          <InputField
            className="col-span-12 md:col-span-4"
            id="zipcode"
            data-testid="registration-zipcode-input"
            label={t.form.postalCode}
            required
            autoComplete="postal-code"
            value={values.zipcode}
            onChange={inputHandler("zipcode")}
            onBlur={touch("zipcode")}
            error={errorFor("zipcode")}
          />
          <InputField
            className="col-span-12 md:col-span-4"
            id="city"
            data-testid="registration-city-input"
            label={t.form.city}
            required
            autoComplete="address-level2"
            value={values.city}
            onChange={inputHandler("city")}
            onBlur={touch("city")}
            error={errorFor("city")}
          />
          <div className="col-span-12 flex gap-6 md:col-span-8">
            <div className="w-full">
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
        </fieldset>
        <div className="mb-5 text-right">
          <BaseButton
            type="submit"
            data-testid="registration-submit-button"
            aria-busy={busy}
            aria-disabled={busy || undefined}
            className="aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
          >
            {t.form.submit}
          </BaseButton>
        </div>
      </form>
    </div>
  );
}
