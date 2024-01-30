<script setup lang="ts">
import {
  getCategoryRoute,
  getCategoryImageUrl,
} from "@shopware-pwa/helpers-next";
import type { Schemas } from "#shopware";

const { navigationElements } = useNavigation();

const sideMenuController = useSideMenuModal();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
const expandedIds = ref<Array<string>>([]);

function isCollapsed(navigationelement: Schemas["Category"]): boolean {
  return !expandedIds.value.includes(navigationelement.id);
}

const toggleCollapse = (navigationElement: Schemas["Category"]) => {
  if (!isCollapsed(navigationElement)) {
    expandedIds.value = expandedIds.value.filter(
      (el) => el !== navigationElement.id,
    );
  } else {
    expandedIds.value.push(navigationElement.id);
  }
};
</script>

<template>
  <button
    class="lg:hidden bg-transparent"
    aria-label="Show side menu"
    @click="sideMenuController.open"
  >
    <div class="i-carbon-menu w-8 h-8" />
  </button>
  <LayoutSidebar :controller="sideMenuController" side="left">
    <div class="flex px-4 py-5">
      <button
        type="button"
        class="inline-flex items-center justify-center p-2 -m-2 text-secondary-400 rounded-md bg-transparent"
        @click="sideMenuController.close"
      >
        <span class="sr-only">Close menu</span>
        <div class="i-carbon-close text-3xl" />
      </button>
    </div>
    <div class="max-w-2xl">
      <aside aria-label="Sidebar" class="flex flex-col">
        <div class="w-full px-4 pb-4">
          <LayoutStoreSearch @link-clicked="sideMenuController.close" />
        </div>
        <div class="overflow-y-auto">
          <ul class="flex flex-col items-start p-x-2 space-y-2">
            <li
              v-for="navigationElement in navigationElements"
              :key="navigationElement.id"
              class="flex flex-col flex-1 w-full"
            >
              <NuxtLink
                :to="formatLink(getCategoryRoute(navigationElement))"
                class="flex items-center px-5 py-3 text-base font-normal text-secondary-900 break-all hover:bg-secondary-100"
                @click="sideMenuController.close"
              >
                <span class="flex">
                  {{ navigationElement.name }}
                </span>
                <div class="flex flex-1" />
                <button
                  v-if="navigationElement?.children?.length"
                  class="flex items-center w-12 p-4 h-2 bg-transparent"
                  @click.stop.prevent="toggleCollapse(navigationElement)"
                >
                  <span
                    :class="[
                      'text-xl',
                      !isCollapsed(navigationElement)
                        ? 'i-carbon-chevron-up '
                        : 'i-carbon-chevron-down',
                    ]"
                  />
                </button>
              </NuxtLink>

              <div
                v-if="
                  navigationElement.media && !isCollapsed(navigationElement)
                "
                class="relative"
              >
                <div class="overflow-hidden">
                  <img
                    :src="getCategoryImageUrl(navigationElement)"
                    class="object-cover object-center"
                    alt="Category image"
                  />
                </div>
              </div>
              <ul
                v-if="
                  navigationElement?.children?.length &&
                  !isCollapsed(navigationElement)
                "
                class="px-0 py-2 m-0"
              >
                <li
                  v-for="childElement in navigationElement.children"
                  :key="childElement.id"
                >
                  <NuxtLink
                    :to="formatLink(getCategoryRoute(childElement))"
                    class="flex items-center p-3 text-base font-normal text-secondary-500 break-all hover:bg-secondary-100 pl-11"
                    @click="sideMenuController.close"
                  >
                    <span>
                      {{ childElement.name }}
                    </span>
                  </NuxtLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </LayoutSidebar>
</template>
