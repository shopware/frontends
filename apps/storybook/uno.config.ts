import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
} from "unocss";

export default defineConfig({
  theme: {
    colors: {
      brandPrimary: {
        DEFAULT: "#543b95",
      },
      surfaceOnSurface: {
        DEFAULT: "#1d1b20",
      },
      brandPrimaryHover: {
        DEFAULT: "#45317a",
      },
    },
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
