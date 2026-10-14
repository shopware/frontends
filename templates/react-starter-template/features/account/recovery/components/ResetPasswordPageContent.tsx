"use client";

import { useCallback, useEffect, useRef } from "react";

import { CustomerUnavailable } from "@/features/account/profile/components/CustomerUnavailable";
import { useTranslations } from "@/i18n/I18nProvider";

import { LINK_ERROR_KEYS } from "../recoveryErrors";
import type { RecoveryLinkProblem } from "../recoveryErrors";
import { useRecoveryHash } from "../useRecoveryHash";
import { RecoverPasswordForm } from "./RecoverPasswordForm";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { ResetPasswordSkeleton } from "./ResetPasswordSkeleton";

export type ResetPasswordPageContentProps = { minLength?: number };

export function ResetPasswordPageContent({
  minLength,
}: ResetPasswordPageContentProps) {
  const t = useTranslations();
  const { state, retry, reject } = useRecoveryHash();
  const messageRef = useRef<HTMLParagraphElement>(null);
  const focusMessage = useRef(false);

  const rejectLink = useCallback(
    (problem: RecoveryLinkProblem) => {
      focusMessage.current = true;
      reject(problem);
    },
    [reject],
  );

  const retryCheck = useCallback(async () => {
    retry();
  }, [retry]);

  useEffect(() => {
    if (!focusMessage.current) return;
    if (state.status !== "expired" && state.status !== "invalid") return;
    focusMessage.current = false;
    messageRef.current?.focus();
  }, [state]);

  switch (state.status) {
    case "checking":
      return <ResetPasswordSkeleton />;
    case "error":
      return <CustomerUnavailable onRetry={retryCheck} />;
    case "valid":
      return (
        <ResetPasswordForm
          hash={state.hash}
          minLength={minLength}
          onLinkRejected={rejectLink}
        />
      );
    default:
      return (
        <div className="flex flex-col gap-6">
          <p
            ref={messageRef}
            tabIndex={-1}
            data-testid="account-reset-password-link-error"
            data-reason={state.status}
            className="max-w-md rounded-lg border-2 border-states-error bg-states-error-container p-4 text-states-on-error-container focus:outline-hidden"
          >
            {t(LINK_ERROR_KEYS[state.status])}
          </p>
          <RecoverPasswordForm idPrefix="reset-recover" />
        </div>
      );
  }
}
