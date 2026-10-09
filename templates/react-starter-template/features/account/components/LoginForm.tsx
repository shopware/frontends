"use client";

import {
  BaseButton,
  useCmsActions,
} from "@shopware/cms-base-layer-react/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import type { FormEvent } from "react";

import { InputField } from "@/components/form/InputField";
import {
  emptyLoginValues,
  validateLogin,
} from "@/features/account/loginSchema";
import type { LoginValues } from "@/features/account/loginSchema";
import { resolveRedirectFromSearch } from "@/features/account/redirect";
import { useSessionActions } from "@/features/session/components/SessionActionsContext";

const t = {
  loginForm: {
    header: "Sign in to your account",
    subHeader: "Sign in to your account to continue",
    loginLabel: "Email address",
    passwordLabel: "Password",
    submitButtonLabel: "Sign in",
    signUpButtonLabel: "Sign up",
  },
  form: {
    requiredFieldsNote: "Fields marked with asterisks (*) are required.",
  },
  account: {
    messages: {
      loggedInSuccess: "You have been logged in successfully.",
    },
  },
};

const SIGN_UP_PATH = "/account/login#registration";

type Touched = Partial<Record<keyof LoginValues, boolean>>;

export type LoginFormProps = {
  hideSignUp?: boolean;
  redirectUrl?: string | null;
};

export function LoginForm({
  hideSignUp = false,
  redirectUrl = null,
}: LoginFormProps) {
  const router = useRouter();
  const { login } = useSessionActions();
  const { notify } = useCmsActions();
  const [values, setValues] = useState<LoginValues>(emptyLoginValues);
  const [touched, setTouched] = useState<Touched>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [navigating, startNavigation] = useTransition();
  const [focusRequest, setFocusRequest] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const busy = pending || navigating;
  const errors = validateLogin(values);
  const errorFor = (field: keyof LoginValues) =>
    submitted || touched[field] ? errors[field] : undefined;

  const setField = (field: keyof LoginValues, value: string) =>
    setValues((current) => ({ ...current, [field]: value }));

  const touch = (field: keyof LoginValues) => () =>
    setTouched((current) => ({ ...current, [field]: true }));

  useEffect(() => {
    if (focusRequest === 0) return;
    formRef.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus();
  }, [focusRequest]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setSubmitted(true);
    if (Object.keys(validateLogin(values)).length) {
      setFocusRequest((count) => count + 1);
      return;
    }

    setPending(true);
    try {
      const result = await login(values);
      if (!result.ok) return;
      notify({ type: "success", message: t.account.messages.loggedInSuccess });
      const target = resolveRedirectFromSearch(
        window.location.search,
        redirectUrl,
      );
      startNavigation(() => {
        router.push(target);
      });
    } catch (cause) {
      notify({
        type: "error",
        message: cause instanceof Error ? cause.message : String(cause),
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{t.loginForm.header}</h1>
        <p className="text-sm text-surface-on-surface-variant">
          {t.loginForm.subHeader}
        </p>
        <p className="mt-2 text-sm text-surface-on-surface-variant">
          {t.form.requiredFieldsNote}
        </p>
      </div>
      <form
        ref={formRef}
        className="flex flex-col gap-3"
        data-testid="login-form"
        noValidate
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
      >
        <InputField
          id="login-username"
          data-testid="login-email-input"
          type="email"
          label={t.loginForm.loginLabel}
          required
          autoComplete="username"
          value={values.username}
          onChange={(event) => setField("username", event.target.value)}
          onBlur={touch("username")}
          error={errorFor("username")}
        />
        <InputField
          id="login-password"
          data-testid="login-password-input"
          type="password"
          label={t.loginForm.passwordLabel}
          required
          autoComplete="current-password"
          value={values.password}
          onChange={(event) => setField("password", event.target.value)}
          onBlur={touch("password")}
          error={errorFor("password")}
        />
        <BaseButton
          type="submit"
          data-testid="login-submit-button"
          aria-busy={busy}
          aria-disabled={busy || undefined}
          className="aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
        >
          {t.loginForm.submitButtonLabel}
        </BaseButton>
      </form>
      {hideSignUp ? null : (
        <BaseButton
          variant="secondary"
          data-testid="login-sign-up-button"
          onClick={() => router.push(SIGN_UP_PATH)}
        >
          {t.loginForm.signUpButtonLabel}
        </BaseButton>
      )}
    </div>
  );
}
