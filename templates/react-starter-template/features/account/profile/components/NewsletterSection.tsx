"use client";

import { useCmsActions } from "@shopware/cms-base-layer-react/client";
import { useEffect, useRef, useState } from "react";

import { resolveApiErrorMessages } from "@/features/session/apiErrors";
import { useSession } from "@/features/session/components/SessionProvider";
import { useShopwareClient } from "@/features/storefront/components/ShopwareClientContext";
import { useTranslations } from "@/i18n/I18nProvider";

import { resolveNewsletterStorefrontUrl } from "../newsletterStorefrontUrl";
import {
  isNewsletterConfirmationNeeded,
  isNewsletterSubscriber,
  readNewsletterStatus,
  subscribeNewsletter,
  unsubscribeNewsletter,
} from "../profileApi";
import type { NewsletterStatus } from "../profileApi";

const CHECKBOX_ID = "newsletter-checkbox";
const CONFIRMATION_ID = "newsletter-confirmation-needed";

export function NewsletterSection({ email }: { email: string }) {
  const getClient = useShopwareClient();
  const { context } = useSession();
  const { notify } = useCmsActions();
  const t = useTranslations();
  const [status, setStatus] = useState<NewsletterStatus | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);

  useEffect(() => {
    let active = true;
    getClient()
      .then(readNewsletterStatus)
      .then(
        (current) => {
          if (!active) return;
          setStatus(current);
          setSubscribed(isNewsletterSubscriber(current));
        },
        (error: unknown) => {
          if (!active) return;
          console.error(
            "[Account] reading the newsletter status failed",
            error,
          );
          setStatus("undefined");
          setSubscribed(false);
        },
      );
    return () => {
      active = false;
    };
  }, [getClient, email]);

  const confirmationNeeded =
    status !== null && isNewsletterConfirmationNeeded(status);
  const disabled = status === null || confirmationNeeded || pending;

  async function handleChange(next: boolean) {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setSubscribed(next);
    try {
      const client = await getClient();
      if (next) {
        const storefrontUrl = await resolveNewsletterStorefrontUrl(context);
        setStatus(await subscribeNewsletter(client, { email, storefrontUrl }));
        notify({
          type: "success",
          message: t("account.overview.newsletter.messages.subscribed"),
        });
      } else {
        await unsubscribeNewsletter(client, email);
        notify({
          type: "success",
          message: t("account.overview.newsletter.messages.unsubscribed"),
        });
      }
    } catch (error) {
      setSubscribed(!next);
      for (const message of resolveApiErrorMessages(error, t)) {
        notify({ type: "error", message });
      }
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return (
    <div>
      <label htmlFor={CHECKBOX_ID} className="flex items-start gap-2">
        <input
          id={CHECKBOX_ID}
          type="checkbox"
          className="mt-1 size-4 shrink-0 accent-brand-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline-outline-focus"
          checked={subscribed}
          disabled={disabled}
          aria-busy={status === null || pending}
          aria-describedby={confirmationNeeded ? CONFIRMATION_ID : undefined}
          onChange={(event) => {
            void handleChange(event.target.checked);
          }}
        />
        <span
          className={
            disabled
              ? "text-surface-on-surface-disabled"
              : "text-surface-on-surface"
          }
        >
          {t("account.overview.newsletter.subscriptionLabel")}
        </span>
      </label>
      {confirmationNeeded ? (
        <p id={CONFIRMATION_ID} className="mb-2 text-sm text-states-error">
          {t("account.overview.newsletter.confirmationNeeded")}
        </p>
      ) : null}
    </div>
  );
}
