<script setup lang="ts">
import {
  getTranslatedProperty,
  getCategoryRoute,
} from "@shopware-pwa/helpers-next";

const { navigationElements } = useNavigation({ type: "footer-navigation" });
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

const gridColumns = computed<number>(() =>
  navigationElements.value
    ? Object.keys(navigationElements.value).length + 2
    : 2,
);
</script>

<template>
  <footer class="px-4 sm:px-6 mt-2 lg:mt-8">
    <menu class="border-t-2 border-secondary-100 flex justify-center">
      <div
        class="py-10 w-full max-w-screen-xl"
        :class="`grid grid-cols-2 md:grid-cols-${gridColumns}`"
      >
        <div class="hidden md:block">
          <NuxtLink :to="formatLink(`/`)">
            <span class="sr-only">Shopware</span>
            <img
              class="h-15 w-auto sm:h-15"
              src="/logo.svg"
              alt="logo of the shop"
            />
          </NuxtLink>
        </div>
        <div
          v-for="navigationElement in navigationElements"
          :key="navigationElement.id"
        >
          <h3 class="mb-5">
            {{ getTranslatedProperty(navigationElement, "name") }}
          </h3>
          <template v-if="navigationElement.childCount > 0">
            <ul class="list-none p-0 mb-5">
              <li
                v-for="navigationChild in navigationElement.children"
                :key="navigationChild.id"
                class="pb-3 md:pb-1"
              >
                <NuxtLink
                  :target="
                    navigationChild.externalLink || navigationChild.linkNewTab
                      ? '_blank'
                      : ''
                  "
                  :to="formatLink(getCategoryRoute(navigationChild))"
                  class="text-base font-normal text-secondary-500 hover:text-secondary-900"
                >
                  {{ getTranslatedProperty(navigationChild, "name") }}
                </NuxtLink>
              </li>
            </ul>
          </template>
        </div>
        <div class="hidden md:block">
          <ul class="list-none">
            <li class="pb-1">
              <a
                href="mailto:info@shopware.com"
                class="text-base font-medium text-secondary-500 hover:text-secondary-900"
                >info@shopware.com</a
              >
            </li>
            <li class="pb-1">
              <a
                href="tel:0080074676260"
                class="text-base font-medium text-secondary-500 hover:text-secondary-900"
              >
                Worldwide: 00 800 746 7626 0
              </a>
            </li>
          </ul>
          <LanguageSwitcher />
        </div>
      </div>
    </menu>
  </footer>
</template>
