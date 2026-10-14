"use client";

import {
  BaseButton,
  useCmsActions,
} from "@shopware/cms-base-layer-react/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import type { FormEvent } from "react";

import { InputField } from "@/components/form/InputField";
import { useSessionActions } from "@/features/session/components/SessionActionsContext";
import { useShopwareClient } from "@/features/storefront/components/ShopwareClientContext";
import { useLocalePath, useTranslations } from "@/i18n/I18nProvider";

import { resetPassword } from "../recoveryApi";
import { classifyResetFailure, logRecoveryFailure } from "../recoveryErrors";
import type { RecoveryLinkProblem, ResetFieldErrors } from "../recoveryErrors";
import {
  RESET_PASSWORD_MIN_LENGTH,
  emptyResetPasswordValues,
  validateResetPassword,
} from "../recoverySchema";
import type {
  ResetPasswordField,
  ResetPasswordValues,
} from "../recoverySchema";

export type ResetPasswordFormProps = {
  hash: string;
  minLength?: number;
  onLinkRejected(problem: RecoveryLinkProblem): void;
};

const LOGIN_PATH = "/account/login";

const ACCOUNT_PATH = "/account";

export function ResetPasswordForm({
  hash,
  minLength = RESET_PASSWORD_MIN_LENGTH,
  onLinkRejected,
}: ResetPasswordFormProps) {
  const router = useRouter();
  const getClient = useShopwareClient();
  const { refreshSession } = useSessionActions();
  const { notify } = useCmsActions();
  const t = useTranslations();
  const localePath = useLocalePath();
  const [values, setValues] = useState<ResetPasswordValues>(
    emptyResetPasswordValues,
  );
  const [touched, setTouched] = useState<
    Partial<Record<ResetPasswordField, true>>
  >({});
  const [submitted, setSubmitted] = useState(false);
  const [serverErrors, setServerErrors] = useState<ResetFieldErrors>({});
  const [failure, setFailure] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [navigating, startNavigation] = useTransition();
  const [focusRequest, setFocusRequest] = useState(0);
  const inFlight = useRef(false);
  const mounted = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  const busy = pending || navigating || done;
  const errors = validateResetPassword(values, t, minLength);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (focusRequest === 0) return;
    formRef.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus();
  }, [focusRequest]);

  function errorFor(field: ResetPasswordField): string | undefined {
    return (
      (submitted || touched[field] ? errors[field] : undefined) ??
      serverErrors[field]
    );
  }

  function setField(field: ResetPasswordField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setServerErrors((current) => (Object.keys(current).length ? {} : current));
  }

  function touch(field: ResetPasswordField) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || busy) return;
    setSubmitted(true);
    setFailure(null);
    setServerErrors({});
    if (Object.keys(validateResetPassword(values, t, minLength)).length) {
      setFocusRequest((count) => count + 1);
      return;
    }

    inFlight.current = true;
    setPending(true);
    try {
      try {
        await resetPassword(await getClient(), {
          hash,
          newPassword: values.newPassword,
          newPasswordConfirm: values.newPasswordConfirm,
        });
      } catch (error) {
        const result = classifyResetFailure(error, t, minLength);
        if (result.kind === "fields") {
          setServerErrors(result.errors);
          setFocusRequest((count) => count + 1);
        } else if (result.kind === "message") {
          logRecoveryFailure("resetting the password failed", error);
          setFailure(result.message);
        } else {
          onLinkRejected(result.kind);
        }
        return;
      }
      setDone(true);
      notify({
        type: "success",
        message: t("account.changePassword.form.successUpdate"),
      });
      await refreshSession();
      if (!mounted.current) return;
      startNavigation(() => {
        router.replace(
          `${localePath(LOGIN_PATH)}?redirect=${encodeURIComponent(localePath(ACCOUNT_PATH))}`,
        );
      });
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return (
    <form
      ref={formRef}
      className="flex max-w-md flex-col gap-4"
      data-testid="account-reset-password-form"
      noValidate
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <p className="text-sm text-surface-on-surface-variant">
        {t("form.requiredFieldsNote")}
      </p>
      <InputField
        id="newPassword"
        data-testid="account-reset-password-new-password-input"
        type="password"
        label={t("account.changePassword.form.newPasswordLabel")}
        hint={t(
          "account.registration.minLengthHint",
          { min: minLength },
          minLength,
        )}
        aria-required="true"
        autoComplete="new-password"
        value={values.newPassword}
        onChange={(event) => setField("newPassword", event.target.value)}
        onBlur={() => touch("newPassword")}
        error={errorFor("newPassword")}
      />
      <InputField
        id="newPasswordConfirm"
        data-testid="account-reset-password-confirm-password-input"
        type="password"
        label={t("account.changePassword.form.confirmPasswordLabel")}
        aria-required="true"
        autoComplete="new-password"
        value={values.newPasswordConfirm}
        onChange={(event) => setField("newPasswordConfirm", event.target.value)}
        onBlur={() => touch("newPasswordConfirm")}
        error={errorFor("newPasswordConfirm")}
      />
      {failure ? (
        <p role="alert" className="text-sm text-states-error">
          {failure}
        </p>
      ) : null}
      <div>
        <BaseButton
          type="submit"
          data-testid="account-reset-password-submit-button"
          aria-busy={busy}
          aria-disabled={busy || undefined}
          className="aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
        >
          {t("account.profile.changePasswordButton")}
        </BaseButton>
      </div>
    </form>
  );
}
