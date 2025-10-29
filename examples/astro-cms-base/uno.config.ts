import {
  defineConfig,
  presetUno,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

// This configuration matches the cms-base-layer UnoCSS setup
export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      collections: {
        carbon: () =>
          import("@iconify-json/carbon/icons.json").then((i) => i.default),
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  theme: {
    colors: {
      // Match cms-base-layer theme colors
      brand: {
        primary: "#1976d2",
        "primary-dark": "#004ba0",
        "primary-light": "#63a4ff",
      },
      surface: {
        primary: "#ffffff",
        secondary: "#f5f5f5",
      },
      outline: {
        primary: "#e0e0e0",
      },
    },
  },
  shortcuts: {
    // Add common shortcuts used in cms-base-layer
    btn: "px-4 py-2 rounded-lg font-medium transition-colors",
    "btn-primary": "btn bg-brand-primary text-white hover:bg-[#004ba0]",
  },
});
