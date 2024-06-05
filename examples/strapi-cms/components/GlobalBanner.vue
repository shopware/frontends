<script setup lang="ts">
interface GlobalBanner {
  text: string;
  color: string;
}

// @ts-expect-error TODO: (md): Fix useStrapi type
const { findOne } = useStrapi();

const { data } = await findOne<GlobalBanner>("global-banner");
// @ts-expect-error TODO: (md): Fix types
const bgColor = computed(() => data.attributes?.color || "#fff");
</script>
<template>
  <section>
    <div
      class="text-center py-1 text-white text-sm"
      :style="{ 'background-color': bgColor }"
    >
      {{ data.attributes.text }}
    </div>
  </section>
</template>
