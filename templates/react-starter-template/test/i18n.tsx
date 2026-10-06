import type { ReactNode } from "react";

import { defaultLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { I18nProvider } from "@/i18n/I18nProvider";
import { getMessages } from "@/i18n/messages";
import { createTranslator } from "@/i18n/translate";
import type { Translate } from "@/i18n/translate";

export function withI18n(node: ReactNode, locale: Locale = defaultLocale) {
  return (
    <I18nProvider locale={locale} messages={getMessages(locale)}>
      {node}
    </I18nProvider>
  );
}

export function testTranslator(locale: Locale = defaultLocale): Translate {
  return createTranslator(locale, getMessages(locale));
}
