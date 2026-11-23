"use client";

import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";

import type {
  LanguageOption,
  SalesChannelLanguages,
} from "@/platform/shopware/reads/languageOptions";

type LoadLanguages = () => Promise<SalesChannelLanguages>;

type ShopwareLanguages = {
  languages: LanguageOption[];
  load: LoadLanguages;
};

const NO_LANGUAGES: LanguageOption[] = [];

const ShopwareLanguagesContext = createContext<ShopwareLanguages>({
  languages: NO_LANGUAGES,
  load: async () => ({ languages: NO_LANGUAGES, defaultLanguageId: null }),
});

export function ShopwareLanguagesProvider({
  languages,
  load,
  children,
}: {
  languages: LanguageOption[];
  load: LoadLanguages;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ languages, load }), [languages, load]);
  return (
    <ShopwareLanguagesContext value={value}>
      {children}
    </ShopwareLanguagesContext>
  );
}

export function useShopwareLanguages(): LanguageOption[] {
  return useContext(ShopwareLanguagesContext).languages;
}

export function useLoadShopwareLanguages(): LoadLanguages {
  return useContext(ShopwareLanguagesContext).load;
}
