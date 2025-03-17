// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  vite: {
    server: {
      allowedHosts: ["local.de", "local.pl"],
    },
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/i18n", "@unocss/nuxt"],
  i18n: {
    strategy: "prefix",
    detectBrowserLanguage: false,
    multiDomainLocales: true,
    langDir: "./i18n/",
    locales: [
      {
        code: "de",
        file: "de-DE.ts",
        language: "de-DE",
        domains: ["local.de:3000"],
        defaultForDomains: ["local.de:3000"],
      },
      {
        code: "pl",
        file: "pl-PL.ts",
        language: "pl-PL",
        domains: ["local.pl:3000"],
        defaultForDomains: ["local.pl:3000"],
      },
      {
        code: "fr",
        file: "fr-FR.ts",
        language: "fr-FR",
        domains: ["local.de:3000"],
      },
      {
        code: "en",
        file: "en-US.ts",
        language: "en-US",
        domains: ["local.pl:3000", "local.de:3000"],
      },
    ],
  },
});
