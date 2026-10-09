"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";

import { ShopwareClientProvider } from "@/features/storefront/components/ShopwareClientContext";
import type { Locale } from "@/i18n/config";
import { ContentLanguageProvider } from "@/i18n/ContentLanguageProvider";
import { useTranslations } from "@/i18n/I18nProvider";
import { contentLanguageFor } from "@/platform/shopware/reads/languageOptions";
import type { LanguageOption } from "@/platform/shopware/reads/languageOptions";

import { anonymousSession } from "../anonymousSession";
import type { SessionNotification } from "../sessionActions";
import { createSessionStore } from "../sessionStore";
import type { StorefrontSession } from "../types";
import { SessionActionsProvider } from "./SessionActionsContext";
import { SessionProvider } from "./SessionProvider";
import { ShopwareLanguagesProvider } from "./ShopwareLanguagesContext";

export type ShopwareSessionProviderProps = {
  notify: (notification: SessionNotification) => void;
  locale?: Locale;
  children: ReactNode;
};

function getServerSession(): StorefrontSession {
  return anonymousSession;
}

export function ShopwareSessionProvider({
  notify,
  locale,
  children,
}: ShopwareSessionProviderProps) {
  const [store] = useState(() => createSessionStore({ locale }));
  const t = useTranslations();
  const session = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    getServerSession,
  );

  useEffect(() => {
    if (locale) store.setLocale(locale);
  }, [store, locale]);

  useEffect(() => {
    void store.start();
  }, [store]);

  const [languages, setLanguages] = useState<LanguageOption[]>([]);

  useEffect(() => {
    if (session.status !== "ready") return;
    let active = true;
    void store.getLanguages().then((list) => {
      if (active) setLanguages(list);
    });
    return () => {
      active = false;
    };
  }, [store, session.status]);

  const loadLanguages = useCallback(async () => {
    const loaded = await store.loadLanguages();
    setLanguages(loaded.languages);
    return loaded;
  }, [store]);

  const contentLang = locale
    ? contentLanguageFor(
        locale,
        languages,
        session.context?.context?.languageIdChain?.[0],
      )
    : undefined;

  const failed = session.status === "error";

  useEffect(() => {
    if (!failed) return;
    const retry = () => {
      if (document.visibilityState === "visible") void store.retry();
    };
    window.addEventListener("online", retry);
    document.addEventListener("visibilitychange", retry);
    return () => {
      window.removeEventListener("online", retry);
      document.removeEventListener("visibilitychange", retry);
    };
  }, [failed, store]);

  const actions = useMemo(
    () => store.createActions(notify, t),
    [store, notify, t],
  );

  return (
    <ShopwareClientProvider getClient={store.getClient}>
      <SessionProvider session={session}>
        <SessionActionsProvider actions={actions}>
          <ShopwareLanguagesProvider languages={languages} load={loadLanguages}>
            <ContentLanguageProvider lang={contentLang}>
              {children}
            </ContentLanguageProvider>
          </ShopwareLanguagesProvider>
        </SessionActionsProvider>
      </SessionProvider>
    </ShopwareClientProvider>
  );
}
