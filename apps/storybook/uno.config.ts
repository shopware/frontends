import transformerDirectives from "@unocss/transformer-directives";
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
} from "unocss";

export default defineConfig({
  theme: {
    fontFamily: {
      inter: "Inter",
    },
  },
  presets: [
    presetUno(),
    presetIcons({
      collections: {
        carbon: () =>
          import("@iconify-json/carbon/icons.json").then((i) => i.default),
      },
    }),
    presetAttributify(),
    presetTypography(),
  ],
  preflights: [
    {
      getCSS: () => `
      body {
        font-family: 'Inter', sans-serif;
      }
      `,
    },
  ],
});
