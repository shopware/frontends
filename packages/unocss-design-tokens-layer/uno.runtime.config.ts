import type { ConfigBase } from "@unocss/core";
// Import the preset from its own package, not the `unocss` barrel. This config is
// loaded by a client plugin, and the barrel statically re-exports
// `@unocss/transformer-attributify-jsx`, which pulls `oxc-parser` and its wasm
// binding into the client bundle.
import { presetWind3 } from "@unocss/preset-wind3";

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
