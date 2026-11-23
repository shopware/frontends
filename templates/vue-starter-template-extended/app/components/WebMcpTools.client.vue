<script setup lang="ts">
import { createWebMcpHandlers } from "~/utils/webmcp/handlers";
import type { WebMcpToolHandler } from "~/utils/webmcp/register";
import { webMcpLabels } from "~/utils/webmcp/tools";
import type { WebMcpToolName } from "~/utils/webmcp/tools";

const nuxtApp = useNuxtApp();
const i18n = useI18n();

// Resolves when the next page has rendered, or after 5 seconds.
function nextPage() {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(done, 5000);
    const unhook = nuxtApp.hooks.hookOnce("page:finish", done);
    function done() {
      clearTimeout(timer);
      unhook();
      resolve();
    }
  });
}

const { handlers, dispose } = createWebMcpHandlers({
  apiClient: useShopwareContext().apiClient,
  invokeRead: useCacheableRead().invokeRead,
  cart: useCart(),
  currency: useSessionContext().currency,
  navigation: useNavigation(),
  resolvePath: useNavigationSearch().resolvePath,
  notifications: useNotifications(),
  i18n,
  localePath: useLocalePath(),
  router: useRouter(),
  navigate: navigateTo,
  nextPage,
});

// The shopper sees every step, also the ones that change nothing on the page.
const activity = ref("");
let fade: ReturnType<typeof setTimeout> | undefined;

function announced(name: WebMcpToolName): WebMcpToolHandler {
  return async (input, stop, madeAt) => {
    const labels = webMcpLabels(i18n.locale.value);
    clearTimeout(fade);
    activity.value = `${labels.assistant}: ${labels[name]}`;
    try {
      return await handlers[name](input, stop, madeAt);
    } finally {
      fade = setTimeout(() => {
        activity.value = "";
      }, 3000);
    }
  };
}

let stopServing = () => {};
onMounted(() => {
  const names = Object.keys(handlers) as WebMcpToolName[];
  stopServing =
    nuxtApp.$serveWebMcpTools?.(
      Object.fromEntries(names.map((name) => [name, announced(name)])),
    ) ?? stopServing;
});
onBeforeUnmount(() => {
  stopServing();
  dispose();
  clearTimeout(fade);
});
</script>

<template>
  <p
    role="status"
    data-testid="agent-activity"
    :class="
      activity
        ? 'pointer-events-none fixed bottom-4 left-4 z-40 m-0 rounded-md bg-surface-inverse-surface px-4 py-2 text-sm text-surface-inverse-on-surface shadow-lg'
        : 'sr-only'
    "
  >
    {{ activity }}
  </p>
</template>
