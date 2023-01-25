<script setup lang="ts">
import { RouterLink } from "vue-router";
import {
  getCategoryUrl,
  getCategoryImageUrl,
} from "@shopware-pwa/helpers-next";
import { Category } from "@shopware-pwa/types";

const { navigationElements } = useNavigation();

const isSideMenuOpened = inject("isSideMenuOpened", ref(false));
const expandedIds = ref<Array<string>>([]);

function isCollapsed(navigationelement: Category): boolean {
  return !expandedIds.value.includes(navigationelement.id);
}

const sideMenuElement = ref(null);
onClickOutside(sideMenuElement, () => (isSideMenuOpened.value = false));

const toggleCollapse = (navigationElement: Category) => {
  if (!isCollapsed(navigationElement)) {
    expandedIds.value = expandedIds.value.filter(
      (el) => el !== navigationElement.id
    );
  } else {
    expandedIds.value.push(navigationElement.id);
  }
};
</script>

<template>
  <button class="lg:hidden" aria-label="menu" @click="isSideMenuOpened = true">
    <div class="i-carbon-menu text-xl" />
  </button>
  <client-only>
    <div
      v-if="isSideMenuOpened"
      class="relative z-40 lg:hidden"
      role="dialog"
      aria-modal="true"
    >
      <div class="fixed inset-0 bg-black opacity-25" />
      <div class="fixed inset-0 z-40 flex max-w-xs">
        <div
          ref="sideMenuElement"
          class="relative flex flex-col w-full overflow-y-auto bg-white shadow-xl"
        >
          <div class="flex px-4 py-5">
            <button
              type="button"
              class="inline-flex items-center justify-center p-2 -m-2 text-gray-400 rounded-md"
              @click="isSideMenuOpened = false"
            >
              <span class="sr-only">Close menu</span>
              <div class="i-carbon-close text-3xl" />
            </button>
          </div>
          <div class="max-w-2xl">
            <aside aria-label="Sidebar">
              <div class="px-5 pb-3">
                <LayoutStoreSearch />
              </div>
              <div class="overflow-y-auto">
                <ul class="flex flex-col p-0 space-y-2">
                  <li
                    v-for="navigationElement in navigationElements"
                    :key="navigationElement.id"
                  >
                    <RouterLink
                      :to="getCategoryUrl(navigationElement)"
                      class="flex items-center w-full px-5 py-3 text-base font-normal text-gray-900 break-all hover:bg-gray-100"
                      @click="isSideMenuOpened = false"
                    >
                      <span class="flex-1">
                        {{ navigationElement.name }}
                      </span>
                      <button
                        v-if="navigationElement?.children?.length"
                        class="flex items-center w-12 p-4 -m-4 h-11"
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
                    </RouterLink>

                    <div
                      v-if="
                        navigationElement.media &&
                        !isCollapsed(navigationElement)
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
                        <RouterLink
                          :to="getCategoryUrl(childElement)"
                          class="flex items-center p-3 text-base font-normal text-gray-500 break-all hover:bg-gray-100 pl-11"
                          @click="isSideMenuOpened = false"
                        >
                          <span>
                            {{ childElement.name }}
                          </span>
                        </RouterLink>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  </client-only>
</template>
