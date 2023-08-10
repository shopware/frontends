<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug.toString() ?? "home";
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
