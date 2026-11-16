"use client";

import { useId, useState } from "react";

import { withTranslationDefaults } from "../../translations";
import type { CmsTranslations } from "../../translations";
import {
  FORM_SELECT_CLASS,
  FormPrivacyCheckbox,
  FormSalutationSelect,
  FormShell,
  FormTextField,
  useFormSubmit,
} from "./formParts";
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
  errors: {} as Record<string, string>,
};

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
  const [values, setValues] = useState<NewsletterFormValues>(INITIAL_VALUES);
  const isSubscribe = values.option === "subscribe";
  const { field, validateAll } = useFormValidation(
    values,
    getRules(values.option),
  );
  const submit = useFormSubmit(
    validateAll,
    (actions) =>
      actions.subscribeNewsletter(
        isSubscribe
          ? {
              email: values.email,
              option: "subscribe",
              firstName: values.firstName,
              lastName: values.lastName,
              salutationId: values.salutationId || undefined,
            }
          : { email: values.email, option: "unsubscribe" },
      ),
    t.errors,
  );

  const patch = (changes: Partial<NewsletterFormValues>) =>
    setValues((current) => ({ ...current, ...changes }));

  const text = (key: "email" | "firstName" | "lastName") => ({
    ...field(key),
    value: values[key],
    onChange: (value: string) => patch({ [key]: value }),
  });

  return (
    <FormShell
      {...submit}
      title={
        title || (isSubscribe ? t.form.subscribeLabel : t.form.unsubscribeLabel)
      }
      confirmation={t.form.newsletterBenefits}
      submitLabel={t.form.submit}
    >
      <div className="col-span-12">
        <label htmlFor={`${idPrefix}option`}>{`${t.form.action} *`}</label>
        <select
          id={`${idPrefix}option`}
          name="option"
          value={values.option}
          onChange={(event) =>
            patch({ option: toNewsletterOption(event.target.value) })
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
          <FormSalutationSelect
            id={`${idPrefix}salutation`}
            label={`${t.form.salutation} *`}
            placeholder={t.form.salutationPlaceholder}
            salutations={salutations}
            value={values.salutationId}
            onChange={(salutationId) => patch({ salutationId })}
          />
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
        {...field("checkbox")}
        id={`${idPrefix}privacy`}
        legend={t.form.privacy}
        label={t.form.privacyLabel}
        checked={values.checkbox}
        onChange={(checkbox) => patch({ checkbox })}
      />
    </FormShell>
  );
}
