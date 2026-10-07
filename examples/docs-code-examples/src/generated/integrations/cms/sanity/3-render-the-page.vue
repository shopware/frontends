<!-- app/app.vue -->
<script setup lang="ts">
import { groq, useSanityQuery } from "#imports";

const PAGE_QUERY = groq`*[_type == "page"] | order(_createdAt asc)[0]{
  title,
  pageBuilder[]{ ... }
}`;
const { data: page } = await useSanityQuery(PAGE_QUERY);
</script>

<template>
  <PageBuilder :sections="page?.pageBuilder ?? []" />
</template>
