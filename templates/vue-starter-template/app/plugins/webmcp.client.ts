import { createLocalTransport, registerWebMcp } from "@shopware/webmcp";
import type { NextTarget, WebMcpHandle, WebMcpMode } from "@shopware/webmcp";

type WebMcpRuntimeConfig = { mode?: WebMcpMode };

/**
 * Registers the storefront's tools with the WebMCP browser API, so an agent
 * running in the shopper's browser can search, read and change the shopper's
 * own cart. Checkout is only ever opened, never completed.
 *
 * Proof of concept: tools run in the browser through the app's api-client.
 * When the Agentic Commerce plugin ships its dispatcher, swap
 * `createLocalTransport` for `createDispatcherTransport`.
 */
export default defineNuxtPlugin({
  name: "shopware-webmcp",
  // The @shopware/nuxt-module plugin is module-registered, so it runs first.
  async setup(nuxtApp) {
    const config = useRuntimeConfig().public.webMcp as
      | WebMcpRuntimeConfig
      | undefined;
    const mode = config?.mode ?? "off";
    if (mode === "off") return;

    const router = useRouter();
    const localePath = useLocalePath();
    const pageContext = useWebMcpPageContext();
    const { refreshCart } = useCart();

    router.beforeEach(() => {
      pageContext.value = {};
    });

    function routeFor(next: NextTarget): string {
      switch (next.target) {
        case "checkout.confirm":
        case "checkout.register":
          // The starter's checkout page collects guest details inline.
          return localePath("/checkout");
        case "cart":
          return localePath("/checkout/cart");
        case "product":
          return next.url ?? localePath("/");
      }
    }

    let handle: WebMcpHandle | undefined;
    try {
      handle = await registerWebMcp({
        transport: createLocalTransport({
          apiClient: nuxtApp.$shopwareApiClient,
          mode,
        }),
        pageContext: () => pageContext.value,
        onCartChanged: () => nuxtApp.runWithContext(() => refreshCart()),
        navigate: (next) => router.push(routeFor(next)),
      });
    } catch (error) {
      console.warn("[webmcp] registration failed", error);
      return;
    }

    nuxtApp.vueApp.onUnmount(() => handle?.dispose());

    if (import.meta.dev) {
      // Lets you try the tools from the devtools console without a WebMCP
      // browser: __shopwareWebMcp.call("search_products", { query: "shirt" })
      (
        window as Window & { __shopwareWebMcp?: WebMcpHandle }
      ).__shopwareWebMcp = handle;
      console.info(
        `[webmcp] ${handle.tools.length} tools in "${mode}" mode, browser registration: ${handle.registered}`,
      );
    }
  },
});
