import { type ConfigBase, mergeConfigs } from "@unocss/core";
import starterConfig from "vue-starter-template/uno.config";

/**
 * Required, not optional.
 *
 * With `unocss.nuxtLayers` enabled, a layer still has to import the base config
 * itself. Without this file the module quietly falls back to its default preset:
 * generic utilities keep working, so the page looks nearly right, while the whole
 * Shopware design token layer goes missing - brand colours, surfaces and every
 * icon, since `presetIcons` is configured there.
 */
const adaptiveConfig: ConfigBase = {
  theme: {
    colors: {
      // Deliberately not the stock purple. The spike is a different thing from
      // the starter and should not be mistaken for it in a screenshot, and
      // overriding tokens here only works if the base config above really
      // loaded - so this doubles as a check that it did.
      "brand-primary": "#0E7C7B",
      "brand-primary-hover": "#0A6160",
      "brand-primary-pressed": "#084E4D",
      "brand-on-primary": "#FFFFFF",

      "brand-secondary": "#C7F0EE",
      "brand-secondary-hover": "#A9E6E3",
      "brand-secondary-pressed": "#8FDCD8",
      "brand-on-secondary": "#06403F",

      "brand-tertiary": "#F1F5F4",
      "brand-tertiary-hover": "#E4EDEB",
      "brand-tertiary-pressed": "#D8E6E4",
      "brand-on-tertiary": "#17211F",

      "surface-background": "#FBFDFC",
      "surface-surface": "#FFFFFF",
      "surface-surface-primary": "#D8EFED",
      "surface-on-surface-primary": "#06403F",
      "surface-surface-variant": "#E9F1F0",
      "surface-surface-container-lowest": "#FFFFFF",
      "surface-surface-container-low": "#F5F9F8",
      "surface-surface-container": "#EFF5F4",
      "surface-surface-container-high": "#E6EFEE",
      "surface-surface-container-highest": "#DCE8E6",
      "surface-on-surface": "#17211F",
      "surface-on-surface-variant": "#55625F",
      "surface-on-background": "#17211F",
      "surface-inverse-surface": "#17211F",
      "surface-inverse-on-surface": "#FFFFFF",

      "outline-outline": "#7C8B88",
      "outline-outline-variant": "#C6D4D1",
      "outline-outline-primary": "#0E7C7B",
      "outline-outline-focus": "#0E7C7B",

      "other-sale": "#C2410C",
    },
  },
  content: {
    // The starter's config brings `presetAttributify`, whose extractor reads
    // anything shaped like an element. Zod's generics parse as exactly that, so
    // scanning it emits rules like `[object~="$ZodCheckGreaterThan"]` that are
    // not valid CSS and take the whole stylesheet down with them. The starter
    // never hits this because it has no zod.
    pipeline: {
      exclude: [/node_modules/, /\.nuxt/],
    },
  },
  safelist: [
    // Set by the plan at runtime rather than written in any template, so the
    // scanner cannot see them. The schemas bound both values, which is what
    // keeps this list short and complete.
    "max-w-[1800px]",
    "max-w-none",
    "max-w-screen-2xl",
  ],
};

export default mergeConfigs([starterConfig, adaptiveConfig]);
