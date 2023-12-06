<script setup lang="ts">
import type { Schemas } from "#shopware";
import { RouterLink } from "vue-router";
import {
  getCategoryRoute,
  getTranslatedProperty,
} from "@shopware-pwa/helpers-next";
import { computed } from "vue";
import { urlIsAbsolute } from "@shopware-pwa/helpers-next";
import buildUrlPrefix from "../helpers/buildUrlPrefix";
import getUrlPrefix from "../helpers/getUrlPrefix";

interface Props {
  navigationElement: Schemas["Category"];
  isActive?: boolean;
  isHighlighted?: boolean;
}

const props = defineProps<Props>();
const urlPrefix = getUrlPrefix();

const url = computed(() => {
  return buildUrlPrefix(getCategoryRoute(props.navigationElement), urlPrefix);
});
</script>
<template>
  <div
    class="flex items-center py-2 px-5 text-base rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 my-2"
  >
    <RouterLink
      v-if="!urlIsAbsolute(url)"
      :to="url"
      :class="[
        props.isHighlighted ? 'font-bold' : 'font-normal',
        props.isActive ? 'text-indigo-600' : 'text-gray-900',
      ]"
    >
      <span>{{ getTranslatedProperty(navigationElement, "name") }}</span>
    </RouterLink>
    <a
      v-else
      :href="url"
      :class="[
        props.isHighlighted ? 'font-bold' : 'font-normal',
        props.isActive ? 'text-indigo-600' : 'text-gray-900',
      ]"
      :target="
        navigationElement.externalLink || navigationElement.linkNewTab
          ? '_blank'
          : ''
      "
      ><span>{{ getTranslatedProperty(navigationElement, "name") }}</span></a
    >
  </div>
</template>
