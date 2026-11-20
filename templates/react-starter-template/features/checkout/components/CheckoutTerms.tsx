"use client";

import type { ReactNode } from "react";

import { useTranslations } from "@/i18n/I18nProvider";

import type { LegalLinks } from "../checkoutSettings";
import type {
  CheckoutTermsErrors,
  CheckoutTermsField,
  CheckoutTermsRequirements,
  CheckoutTermsValues,
} from "../checkoutTerms";
import { linkedMessageText } from "../linkedMessage";
import { LinkedMessage } from "./LinkedMessage";

const CHECKBOX_CLASS =
  "mt-1 size-4 shrink-0 accent-brand-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline-outline-focus";

const FIELD_NAMES: Record<CheckoutTermsField, string> = {
  tos: "tos",
  revocation: "revocation",
  dataProtection: "data-protection",
};

export type CheckoutTermsProps = {
  values: CheckoutTermsValues;
  errors: CheckoutTermsErrors;
  requirements: CheckoutTermsRequirements;
  legalLinks: LegalLinks;
  onChange: (field: CheckoutTermsField, checked: boolean) => void;
};

type TermsRowProps = {
  field: CheckoutTermsField;
  checked: boolean;
  error?: string;
  accessibleName?: string;
  onChange: (field: CheckoutTermsField, checked: boolean) => void;
  children: ReactNode;
};

function TermsRow({
  field,
  checked,
  error,
  accessibleName,
  onChange,
  children,
}: TermsRowProps) {
  const name = FIELD_NAMES[field];
  const errorId = `${name}-error`;
  return (
    <div data-testid={`checkout-t&c-${name}`}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id={name}
          name={name}
          required
          checked={checked}
          onChange={(event) => onChange(field, event.target.checked)}
          data-testid={`checkout-t&c-checkbox-${name}`}
          aria-label={accessibleName}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={CHECKBOX_CLASS}
        />
        <label htmlFor={name} className="text-sm text-surface-on-surface">
          {children}
          <span aria-hidden="true" className="ml-0.5 text-states-error">
            *
          </span>
        </label>
      </div>
      {error ? (
        <p id={errorId} className="mt-1 ml-7 text-xs text-states-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function CheckoutTerms({
  values,
  errors,
  requirements,
  legalLinks,
  onChange,
}: CheckoutTermsProps) {
  const t = useTranslations();
  return (
    <fieldset data-testid="checkout-terms-box" className="mb-10 min-w-0">
      <legend className="mb-4 text-lg leading-normal font-bold text-surface-on-surface">
        {t("checkout.terms.heading")}
      </legend>
      <div className="flex flex-col gap-4">
        {legalLinks.revocation ? (
          <p className="text-sm text-surface-on-surface">
            <LinkedMessage
              messageKey="checkout.terms.revocationNotice"
              linkKey="checkout.terms.revocationLink"
              href={legalLinks.revocation}
            />
          </p>
        ) : null}
        <TermsRow
          field="tos"
          checked={values.tos}
          error={errors.tos}
          accessibleName={linkedMessageText(
            t,
            "checkout.terms.tosLabel",
            "checkout.terms.tosLink",
          )}
          onChange={onChange}
        >
          <LinkedMessage
            messageKey="checkout.terms.tosLabel"
            linkKey="checkout.terms.tosLink"
            href={legalLinks.terms}
          />
        </TermsRow>
        {requirements.revocation ? (
          <TermsRow
            field="revocation"
            checked={values.revocation}
            error={errors.revocation}
            onChange={onChange}
          >
            {t("checkout.terms.revocationLabel")}
          </TermsRow>
        ) : null}
        {requirements.dataProtection ? (
          <TermsRow
            field="dataProtection"
            checked={values.dataProtection}
            error={errors.dataProtection}
            onChange={onChange}
          >
            {t("form.privacyLabel")}
          </TermsRow>
        ) : null}
      </div>
    </fieldset>
  );
}
