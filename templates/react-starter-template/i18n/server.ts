import "server-only";
import { notFound } from "next/navigation";

import { isLocale } from "./config";
import type { Locale } from "./config";
import { getMessages } from "./messages";
import type { Messages } from "./messages";
import { createTranslator } from "./translate";
import type { Translate } from "./translate";

const translators = new Map<Locale, Translate>();

export function getTranslator(locale: Locale): Translate {
  let translator = translators.get(locale);
  if (!translator) {
    translator = createTranslator(locale, getMessages(locale));
    translators.set(locale, translator);
  }
  return translator;
}

export function getMessagesFor(locale: Locale): Messages {
  return getMessages(locale);
}

export async function localeFromParams(
  params: Promise<{ locale: string }>,
): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}
