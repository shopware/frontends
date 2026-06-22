<script setup lang="ts">
import { sampleHome } from "./sample-home";

type Section = { _key: string; _type: string; [key: string]: unknown };

// Sanity owns the layout via a Page Builder: an ordered array of section blocks
// the editor composes. `groq` + `useSanityQuery` are auto-imported by @nuxtjs/sanity.
const PAGE_QUERY = groq`*[_type == "page"] | order(_createdAt asc)[0]{
  title,
  pageBuilder[]{ ... }
}`;

const { data: page } = await useSanityQuery<{
  title?: string;
  pageBuilder?: Section[];
} | null>(PAGE_QUERY);

// Live Sanity content wins; fall back to bundled demo content so the layout is
// visible before a real `page` document exists in the Studio.
const sections = computed<Section[]>(
  () => page.value?.pageBuilder ?? (sampleHome.pageBuilder as Section[]),
);
const usingSample = computed(() => !page.value?.pageBuilder?.length);

// Shared notifications store at the app root (product cards push toasts here).
const { notifications } = useNotifications();

// Load the existing cart on the client so the mini cart reflects items from a
// previous visit - not just ones added in this session. The cart is per-user
// session state, so it's loaded client-side rather than baked into the
// (cacheable) SSR HTML.
const { refreshCart } = useCart();
onMounted(() => {
  refreshCart();
});
</script>

<template>
  <div
    test-id="test-wrapper"
    class="min-h-screen bg-slate-50 pb-28 font-sans text-slate-900 antialiased"
  >
    <PageBuilder :sections="sections" />

    <p v-if="usingSample" class="px-6 py-10 text-center text-sm text-slate-400">
      Showing bundled demo content. Create a <code>page</code> in
      <code>studio-composable-frontends</code> and it renders here instead.
    </p>

    <!-- Fixed mini cart pinned to the bottom -->
    <MiniCart />

    <!-- Cart toast notifications -->
    <div
      class="pointer-events-none fixed inset-x-0 top-6 z-50 flex flex-col items-center gap-3 px-4"
    >
      <TransitionGroup name="toast">
        <div
          v-for="n in notifications"
          :key="n.id"
          class="pointer-events-auto rounded-2xl px-5 py-3 text-sm font-medium text-white shadow-xl"
          :class="
            n.type === 'success'
              ? 'bg-gradient-to-r from-emerald-500 to-green-600'
              : n.type === 'error'
                ? 'bg-gradient-to-r from-rose-500 to-red-600'
                : 'bg-slate-800'
          "
        >
          {{ n.message }}
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
