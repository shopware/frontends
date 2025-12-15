<script setup lang="ts">
import { getCategoryRoute, getTranslatedProperty } from "@shopware/helpers";

const { navigationElements } = useNavigation({ type: "footer-navigation" });
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
</script>

<template>
  <footer class="bg-brand-primary">
    <div class="container mx-auto py-10 px-6 sm:px-0">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        <NuxtLink class="mb-4 md:mb-0" :to="formatLink(`/`)">
          <NuxtImg
            class="h-16 sm:h-20"
            src="/logo-white.svg"
            alt="logo of the shop"
          />
        </NuxtLink>

        <div
          class="flex flex-col gap-4"
          v-for="navigationElement in navigationElements"
          :key="navigationElement.id"
        >
          <div class="text-surface-inverse-on-surface font-semibold">
            {{ getTranslatedProperty(navigationElement, "name") }}
          </div>
          <template v-if="navigationElement.childCount > 0">
            <ul class="list-none flex flex-col gap-2">
              <li
                v-for="navigationChild in navigationElement.children"
                :key="navigationChild.id"
              >
                <NuxtLink
                  :target="
                    navigationChild.externalLink || navigationChild.linkNewTab
                      ? '_blank'
                      : ''
                  "
                  :to="formatLink(getCategoryRoute(navigationChild))"
                  class="text-surface-surface-primary hover:text-surface-surface-primary-hover"
                >
                  {{ getTranslatedProperty(navigationChild, "name") }}
                </NuxtLink>
              </li>
            </ul>
          </template>
        </div>
        <LayoutFooterNewsletterBox class="col-span-1 sm:col-span-2 md:col-span-1" />
      </div>
    </div>
  </footer>
</template>
