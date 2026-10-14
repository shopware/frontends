"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";

import { useCmsActions } from "../../actions/CmsActionsContext";
import type {
  CmsContactFormEntityName,
  CmsContactFormInput,
  CmsContactFormResult,
} from "../../actions/CmsActionsContext";
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
    salutation: "Salutation",
    salutationPlaceholder: "Enter salutation...",
    firstName: "First name",
    firstNamePlaceholder: "Enter first name...",
    lastName: "Last name",
    lastNamePlaceholder: "Enter last name...",
    email: "Email address",
    emailPlaceholder: "Enter email address...",
    phone: "Phone number",
    phonePlaceholder: "Enter phone number...",
    subject: "Subject",
    subjectPlaceholder: "Enter subject...",
    comment: "Comment",
    commentPlaceholder: "Enter comment...",
    privacy: "Privacy",
    dataProtection: "I have read the data protection information.",
    submit: "Submit",
    requiredFieldsNote: "Fields marked with asterisks (*) are required.",
    messages: {
      contactFormSuccess:
        "We have received your contact request and will process it as soon as possible.",
    },
  },
};

const DEFAULT_TITLE = "Contact";

const INPUT_CLASS =
  "appearance-none relative block w-full px-3 py-2 border placeholder-surface-on-surface-variant text-surface-on-surface rounded-md focus:outline-hidden focus:ring-2 focus:ring-brand-primary focus:z-10 sm:text-sm";
const INPUT_ERROR_CLASS = "border-red-600 focus:border-red-600";
const INPUT_VALID_CLASS =
  "border-outline-outline-variant focus:border-brand-primary";
const ERROR_MESSAGE_CLASS =
  "pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300";

type ContactFormValues = {
  salutationId: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  comment: string;
  phone: string;
  checkbox: boolean;
};

type ContactField = keyof ContactFormValues;

const INITIAL_VALUES: ContactFormValues = {
  salutationId: "",
  firstName: "",
  lastName: "",
  email: "",
  subject: "",
  comment: "",
  phone: "",
  checkbox: false,
};

const FIELD_IDS: Record<ContactField, string> = {
  salutationId: "salutation",
  firstName: "first-name",
  lastName: "last-name",
  email: "email-address",
  phone: "phone",
  subject: "subject",
  comment: "comment",
  checkbox: "privacy",
};

const SERVER_FIELDS: readonly ContactField[] = [
  "salutationId",
  "firstName",
  "lastName",
  "email",
  "phone",
  "subject",
  "comment",
];

const RULES: FormRules<ContactFormValues> = {
  email: [required, email],
  firstName: [required, minLength(3)],
  lastName: [required, minLength(3)],
  phone: [required, minLength(3)],
  subject: [required, minLength(3)],
  comment: [required, minLength(10)],
  checkbox: [required, isTrue],
};

const RULES_WITH_SALUTATION: FormRules<ContactFormValues> = {
  salutationId: [required],
  ...RULES,
};

function contactRules(
  requireSalutation: boolean,
): FormRules<ContactFormValues> {
  return requireSalutation ? RULES_WITH_SALUTATION : RULES;
}

type FocusRequest = { target: "invalid" | "submit" };

function focusIfFocusWasLost(element: HTMLElement | null) {
  if (!element) return;
  const { activeElement, body } = element.ownerDocument;
  if (!activeElement || activeElement === body) element.focus();
}

export type SwContactFormProps = {
  title?: string;
  confirmationText?: string;
  salutations: SwFormSalutation[];
  navigationId?: string;
  entityName?: CmsContactFormEntityName;
  slotId?: string;
  translations?: CmsTranslations;
};

