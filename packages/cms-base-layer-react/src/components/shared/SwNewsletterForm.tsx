"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";

import { useCmsActions } from "../../actions/CmsActionsContext";
import type { CmsNewsletterResult } from "../../actions/CmsActionsContext";
import { cx } from "../../helpers/cx";
import { withTranslationDefaults } from "../../translations";
import type { CmsTranslations } from "../../translations";
import { SpinnerIcon } from "../icons";
import type { SwFormSalutation } from "./formSalutations";
import {
  emptyFormServerErrors,
  splitFormViolations,
  withoutFieldError,
} from "./formServerErrors";
import type { FormServerErrors } from "./formServerErrors";
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
    requiredFieldsNote: "Fields marked with asterisks (*) are required.",
    newsletterBenefits:
      "Be aware of upcoming sales and events.Receive gifts and special offers!",
    messages: {
      newsletterConfirmationSent:
        "Thank you! Please confirm your subscription with the link in the email we have just sent you.",
      newsletterUnsubscribed: "You have unsubscribed from the newsletter.",
    },
  },
};

const INPUT_CLASS =
  "appearance-none relative block w-full px-3 py-2 border placeholder-surface-on-surface-variant text-surface-on-surface rounded-md focus:outline-hidden focus:ring-2 focus:ring-brand-primary focus:z-10 sm:text-sm";
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

type NewsletterField = keyof NewsletterFormValues;

const INITIAL_VALUES: NewsletterFormValues = {
  option: "subscribe",
  salutationId: "",
  firstName: "",
  lastName: "",
  email: "",
  checkbox: false,
};

const FIELD_IDS: Record<NewsletterField, string> = {
  option: "option",
  email: "email-address",
  salutationId: "salutation",
  firstName: "first-name",
  lastName: "last-name",
  checkbox: "privacy",
};

