"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";

import { useCmsActions } from "../../actions/CmsActionsContext";
import { cx } from "../../helpers/cx";
import { withTranslationDefaults } from "../../translations";
import type { CmsTranslations } from "../../translations";
import { SpinnerIcon } from "../icons";
import type { SwFormSalutation } from "./formSalutations";
import { email, isTrue, minLength, required } from "./formValidation";
import type { FormRules } from "./formValidation";
import { useFormValidation } from "./useFormValidation";

const defaultTranslations = {
  form: {
    subscribeLabel: "Subscribe to newsletter",
    unsubscribeLabel: "Unsubscribe from newsletter",
    action: "Action",
    email: "Email address",
    emailPlaceholder: "Enter email address...",
    salutation: "Salutation",
    salutationPlaceholder: "Enter salutation...",
    firstName: "First name",
    firstNamePlaceholder: "Enter first name...",
    lastName: "Last name",
    lastNamePlaceholder: "Enter last name...",
    privacy: "Privacy",
    privacyLabel: "I have read the data protection information.",
    submit: "Submit",
    newsletterBenefits:
      "Be aware of upcoming sales and events.Receive gifts and special offers!",
  },
};

const INPUT_CLASS =
  "appearance-none relative block w-full px-3 py-2 border placeholder-surface-on-surface-variant text-surface-on-surface rounded-md focus:outline-hidden focus:ring-brand-primary focus:z-10 sm:text-sm";
const INPUT_ERROR_CLASS = "border-red-600 focus:border-red-600";
const INPUT_VALID_CLASS =
  "border-outline-outline-variant focus:border-brand-primary";
const ERROR_MESSAGE_CLASS =
  "pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300";

type NewsletterOption = "subscribe" | "unsubscribe";

type NewsletterFormValues = {
  option: NewsletterOption;
  salutationId: string;
  firstName: string;
  lastName: string;
  email: string;
  checkbox: boolean;
};

const INITIAL_VALUES: NewsletterFormValues = {
  option: "subscribe",
  salutationId: "",
  firstName: "",
  lastName: "",
  email: "",
  checkbox: false,
};

function getRules(option: NewsletterOption): FormRules<NewsletterFormValues> {
  const rules: FormRules<NewsletterFormValues> = {
    email: [required, email],
    checkbox: [required, isTrue],
  };
  if (option === "subscribe") {
    rules.firstName = [required, minLength(3)];
    rules.lastName = [required, minLength(3)];
  }
  return rules;
}

function toNewsletterOption(value: string): NewsletterOption {
  return value === "unsubscribe" ? "unsubscribe" : "subscribe";
}

export type SwNewsletterFormProps = {
  title?: string;
  salutations: SwFormSalutation[];
  translations?: CmsTranslations;
};

