<template>
  <div class="recipe-card-grid">
    <slot />
  </div>
</template>

<style scoped>
.recipe-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin: 16px 0 32px;
}
</style>
