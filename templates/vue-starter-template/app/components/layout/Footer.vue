<script setup lang="ts">
import { getCategoryRoute, getTranslatedProperty } from "@shopware/helpers";

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
  <footer class="bg-brand-primary">
    <div class="container mx-auto py-10 px-6 sm:px-0">
      <div :class="`grid grid-cols-2 md:grid-cols-${gridColumns} gap-4`">
        <NuxtLink class="hidden md:block" :to="formatLink(`/`)">
          <NuxtImg
            class="h-20 max-sm:h-10"
            src="/logo-white.svg"
            alt="logo of the shop"
          />
        </NuxtLink>

        <div
          class="flex flex-row gap-10"
          v-for="navigationElement in navigationElements"
          :key="navigationElement.id"
        >
          <div class="text-surface-inverse-on-surface">
            {{ getTranslatedProperty(navigationElement, "name") }}
          </div>
          <template v-if="navigationElement.childCount > 0">
            <ul class="list-none">
              <li
                v-for="navigationChild in navigationElement.children"
                :key="navigationChild.id"
                class="mb-1.5 leading-normal"
              >
                <NuxtLink
                  :target="
                    navigationChild.externalLink || navigationChild.linkNewTab
                      ? '_blank'
                      : ''
                  "
                  :to="formatLink(getCategoryRoute(navigationChild))"
                  class="text-surface-surface-primary hover:text-surface-surface-primary-hover leading-normal"
                >
                  {{ getTranslatedProperty(navigationChild, "name") }}
                </NuxtLink>
              </li>
            </ul>
          </template>
        </div>
        <LayoutFooterNewsletterBox class="md:block hidden" />
      </div>
    </div>
  </footer>
</template>