export function SwNewsletterForm({
  title,
  salutations,
  translations,
}: SwNewsletterFormProps) {
  const t = withTranslationDefaults(translations, defaultTranslations);
  const idPrefix = useId();
  const actions = useCmsActions();
  const [loading, setLoading] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [values, setValues] = useState<NewsletterFormValues>(INITIAL_VALUES);
  const { isValid, touch, touchAll, hasError, errorMessage } =
    useFormValidation(values, getRules(values.option));

  const subscriptionOptions: { label: string; value: NewsletterOption }[] = [
    { label: t.form.subscribeLabel, value: "subscribe" },
    { label: t.form.unsubscribeLabel, value: "unsubscribe" },
  ];

  const isSubscribe = values.option === "subscribe";
  const formTitle =
    title || (isSubscribe ? t.form.subscribeLabel : t.form.unsubscribeLabel);

  const setValue = <KEY extends keyof NewsletterFormValues>(
    key: KEY,
    value: NewsletterFormValues[KEY],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const inputClass = (key: keyof NewsletterFormValues) =>
    cx(INPUT_CLASS, hasError(key) ? INPUT_ERROR_CLASS : INPUT_VALID_CLASS);

  const renderError = (key: keyof NewsletterFormValues) => {
    const message = errorMessage(key);
    return message ? (
      <span className={ERROR_MESSAGE_CLASS}>{message}</span>
    ) : null;
  };

  async function invokeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    touchAll();
    if (!isValid) return;
    setLoading(true);
    try {
      const result = isSubscribe
        ? await actions.subscribeNewsletter({
            email: values.email,
            option: "subscribe",
            firstName: values.firstName,
            lastName: values.lastName,
            salutationId: values.salutationId || undefined,
          })
        : await actions.subscribeNewsletter({
            email: values.email,
            option: "unsubscribe",
          });
      if (result.ok) {
        setFormSent(true);
        return;
      }
      if (result.message) {
        actions.notify({ type: "error", message: result.message });
      }
    } catch (error) {
      actions.notify({
        type: "error",
        message: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="w-full relative"
      onSubmit={(event) => {
        void invokeSubmit(event);
      }}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/50">
          <SpinnerIcon className="h-15 w-15 animate-spin text-gray-500" />
        </div>
      )}
      <h3 className="pb-3 mb-10 border-b border-gray-300">{formTitle}</h3>
      {!formSent ? (
        <>
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12">
              <label
                htmlFor={`${idPrefix}option`}
              >{`${t.form.action} *`}</label>
              <select
                id={`${idPrefix}option`}
                name="option"
                value={values.option}
                onChange={(event) =>
                  setValue("option", toNewsletterOption(event.target.value))
                }
                className="appearance-none relative block w-full px-3 py-2 border border-outline-outline-variant placeholder-surface-on-surface-variant text-surface-on-surface rounded-md focus:border-brand-primary focus:outline-hidden focus:ring-brand-primary focus:z-10 sm:text-sm"
              >
                {subscriptionOptions.map((subscription) => (
                  <option key={subscription.value} value={subscription.value}>
                    {subscription.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-12">
              <label htmlFor={`${idPrefix}email-address`}>
                {`${t.form.email} *`}
              </label>
              <input
                id={`${idPrefix}email-address`}
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(event) => setValue("email", event.target.value)}
                onBlur={() => touch("email")}
                className={inputClass("email")}
                placeholder={t.form.emailPlaceholder}
              />
              {renderError("email")}
            </div>
            {isSubscribe && (
              <div className="col-span-4">
                <label htmlFor={`${idPrefix}salutation`}>
                  {`${t.form.salutation} *`}
                </label>
                <select
                  id={`${idPrefix}salutation`}
                  name="salutation"
                  value={values.salutationId}
                  onChange={(event) =>
                    setValue("salutationId", event.target.value)
                  }
                  className="border-outline-outline-variant focus:border-brand-primary appearance-none relative block w-full px-3 py-2 border placeholder-surface-on-surface-variant text-surface-on-surface rounded-md focus:outline-hidden focus:ring-brand-primary focus:z-10 sm:text-sm"
                >
                  <option disabled value="">
                    {t.form.salutationPlaceholder}
                  </option>
                  {salutations.map((salutation) => (
                    <option key={salutation.id} value={salutation.id}>
                      {salutation.displayName}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {isSubscribe && (
              <div className="col-span-4">
                <label htmlFor={`${idPrefix}first-name`}>
                  {`${t.form.firstName} *`}
                </label>
                <input
                  id={`${idPrefix}first-name`}
                  name="first-name"
                  type="text"
                  autoComplete="given-name"
                  value={values.firstName}
                  onChange={(event) =>
                    setValue("firstName", event.target.value)
                  }
                  onBlur={() => touch("firstName")}
                  className={inputClass("firstName")}
                  placeholder={t.form.firstNamePlaceholder}
                />
                {renderError("firstName")}
              </div>
            )}
            {isSubscribe && (
              <div className="col-span-4">
                <label htmlFor={`${idPrefix}last-name`}>
                  {`${t.form.lastName} *`}
                </label>
                <input
                  id={`${idPrefix}last-name`}
                  name="last-name"
                  type="text"
                  autoComplete="family-name"
                  value={values.lastName}
                  onChange={(event) => setValue("lastName", event.target.value)}
                  onBlur={() => touch("lastName")}
                  className={inputClass("lastName")}
                  placeholder={t.form.lastNamePlaceholder}
                />
                {renderError("lastName")}
              </div>
            )}
            <fieldset className="col-span-12">
              <legend>{`${t.form.privacy} *`}</legend>
              <div className="flex gap-3 items-start">
                <input
                  id={`${idPrefix}privacy`}
                  name="privacy"
                  type="checkbox"
                  checked={values.checkbox}
                  onChange={(event) =>
                    setValue("checkbox", event.target.checked)
                  }
                  className={cx(
                    "mt-1 focus:ring-brand-primary h-4 w-4 border text-brand-primary rounded",
                    hasError("checkbox") ? "border-red-600" : "border-gray-300",
                  )}
                />
                <div>
                  <label
                    className={
                      hasError("checkbox") ? "text-red-600" : undefined
                    }
                    htmlFor={`${idPrefix}privacy`}
                  >
                    {t.form.privacyLabel}
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
          <div className="flex justify-end mt-10">
            <button
              className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-primary-hover focus:outline-hidden focus:ring-2 focus:ring-brand-primary disabled:opacity-75"
              type="submit"
            >
              {t.form.submit}
            </button>
          </div>
        </>
      ) : (
        <p className="py-10 text-lg text-center">{t.form.newsletterBenefits}</p>
      )}
    </form>
  );
}
