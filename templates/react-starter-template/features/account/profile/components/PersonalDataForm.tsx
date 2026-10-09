"use client";

import {
  BaseButton,
  useCmsActions,
} from "@shopware/cms-base-layer-react/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import type { ChangeEvent, FormEvent } from "react";

import type { Schemas } from "#shopware";
import { InputField } from "@/components/form/InputField";
import { SelectField } from "@/components/form/SelectField";
import { useCustomer } from "@/features/account/customer/useCustomer";
import type { AccountType } from "@/features/account/registrationSchema";
import { resolveApiErrorMessages } from "@/features/session/apiErrors";
import { useSessionActions } from "@/features/session/components/SessionActionsContext";
import { useShopwareClient } from "@/features/storefront/components/ShopwareClientContext";
import { useContentLang } from "@/i18n/ContentLanguageProvider";
import { useTranslations } from "@/i18n/I18nProvider";
import type { SalutationOption } from "@/platform/shopware/reads/salutations";

import { changeProfile } from "../profileApi";
import {
  personalDataFromCustomer,
  toChangeProfileBody,
  validatePersonalData,
} from "../profileSchemas";
import type { PersonalDataField, PersonalDataValues } from "../profileSchemas";
import { CustomerUnavailable } from "./CustomerUnavailable";
import { PersonalDataFormSkeleton } from "./PersonalDataFormSkeleton";

type Touched = Partial<Record<PersonalDataField, boolean>>;

export type PersonalDataFormProps = {
  salutations: SalutationOption[];
  salutationsUnavailable?: boolean;
};

function toAccountType(value: string): AccountType {
  return value === "business" ? "business" : "private";
}

export function PersonalDataForm(props: PersonalDataFormProps) {
  const { status, customer, refresh } = useCustomer();

  if (!customer) {
    if (status === "error") return <CustomerUnavailable onRetry={refresh} />;
    return <PersonalDataFormSkeleton />;
  }

  return (
    <PersonalDataFields key={customer.id} customer={customer} {...props} />
  );
}

function PersonalDataFields({
  customer,
  salutations,
  salutationsUnavailable = false,
}: PersonalDataFormProps & { customer: Schemas["Customer"] }) {
  const router = useRouter();
  const getClient = useShopwareClient();
  const { refresh } = useCustomer();
  const { refreshSession } = useSessionActions();
  const { notify } = useCmsActions();
  const t = useTranslations();
  const contentLang = useContentLang();
  const accountTypeOptions = [
    { label: t("form.accountType.private"), value: "private" },
    { label: t("form.accountType.business"), value: "business" },
  ];
  const [values, setValues] = useState<PersonalDataValues>(() =>
    personalDataFromCustomer(customer),
  );
  const [touched, setTouched] = useState<Touched>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [refreshing, startRefresh] = useTransition();
  const [focusRequest, setFocusRequest] = useState(0);
  const inFlight = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  const business = values.accountType === "business";
  const errors = validatePersonalData(values, t);
  const errorFor = (field: PersonalDataField) =>
    submitted || touched[field] ? errors[field] : undefined;

  const setField = <K extends PersonalDataField>(
    field: K,
    value: PersonalDataValues[K],
  ) => setValues((current) => ({ ...current, [field]: value }));

  const touch = (field: PersonalDataField) => () =>
    setTouched((current) => ({ ...current, [field]: true }));

  const inputHandler =
    (field: Exclude<PersonalDataField, "accountType">) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setField(field, event.target.value);

  useEffect(() => {
    if (focusRequest === 0) return;
    formRef.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"]:not(:disabled)')
      ?.focus();
  }, [focusRequest]);

  function retrySalutations() {
    if (refreshing) return;
    startRefresh(() => {
      router.refresh();
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    setSubmitted(true);
    if (Object.keys(validatePersonalData(values, t)).length) {
      setFocusRequest((count) => count + 1);
      return;
    }

    inFlight.current = true;
    setPending(true);
    try {
      try {
        await changeProfile(await getClient(), toChangeProfileBody(values));
      } catch (error) {
        for (const message of resolveApiErrorMessages(error, t)) {
          notify({ type: "error", message });
        }
        return;
      }
      notify({
        type: "success",
        message: t("account.profile.form.successUpdate"),
      });
      await Promise.all([refresh(), refreshSession()]);
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return (
    <form
      ref={formRef}
      className="flex flex-col gap-4"
      data-testid="account-personal-data-form"
      noValidate
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <div className="w-60">
        <SelectField
          id="salutation"
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
            onClick={retrySalutations}
          >
            {t("listing.retry")}
          </BaseButton>
        ) : null}
      </div>
      <div className="w-60">
        <SelectField
          id="accountType"
          label={t("form.accountType.title")}
          options={accountTypeOptions}
          value={values.accountType}
          onChange={(event) =>
            setField("accountType", toAccountType(event.target.value))
          }
          onBlur={touch("accountType")}
          error={errorFor("accountType")}
        />
      </div>
      <div className="flex flex-col gap-2 md:flex-row">
        <InputField
          className="w-full"
          id="firstName"
          data-testid="account-personal-data-firstname-input"
          label={t("account.profile.form.firstName")}
          required
          autoComplete="given-name"
          value={values.firstName}
          onChange={inputHandler("firstName")}
          onBlur={touch("firstName")}
          error={errorFor("firstName")}
        />
        <InputField
          className="w-full"
          id="lastName"
          data-testid="account-personal-data-lastname-input"
          label={t("account.profile.form.lastName")}
          required
          autoComplete="family-name"
          value={values.lastName}
          onChange={inputHandler("lastName")}
          onBlur={touch("lastName")}
          error={errorFor("lastName")}
        />
      </div>
      {business ? (
        <div className="flex flex-col gap-2 md:flex-row">
          <InputField
            className="w-full"
            id="company"
            label={t("account.profile.form.company")}
            required
            autoComplete="organization"
            value={values.company}
            onChange={inputHandler("company")}
            onBlur={touch("company")}
            error={errorFor("company")}
          />
          <InputField
            className="w-full"
            id="vatIds"
            label={t("account.profile.form.vatIds")}
            required
            value={values.vatIds}
            onChange={inputHandler("vatIds")}
            onBlur={touch("vatIds")}
            error={errorFor("vatIds")}
          />
        </div>
      ) : null}
      <BaseButton
        type="submit"
        data-testid="account-personal-data-submit-button"
        aria-busy={pending}
        aria-disabled={pending || undefined}
        className="aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
      >
        {t("account.profile.form.buttonSubmit")}
      </BaseButton>
    </form>
  );
}
