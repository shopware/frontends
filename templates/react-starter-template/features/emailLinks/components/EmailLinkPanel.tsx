"use client";

import { cx } from "@shopware/cms-base-layer-react/client";
import type { ReactNode, Ref } from "react";

import { LocaleLink } from "@/components/LocaleLink";
import { AccountPageHeader } from "@/features/account/components/AccountPageHeader";
import {
  SHELL_BUTTON_PRIMARY_CLASS,
  SHELL_BUTTON_SECONDARY_CLASS,
} from "@/features/layout/shellButton";
import { useTranslations } from "@/i18n/I18nProvider";

export type EmailLinkTone = "pending" | "success" | "info" | "error";

export type EmailLinkActionVariant = "primary" | "secondary";

export type EmailLinkPanelProps = {
  testId: string;
  title: string;
  tone: EmailLinkTone;
  message: string;
  detail?: string;
  headingRef?: Ref<HTMLHeadingElement>;
  children?: ReactNode;
};

const TONE_CLASSES: Record<Exclude<EmailLinkTone, "pending">, string> = {
  success:
    "border-states-success bg-states-success-container text-states-on-success-container",
  info: "border-states-info bg-states-info-container text-states-on-info-container",
  error:
    "border-states-error bg-states-error-container text-states-on-error-container",
};

const ACTION_CLASS =
  "inline-flex min-h-11 items-center justify-center px-5 py-2 text-sm";

function actionClass(variant: EmailLinkActionVariant): string {
  return cx(
    ACTION_CLASS,
    variant === "primary"
      ? SHELL_BUTTON_PRIMARY_CLASS
      : SHELL_BUTTON_SECONDARY_CLASS,
  );
}

export function EmailLinkPanel({
  testId,
  title,
  tone,
  message,
  detail,
  headingRef,
  children,
}: EmailLinkPanelProps) {
  const pending = tone === "pending";
  return (
    <div
      data-testid={testId}
      className="mx-auto my-10 w-full max-w-2xl px-4 sm:px-6 lg:my-16"
    >
      <AccountPageHeader
        title={title}
        headingRef={headingRef}
        className="mb-6"
      />
      <output
        aria-live="polite"
        aria-busy={pending || undefined}
        data-testid="email-link-status"
        data-state={tone}
        className={cx(
          "block",
          pending
            ? "text-surface-on-surface"
            : cx("rounded-lg border-2 p-6", TONE_CLASSES[tone]),
        )}
      >
        {pending ? (
          <span className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="size-5 shrink-0 animate-spin rounded-full border-2 border-brand-primary border-t-transparent motion-reduce:animate-none"
            />
            <span>{message}</span>
          </span>
        ) : (
          <>
            <span className="block text-lg font-medium">{message}</span>
            {detail ? <span className="mt-2 block">{detail}</span> : null}
          </>
        )}
      </output>
      {children ? (
        <div className="mt-6 flex flex-wrap gap-3">{children}</div>
      ) : null}
    </div>
  );
}

export function EmailLinkHomeLink({
  variant = "primary",
}: {
  variant?: EmailLinkActionVariant;
}) {
  const t = useTranslations();
  return (
    <LocaleLink
      href="/"
      data-testid="email-link-home-link"
      className={actionClass(variant)}
    >
      {t("newsletter.backToHomepage")}
    </LocaleLink>
  );
}

export function EmailLinkLoginLink({
  variant = "primary",
}: {
  variant?: EmailLinkActionVariant;
}) {
  const t = useTranslations();
  return (
    <LocaleLink
      href="/account/login"
      data-testid="email-link-login-link"
      className={actionClass(variant)}
    >
      {t("account.registrationConfirm.toLogin")}
    </LocaleLink>
  );
}

export function EmailLinkRetryButton({
  retrying,
  onRetry,
  variant = "primary",
}: {
  retrying: boolean;
  onRetry: () => void;
  variant?: EmailLinkActionVariant;
}) {
  const t = useTranslations();
  return (
    <button
      type="button"
      data-testid="email-link-retry-button"
      aria-busy={retrying || undefined}
      aria-disabled={retrying || undefined}
      className={cx(actionClass(variant), retrying && "cursor-wait")}
      onClick={onRetry}
    >
      {t("listing.retry")}
    </button>
  );
}
