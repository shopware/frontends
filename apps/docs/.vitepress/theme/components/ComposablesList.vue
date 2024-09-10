<template>
  <div
    v-for="(category, index) in categoryTreeData"
    :id="`${index}${new Date().getTime()}`"
  >
    <h3 class="!mb-2" :id="normalizeAnchorText(index.toString())" tabindex="-1">
      {{ index }}
      <a
        class="header-anchor !top-0"
        :href="`#${normalizeAnchorText(index.toString())}`"
        aria-label='Permalink to "Test"'
      ></a>
    </h3>
    <ul class="flex flex-wrap gap-3 !p-0 !m-0">
      <li
        v-for="(composable, index) in category"
        :key="`${composable + new Date().getTime()}`"
        class="list-none !m-0 bg-gray-100 rounded-sm leading-4"
      >
        <a
          :href="`/packages/composables/${composable}`"
          class="text-sm p-2 !no-underline !text-gray-800"
          >{{ composable }}</a
        >
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { data } from "../../data/composables.data";
import { normalizeAnchorText } from "../typer/utils";

const categoryTreeData = computed(() => {
  const categoryTree: { [key: string]: string[] } = {};

  data.composablesList.forEach((composable) => {
    const categories = composable.category.split(",");

    categories.forEach((category) => {
      if (!categoryTree[category]) {
        categoryTree[category] = [];
      }

      categoryTree[category].push(composable.text);
    });
  });

  return categoryTree;
});
</script>
