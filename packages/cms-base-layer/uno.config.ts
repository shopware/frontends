import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWind3,
} from "unocss";
import { THEME_COLORS } from "./app/helpers/theme";

export default defineConfig({
  shortcuts: {},
  preflights: [
    {
      getCSS: () => `
        /* Filter collapse transition */
        .filter-collapse-enter-active,
        .filter-collapse-leave-active {
          transition: all 0.3s ease-in-out;
          overflow: hidden;
        }

        .filter-collapse-enter-from,
        .filter-collapse-leave-to {
          max-height: 0;
          opacity: 0;
        }

        .filter-collapse-enter-to,
        .filter-collapse-leave-from {
          max-height: 1000px;
          opacity: 1;
        }
      `,
    },
  ],
  theme: {
    colors: THEME_COLORS,
    fontFamily: {
      inter: "Inter",
      Noto_Serif: "Noto Serif",
    },
  },
  safelist: ["states-success", "states-error", "states-info", "states-warning"],
  presets: [
    presetWind3(),
    presetIcons({
      collections: {
        carbon: () =>
          import("@iconify-json/carbon/icons.json", {
            with: { type: "json" },
          }).then((i) => i.default),
      },
    }),
    presetAttributify(),
    presetTypography(),
  ],
});
