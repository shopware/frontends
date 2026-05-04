import initUnocssRuntime from "@unocss/runtime";
import { defineNuxtPlugin, useAppConfig } from "#imports";
import config from "../../uno.config";

// Resolves UnoCSS utility classes at runtime via DOM MutationObserver.
// Needed when CMS content contains dynamic classes not known at build time,
// since extracting all CMS-used classes from the backend during build is impractical.
// Trade-off: may cause layout shift as styles are applied after hydration.
// Can be disabled via app.config.ts: { unocssRuntime: false }
// When disabled, CMS classes unknown at build time won't be resolved —
// add them to the UnoCSS safelist in uno.config.ts to ensure they are generated.
export default defineNuxtPlugin(() => {
  const appConfig = useAppConfig();
  if (!appConfig.unocssRuntime) return;

  initUnocssRuntime({ defaults: config });
});
