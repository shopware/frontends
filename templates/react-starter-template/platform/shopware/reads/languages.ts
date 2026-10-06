import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import type { Locale } from "@/i18n/config";

import { createShopwareClient } from "../client";
import { readSalesChannelContext } from "./context";
import {
  contentLanguageFor,
  findLanguageId,
  toLanguageOptions,
} from "./languageOptions";
import type { LanguageOption } from "./languageOptions";

export async function readLanguages(): Promise<LanguageOption[]> {
  "use cache";
  cacheLife("reference");
  cacheTag("sw:languages");

  const { data } = await createShopwareClient().invoke(
    "readLanguagesGet get /language",
  );
  return toLanguageOptions(data.elements ?? []);
}

let loggedReadFailure = false;

export async function resolveLanguageId(
  locale: Locale,
): Promise<string | null> {
  try {
    return findLanguageId(await readLanguages(), locale);
  } catch (error) {
    if (!loggedReadFailure) {
      loggedReadFailure = true;
      console.error(
        "[Shopware] reading the languages failed, so the default language is used",
        error,
      );
    }
    return null;
  }
}

export type ContentLanguage = {
  languageId: string | null;
  contentLang: string | undefined;
};

let loggedDefaultLanguageFailure = false;

export async function resolveContentLanguage(
  locale: Locale,
): Promise<ContentLanguage> {
  const languageId = await resolveLanguageId(locale);
  if (languageId) return { languageId, contentLang: undefined };
  try {
    const [languages, context] = await Promise.all([
      readLanguages(),
      readSalesChannelContext(null),
    ]);
    return {
      languageId,
      contentLang: contentLanguageFor(
        locale,
        languages,
        context.context?.languageIdChain?.[0],
      ),
    };
  } catch (error) {
    if (!loggedDefaultLanguageFailure) {
      loggedDefaultLanguageFailure = true;
      console.error(
        "[Shopware] reading the default language failed, so no content language is declared",
        error,
      );
    }
    return { languageId, contentLang: undefined };
  }
}
