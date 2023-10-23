import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
} from "unocss";
import transformerDirectives from "@unocss/transformer-directives";

export default defineConfig({
  theme: {
    extend: {
      width: "width",
      height: "height",
    },
    colors: {
      brand: {
        primary: "#0d588f",
        light: "#5ebbff",
        dark: "#026ebd",
      },
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
  transformers: [transformerDirectives()],
  preflights: [
    // preflights can be used to set some base styles
    {
      getCSS: () => `
      h1 {
        line-height: 2.5rem;
        font-size: 2.25rem;
      }
      h2 {
        line-height: 2rem;
        font-size: 1.75rem;
      }
      h3 {
        line-height: 1.5rem;
        font-size: 1.25rem;
      }
      ol,
      ul,
      dl {
        list-style-type: disc;
        padding-left: 40px;
        margin-top: 0;
        margin-bottom: 1rem;
      }
      ol {
        list-style-type: decimal;
      }
      `,
    },
  ],
});
