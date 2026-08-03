<script setup lang="ts">
const { breadcrumbs, clearBreadcrumbs } = useBreadcrumbs();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
const router = useRouter();
const breadcrumbTransitionDuration = 180;
const isTrailVisible = ref(true);
let collapsePromise: Promise<void> | undefined;
let finishCollapse: (() => void) | undefined;

if (import.meta.client) {
  const collapseTrail = () => {
    if (collapsePromise) return collapsePromise;

    collapsePromise = new Promise<void>((resolve) => {
      const fallback = window.setTimeout(
        () => finishCollapse?.(),
        breadcrumbTransitionDuration + 80,
      );

      finishCollapse = () => {
        window.clearTimeout(fallback);
        finishCollapse = undefined;
        resolve();
      };

      isTrailVisible.value = false;
    });

    return collapsePromise;
  };

  const removeRouteGuard = router.beforeEach(async (to, from) => {
    if (to.fullPath === from.fullPath || !breadcrumbs.value.length) return;

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      await collapseTrail();
    }

    clearBreadcrumbs();
  });

  const removeAfterEach = router.afterEach((_to, _from, failure) => {
    if (!failure) return;

    collapsePromise = undefined;
    finishCollapse = undefined;
    isTrailVisible.value = true;
  });

  onBeforeUnmount(() => {
    finishCollapse?.();
    removeRouteGuard();
    removeAfterEach();
  });
}
</script>

<template>
  <nav
    class="container hidden min-h-6 lg:flex mt-8 mb-8 px-4 sm:px-0 mx-auto"
    :aria-label="$t('layout.ariaLabels.breadcrumb')"
  >
    <Transition name="breadcrumb" appear @after-leave="finishCollapse?.()">
      <ol
        v-if="isTrailVisible && breadcrumbs.length"
        class="breadcrumb-trail inline-flex items-center gap-x-1 md:gap-x-3"
      >
        <li class="inline-flex items-center">
          <LayoutBreadcrumbsElement :to="formatLink(`/`)">
            <div class="flex items-center">
              <div class="w-5 h-5 i-carbon-home mr-2" />
              <div>{{ $t("home") }}</div>
            </div>
          </LayoutBreadcrumbsElement>
          <LayoutBreadcrumbsDivider />
        </li>
        <li
          v-for="(breadcrumb, index) in breadcrumbs"
          :key="breadcrumb.path || breadcrumb.name"
          class="inline-flex items-center"
        >
          <NuxtLink v-if="breadcrumb.path" :to="formatLink(breadcrumb.path)">
            <LayoutBreadcrumbsElement>
              {{ breadcrumb.name }}
            </LayoutBreadcrumbsElement>
          </NuxtLink>
          <LayoutBreadcrumbsElement v-else>
            {{ breadcrumb.name }}
          </LayoutBreadcrumbsElement>
          <LayoutBreadcrumbsDivider v-if="index < breadcrumbs.length - 1" />
        </li>
      </ol>
    </Transition>
  </nav>
</template>

<style scoped>
.breadcrumb-trail {
  transform-origin: left center;
  will-change: clip-path, opacity, transform;
}

.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition:
    clip-path 180ms cubic-bezier(0.2, 0, 0, 1),
    opacity 120ms ease,
    transform 180ms cubic-bezier(0.2, 0, 0, 1);
}

.breadcrumb-enter-from,
.breadcrumb-leave-to {
  clip-path: inset(0 100% 0 0);
  opacity: 0;
  transform: translateX(-0.375rem);
}

.breadcrumb-enter-to,
.breadcrumb-leave-from {
  clip-path: inset(0 0 0 0);
  opacity: 1;
  transform: translateX(0);
}

@media (prefers-reduced-motion: reduce) {
  .breadcrumb-enter-active,
  .breadcrumb-leave-active {
    transition: none;
  }
}
</style>
