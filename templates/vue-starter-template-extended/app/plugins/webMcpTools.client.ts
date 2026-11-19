export default defineNuxtPlugin({
  name: "webmcp-tools",
  // Runs right after the router, before the plugins that wait for the network.
  enforce: "pre",
  dependsOn: ["nuxt:router"],
  setup() {
    const { currentRoute } = useRouter();
    const error = useError();

    // Only the default layout renders <WebMcpTools />, which runs the tools.
    const active = computed(
      () =>
        !error.value &&
        (unref(currentRoute.value.meta.layout) ?? "default") === "default",
    );

    // The server sets the page language on <html>. The i18n plugin runs later.
    const labels = webMcpLabels(document.documentElement.lang);
    const tools = webMcpTools.map((tool) => ({
      ...tool,
      title: labels[tool.name],
    }));

    return {
      provide: { serveWebMcpTools: registerWebMcpTools(tools, active) },
    };
  },
});
