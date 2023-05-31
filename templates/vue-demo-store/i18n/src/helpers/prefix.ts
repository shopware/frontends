import i18nConfig from "../config";
export function getPrefix(locales: string[], name: string) {
  if (name.includes(i18nConfig.defaultLocale)) return "";
  const index = locales.findIndex((element) => name.includes(element));
  return index ? locales[index] : "";
}

export function getDefaultLocale() {
  return i18nConfig.defaultLocale;
}
