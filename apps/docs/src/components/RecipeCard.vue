<script setup lang="ts">
import { useData, withBase } from "vitepress";
import { computed } from "vue";

const props = defineProps<{
  /** Absolute (`/frontends-recipes/...`) or relative to the current page. */
  page: string;
  title: string;
  summary: string;
  composables?: string[];
  badge?: string;
}>();

const { page: currentPage } = useData();

function normalizePath(path: string) {
  const result: string[] = [];
  for (const part of path.split("/").filter(Boolean)) {
    if (part === "..") {
      result.pop();
    } else if (part !== ".") {
      result.push(part);
    }
  }
  return `/${result.join("/")}`;
}

const href = computed(() => {
  if (props.page.startsWith("/")) {
    return withBase(props.page);
  }
  const currentPath = currentPage.value.relativePath;
  const currentDir = currentPath.substring(0, currentPath.lastIndexOf("/"));
  return withBase(normalizePath(`/${currentDir}/${props.page}`));
});
</script>

<template>
  <a :href="href" class="recipe-card">
    <span class="recipe-card__header">
      <span class="recipe-card__title">{{ title }}</span>
      <span v-if="badge" class="recipe-card__badge">{{ badge }}</span>
    </span>
    <span class="recipe-card__summary">{{ summary }}</span>
    <span v-if="composables?.length" class="recipe-card__tags">
      <code v-for="name in composables" :key="name">{{ name }}</code>
    </span>
  </a>
</template>

<style scoped>
.recipe-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  padding: 18px 20px;
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  text-decoration: none !important;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    transform 0.2s;
}

.recipe-card:hover,
.recipe-card:focus-visible {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.recipe-card:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.recipe-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.recipe-card__title {
  color: var(--vp-c-text-1);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
}

.recipe-card:hover .recipe-card__title {
  color: var(--vp-c-brand-1);
}

.recipe-card__badge {
  flex-shrink: 0;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 600;
  line-height: 1.6;
}

.recipe-card__summary {
  flex-grow: 1;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.55;
}

.recipe-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.recipe-card__tags code {
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
  font-size: 12px;
}
</style>
