import { defineNuxtConfig } from "nuxt/config";

const defaultLocale = "en-GB";
const locales = ["en-GB", "pl-PL", "de-DE"];

// Rendered in the browser and never cached. "ssr: false" alone would leave the
// empty app shell in the "/**" ISR cache.
const personalizedRule = {
  ssr: false,
  isr: false,
  headers: {
    "Cache-Control": "private, no-store",
    "Surrogate-Control": "no-store",
  },
};
const personalizedPaths = [
  "/checkout",
  "/checkout/**",
  "/account",
  "/account/**",
  "/wishlist",
];

// Route rules match raw paths, so each path is repeated under every locale prefix.
const personalizedRules = Object.fromEntries(
  locales
    .map((locale) => (locale === defaultLocale ? "" : `/${locale}`))
    .flatMap((prefix) =>
      personalizedPaths.map(
        (path) => [`${prefix}${path}`, personalizedRule] as const,
      ),
    ),
);

export default defineNuxtConfig({
  routeRules: {
    "/**": {
      // 24-hour ISR - reduce for frequently updated catalogs or CMS-heavy storefronts
      isr: 60 * 60 * 24, // 86400s
    },
    "/**/*.svg": {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable", // 1 year
      },
    },
    ...personalizedRules,
  },
});
