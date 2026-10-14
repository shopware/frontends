"use client";

import { cx, useCmsActions } from "@shopware/cms-base-layer-react/client";
import type { CmsNewsletterResult } from "@shopware/cms-base-layer-react/client";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import { SHELL_BUTTON_PRIMARY_CLASS } from "@/features/layout/shellButton";
import { useTranslations } from "@/i18n/I18nProvider";
import type { Translate } from "@/i18n/translate";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMAIL_FIELD = "email";

type FocusRequest = { target: "input" | "button" };

export function validateEmail(value: string, t: Translate): string | null {
  const trimmed = value.trim();
  if (!trimmed) return t("validations.required");
  if (!EMAIL_PATTERN.test(trimmed)) return t("validations.email");
  return null;
}

function failureMessages(result: CmsNewsletterResult): {
  email: string | null;
  toasts: string[];
} {
  const violations = result.violations ?? [];
  if (!violations.length) {
    return { email: null, toasts: result.message ? [result.message] : [] };
  }
  const email =
    violations.find(({ field }) => field === EMAIL_FIELD)?.message ?? null;
  const toasts = [
    ...new Set(
      violations
        .filter(({ field }) => field !== EMAIL_FIELD)
        .map(({ message }) => message),
    ),
  ];
  return { email, toasts };
}

function focusIfFocusWasLost(element: HTMLElement | null) {
  if (!element) return;
  const { activeElement, body } = element.ownerDocument;
  if (!activeElement || activeElement === body) element.focus();
}

export function NewsletterBox({ className }: { className?: string }) {
  const actions = useCmsActions();
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [pending, setPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(null);
  const inFlight = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const error = (touched ? validateEmail(email, t) : null) ?? serverError;

  useEffect(() => {
    if (!focusRequest) return;
    if (focusRequest.target === "input") {
      inputRef.current?.focus();
      return;
    }
    focusIfFocusWasLost(buttonRef.current);
  }, [focusRequest]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    setTouched(true);
    if (validateEmail(email, t)) {
      setFocusRequest({ target: "input" });
      return;
    }

    inFlight.current = true;
    setPending(true);
    setServerError(null);
    try {
      const result = await actions.subscribeNewsletter({
        email: email.trim(),
        option: "subscribe",
      });
      if (result.ok) {
        actions.notify({
          type: "success",
          message: t(
            result.status === "notSet"
              ? "form.messages.newsletterConfirmationSent"
              : "layout.footer.newsletter.messages.subscribed",
          ),
        });
        setEmail("");
        setTouched(false);
        setFocusRequest({ target: "button" });
        return;
      }
      const messages = failureMessages(result);
      for (const message of messages.toasts) {
        actions.notify({ type: "error", message });
      }
      setServerError(messages.email);
      setFocusRequest({ target: messages.email ? "input" : "button" });
    } catch (cause) {
      actions.notify({
        type: "error",
        message: cause instanceof Error ? cause.message : String(cause),
      });
      setFocusRequest({ target: "button" });
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return (
    <div
      className={cx(
        "grid gap-6 md:grid-cols-2 md:items-center md:gap-12",
        className,
      )}
    >
      <div>
        <p className="text-2xl font-semibold tracking-tight text-shell-ink md:text-3xl">
          {t("layout.footer.newsletter.title")}
        </p>
        <p className="mt-2 max-w-prose text-surface-on-surface-variant">
          {t("layout.footer.newsletter.description")}
        </p>
      </div>
      <form
        noValidate
        data-testid="footer-newsletter-form"
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="min-w-0 flex-1">
            <label htmlFor="newsletter-email" className="sr-only">
              {t("form.email")}
            </label>
            <input
              ref={inputRef}
              id="newsletter-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder={t("layout.footer.newsletter.placeholder")}
              value={email}
              disabled={pending}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "newsletter-email-error" : undefined}
              data-testid="footer-newsletter-email-input"
              onChange={(event) => {
                setEmail(event.target.value);
                setServerError(null);
              }}
              onBlur={() => setTouched(true)}
              className="w-full rounded-full border border-shell-ink/60 bg-surface-surface px-4 py-2.5 text-sm text-surface-on-surface placeholder:text-surface-on-surface-variant focus-visible:border-shell-ink focus-visible:ring-2 focus-visible:ring-shell-ink focus-visible:ring-offset-2 focus-visible:ring-offset-shell-sand focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-states-error"
            />
            {error ? (
              <p
                id="newsletter-email-error"
                role="alert"
                className="mt-1 px-4 text-xs text-states-error"
              >
                {error}
              </p>
            ) : null}
          </div>
          <button
            ref={buttonRef}
            type="submit"
            disabled={pending}
            data-testid="footer-newsletter-submit-button"
            className={cx(
              SHELL_BUTTON_PRIMARY_CLASS,
              "inline-flex shrink-0 items-center justify-center px-6 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60",
            )}
          >
            {t("layout.footer.newsletter.button")}
          </button>
        </div>
        <p className="mt-3 text-xs leading-5 text-surface-on-surface-variant">
          {t("layout.footer.newsletter.privacyPolicy")}
        </p>
      </form>
    </div>
  );
}
