import type { ConfigBase } from "@unocss/core";
import { presetWind3 } from "unocss";

import { designTokenTheme } from "./theme";

/**
 * Slim config for @unocss/runtime on the client.
 * Omits presetIcons / icon collection loaders so the full @iconify-json/carbon
 * JSON (~1.1 MB) is not shipped as a client chunk. Icon utilities must come from
 * the build-time UnoCSS scan or safelist.
 */
const runtimeConfig: ConfigBase = {
  theme: designTokenTheme,
  presets: [presetWind3()],
};

export default runtimeConfig;
