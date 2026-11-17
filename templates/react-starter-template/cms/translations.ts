import { defu } from "defu";

export type CmsTranslations = {
  [key: string]: string | CmsTranslations;
};

export function withTranslationDefaults<DEFAULTS extends CmsTranslations>(
  translations: CmsTranslations | undefined,
  defaults: DEFAULTS,
): DEFAULTS {
  return defu(translations ?? {}, defaults) as DEFAULTS;
}

export { getCmsTranslate } from "@shopware/helpers";
