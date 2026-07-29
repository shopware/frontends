import { fileURLToPath } from "node:url";

import transformerDirectives from "@unocss/transformer-directives";

const layerRoot = fileURLToPath(new URL(".", import.meta.url));

const config: Record<string, unknown> = {
  content: {
    filesystem: [`${layerRoot}/app/**/*.{ts,vue}`],
  },
  transformers: [transformerDirectives()],
};

export default config;