export function SwContactForm({
  title,
  confirmationText,
  salutations,
  navigationId,
  entityName,
  slotId,
  translations,
}: SwContactFormProps) {
  const t = withTranslationDefaults(translations, defaultTranslations);
  const idPrefix = useId();
  const actions = useCmsActions();
  const requireSalutation = salutations.length > 0;
  const [loading, setLoading] = useState(false);
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES);
  const [serverErrors, setServerErrors] = useState<
    FormServerErrors<ContactField>
  >(emptyFormServerErrors);
  const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(null);
  const inFlight = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const { isValid, touch, touchAll, hasError, errorMessage } =
    useFormValidation(values, contactRules(requireSalutation));

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

  const formTitle = title || DEFAULT_TITLE;

  const setValue = <KEY extends ContactField>(
    key: KEY,
    value: ContactFormValues[KEY],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
    setServerErrors((current) => withoutFieldError(current, key));
  };

  const fieldId = (key: ContactField) => `${idPrefix}${FIELD_IDS[key]}`;
  const errorId = (key: ContactField) => `${fieldId(key)}-error`;
  const fieldError = (key: ContactField) =>
    errorMessage(key) ?? serverErrors.fields[key];
  const isInvalid = (key: ContactField) =>
    hasError(key) || serverErrors.fields[key] !== undefined;

  const fieldA11y = (key: ContactField) => ({
    id: fieldId(key),
    "aria-invalid": isInvalid(key) || undefined,
    "aria-describedby": fieldError(key) ? errorId(key) : undefined,
  });

  const inputClass = (key: ContactField) =>
    cx(INPUT_CLASS, isInvalid(key) ? INPUT_ERROR_CLASS : INPUT_VALID_CLASS);

  const renderError = (key: ContactField) => {
    const message = fieldError(key);
    return message ? (
      <span id={errorId(key)} className={ERROR_MESSAGE_CLASS}>
        {message}
      </span>
    ) : null;
  };

  function contactFormInput(): CmsContactFormInput {
    return {
      salutationId: values.salutationId || undefined,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      subject: values.subject,
      comment: values.comment,
      phone: values.phone,
      ...(navigationId
        ? { navigationId, ...(entityName ? { entityName } : {}) }
        : {}),
      ...(slotId ? { slotId } : {}),
    };
  }

  function confirmationFor(result: CmsContactFormResult): string {
    return (
      result.successMessage?.trim() ||
      confirmationText?.trim() ||
      t.form.messages.contactFormSuccess
    );
  }

  async function invokeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    touchAll();
    if (!isValid) {
      setFocusRequest({ target: "invalid" });
      return;
    }
    inFlight.current = true;
    setLoading(true);
    setServerErrors(emptyFormServerErrors());
    try {
      const result = await actions.submitContactForm(contactFormInput());
      if (result.ok) {
        setSentMessage(confirmationFor(result));
        return;
      }
      const errors = splitFormViolations(result, SERVER_FIELDS);
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
      data-testid="cms-contact-form"
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
      {sentMessage === null ? (
        <>
          <p className="mb-5 text-sm text-surface-on-surface-variant">
            {t.form.requiredFieldsNote}
          </p>
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-4">
              <label htmlFor={fieldId("salutationId")}>
                {requireSalutation
                  ? `${t.form.salutation} *`
                  : t.form.salutation}
              </label>
              <select
                {...fieldA11y("salutationId")}
                name="salutation"
                aria-required={requireSalutation || undefined}
                value={values.salutationId}
                onChange={(event) =>
                  setValue("salutationId", event.target.value)
                }
                onBlur={() => touch("salutationId")}
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
            <div className="col-span-4">
              <label
                htmlFor={fieldId("firstName")}
              >{`${t.form.firstName} *`}</label>
              <input
                {...fieldA11y("firstName")}
                name="first-name"
                type="text"
                autoComplete="given-name"
                aria-required
                value={values.firstName}
                onChange={(event) => setValue("firstName", event.target.value)}
                onBlur={() => touch("firstName")}
                className={inputClass("firstName")}
                placeholder={t.form.firstNamePlaceholder}
              />
              {renderError("firstName")}
            </div>
            <div className="col-span-4">
              <label
                htmlFor={fieldId("lastName")}
              >{`${t.form.lastName} *`}</label>
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
            <div className="col-span-6">
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
            <div className="col-span-6">
              <label htmlFor={fieldId("phone")}>{`${t.form.phone} *`}</label>
              <input
                {...fieldA11y("phone")}
                name="phone"
                type="text"
                autoComplete="tel"
                aria-required
                value={values.phone}
                onChange={(event) => setValue("phone", event.target.value)}
                onBlur={() => touch("phone")}
                className={inputClass("phone")}
                placeholder={t.form.phonePlaceholder}
              />
              {renderError("phone")}
            </div>
            <div className="col-span-12">
              <label
                htmlFor={fieldId("subject")}
              >{`${t.form.subject} *`}</label>
              <input
                {...fieldA11y("subject")}
                name="subject"
                type="text"
                aria-required
                value={values.subject}
                onChange={(event) => setValue("subject", event.target.value)}
                onBlur={() => touch("subject")}
                className={inputClass("subject")}
                placeholder={t.form.subjectPlaceholder}
              />
              {renderError("subject")}
            </div>
            <div className="col-span-12">
              <label
                htmlFor={fieldId("comment")}
              >{`${t.form.comment} *`}</label>
              <textarea
                {...fieldA11y("comment")}
                name="comment"
                aria-required
                value={values.comment}
                onChange={(event) => setValue("comment", event.target.value)}
                onBlur={() => touch("comment")}
                className={inputClass("comment")}
                placeholder={t.form.commentPlaceholder}
                rows={5}
              />
              {renderError("comment")}
            </div>
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
                    {t.form.dataProtection}
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
              data-testid="cms-contact-form-submit"
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
          {sentMessage}
        </p>
      )}
    </form>
  );
}
