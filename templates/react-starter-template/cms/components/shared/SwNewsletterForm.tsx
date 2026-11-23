"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";

import { useCmsActions } from "../../actions/CmsActionsContext";
import type { CmsNewsletterResult } from "../../actions/CmsActionsContext";
import { withTranslationDefaults } from "../../translations";
import type { CmsTranslations } from "../../translations";
import { SpinnerIcon } from "../icons";
import {
  getActionFailureMessages,
  notifyActionError,
} from "./actionNotifications";
import {
  FORM_SELECT_CLASS,
  FormError,
  FormPrivacyCheckbox,
  FormTextField,
} from "./formParts";
import type { SwFormSalutation } from "./formSalutations";
import {
  emptyFormServerErrors,
  splitFormViolations,
  withoutFieldError,
} from "./formServerErrors";
import type { FormServerErrors } from "./formServerErrors";
import {
  email,
  fieldAria,
  isTrue,
  minLength,
  required,
} from "./formValidation";
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
  errors: {} as Record<string, string>,
};

const SELECT_ERROR_CLASS =
  "appearance-none relative block w-full px-3 py-2 border placeholder-surface-on-surface-variant text-surface-on-surface rounded-md focus:outline-hidden focus:ring-2 focus:ring-brand-primary focus:z-10 sm:text-sm border-red-600 focus:border-red-600";

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

const SERVER_FIELDS: Record<NewsletterOption, readonly NewsletterField[]> = {
  subscribe: ["email", "salutationId", "firstName", "lastName"],
  unsubscribe: ["email"],
};

const NAME_RULES = [required, minLength(3)];

function getRules(option: NewsletterOption): FormRules<NewsletterFormValues> {
  return {
    email: [required, email],
    ...(option === "subscribe"
      ? { firstName: NAME_RULES, lastName: NAME_RULES }
      : {}),
    checkbox: [required, isTrue],
  };
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
  const isSubscribe = values.option === "subscribe";
  const { field, validateAll } = useFormValidation(
    values,
    getRules(values.option),
  );

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

  const patch = (
    key: NewsletterField,
    changes: Partial<NewsletterFormValues>,
  ) => {
    setValues((current) => ({ ...current, ...changes }));
    setServerErrors((current) => withoutFieldError(current, key));
  };

  const changeOption = (option: NewsletterOption) => {
    setValues((current) => ({ ...current, option }));
    setServerErrors(emptyFormServerErrors());
  };

  const control = (key: NewsletterField) => {
    const state = field(key);
    return { ...state, error: state.error ?? serverErrors.fields[key] };
  };

  const text = (key: "email" | "firstName" | "lastName") => ({
    ...control(key),
    value: values[key],
    onChange: (value: string) => patch(key, { [key]: value }),
  });

  const salutationId = `${idPrefix}salutation`;
  const { ref: salutationRef, ...salutation } = control("salutationId");

  function successCopy({ option, status }: SentState): string {
    if (option === "unsubscribe") return t.form.messages.newsletterUnsubscribed;
    if (status === "notSet") return t.form.messages.newsletterConfirmationSent;
    return t.form.newsletterBenefits;
  }

  async function invokeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || !validateAll()) return;
    const option = values.option;
    inFlight.current = true;
    setLoading(true);
    setServerErrors(emptyFormServerErrors());
    try {
      const result = await actions.subscribeNewsletter(
        option === "subscribe"
          ? {
              email: values.email,
              option: "subscribe",
              firstName: values.firstName,
              lastName: values.lastName,
              salutationId: values.salutationId || undefined,
            }
          : { email: values.email, option: "unsubscribe" },
      );
      if (result.ok) {
        setSent({ option, status: result.status });
        return;
      }
      const errors = result.violations?.length
        ? splitFormViolations(result, SERVER_FIELDS[option])
        : {
            fields: {},
            form: getActionFailureMessages(result, { messages: t.errors }),
          };
      setServerErrors(errors);
      setFocusRequest({
        target: Object.keys(errors.fields).length ? "invalid" : "submit",
      });
    } catch (error) {
      notifyActionError(actions, error, { messages: t.errors });
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
      <h3 className="pb-3 mb-10 border-b border-gray-300">
        {title ||
          (isSubscribe ? t.form.subscribeLabel : t.form.unsubscribeLabel)}
      </h3>
      {sent === null && (
        <>
          <p className="mb-5 text-sm text-surface-on-surface-variant">
            {t.form.requiredFieldsNote}
          </p>
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
                  changeOption(toNewsletterOption(event.target.value))
                }
                className={FORM_SELECT_CLASS}
              >
                <option value="subscribe">{t.form.subscribeLabel}</option>
                <option value="unsubscribe">{t.form.unsubscribeLabel}</option>
              </select>
            </div>
            <FormTextField
              {...text("email")}
              className="col-span-12"
              id={`${idPrefix}email-address`}
              name="email"
              type="email"
              autoComplete="email"
              label={t.form.email}
              placeholder={t.form.emailPlaceholder}
            />
            {isSubscribe && (
              <>
                <div className="col-span-4">
                  <label htmlFor={salutationId}>{t.form.salutation}</label>
                  <select
                    id={salutationId}
                    {...fieldAria(salutationId, salutation)}
                    aria-required={salutation.required || undefined}
                    ref={salutationRef}
                    name="salutation"
                    value={values.salutationId}
                    onChange={(event) =>
                      patch("salutationId", {
                        salutationId: event.target.value,
                      })
                    }
                    onBlur={salutation.onBlur}
                    className={
                      salutation.error ? SELECT_ERROR_CLASS : FORM_SELECT_CLASS
                    }
                  >
                    <option disabled value="">
                      {t.form.salutationPlaceholder}
                    </option>
                    {salutations.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.displayName}
                      </option>
                    ))}
                  </select>
                  <FormError id={salutationId} error={salutation.error} />
                </div>
                <FormTextField
                  {...text("firstName")}
                  className="col-span-4"
                  id={`${idPrefix}first-name`}
                  name="first-name"
                  autoComplete="given-name"
                  label={t.form.firstName}
                  placeholder={t.form.firstNamePlaceholder}
                />
                <FormTextField
                  {...text("lastName")}
                  className="col-span-4"
                  id={`${idPrefix}last-name`}
                  name="last-name"
                  autoComplete="family-name"
                  label={t.form.lastName}
                  placeholder={t.form.lastNamePlaceholder}
                />
              </>
            )}
            <FormPrivacyCheckbox
              {...control("checkbox")}
              id={`${idPrefix}privacy`}
              legend={t.form.privacy}
              label={t.form.privacyLabel}
              checked={values.checkbox}
              onChange={(checkbox) => patch("checkbox", { checkbox })}
            />
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
      )}
      <div role="status">
        {sent !== null && (
          <p
            ref={focusIfFocusWasLost}
            tabIndex={-1}
            data-testid="cms-form-success"
            className="py-10 text-lg text-center"
          >
            {successCopy(sent)}
          </p>
        )}
      </div>
    </form>
  );
}
