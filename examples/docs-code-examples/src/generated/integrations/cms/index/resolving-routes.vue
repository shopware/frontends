<!-- app/pages/[...all].vue -->
<script setup lang="ts">
const route = useRoute();
const { locale } = useI18n();
const { resolvePage } = useExternalCms();

const path =
  route.path.replace(`/${locale.value}`, "").replace(/^\//, "") || "home";

const { data: page } = await useAsyncData(
  `external-cms-${locale.value}-${path}`,
  () => resolvePage(path, locale.value),
);

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: "Page not found" });
}

useSeoMeta({
  title: page.value.seo?.title ?? page.value.title,
  description: page.value.seo?.description,
});
</script>

<template>
  <ExternalCmsPage :blocks="page?.blocks ?? []" />
</template>
