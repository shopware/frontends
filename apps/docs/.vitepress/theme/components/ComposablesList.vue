<template>
  <div v-for="(category, index) in categoryTreeData" :id="index">
    {{ index }}
    <ul>
      <li v-for="(composable, index) in category">
        <a :href="`/packages/composables/${composable}`">{{ composable }}</a>
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
