"use client";

import { BaseButton } from "@shopware/cms-base-layer-react/client";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import { InputField } from "@/components/form/InputField";
import { useSessionActions } from "@/features/session/components/SessionActionsContext";
import { useShopwareClient } from "@/features/storefront/components/ShopwareClientContext";
import { localePrefix } from "@/i18n/config";
import { useLocale, useTranslations } from "@/i18n/I18nProvider";

import { sendRecoveryMail } from "../recoveryApi";
import {
  logRecoverRequestFailure,
  recoverRequestErrors,
} from "../recoveryErrors";
import type { RecoverRequestErrors } from "../recoveryErrors";
import {
  emptyRecoverRequestValues,
  validateRecoverRequest,
} from "../recoverySchema";
import type { RecoverRequestValues } from "../recoverySchema";
import { resolveRecoveryStorefrontUrl } from "../recoveryStorefrontUrl";
import { BackToLoginLink } from "./RecoveryLinks";

export type RecoverPasswordFormProps = { idPrefix?: string };

type FocusRequest = { target: "invalid" | "email" | "success" };

const BUTTON_ROW_CLASS = "flex flex-wrap items-center gap-x-6 gap-y-3";

export function RecoverPasswordForm({
  idPrefix = "recover-password",
}: RecoverPasswordFormProps) {
  const getClient = useShopwareClient();
  const { retrySession } = useSessionActions();
  const t = useTranslations();
  const locale = useLocale();
  const [values, setValues] = useState<RecoverRequestValues>(
    emptyRecoverRequestValues,
  );
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverErrors, setServerErrors] = useState<RecoverRequestErrors>({});
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(null);
  const inFlight = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const clientErrors = validateRecoverRequest(values, t);
  const emailError =
    (submitted || touched ? clientErrors.email : undefined) ??
    serverErrors.email;

  useEffect(() => {
    if (!focusRequest) return;
    if (focusRequest.target === "success") {
      successRef.current?.focus();
      return;
    }
    formRef.current
      ?.querySelector<HTMLElement>(
        focusRequest.target === "email"
          ? 'input[type="email"]'
          : '[aria-invalid="true"]',
      )
      ?.focus();
  }, [focusRequest]);

  function setEmail(email: string) {
    setValues({ email });
    setServerErrors(({ form }) => (form ? { form } : {}));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    setSubmitted(true);
    setServerErrors({});
    if (Object.keys(validateRecoverRequest(values, t)).length) {
      setFocusRequest({ target: "invalid" });
      return;
    }

    inFlight.current = true;
    setPending(true);
    try {
      const client = await getClient();
      const { context } = await retrySession();
      const storefrontUrl = await resolveRecoveryStorefrontUrl(
        context,
        localePrefix(locale),
      );
      await sendRecoveryMail(client, { email: values.email, storefrontUrl });
      setSent(true);
      setFocusRequest({ target: "success" });
    } catch (error) {
      logRecoverRequestFailure(error);
      const errors = recoverRequestErrors(error, t);
      setServerErrors(errors);
      if (errors.email) setFocusRequest({ target: "invalid" });
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  function sendAgain() {
    setSent(false);
    setSubmitted(false);
    setFocusRequest({ target: "email" });
  }

  if (sent) {
    return (
      <div className="flex max-w-md flex-col gap-6">
        <div
          ref={successRef}
          tabIndex={-1}
          data-testid="account-recover-password-success"
          className="rounded-lg border-2 border-states-success bg-states-success-container p-6 text-states-on-success-container focus:outline-hidden"
        >
          {t("account.recoverPassword.sent")}
        </div>
        <div className={BUTTON_ROW_CLASS}>
          <BaseButton
            variant="secondary"
            data-testid="account-recover-password-resend-button"
            onClick={sendAgain}
          >
            {t("account.recoverPassword.resend")}
          </BaseButton>
          <BackToLoginLink />
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      className="flex max-w-md flex-col gap-4"
      data-testid="account-recover-password-form"
      noValidate
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <p className="text-surface-on-surface">
        {t("account.recoverPassword.info")}
      </p>
      <p className="text-sm text-surface-on-surface-variant">
        {t("form.requiredFieldsNote")}
      </p>
      <InputField
        id={`${idPrefix}-email`}
        data-testid="account-recover-password-email-input"
        type="email"
        label={t("form.email")}
        required
        autoComplete="email"
        value={values.email}
        onChange={(event) => setEmail(event.target.value)}
        onBlur={() => setTouched(true)}
        error={emailError}
      />
      {serverErrors.form ? (
        <p role="alert" className="text-sm text-states-error">
          {serverErrors.form}
        </p>
      ) : null}
      <div className={BUTTON_ROW_CLASS}>
        <BaseButton
          type="submit"
          data-testid="account-recover-password-submit-button"
          aria-busy={pending}
          aria-disabled={pending || undefined}
          className="aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
        >
          {t("account.recoverPassword.submit")}
        </BaseButton>
        <BackToLoginLink />
      </div>
    </form>
  );
}
