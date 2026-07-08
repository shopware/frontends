export default defineAppConfig({
  // Prefer build-time UnoCSS; enable only when CMS classes must be generated in the browser.
  unocssRuntime: false,

  // Override image placeholder with Lumora brand color
  imagePlaceholder: {
    color: "#B38A65", // Lumora brand-primary
  },
});
