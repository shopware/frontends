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

    registerWebMcpTools(webMcpTools, active);
  },
});
