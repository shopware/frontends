<script setup lang="ts">
defineProps<{
  counter: number;
}>();

const { isLoggedIn } = useUser();
</script>
<template>
  <div class="relative">
    <Icon size="1.2rem" name="shopware:heart" class="color-brand-primary" />
    <LayoutMainCounter
      v-if="counter > 0 && isLoggedIn"
      class="absolute top-[-50%] left-[50%]"
      :count="counter"
    />
  </div>
</template>
