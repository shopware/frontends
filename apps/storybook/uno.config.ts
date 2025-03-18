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
      statesInfo: {
        DEFAULT: "#0288D1",
      },
      statesSuccess: {
        DEFAULT: "#15B31C",
      },
      statesWarning: {
        DEFAULT: "#F57C00",
      },
      statesError: {
        DEFAULT: "#D12D24",
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
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased; 
      }
      `,
    },
  ],
});
