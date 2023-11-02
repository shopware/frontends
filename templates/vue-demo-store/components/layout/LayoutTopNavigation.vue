<script setup lang="ts">
import {
  getCategoryRoute,
  getTranslatedProperty,
  getSmallestThumbnailUrl,
} from "@shopware-pwa/helpers-next";
import type { Category } from "@shopware-pwa/types";
const { navigationElements } = useNavigation();
const currentMenuPosition = ref<string | null>(null);

const route = useRoute();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

onMounted(() => {
  const currentNaviagtionElement = findNavigationElement(route.path.slice(1));
  if (currentNaviagtionElement) {
    updateActiceClass(
      currentNaviagtionElement.id,
      currentNaviagtionElement.parentId,
    );
  }
});
// only works with 2 level navigation
const findNavigationElement = (routePath: string): Category | undefined => {
  let navigationElement;
  const navigation = navigationElements.value;
  if (navigation) {
    // we do not loop through the top level
    for (let ni = 0; ni < navigation.length; ++ni) {
      const children = navigation[ni].children;
      if (children) {
        for (let ci = 0; ci < children.length; ++ci) {
          const seoUrls = children[ci].seoUrls;
          if (seoUrls) {
            for (let si = 0; si < seoUrls.length; ++si) {
              if (seoUrls[si].seoPathInfo == routePath) {
                navigationElement = children[ci];
                break;
              }
            }
          }
          if (navigationElement) {
            break;
          }
        }
      }
      if (navigationElement) {
        break;
      }
    }
  }

  return navigationElement;
};
// only works with 2 level navigation, timeout needed to be executed after watch
const updateActiceClass = (
  navigationId: string,
  parentId: string | null,
  timeout?: number,
) => {
  setTimeout(() => {
    const navigation = navigationElements.value;
    if (navigation) {
      for (let ni = 0; ni < navigation.length; ++ni) {
        navigation[ni].activeClass = false;
        if (
          (parentId && navigation[ni].id == parentId) ||
          navigation[ni].id == navigationId
        ) {
          navigation[ni].activeClass = true;
        }
        const children = navigation[ni].children;
        if (children) {
          for (let ci = 0; ci < children.length; ++ci) {
            children[ci].activeClass = false;
            if (children[ci].id == navigationId) {
              children[ci].activeClass = true;
            }
          }
        }
      }
    }
  }, timeout ?? 0);
};
// reset when route.path changes
watch(
  () => route.path,
  () => {
    updateActiceClass("", "");
  },
);
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->
  <nav
    class="hidden lg:flex space-x-4 items-center"
    aria-label="Top navigation"
    role="menu"
  >
    <div
      v-for="navigationElement in navigationElements"
      :key="navigationElement.id"
      class="relative hover:bg-gray-50 rounded-lg"
      @mouseover="currentMenuPosition = navigationElement.id"
    >
      <NuxtLink
        role="menuitem"
        :target="
          navigationElement.externalLink || navigationElement.linkNewTab
            ? '_blank'
            : ''
        "
        :to="formatLink(getCategoryRoute(navigationElement))"
        :class="{
          'link-active': navigationElement.activeClass,
        }"
        class="text-base font-medium text-gray-500 hover:text-gray-900 p-2 inline-block"
        @click="
          updateActiceClass(
            navigationElement.id,
            navigationElement.parentId,
            100,
          )
        "
      >
        {{ getTranslatedProperty(navigationElement, "name") }}
      </NuxtLink>

      <!--
            Flyout menu, show/hide based on flyout menu state.

            Entering: "transition ease-out duration-200"
              From: "opacity-0 translate-y-1"
              To: "opacity-100 translate-y-0"
            Leaving: "transition ease-in duration-150"
              From: "opacity-100 translate-y-0"
              To: "opacity-0 translate-y-1"
          -->
      <client-only>
        <div
          v-if="
            currentMenuPosition === navigationElement.id &&
            navigationElement?.children?.length
          "
          class="absolute z-10 -ml-4 mt-3 transform px-2 w-screen max-w-md xl:max-w-screen-sm sm:px-0 lg:ml-0 lg:left-1/4 lg:-translate-x-1/6"
          @mouseleave="currentMenuPosition = null"
        >
          <div
            class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
          >
            <template
              v-for="(childElement, index) in navigationElement.children"
              :key="childElement.id"
            >
              <div
                :class="{
                  'sm:pb-0': index !== navigationElement.children.length - 1,
                }"
                class="relative grid gap-6 bg-white px-3 py-2 sm:gap-6 sm:p-3"
              >
                <NuxtLink
                  :to="formatLink(getCategoryRoute(childElement))"
                  :target="
                    childElement.externalLink || childElement.linkNewTab
                      ? '_blank'
                      : ''
                  "
                  :class="{
                    'link-active': childElement.activeClass,
                  }"
                  class="flex justify-between rounded-lg hover:bg-gray-50 p-2"
                  @click="
                    updateActiceClass(
                      childElement.id,
                      childElement.parentId,
                      100,
                    )
                  "
                >
                  <div
                    class="flex flex-col flex-grow pl-2"
                    :class="{
                      'max-w-200px md:max-w-300px': !!childElement.media,
                    }"
                  >
                    <p class="text-base font-medium text-gray-900">
                      {{ getTranslatedProperty(childElement, "name") }}
                    </p>
                    <p
                      v-if="getTranslatedProperty(childElement, 'description')"
                      class="mt-1 text-sm text-gray-500"
                      v-html="
                        getTranslatedProperty(childElement, 'description')
                      "
                    />
                  </div>
                  <div v-if="childElement.media" class="flex">
                    <img
                      :src="getSmallestThumbnailUrl(childElement.media)"
                      class="object-scale-down h-48 w-px-200 rounded-md"
                      alt="Category image"
                    />
                  </div>
                </NuxtLink>
              </div>
            </template>
            <div
              class="px-5 py-5 bg-gray-50 space-y-6 sm:flex sm:space-y-0 sm:space-x-10 sm:px-8"
            >
              <div
                class="flow-root"
                v-html="getTranslatedProperty(navigationElement, 'description')"
              />
            </div>
          </div>
        </div>
      </client-only>
    </div>
  </nav>
</template>

<style scoped>
nav .link-active {
  @apply text-gray-900 bg-brand-primary bg-opacity-10 rounded-lg;
}
</style>
