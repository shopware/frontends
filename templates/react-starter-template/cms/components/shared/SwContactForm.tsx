"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";

import { useCmsActions } from "../../actions/CmsActionsContext";
import type {
  CmsContactFormEntityName,
  CmsContactFormInput,
  CmsContactFormResult,
} from "../../actions/CmsActionsContext";
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
  errors: {} as Record<string, string>,
};

const DEFAULT_TITLE = "Contact";

const SELECT_ERROR_CLASS =
  "appearance-none relative block w-full px-3 py-2 border placeholder-surface-on-surface-variant text-surface-on-surface rounded-md focus:outline-hidden focus:ring-2 focus:ring-brand-primary focus:z-10 sm:text-sm border-red-600 focus:border-red-600";

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
  firstName: [required, minLength(3)],
  lastName: [required, minLength(3)],
  email: [required, email],
  phone: [required, minLength(3)],
  subject: [required, minLength(3)],
  comment: [required, minLength(10)],
  checkbox: [required, isTrue],
};

const RULES_WITH_SALUTATION: FormRules<ContactFormValues> = {
  salutationId: [required],
  ...RULES,
};

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
  const { field, validateAll } = useFormValidation(
    values,
    requireSalutation ? RULES_WITH_SALUTATION : RULES,
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

  const patch = (key: ContactField, changes: Partial<ContactFormValues>) => {
    setValues((current) => ({ ...current, ...changes }));
    setServerErrors((current) => withoutFieldError(current, key));
  };

  const control = (key: ContactField) => {
    const state = field(key);
    return { ...state, error: state.error ?? serverErrors.fields[key] };
  };

  const text = (key: Exclude<ContactField, "checkbox" | "salutationId">) => ({
    ...control(key),
    value: values[key],
    onChange: (value: string) => patch(key, { [key]: value }),
  });

  const salutationId = `${idPrefix}salutation`;
  const { ref: salutationRef, ...salutation } = control("salutationId");

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
    if (inFlight.current || !validateAll()) return;
    inFlight.current = true;
    setLoading(true);
    setServerErrors(emptyFormServerErrors());
    try {
      const result = await actions.submitContactForm(contactFormInput());
      if (result.ok) {
        setSentMessage(confirmationFor(result));
        return;
      }
      const errors = result.violations?.length
        ? splitFormViolations(result, SERVER_FIELDS)
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
      <h3 className="pb-3 mb-10 border-b border-gray-300">
        {title || DEFAULT_TITLE}
      </h3>
      {sentMessage === null && (
        <>
          <p className="mb-5 text-sm text-surface-on-surface-variant">
            {t.form.requiredFieldsNote}
          </p>
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-4">
              <label htmlFor={salutationId}>
                {salutation.required
                  ? `${t.form.salutation} *`
                  : t.form.salutation}
              </label>
              <select
                id={salutationId}
                {...fieldAria(salutationId, salutation)}
                aria-required={salutation.required || undefined}
                ref={salutationRef}
                name="salutation"
                value={values.salutationId}
                onChange={(event) =>
                  patch("salutationId", { salutationId: event.target.value })
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
            <FormTextField
              {...text("email")}
              className="col-span-6"
              id={`${idPrefix}email-address`}
              name="email"
              type="email"
              autoComplete="email"
              label={t.form.email}
              placeholder={t.form.emailPlaceholder}
            />
            <FormTextField
              {...text("phone")}
              className="col-span-6"
              id={`${idPrefix}phone`}
              name="phone"
              autoComplete="tel"
              label={t.form.phone}
              placeholder={t.form.phonePlaceholder}
            />
            <FormTextField
              {...text("subject")}
              className="col-span-12"
              id={`${idPrefix}subject`}
              name="subject"
              label={t.form.subject}
              placeholder={t.form.subjectPlaceholder}
            />
            <FormTextField
              {...text("comment")}
              className="col-span-12"
              id={`${idPrefix}comment`}
              name="comment"
              label={t.form.comment}
              placeholder={t.form.commentPlaceholder}
              rows={5}
            />
            <FormPrivacyCheckbox
              {...control("checkbox")}
              id={`${idPrefix}privacy`}
              legend={t.form.privacy}
              label={t.form.dataProtection}
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
              data-testid="cms-contact-form-submit"
            >
              {t.form.submit}
            </button>
          </div>
        </>
      )}
      <div role="status">
        {sentMessage !== null && (
          <p
            ref={focusIfFocusWasLost}
            tabIndex={-1}
            data-testid="cms-form-success"
            className="py-10 text-lg text-center"
          >
            {sentMessage}
          </p>
        )}
      </div>
    </form>
  );
}
