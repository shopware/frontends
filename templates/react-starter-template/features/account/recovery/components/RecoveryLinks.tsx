"use client";

import { cx } from "@shopware/cms-base-layer-react/client";

import { LocaleLink } from "@/components/LocaleLink";
import { useTranslations } from "@/i18n/I18nProvider";

export const RECOVER_PASSWORD_PATH = "/account/recover";

const LOGIN_PATH = "/account/login";

const TEXT_LINK_CLASS =
  "inline-flex min-h-6 items-center rounded-sm text-sm text-surface-on-surface underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-outline-outline-focus";

export function ForgotPasswordLink() {
  const t = useTranslations();
  return (
    <LocaleLink
      href={RECOVER_PASSWORD_PATH}
      data-testid="login-forgot-password-link"
      className={cx(TEXT_LINK_CLASS, "self-start")}
    >
      {t("account.recoverPassword.link")}
    </LocaleLink>
  );
}

export function BackToLoginLink() {
  const t = useTranslations();
  return (
    <LocaleLink
      href={LOGIN_PATH}
      data-testid="account-recover-password-back-link"
      className={TEXT_LINK_CLASS}
    >
      {t("account.recoverPassword.backToLogin")}
    </LocaleLink>
  );
}
