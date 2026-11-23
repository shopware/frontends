"use client";

import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";

import { defaultLocale, withLocale } from "./config";
import type { Locale } from "./config";
import defaultMessages from "./en-GB/en-GB";
import type { Messages } from "./messages";
import { createTranslator } from "./translate";
import type { Translate } from "./translate";

type I18nContextValue = {
  locale: Locale;
  messages: Messages;
  t: Translate;
  localePath: (path: string) => string;
};

function createContextValue(
  locale: Locale,
  messages: Messages,
): I18nContextValue {
  return {
    locale,
    messages,
    t: createTranslator(locale, messages),
    localePath: (path) => withLocale(path, locale),
  };
}

const I18nContext = createContext<I18nContextValue>(
  createContextValue(defaultLocale, defaultMessages),
);

export type I18nProviderProps = {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
};

export function I18nProvider({
  locale,
  messages,
  children,
}: I18nProviderProps) {
  const value = useMemo(
    () => createContextValue(locale, messages),
    [locale, messages],
  );
  return <I18nContext value={value}>{children}</I18nContext>;
}

export function useLocale(): Locale {
  return useContext(I18nContext).locale;
}

export function useTranslations(): Translate {
  return useContext(I18nContext).t;
}

export function useLocalePath(): (path: string) => string {
  return useContext(I18nContext).localePath;
}

export function useMessages(): Messages {
  return useContext(I18nContext).messages;
}
