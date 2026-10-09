import "server-only";
import { createCmsContext } from "@shopware/cms-base-layer-react";
import type {
  CmsContext,
  CmsTranslations,
  CreateCmsContextInput,
} from "@shopware/cms-base-layer-react";

import { localePrefix } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { getMessagesFor } from "@/i18n/server";

import { readSalesChannelContext } from "../shopware/reads/context";
import { cmsRegistry } from "./registry";

export type StorefrontCmsContextInput = Omit<
  CreateCmsContextInput,
  | "registry"
  | "locale"
  | "currencyCode"
  | "urlPrefix"
  | "taxState"
  | "navigationCategoryId"
  | "isLoggedIn"
  | "translations"
> & {
  locale: Locale;
  languageId: string | null;
};

export async function createStorefrontCmsContext({
  locale,
  languageId,
  ...input
}: StorefrontCmsContextInput): Promise<CmsContext> {
  const salesChannelContext = await readSalesChannelContext(languageId);
  return createCmsContext({
    registry: cmsRegistry,
    locale,
    urlPrefix: localePrefix(locale),
    translations: getMessagesFor(locale) as CmsTranslations,
    currencyCode: salesChannelContext.currency?.isoCode ?? "EUR",
    taxState: salesChannelContext.context?.taxState === "net" ? "net" : "gross",
    navigationCategoryId: salesChannelContext.salesChannel.navigationCategoryId,
    isLoggedIn: false,
    ...input,
  });
}
