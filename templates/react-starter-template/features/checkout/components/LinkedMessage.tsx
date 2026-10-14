"use client";

import { LocaleLink } from "@/components/LocaleLink";
import { useTranslations } from "@/i18n/I18nProvider";

import { splitLinkedMessage } from "../linkedMessage";

const LINK_CLASS =
  "rounded-sm font-medium underline underline-offset-2 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline-outline-focus";

export type LinkedMessageProps = {
  messageKey: string;
  linkKey: string;
  href: string | null;
};

export function LinkedMessage({
  messageKey,
  linkKey,
  href,
}: LinkedMessageProps) {
  const t = useTranslations();
  const { before, link, after } = splitLinkedMessage(t, messageKey, linkKey);
  if (!href || !link) return <>{`${before}${link}${after}`}</>;

  const content = (
    <>
      {link}
      <span className="sr-only"> {t("checkout.terms.opensInNewTab")}</span>
    </>
  );

  return (
    <>
      {before}
      {href.startsWith("/") ? (
        <LocaleLink
          href={href}
          target="_blank"
          rel="noopener"
          prefetch={false}
          className={LINK_CLASS}
        >
          {content}
        </LocaleLink>
      ) : (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASS}
        >
          {content}
        </a>
      )}
      {after}
    </>
  );
}
