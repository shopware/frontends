"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { z } from "zod";

import { BaseButton, cx, useCmsActions } from "@/cms/client";
import { INPUT_CLASS } from "@/components/input";

const t = {
  layout: {
    footer: {
      newsletter: {
        title: "Subscribe",
        description:
          "Receive the latest updates about offers and community updates.",
        placeholder: "Enter Email Address",
        button: "Submit",
        privacyPolicy:
          "By submitting you automatically agree to our privacy policy.",
        messages: {
          subscribed: "Thank you! We have signed up your address.",
          failed: "An error occurred. Please try again.",
        },
      },
    },
  },
  form: {
    email: "Email address",
  },
  validations: {
    required: "Value is required",
    email: "Value is not a valid email address",
  },
};

export function validateEmail(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return t.validations.required;
  if (!z.email().safeParse(trimmed).success) return t.validations.email;
  return null;
}

export function NewsletterBox({ className }: { className?: string }) {
  const actions = useCmsActions();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [pending, setPending] = useState(false);
  const error = touched ? validateEmail(email) : null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setTouched(true);
    if (validateEmail(email)) return;

    setPending(true);
    try {
      const result = await actions.subscribeNewsletter({
        email: email.trim(),
        option: "subscribe",
      });
      if (result.ok) {
        actions.notify({
          type: "success",
          message: t.layout.footer.newsletter.messages.subscribed,
        });
        setEmail("");
        setTouched(false);
      } else {
        actions.notify({
          type: "error",
          message: result.message || t.layout.footer.newsletter.messages.failed,
        });
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
    <div className={className}>
      <p className="mb-2 text-surface-inverse-on-surface">
        {t.layout.footer.newsletter.title}
      </p>
      <p className="mb-4 text-surface-inverse-on-surface">
        {t.layout.footer.newsletter.description}
      </p>
      <form
        noValidate
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
      >
        <div className="flex gap-2">
          <div>
            <div className={error ? "mb-4" : "mb-1"}>
              <label htmlFor="newsletter-email" className="sr-only">
                {t.form.email}
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={t.layout.footer.newsletter.placeholder}
                value={email}
                readOnly={pending}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "newsletter-email-error" : undefined}
                onChange={(event) => setEmail(event.target.value)}
                onBlur={() => setTouched(true)}
                className={cx(
                  INPUT_CLASS,
                  "px-3 focus-visible:outline-brand-secondary!",
                )}
              />
              {error ? (
                <p
                  id="newsletter-email-error"
                  role="alert"
                  className="mt-1 text-xs text-states-error-container"
                >
                  {error}
                </p>
              ) : null}
            </div>
            <p className="text-xs leading-5 text-surface-inverse-on-surface">
              {t.layout.footer.newsletter.privacyPolicy}
            </p>
          </div>
          <div>
            <BaseButton
              className="mt-0.5"
              type="submit"
              variant="secondary"
              size="small"
              aria-busy={pending}
              aria-disabled={pending || undefined}
            >
              {t.layout.footer.newsletter.button}
            </BaseButton>
          </div>
        </div>
      </form>
    </div>
  );
}