const SERVER_FIELDS: Record<NewsletterOption, readonly NewsletterField[]> = {
  subscribe: ["email", "salutationId", "firstName", "lastName"],
  unsubscribe: ["email"],
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

type SentState = {
  option: NewsletterOption;
  status: CmsNewsletterResult["status"];
};

type FocusRequest = { target: "invalid" | "submit" };

function focusIfFocusWasLost(element: HTMLElement | null) {
  if (!element) return;
  const { activeElement, body } = element.ownerDocument;
  if (!activeElement || activeElement === body) element.focus();
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
  const [sent, setSent] = useState<SentState | null>(null);
  const [values, setValues] = useState<NewsletterFormValues>(INITIAL_VALUES);
  const [serverErrors, setServerErrors] = useState<
    FormServerErrors<NewsletterField>
  >(emptyFormServerErrors);
  const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(null);
  const inFlight = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const { isValid, touch, touchAll, hasError, errorMessage } =
    useFormValidation(values, getRules(values.option));

  useEffect(() => {
    if (!focusRequest) return;
    if (focusRequest.target === "submit") {
      focusIfFocusWasLost(submitRef.current);
      return;
    }
    formRef.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus();
  }, [focusRequest]);

  const subscriptionOptions: { label: string; value: NewsletterOption }[] = [
    { label: t.form.subscribeLabel, value: "subscribe" },
    { label: t.form.unsubscribeLabel, value: "unsubscribe" },
  ];

  const isSubscribe = values.option === "subscribe";
  const formTitle =
    title || (isSubscribe ? t.form.subscribeLabel : t.form.unsubscribeLabel);

  const setValue = <KEY extends NewsletterField>(
    key: KEY,
    value: NewsletterFormValues[KEY],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
    setServerErrors((current) => withoutFieldError(current, key));
  };

  const changeOption = (option: NewsletterOption) => {
    setValues((current) => ({ ...current, option }));
    setServerErrors(emptyFormServerErrors());
  };

  const fieldId = (key: NewsletterField) => `${idPrefix}${FIELD_IDS[key]}`;
  const errorId = (key: NewsletterField) => `${fieldId(key)}-error`;
  const fieldError = (key: NewsletterField) =>
    errorMessage(key) ?? serverErrors.fields[key];
  const isInvalid = (key: NewsletterField) =>
    hasError(key) || serverErrors.fields[key] !== undefined;

  const fieldA11y = (key: NewsletterField) => ({
    id: fieldId(key),
    "aria-invalid": isInvalid(key) || undefined,
    "aria-describedby": fieldError(key) ? errorId(key) : undefined,
  });

  const inputClass = (key: NewsletterField) =>
    cx(INPUT_CLASS, isInvalid(key) ? INPUT_ERROR_CLASS : INPUT_VALID_CLASS);

  const renderError = (key: NewsletterField) => {
    const message = fieldError(key);
    return message ? (
      <span id={errorId(key)} className={ERROR_MESSAGE_CLASS}>
        {message}
      </span>
    ) : null;
  };

  function successCopy({ option, status }: SentState): string {
    if (option === "unsubscribe") return t.form.messages.newsletterUnsubscribed;
    if (status === "notSet") return t.form.messages.newsletterConfirmationSent;
    return t.form.newsletterBenefits;
  }

  async function invokeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    touchAll();
    if (!isValid) {
      setFocusRequest({ target: "invalid" });
      return;
    }
    const option = values.option;
    inFlight.current = true;
    setLoading(true);
    setServerErrors(emptyFormServerErrors());
    try {
      const result =
        option === "subscribe"
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
        setSent({ option, status: result.status });
        return;
      }
      const errors = splitFormViolations(result, SERVER_FIELDS[option]);
      setServerErrors(errors);
      setFocusRequest({
        target: Object.keys(errors.fields).length ? "invalid" : "submit",
      });
    } catch (error) {
      actions.notify({
        type: "error",
        message: error instanceof Error ? error.message : String(error),
      });
      setFocusRequest({ target: "submit" });
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }

  return (
    <form
      ref={formRef}
      className="w-full relative"
      noValidate
      aria-busy={loading || undefined}
      data-testid="cms-newsletter-form"
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
      {sent === null ? (
        <>
          <p className="mb-5 text-sm text-surface-on-surface-variant">
            {t.form.requiredFieldsNote}
          </p>
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12">
              <label htmlFor={fieldId("option")}>{`${t.form.action} *`}</label>
              <select
                id={fieldId("option")}
                name="option"
                value={values.option}
                onChange={(event) =>
                  changeOption(toNewsletterOption(event.target.value))
                }
                className={cx(INPUT_CLASS, INPUT_VALID_CLASS)}
              >
                {subscriptionOptions.map((subscription) => (
                  <option key={subscription.value} value={subscription.value}>
                    {subscription.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-12">
              <label htmlFor={fieldId("email")}>{`${t.form.email} *`}</label>
              <input
                {...fieldA11y("email")}
                name="email"
                type="email"
                autoComplete="email"
                aria-required
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
                <label htmlFor={fieldId("salutationId")}>
                  {t.form.salutation}
                </label>
                <select
                  {...fieldA11y("salutationId")}
                  name="salutation"
                  value={values.salutationId}
                  onChange={(event) =>
                    setValue("salutationId", event.target.value)
                  }
                  className={inputClass("salutationId")}
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
                {renderError("salutationId")}
              </div>
            )}
            {isSubscribe && (
              <div className="col-span-4">
                <label htmlFor={fieldId("firstName")}>
                  {`${t.form.firstName} *`}
                </label>
                <input
                  {...fieldA11y("firstName")}
                  name="first-name"
                  type="text"
                  autoComplete="given-name"
                  aria-required
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
                <label htmlFor={fieldId("lastName")}>
                  {`${t.form.lastName} *`}
                </label>
                <input
                  {...fieldA11y("lastName")}
                  name="last-name"
                  type="text"
                  autoComplete="family-name"
                  aria-required
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
                  {...fieldA11y("checkbox")}
                  name="privacy"
                  type="checkbox"
                  aria-required
                  checked={values.checkbox}
                  onChange={(event) =>
                    setValue("checkbox", event.target.checked)
                  }
                  className={cx(
                    "mt-1 focus:outline-2 focus:outline-offset-2 focus:outline-brand-primary h-4 w-4 border text-brand-primary rounded",
                    isInvalid("checkbox")
                      ? "border-red-600"
                      : "border-gray-300",
                  )}
                />
                <div>
                  <label
                    className={
                      isInvalid("checkbox") ? "text-red-600" : undefined
                    }
                    htmlFor={fieldId("checkbox")}
                  >
                    {t.form.privacyLabel}
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
          {serverErrors.form.length ? (
            <div
              role="alert"
              data-testid="cms-form-error"
              className="mt-5 p-3 border border-states-error rounded-md"
            >
              {serverErrors.form.map((message) => (
                <p key={message} className="text-sm text-states-error">
                  {message}
                </p>
              ))}
            </div>
          ) : null}
          <div className="flex justify-end mt-10">
            <button
              ref={submitRef}
              className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-primary-hover focus:outline-hidden focus:ring-2 focus:ring-brand-primary disabled:opacity-75"
              type="submit"
              disabled={loading}
              data-testid="cms-newsletter-form-submit"
            >
              {t.form.submit}
            </button>
          </div>
        </>
      ) : (
        <p
          ref={focusIfFocusWasLost}
          tabIndex={-1}
          data-testid="cms-form-success"
          className="py-10 text-lg text-center"
        >
          {successCopy(sent)}
        </p>
      )}
    </form>
  );
}
