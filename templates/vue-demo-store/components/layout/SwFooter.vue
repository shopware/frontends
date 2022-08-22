<script setup lang="ts">
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";

const { navigationElements } = useNavigation({ type: "footer-navigation" });
const gridColumns = computed<number>(() =>
  navigationElements.value
    ? Object.keys(navigationElements.value).length + 2
    : 2
);
</script>

<template>
  <footer class="px-4 sm:px-6">
    <menu class="border-t-2 border-gray-100 flex justify-center">
      <div
        class="py-10 w-full max-w-screen-xl"
        :class="`grid grid-cols-2 md:grid-cols-${gridColumns}`"
      >
        <div class="hidden md:block">
          <router-link to="/">
            <span class="sr-only">Shopware</span>
            <img class="h-15 w-auto sm:h-15" src="/logo.svg" alt="Logo" />
          </router-link>
        </div>
        <div
          v-for="navigationElement in navigationElements"
          :key="navigationElement.id"
        >
          <h4 class="mb-5">
            {{ getTranslatedProperty(navigationElement, "name") }}
          </h4>
          <template v-if="navigationElement.childCount > 0">
            <ul class="list-none p-0 mb-5">
              <li
                v-for="navigationChild in navigationElement.children"
                :key="navigationChild.id"
                class="pb-1"
              >
                <router-link
                  :to="'/' + navigationChild.seoUrls[0]?.seoPathInfo"
                  class="text-base font-normal text-gray-500 hover:text-gray-900"
                >
                  {{ getTranslatedProperty(navigationChild, "name") }}
                </router-link>
              </li>
            </ul>
          </template>
        </div>
        <div class="hidden md:block">
          <ul class="list-none">
            <li class="pb-1">
              <a
                href="mailto:info@shopware.com"
                class="text-base font-medium text-gray-500 hover:text-gray-900"
                >info@shopware.com</a
              >
            </li>
            <li class="pb-1">
              <a
                href="tel:0080074676260"
                class="text-base font-medium text-gray-500 hover:text-gray-900"
              >
                Worldwide: 00 800 746 7626 0
              </a>
            </li>
          </ul>
        </div>
      </div>
    </menu>
  </footer>
</template>
