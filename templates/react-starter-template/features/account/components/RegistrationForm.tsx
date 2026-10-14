"use client";

import {
  BaseButton,
  useCmsActions,
} from "@shopware/cms-base-layer-react/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import type { ChangeEvent, FormEvent } from "react";

import type { BirthdayPart } from "@/components/form/birthday";
import { BirthdayField } from "@/components/form/BirthdayField";
import { CheckboxField } from "@/components/form/CheckboxField";
import { CountrySelect } from "@/components/form/CountrySelect";
import { InputField } from "@/components/form/InputField";
import { SelectField } from "@/components/form/SelectField";
import type { SelectOption } from "@/components/form/SelectField";
import { resolveRedirectFromSearch } from "@/features/account/redirect";
import {
  REGISTRATION_MAX_LENGTHS,
  REGISTRATION_MIN_LENGTHS,
  emptyRegistrationValues,
  toRegistrationInput,
  validateRegistration,
} from "@/features/account/registrationSchema";
import type {
  AccountType,
  RegistrationField,
  RegistrationSettings,
  RegistrationValues,
} from "@/features/account/registrationSchema";
import { useSessionActions } from "@/features/session/components/SessionActionsContext";
import { useContentLang } from "@/i18n/ContentLanguageProvider";
import { useLocalePath, useTranslations } from "@/i18n/I18nProvider";
import type { CountryOption } from "@/platform/shopware/reads/countryOptions";
import { TEMPLATE_SHOP_SETTINGS } from "@/site/shopSettings";

type Touched = Partial<Record<RegistrationField, boolean>>;

type TextField = Exclude<
  RegistrationField,
  "accountType" | "acceptedDataProtection"
>;

const BIRTHDAY_FIELDS = {
  day: "birthdayDay",
  month: "birthdayMonth",
  year: "birthdayYear",
} as const satisfies Record<BirthdayPart, TextField>;

const FIRST_INVALID_FIELD = '[aria-invalid="true"]:not(:disabled)';

