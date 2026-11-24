import type { NavigationTracker } from "../utils/webmcp/guards";
import type { ServeWebMcpTools } from "../utils/webmcp/register";

export default defineNuxtPlugin({
  name: "webmcp-tools",
  // Runs right after the router, next to the plugins that wait for the network.
  enforce: "pre",
  dependsOn: ["nuxt:router"],
  parallel: true,
  async setup() {
    let serveWebMcpTools: ServeWebMcpTools | undefined;
    let webMcpNavigations: NavigationTracker | undefined;
    // Off unless NUXT_PUBLIC_WEBMCP_ENABLED is true. Browsers without WebMCP
    // never run the tool code either.
    const { webmcpEnabled } = useRuntimeConfig().public;
    if (!webmcpEnabled || !("modelContext" in document)) {
      return { provide: { serveWebMcpTools, webMcpNavigations } };
    }
    const modules = await Promise.all([
      import("../utils/webmcp/register"),
      import("../utils/webmcp/tools"),
      import("../utils/webmcp/guards"),
    ]).catch((error: unknown) => {
      // The shop works without the tools, so a failed download only skips them.
      console.warn("[WebMCP] The tools did not load:", error);
    });
    if (!modules) return { provide: { serveWebMcpTools, webMcpNavigations } };
    const [
      { registerWebMcpTools, toolsActive },
      { webMcpLabels, webMcpTools },
      { trackNavigations },
    ] = modules;

    const router = useRouter();
    const { currentRoute } = router;
    // Starts before any call can be made, so a click during page load counts.
    webMcpNavigations = trackNavigations(router);
    const error = useError();
    const active = computed(() =>
      toolsActive(unref(currentRoute.value.meta.layout), error.value),
    );

    // i18n names each route "<page>___<locale>", like app.vue reads it. It runs later.
    const [, locale = ""] = String(currentRoute.value.name ?? "").split("___");
    const labels = webMcpLabels(locale);
    const tools = webMcpTools.map((tool) => ({
      ...tool,
      title: labels[tool.name],
    }));

    serveWebMcpTools = registerWebMcpTools(tools, active);
    return { provide: { serveWebMcpTools, webMcpNavigations } };
  },
});
