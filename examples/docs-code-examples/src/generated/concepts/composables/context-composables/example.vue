<!-- Category.vue -->

<script setup>
const { path } = useRoute();
const { search } = useCategorySearch();

const categoryResponse = await search(path);

// Setting the context and creating a context boundary
const { category } = useCategory(categoryResponse);
</script>

<template>
  <CategoryHeader />
</template>
