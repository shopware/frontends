/**
 * i18n configuration
 */
export default defineI18nConfig(() => ({
  legacy: false,
  defaultLocale: "en-GB",
  fallbackLocale: "en-GB",
  allowComposition: true,
  globalInjection: true,
  locales: [
    {
      code: "en-GB",
      iso: "en-GB",
      file: "en-GB.ts",
    },
    {
      code: "pl-PL",
      iso: "pl-PL",
      file: "pl-PL.ts",
    },
    {
      code: "de-DE",
      iso: "de-DE",
      file: "de-DE.ts",
    },
  ],
}));
