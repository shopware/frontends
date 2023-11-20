<script setup lang="ts">
import {
  getCategoryRoute,
  getTranslatedProperty,
  getSmallestThumbnailUrl,
} from "@shopware-pwa/helpers-next";
import type { Category } from "@shopware-pwa/types";
type NavigationElement = Category & {
  activeClass?: boolean;
};

const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

defineProps<{
  navigationElementChildren: Array<NavigationElement>;
}>();

const emits = defineEmits<{
  (e: "updateActiveClass", navigationId: string, parentId: string | null): void;
}>();

const emitUpdateActiveClass = (
  navigationId: string,
  parentId: string | null,
) => {
  emits("updateActiveClass", navigationId, parentId);
};
</script>

<template>
  <template
    v-for="(childElement, index) in navigationElementChildren"
    :key="childElement.id"
  >
    <div
      :class="{
        'sm:pb-0': index !== navigationElementChildren.length - 1,
      }"
      class="relative grid gap-6 bg-white px-3 py-2 sm:gap-6 sm:p-3"
    >
      <NuxtLink
        :to="formatLink(getCategoryRoute(childElement))"
        :target="
          childElement.externalLink || childElement.linkNewTab ? '_blank' : ''
        "
        :class="{
          'link-active': childElement.activeClass,
        }"
        class="flex justify-between rounded-lg hover:bg-gray-50 p-2"
        @click="emitUpdateActiveClass(childElement.id, childElement.parentId)"
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
          <!-- eslint-disable vue/no-v-html -->
          <p
            v-if="getTranslatedProperty(childElement, 'description')"
            class="mt-1 text-sm text-gray-500"
            v-html="getTranslatedProperty(childElement, 'description')"
          />
          <!-- eslint-enable vue/no-v-html -->
        </div>
        <div v-if="childElement.media" class="flex">
          <img
            :src="getSmallestThumbnailUrl(childElement.media)"
            class="object-scale-down h-48 w-px-200 rounded-md"
            alt="Category image"
          />
        </div>
      </NuxtLink>
      <template
        v-if="childElement.children && childElement.children.length > 0"
      >
        <LayoutTopNavigationRecursive
          :navigation-element-children="childElement.children"
          @update-active-class="
            emitUpdateActiveClass(childElement.id, childElement.parentId)
          "
        />
      </template>
    </div>
  </template>
</template>

<style scoped>
nav .link-active {
  @apply text-gray-900 bg-brand-primary bg-opacity-10 rounded-lg;
}
</style>