export type RegistrationFormProps = {
  countries: CountryOption[];
  countriesUnavailable?: boolean;
  settings?: RegistrationSettings;
  salutations?: SelectOption[];
  salutationsUnavailable?: boolean;
  birthYearMax?: number;
  companyOnly?: boolean;
  requestedGroupId?: string;
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
  settings = TEMPLATE_SHOP_SETTINGS.loginRegistration,
  salutations = [],
  salutationsUnavailable = false,
  birthYearMax = new Date().getFullYear(),
  companyOnly = false,
  requestedGroupId,
  redirectUrl = null,
}: RegistrationFormProps) {
  const router = useRouter();
  const { register } = useSessionActions();
  const { notify } = useCmsActions();
  const t = useTranslations();
  const contentLang = useContentLang();
  const localePath = useLocalePath();
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

  const showAccountTypeSelect =
    !companyOnly && settings.showAccountTypeSelection;
  const accountType: AccountType = companyOnly
    ? "business"
    : showAccountTypeSelect
      ? values.accountType
      : "private";
  const formValues: RegistrationValues =
    accountType === values.accountType ? values : { ...values, accountType };
  const business = accountType === "business";
  const selectedCountry =
    countries.find((country) => country.id === values.countryId) ?? null;
  const states = selectedCountry?.states ?? [];
  const countryHasStates = states.length > 0;
  const schemaOptions = { countryHasStates, settings, birthYearMax };
  const errors = validateRegistration(formValues, schemaOptions, t);
  const minLengthHint = (min: number) =>
    t("account.registration.minLengthHint", { min }, min);
  const accountTypeOptions = [
    { label: t("form.accountType.private"), value: "private" },
    { label: t("form.accountType.business"), value: "business" },
  ];
  const showAdditionalAddressLine =
    settings.showAdditionalAddressField1 ||
    settings.showAdditionalAddressField2;

  const errorFor = (field: RegistrationField) =>
    submitted || touched[field] ? errors[field] : undefined;

  const setField = <K extends RegistrationField>(
    field: K,
    value: RegistrationValues[K],
  ) => setValues((current) => ({ ...current, [field]: value }));

  const touch = (field: RegistrationField) => () =>
    setTouched((current) => ({ ...current, [field]: true }));

  const inputHandler =
    (field: TextField) =>
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
    formRef.current?.querySelector<HTMLElement>(FIRST_INVALID_FIELD)?.focus();
  }, [focusRequest]);

  function retryReferences() {
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
      Object.keys(validateRegistration(formValues, schemaOptions, t)).length
    ) {
      setFocusRequest((count) => count + 1);
      return;
    }

    setPending(true);
    try {
      const result = await register(
        toRegistrationInput(formValues, { settings, requestedGroupId }),
      );
      if (!result.ok) return;
      if (result.doubleOptIn) {
        setValues(initialValues(companyOnly));
        setTouched({});
        setSubmitted(false);
        setDoubleOptInCount((count) => count + 1);
        return;
      }
      const target = resolveRedirectFromSearch(
        window.location.search,
        redirectUrl,
      );
      startNavigation(() => {
        router.push(localePath(target));
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
            {t("account.messages.signUpSuccess")}
          </span>
        ) : null}
      </output>
      <div className="mb-6">
        <h2 id="sign-up-heading" className="text-2xl font-bold">
          {t("account.signUpHeader")}
        </h2>
        <p className="text-sm text-surface-on-surface-variant">
          {t("account.signUpSubHeader")}
        </p>
        <p className="mt-2 text-sm text-surface-on-surface-variant">
          {t("form.requiredFieldsNote")}
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
          {showAccountTypeSelect ? (
            <SelectField
              className="col-span-12"
              id="accountType"
              data-testid="registration-account-type-select"
              label={t("form.accountType.title")}
              options={accountTypeOptions}
              value={values.accountType}
              onChange={(event) =>
                setField("accountType", toAccountType(event.target.value))
              }
              onBlur={touch("accountType")}
              error={errorFor("accountType")}
            />
          ) : null}
          {settings.showSalutation || settings.showTitleField ? (
            <div className="col-span-12 grid grid-cols-12 gap-5">
              {settings.showSalutation ? (
                <div className="col-span-12 md:col-span-4">
                  <SelectField
                    id="salutation"
                    data-testid="registration-salutation-select"
                    label={t("form.salutation")}
                    placeholder={t("form.chooseSalutation")}
                    autoComplete="honorific-prefix"
                    optionsLang={contentLang}
                    options={salutations}
                    disabled={salutationsUnavailable}
                    value={values.salutationId}
                    onChange={inputHandler("salutationId")}
                    onBlur={touch("salutationId")}
                    error={
                      salutationsUnavailable
                        ? t("errors.message-default")
                        : errorFor("salutationId")
                    }
                  />
                  {salutationsUnavailable ? (
                    <BaseButton
                      variant="secondary"
                      size="small"
                      className="mt-2"
                      aria-busy={refreshing}
                      aria-describedby="salutation-error"
                      onClick={retryReferences}
                    >
                      {t("listing.retry")}
                    </BaseButton>
                  ) : null}
                </div>
              ) : null}
              {settings.showTitleField ? (
                <InputField
                  className="col-span-12 md:col-span-4"
                  id="title"
                  data-testid="registration-title-input"
                  label={t("form.title")}
                  autoComplete="honorific-prefix"
                  maxLength={REGISTRATION_MAX_LENGTHS.title}
                  value={values.title}
                  onChange={inputHandler("title")}
                  onBlur={touch("title")}
                  error={errorFor("title")}
                />
              ) : null}
            </div>
          ) : null}
          <InputField
            className="col-span-12 md:col-span-4"
            id="firstName"
            data-testid="registration-first-name-input"
            label={t("form.firstName")}
            hint={minLengthHint(REGISTRATION_MIN_LENGTHS.firstName)}
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
            label={t("form.lastName")}
            hint={minLengthHint(REGISTRATION_MIN_LENGTHS.lastName)}
            required
            autoComplete="family-name"
            value={values.lastName}
            onChange={inputHandler("lastName")}
            onBlur={touch("lastName")}
            error={errorFor("lastName")}
          />
          {settings.showBirthdayField ? (
            <BirthdayField
              className="col-span-12 md:col-span-8"
              testIdPrefix="registration-birthday"
              required={settings.birthdayFieldRequired}
              birthYearMax={birthYearMax}
              value={{
                day: values.birthdayDay,
                month: values.birthdayMonth,
                year: values.birthdayYear,
              }}
              errors={{
                day: errorFor("birthdayDay"),
                month: errorFor("birthdayMonth"),
                year: errorFor("birthdayYear"),
              }}
              onChange={(part, value) => setField(BIRTHDAY_FIELDS[part], value)}
              onBlur={(part) => touch(BIRTHDAY_FIELDS[part])()}
            />
          ) : null}
          <InputField
            className="col-span-12 md:col-span-6"
            id="emailAddress"
            data-testid="registration-email-input"
            type="email"
            label={t("form.email")}
            required
            autoComplete="email"
            value={values.email}
            onChange={inputHandler("email")}
            onBlur={touch("email")}
            error={errorFor("email")}
          />
          {settings.requireEmailConfirmation ? (
            <InputField
              className="col-span-12 md:col-span-6"
              id="emailConfirmation"
              data-testid="registration-email-confirmation-input"
              type="email"
              label={t("form.confirmEmail")}
              required
              autoComplete="email"
              value={values.emailConfirmation}
              onChange={inputHandler("emailConfirmation")}
              onBlur={touch("emailConfirmation")}
              error={errorFor("emailConfirmation")}
            />
          ) : null}
          <InputField
            className="col-span-12 md:col-span-4"
            id="password"
            data-testid="registration-password-input"
            type="password"
            label={t("form.password")}
            hint={
              settings.passwordMinLength > 0
                ? minLengthHint(settings.passwordMinLength)
                : undefined
            }
            required
            autoComplete="new-password"
            value={values.password}
            onChange={inputHandler("password")}
            onBlur={touch("password")}
            error={errorFor("password")}
          />
          {settings.requirePasswordConfirmation ? (
            <InputField
              className="col-span-12 md:col-span-4"
              id="passwordConfirmation"
              data-testid="registration-password-confirmation-input"
              type="password"
              label={t("account.registration.passwordConfirmation")}
              required
              autoComplete="new-password"
              value={values.passwordConfirmation}
              onChange={inputHandler("passwordConfirmation")}
              onBlur={touch("passwordConfirmation")}
              error={errorFor("passwordConfirmation")}
            />
          ) : null}
          {business ? (
            <InputField
              className="col-span-12 md:col-span-4"
              id="vatId"
              data-testid="registration-vatid-input"
              label={t("form.vatId")}
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
          {t("account.yourAddress")}
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
              label={t("form.company")}
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
            label={t("form.streetAddress")}
            hint={minLengthHint(REGISTRATION_MIN_LENGTHS.street)}
            required
            autoComplete={
              showAdditionalAddressLine ? "address-line1" : "street-address"
            }
            value={values.street}
            onChange={inputHandler("street")}
            onBlur={touch("street")}
            error={errorFor("street")}
          />
          {settings.showAdditionalAddressField1 ? (
            <InputField
              className="col-span-12 md:col-span-4"
              id="additionalAddressLine1"
              data-testid="registration-additional-address-line1-input"
              label={t("form.additionalAddressLine1")}
              required={settings.additionalAddressField1Required}
              autoComplete="address-line2"
              value={values.additionalAddressLine1}
              onChange={inputHandler("additionalAddressLine1")}
              onBlur={touch("additionalAddressLine1")}
              error={errorFor("additionalAddressLine1")}
            />
          ) : null}
          {settings.showAdditionalAddressField2 ? (
            <InputField
              className="col-span-12 md:col-span-4"
              id="additionalAddressLine2"
              data-testid="registration-additional-address-line2-input"
              label={t("form.additionalAddressLine2")}
              required={settings.additionalAddressField2Required}
              autoComplete="address-line3"
              value={values.additionalAddressLine2}
              onChange={inputHandler("additionalAddressLine2")}
              onBlur={touch("additionalAddressLine2")}
              error={errorFor("additionalAddressLine2")}
            />
          ) : null}
          <InputField
            className="col-span-12 md:col-span-4"
            id="zipcode"
            data-testid="registration-zipcode-input"
            label={t("form.postalCode")}
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
            label={t("form.city")}
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
                label={t("form.country")}
                placeholder={t("form.chooseCountry")}
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
                  onClick={retryReferences}
                >
                  {t("listing.retry")}
                </BaseButton>
              ) : null}
            </div>
            {countryHasStates ? (
              <SelectField
                className="w-full"
                id="state"
                data-testid="checkout-pi-state-input"
                label={t("form.state")}
                placeholder={t("form.chooseState")}
                required
                autoComplete="address-level1"
                optionsLang={contentLang}
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
          {settings.showPhoneNumberField ? (
            <InputField
              className="col-span-12 md:col-span-4"
              id="phoneNumber"
              data-testid="registration-phone-input"
              type="tel"
              label={t("form.phone")}
              required={settings.phoneNumberFieldRequired}
              autoComplete="tel"
              maxLength={REGISTRATION_MAX_LENGTHS.phoneNumber}
              value={values.phoneNumber}
              onChange={inputHandler("phoneNumber")}
              onBlur={touch("phoneNumber")}
              error={errorFor("phoneNumber")}
            />
          ) : null}
        </fieldset>
        {settings.requireDataProtectionCheckbox ? (
          <CheckboxField
            className="mb-5"
            id="acceptedDataProtection"
            data-testid="registration-data-protection-checkbox"
            label={t("form.privacyLabel")}
            required
            checked={values.acceptedDataProtection}
            onChange={(checked) => setField("acceptedDataProtection", checked)}
            onBlur={touch("acceptedDataProtection")}
            error={errorFor("acceptedDataProtection")}
          />
        ) : null}
        <div className="mb-5 text-right">
          <BaseButton
            type="submit"
            data-testid="registration-submit-button"
            aria-busy={busy}
            aria-disabled={busy || undefined}
            className="aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
          >
            {t("form.submit")}
          </BaseButton>
        </div>
      </form>
    </div>
  );
}
