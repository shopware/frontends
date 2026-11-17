"use client";

import { useId, useState } from "react";

import { withTranslationDefaults } from "../../translations";
import type { CmsTranslations } from "../../translations";
import {
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
    messages: {
      contactFormSuccess:
        "We have received your contact request and will process it as soon as possible.",
    },
  },
  errors: {} as Record<string, string>,
};

const DEFAULT_TITLE = "Contact";

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

const RULES: FormRules<ContactFormValues> = {
  firstName: [required, minLength(3)],
  lastName: [required, minLength(3)],
  email: [required, email],
  phone: [required, minLength(3)],
  subject: [required, minLength(3)],
  comment: [required, minLength(10)],
  checkbox: [required, isTrue],
};

export type SwContactFormProps = {
  title?: string;
  confirmationText?: string;
  salutations: SwFormSalutation[];
  navigationId?: string;
  translations?: CmsTranslations;
};

export function SwContactForm({
  title,
  confirmationText,
  salutations,
  navigationId,
  translations,
}: SwContactFormProps) {
  const t = withTranslationDefaults(translations, defaultTranslations);
  const idPrefix = useId();
  const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES);
  const { field, validateAll } = useFormValidation(values, RULES);
  const submit = useFormSubmit(
    validateAll,
    (actions) =>
      actions.submitContactForm({
        salutationId: values.salutationId,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        subject: values.subject,
        comment: values.comment,
        phone: values.phone,
        ...(navigationId ? { navigationId } : {}),
      }),
    t.errors,
  );

  const patch = (changes: Partial<ContactFormValues>) =>
    setValues((current) => ({ ...current, ...changes }));

  const text = (key: Exclude<keyof ContactFormValues, "checkbox">) => ({
    ...field(key),
    value: values[key],
    onChange: (value: string) => patch({ [key]: value }),
  });

  return (
    <FormShell
      {...submit}
      title={title || DEFAULT_TITLE}
      confirmation={confirmationText ?? t.form.messages.contactFormSuccess}
      submitLabel={t.form.submit}
    >
      <FormSalutationSelect
        id={`${idPrefix}salutation`}
        label={t.form.salutation}
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
        {...field("checkbox")}
        id={`${idPrefix}privacy`}
        legend={t.form.privacy}
        label={t.form.dataProtection}
        checked={values.checkbox}
        onChange={(checkbox) => patch({ checkbox })}
      />
    </FormShell>
  );
}
