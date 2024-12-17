<script setup lang="ts">
import {
  getCategoryRoute,
  getTranslatedProperty,
} from "@shopware-pwa/helpers-next";
import { onKeyStroke, useActiveElement } from "@vueuse/core";
import type { Schemas } from "#shopware";
type NavigationElement = Schemas["Category"] & {
  activeClass?: boolean;
};

const { navigationElements } = useNavigation();
const currentMenuPosition = ref<string | undefined>(undefined);
const resetActiveClass = ref<boolean>(true);

const route = useRoute();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

onMounted(() => {
  let currentNaviagtionElement: NavigationElement | undefined;
  if (navigationElements.value) {
    currentNaviagtionElement = findNavigationElement(
      route.path.slice(1),
      navigationElements.value,
    );
  }
  if (currentNaviagtionElement) {
    updateActiveClass(
      currentNaviagtionElement.id,
      currentNaviagtionElement.parentId,
    );
  }
});

const findNavigationElement = (
  routePath: string,
  navigation: NavigationElement[],
): NavigationElement | undefined => {
  for (let i = 0; i < navigation.length; i++) {
    const navigationElement = navigation[i];
    const seoUrls = navigationElement.seoUrls as
      | Schemas["SeoUrl"][]
      | undefined;
    if (seoUrls) {
      for (let j = 0; j < seoUrls.length; j++) {
        const currentSeoUrl = seoUrls[j];
        if (currentSeoUrl && currentSeoUrl.seoPathInfo === routePath) {
          return navigationElement;
        }
      }
    }
    const children = navigationElement.children;
    if (children) {
      const foundElement = findNavigationElement(routePath, children);
      if (foundElement) {
        return foundElement;
      }
    }
  }
  return undefined;
};

const onUpdateActiveClass = (
  navigationId: string,
  parentId: string | undefined,
) => {
  updateActiveClass(navigationId, parentId);
};

const resetNavigationActiveClass = (navigation: NavigationElement[]) => {
  for (let ni = 0; ni < navigation.length; ++ni) {
    navigation[ni].activeClass = false;
    const children = navigation[ni].children;
    if (children) {
      resetNavigationActiveClass(children);
    }
  }
};

const updateActiveClass = (
  navigationId: string,
  parentId: string | undefined,
) => {
  const setNavigationActiveClass = (
    navigation: NavigationElement[],
    navigationId: string,
    parentId: string | undefined,
  ) => {
    for (let ni = 0; ni < navigation.length; ++ni) {
      if (navigation[ni].id === navigationId) {
        navigation[ni].activeClass = true;
      }
      if (navigation[ni].id === parentId) {
        navigation[ni].activeClass = true;
        if (navigationElements.value) {
          setNavigationActiveClass(
            navigationElements.value,
            navigationId,
            navigation[ni].parentId,
          );
        }
      }
      const children = navigation[ni].children;
      if (children) {
        setNavigationActiveClass(children, navigationId, parentId);
      }
    }
  };

  if (navigationElements.value) {
    resetNavigationActiveClass(navigationElements.value);
    setNavigationActiveClass(navigationElements.value, navigationId, parentId);
    resetActiveClass.value = false;
  }
};
//#region - keyboard navigation (highliy connected to the HTML structure)
const activeElement = useActiveElement();
onKeyStroke("ArrowDown", (e) => {
  // next parent link or next child link
  if (
    activeElement.value?.parentElement?.nextElementSibling?.getElementsByTagName(
      "a",
    )[0]
  ) {
    e.preventDefault();
    activeElement.value.parentElement.nextElementSibling
      .getElementsByTagName("a")[0]
      .focus();
    return;
  }
});

onKeyStroke("ArrowUp", (e) => {
  // previous parent link or previous child link
  if (
    activeElement.value?.parentElement?.previousElementSibling?.getElementsByTagName(
      "a",
    )[0]
  ) {
    e.preventDefault();
    activeElement.value?.parentElement.previousElementSibling
      .getElementsByTagName("a")[0]
      .focus();
    return;
  }
});

function isFocusInsideNav() {
  if (activeElement.value) {
    const focusInsideMenu = document
      .getElementsByTagName("nav")[0]
      .contains(activeElement.value);
    return focusInsideMenu;
  }
  return false;
}

onKeyStroke("Escape", () => {
  if (isFocusInsideNav()) {
    currentMenuPosition.value = undefined;
    document
      .getElementsByTagName("header")[0]
      .getElementsByTagName("a")[0]
      .focus();
  }
});
//#endregion - keyboard navigation

// reset when route.path changes
watch(
  () => route.path,
  () => {
    if (resetActiveClass.value === true && navigationElements.value) {
      resetNavigationActiveClass(navigationElements.value);
    }
    resetActiveClass.value = true;
    currentMenuPosition.value = undefined;
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
      v-for="(navigationElement, index) in navigationElements"
      :key="navigationElement.id"
      class="relative hover:bg-secondary-50 rounded-lg"
      @mouseover="currentMenuPosition = navigationElement.id"
      @focusin="currentMenuPosition = navigationElement.id"
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
          'link-active': (navigationElement as NavigationElement).activeClass,
        }"
        class="text-base font-medium text-secondary-500 hover:text-secondary-900 p-2 inline-block"
        @click="
          updateActiveClass(navigationElement.id, navigationElement.parentId)
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
          v-if="navigationElement.children.length > 0"
          class="absolute z-10 -ml-4 mt-3 transform px-2 w-screen max-w-md xl:max-w-screen-sm sm:px-0 lg:ml-0 lg:left-1/4 lg:-translate-x-1/6"
          :class="{
            visbile: currentMenuPosition === navigationElement.id,
            hidden: currentMenuPosition !== navigationElement.id,
          }"
          @focusin="currentMenuPosition = navigationElement.id"
          @mouseleave="currentMenuPosition = undefined"
        >
          <div
            class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
          >
            <template v-if="navigationElement.children.length > 0">
              <LayoutTopNavigationRecursive
                :navigation-element-children="navigationElement.children"
                :last-element="
                  navigationElements
                    ? navigationElements.length - 1 === index
                    : false
                "
                @update-active-class="onUpdateActiveClass"
                @focusout-last-element="currentMenuPosition = undefined"
              />
            </template>
            <div
              class="px-5 py-5 bg-secondary-50 space-y-6 sm:flex sm:space-y-0 sm:space-x-10 sm:px-8"
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
  @apply text-secondary-900 bg-primary bg-opacity-10 rounded-lg;
}
</style>
