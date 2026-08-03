import type { ConfigBase } from "@unocss/core";
import { presetIcons, presetWind3 } from "unocss";

import { designTokenTheme } from "./theme";

const templateConfig: ConfigBase = {
  theme: designTokenTheme,
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
  ],
};

export default templateConfig;
