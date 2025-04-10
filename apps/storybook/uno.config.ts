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
      /** Primary */
      brandPrimary: {
        DEFAULT: "#543b95",
      },
      brandOnPrimary: {
        DEFAULT: "#ffffff",
      },
      brandPrimaryHover: {
        DEFAULT: "#45317a",
      },
      /** Secondary */
      brandSecondary: {
        DEFAULT: "#E1D5FF",
      },
      surfaceOnSurface: {
        DEFAULT: "#1d1b20",
      },
      brandSecondaryHover: {
        DEFAULT: "#D0BCFC",
      },
      brandOnSecondary: {
        DEFAULT: "#3A276A",
      },

      /** Tertiary */
      brandTertiary: {
        DEFAULT: "#f1f1f1",
      },
      brandTertiaryHover: {
        DEFAULT: "#e2e2e2",
      },
      brandOnTertiary: {
        DEFAULT: "#1d1b20",
      },

      /** Surface */
      surfaceSurfaceContainer: {
        DEFAULT: "#F3EDF7",
      },
      surfaceSurfaceDisabled: {
        DEFAULT: "#e8e8e8",
      },
      surfaceOnSurfaceDisabled: {
        DEFAULT: "#9893a5",
      },
      surfaceSurface: {
        DEFAULT: "#ffffff",
      },

      /** Outline */
      outlineOutline: {
        DEFAULT: "#79747e",
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
      Noto_Serif: "Noto Serif",
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
