"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

const ContentLanguageContext = createContext<string | undefined>(undefined);

export type ContentLanguageProviderProps = {
  lang: string | undefined;
  children: ReactNode;
};

export function ContentLanguageProvider({
  lang,
  children,
}: ContentLanguageProviderProps) {
  return (
    <ContentLanguageContext value={lang}>{children}</ContentLanguageContext>
  );
}

export function useContentLang(): string | undefined {
  return useContext(ContentLanguageContext);
}
