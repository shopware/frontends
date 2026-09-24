<script setup lang="ts">
import { createError, useAsyncStoryblok, useRoute } from "#imports";

const route = useRoute();
const slugParam = route.params.slug;
const slug = Array.isArray(slugParam)
  ? slugParam.join("/")
  : slugParam?.toString() || "home";
const story = await useAsyncStoryblok(
  slug,
  { version: "draft", resolve_relations: "Article.author" }, // API Options
  { resolveRelations: ["Article.author"], resolveLinks: "url" }, // Bridge Options
);
if (story.value.status) {
  throw createError({
    statusCode: story.value.status,
    statusMessage: story.value.response,
  });
}
</script>

<template>
  <StoryblokComponent v-if="story" :blok="story.content" />
</template>
