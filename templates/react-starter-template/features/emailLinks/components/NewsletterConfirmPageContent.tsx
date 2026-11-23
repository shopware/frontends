"use client";

import { useCallback, useRef } from "react";

import { useShopwareClient } from "@/features/storefront/components/ShopwareClientContext";
import { useTranslations } from "@/i18n/I18nProvider";
import type { Translate } from "@/i18n/translate";

import { newsletterConfirmations } from "../confirmOnce";
import type { EmailLinkParams } from "../emailLinkParams";
import { confirmNewsletter } from "../newsletterConfirm";
import type { NewsletterConfirmResult } from "../newsletterConfirm";
import { useEmailLinkConfirmation } from "../useEmailLinkConfirmation";
import type { EmailLinkState } from "../useEmailLinkConfirmation";
import {
  EmailLinkHomeLink,
  EmailLinkPanel,
  EmailLinkRetryButton,
} from "./EmailLinkPanel";
import type { EmailLinkTone } from "./EmailLinkPanel";

const INVALID_LINK: NewsletterConfirmResult = { status: "invalidLink" };
const FAILED: NewsletterConfirmResult = { status: "failed" };

type PanelContent = { tone: EmailLinkTone; message: string; detail?: string };

function panelContent(
  state: EmailLinkState<NewsletterConfirmResult>,
  t: Translate,
): PanelContent {
  if (state.phase === "pending" || state.retrying) {
    return { tone: "pending", message: t("newsletter.messages.loading") };
  }
  switch (state.result.status) {
    case "confirmed":
      return {
        tone: "success",
        message: t("newsletter.messages.newsletterSubscribed"),
        detail: t("newsletter.subscriptionInfo"),
      };
    case "alreadyConfirmed":
      return {
        tone: "info",
        message: t("newsletter.confirm.alreadyConfirmed"),
      };
    case "invalidLink":
      return { tone: "error", message: t("newsletter.confirm.invalidLink") };
    default:
      return { tone: "error", message: t("errors.message-default") };
  }
}

export function NewsletterConfirmPageContent() {
  const t = useTranslations();
  const getClient = useShopwareClient();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const confirm = useCallback(
    (link: EmailLinkParams) => confirmNewsletter(getClient, link),
    [getClient],
  );
  const { state, retry } = useEmailLinkConfirmation({
    once: newsletterConfirmations,
    confirm,
    invalid: INVALID_LINK,
    failed: FAILED,
    focusAfterRetry: headingRef,
  });

  const { tone, message, detail } = panelContent(state, t);
  const settled = state.phase === "settled" ? state : null;

  return (
    <EmailLinkPanel
      testId="newsletter-confirm-page"
      title={t("newsletter.subscriptionHeader")}
      tone={tone}
      message={message}
      detail={detail}
      headingRef={headingRef}
    >
      {settled?.result.status === "failed" ? (
        <>
          <EmailLinkRetryButton retrying={settled.retrying} onRetry={retry} />
          <EmailLinkHomeLink variant="secondary" />
        </>
      ) : settled ? (
        <EmailLinkHomeLink />
      ) : null}
    </EmailLinkPanel>
  );
}
