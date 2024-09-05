<template>
  <div
    v-for="(category, index) in categoryTreeData"
    :id="`${index}${new Date().getTime()}`"
  >
    <p>{{ index }}</p>
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
