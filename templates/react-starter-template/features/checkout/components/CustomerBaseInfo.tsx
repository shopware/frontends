"use client";

import { useEffect, useRef } from "react";

import { InputField } from "@/components/form/InputField";
import { useTranslations } from "@/i18n/I18nProvider";

import type { CheckoutErrors, CheckoutField } from "../checkoutSchema";
import { PlusIcon } from "./CheckoutIcons";

const TOGGLE_CLASS =
  "inline-flex items-center gap-1 rounded-sm text-sm text-brand-primary hover:underline focus-visible:ring-2 focus-visible:ring-outline-outline-focus focus-visible:outline-hidden";

export type CustomerBaseInfoProps = {
  email: string;
  password: string;
  createAccount: boolean;
  errors: CheckoutErrors;
  onFieldChange: (field: CheckoutField, value: string) => void;
  onFieldBlur: (field: CheckoutField) => void;
  onCreateAccountChange: (createAccount: boolean) => void;
  className?: string;
};

export function CustomerBaseInfo({
  email,
  password,
  createAccount,
  errors,
  onFieldChange,
  onFieldBlur,
  onCreateAccountChange,
  className,
}: CustomerBaseInfoProps) {
  const t = useTranslations();
  const passwordRef = useRef<HTMLInputElement>(null);
  const createToggleRef = useRef<HTMLButtonElement>(null);
  const focusPassword = useRef(false);
  const focusToggle = useRef(false);

  useEffect(() => {
    if (!createAccount || !focusPassword.current) return;
    focusPassword.current = false;
    passwordRef.current?.focus({ preventScroll: true });
  }, [createAccount]);

  useEffect(() => {
    if (createAccount || !focusToggle.current) return;
    focusToggle.current = false;
    createToggleRef.current?.focus();
  }, [createAccount]);

  function switchToAccount() {
    if (createAccount) return;
    focusPassword.current = true;
    onCreateAccountChange(true);
  }

  function switchToGuest() {
    if (!createAccount) return;
    focusToggle.current = true;
    onCreateAccountChange(false);
  }

  return (
    <div className={className}>
      <InputField
        className="mb-4"
        id="email"
        type="email"
        autoComplete="email"
        data-testid="checkout-pi-email-input"
        label={t("checkout.customerBaseInfo.emailLabel")}
        placeholder={t("checkout.customerBaseInfo.emailPlaceholder")}
        required
        value={email}
        onChange={(event) => onFieldChange("email", event.target.value)}
        onBlur={() => onFieldBlur("email")}
        error={errors.email}
      />
      {createAccount ? (
        <div className="mb-4">
          <InputField
            ref={passwordRef}
            className="mb-2"
            id="password"
            type="password"
            autoComplete="new-password"
            data-testid="checkout-pi-password-input"
            label={t("checkout.customerBaseInfo.passwordLabel")}
            placeholder={t("checkout.customerBaseInfo.passwordPlaceholder")}
            required
            value={password}
            onChange={(event) => onFieldChange("password", event.target.value)}
            onBlur={() => onFieldBlur("password")}
            error={errors.password}
          />
          <button
            type="button"
            className={TOGGLE_CLASS}
            onClick={switchToGuest}
          >
            {t("checkout.customerBaseInfo.continueAsGuestToggleLabel")}
          </button>
        </div>
      ) : (
        <div className="mb-4">
          <button
            ref={createToggleRef}
            type="button"
            className={TOGGLE_CLASS}
            data-testid="checkout-create-account-toggle"
            onClick={switchToAccount}
          >
            <PlusIcon className="size-4" />
            <span>
              {t("checkout.customerBaseInfo.createAccountToggleLabel")}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
