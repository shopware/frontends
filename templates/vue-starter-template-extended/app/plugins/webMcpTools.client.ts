import type { ServeWebMcpTools } from "~/utils/webmcp/register";

export default defineNuxtPlugin({
  name: "webmcp-tools",
  // Runs right after the router, next to the plugins that wait for the network.
  enforce: "pre",
  dependsOn: ["nuxt:router"],
  parallel: true,
  async setup() {
    let serveWebMcpTools: ServeWebMcpTools | undefined;
    // Most browsers have no WebMCP. They load none of the tool code.
    if (!("modelContext" in document)) return { provide: { serveWebMcpTools } };
    const modules = await Promise.all([
      import("~/utils/webmcp/register"),
      import("~/utils/webmcp/tools"),
    ]).catch((error: unknown) => {
      // The shop works without the tools, so a failed download only skips them.
      console.warn("[WebMCP] The tools did not load:", error);
    });
    if (!modules) return { provide: { serveWebMcpTools } };
    const [{ registerWebMcpTools }, { webMcpLabels, webMcpTools }] = modules;

    const { currentRoute } = useRouter();
    const error = useError();

    // Only the default layout renders <WebMcpTools />, which runs the tools.
    const active = computed(
      () =>
        !error.value &&
        (unref(currentRoute.value.meta.layout) ?? "default") === "default",
    );

    // i18n names each route "<page>___<locale>", like app.vue reads it. It runs later.
    const [, locale = ""] = String(currentRoute.value.name ?? "").split("___");
    const labels = webMcpLabels(locale);
    const tools = webMcpTools.map((tool) => ({
      ...tool,
      title: labels[tool.name],
    }));

    serveWebMcpTools = registerWebMcpTools(tools, active);
    return { provide: { serveWebMcpTools } };
  },
});
