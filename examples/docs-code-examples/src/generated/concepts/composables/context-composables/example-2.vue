<!-- CategoryHeader.vue -->

<script setup>
// Resolving the category from the closest parent context boundary
const { category } = useCategory();
</script>

<template>
  <h1>{{ category.name }}</h1>
  <p>{{ category.description }}</p>
</template>
