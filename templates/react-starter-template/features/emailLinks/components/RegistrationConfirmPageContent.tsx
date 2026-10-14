"use client";

import { useCmsActions } from "@shopware/cms-base-layer-react/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

import { useCart } from "@/features/cart/useCart";
import { useSessionActions } from "@/features/session/components/SessionActionsContext";
import type { RegistrationConfirmResult } from "@/features/session/registrationConfirm";
import { useLocalePath, useTranslations } from "@/i18n/I18nProvider";
import type { Translate } from "@/i18n/translate";

import { registrationConfirmations } from "../confirmOnce";
import type { EmailLinkParams } from "../emailLinkParams";
import { useEmailLinkConfirmation } from "../useEmailLinkConfirmation";
import type { EmailLinkState } from "../useEmailLinkConfirmation";
import {
  EmailLinkHomeLink,
  EmailLinkLoginLink,
  EmailLinkPanel,
  EmailLinkRetryButton,
} from "./EmailLinkPanel";
import type { EmailLinkTone } from "./EmailLinkPanel";

const INVALID_LINK: RegistrationConfirmResult = { status: "invalidLink" };
const FAILED: RegistrationConfirmResult = { status: "failed" };

type PanelContent = { tone: EmailLinkTone; message: string };

function panelContent(
  state: EmailLinkState<RegistrationConfirmResult>,
  t: Translate,
): PanelContent {
  if (
    state.phase === "pending" ||
    state.retrying ||
    state.result.status === "confirmed"
  ) {
    return { tone: "pending", message: t("account.messages.verifying") };
  }
  switch (state.result.status) {
    case "alreadyConfirmed":
      return {
        tone: "error",
        message: t("errors.CHECKOUT__CUSTOMER_IS_ALREADY_CONFIRMED"),
      };
    case "invalidLink":
      return {
        tone: "error",
        message: t("account.messages.verificationLinkInvalid"),
      };
    default:
      return { tone: "error", message: t("errors.message-default") };
  }
}

export function RegistrationConfirmPageContent() {
  const t = useTranslations();
  const localePath = useLocalePath();
  const router = useRouter();
  const { notify } = useCmsActions();
  const { confirmRegistration } = useSessionActions();
  const cart = useCart();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const handled = useRef(false);
  const confirm = useCallback(
    (link: EmailLinkParams) => confirmRegistration(link),
    [confirmRegistration],
  );
  const { state, retry } = useEmailLinkConfirmation({
    once: registrationConfirmations,
    confirm,
    invalid: INVALID_LINK,
    failed: FAILED,
    ready: cart.status !== "loading",
    focusAfterRetry: headingRef,
  });

  useEffect(() => {
    if (handled.current || state.phase !== "settled") return;
    const { result } = state;
    if (result.status !== "confirmed") return;
    handled.current = true;
    notify({
      type: "success",
      message: t(
        result.guest
          ? "account.registrationConfirm.guestConfirmed"
          : "account.messages.loggedInSuccess",
      ),
    });
    router.replace(localePath(result.guest ? "/checkout" : "/"));
  }, [state, notify, t, router, localePath]);

  const { tone, message } = panelContent(state, t);
  const settled = state.phase === "settled" ? state : null;
  const status = settled?.result.status;

  return (
    <EmailLinkPanel
      testId="registration-confirm-page"
      title={t("account.registrationConfirm.title")}
      tone={tone}
      message={message}
      headingRef={headingRef}
    >
      {status === "failed" ? (
        <>
          <EmailLinkRetryButton
            retrying={settled?.retrying ?? false}
            onRetry={retry}
          />
          <EmailLinkHomeLink variant="secondary" />
        </>
      ) : status === "alreadyConfirmed" || status === "invalidLink" ? (
        <>
          <EmailLinkLoginLink />
          <EmailLinkHomeLink variant="secondary" />
        </>
      ) : null}
    </EmailLinkPanel>
  );
}
