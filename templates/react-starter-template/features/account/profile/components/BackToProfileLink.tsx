"use client";

import { LocaleLink } from "@/components/LocaleLink";
import { useTranslations } from "@/i18n/I18nProvider";

import { PROFILE_PATH } from "../useCredentialChange";

export function BackToProfileLink() {
  const t = useTranslations();
  return (
    <LocaleLink
      href={PROFILE_PATH}
      className="inline-flex items-center gap-1 text-sm text-brand-primary"
    >
      <span aria-hidden="true">&lt;</span>
      {t("account.back")}
    </LocaleLink>
  );
}
