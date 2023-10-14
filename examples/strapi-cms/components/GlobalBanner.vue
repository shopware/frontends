<script setup lang="ts">
interface GlobalBanner {
  text: string;
  color: string;
}

const { findOne } = useStrapi();

const { data } = await findOne<GlobalBanner>("global-banner");
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
