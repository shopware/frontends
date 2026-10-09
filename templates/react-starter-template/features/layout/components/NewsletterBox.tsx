"use client";

import { cx, useCmsActions } from "@shopware/cms-base-layer-react/client";
import { useState } from "react";
import type { FormEvent } from "react";

import { SHELL_BUTTON_PRIMARY_CLASS } from "@/features/layout/shellButton";
import { useTranslations } from "@/i18n/I18nProvider";
import type { Translate } from "@/i18n/translate";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string, t: Translate): string | null {
  const trimmed = value.trim();
  if (!trimmed) return t("validations.required");
  if (!EMAIL_PATTERN.test(trimmed)) return t("validations.email");
  return null;
}

export function NewsletterBox({ className }: { className?: string }) {
  const actions = useCmsActions();
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [pending, setPending] = useState(false);
  const error = touched ? validateEmail(email, t) : null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    if (validateEmail(email, t)) return;

    setPending(true);
    try {
      const result = await actions.subscribeNewsletter({
        email: email.trim(),
        option: "subscribe",
      });
      if (result.ok) {
        actions.notify({
          type: "success",
          message: t("layout.footer.newsletter.messages.subscribed"),
        });
        setEmail("");
        setTouched(false);
      }
    } catch (cause) {
      actions.notify({
        type: "error",
        message: cause instanceof Error ? cause.message : String(cause),
      });
    } finally {
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
              onChange={(event) => setEmail(event.target.value)}
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
            type="submit"
            disabled={pending}
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
