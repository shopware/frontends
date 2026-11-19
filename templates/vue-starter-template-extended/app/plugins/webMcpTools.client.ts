import { registerWebMcpTools } from "~/utils/webmcp/register";
import { webMcpLabels, webMcpTools } from "~/utils/webmcp/tools";

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

    // i18n names each route "<page>___<locale>", like app.vue reads it. It runs later.
    const [, locale = ""] = String(currentRoute.value.name ?? "").split("___");
    const labels = webMcpLabels(locale);
    const tools = webMcpTools.map((tool) => ({
      ...tool,
      title: labels[tool.name],
    }));

    return {
      provide: { serveWebMcpTools: registerWebMcpTools(tools, active) },
    };
  },
});
