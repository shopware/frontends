<script setup lang="ts">
const { type = "primary" } = defineProps<{
  type?: "primary" | "secondary" | "tertiary" | "outline" | "ghost" | "filled";
  counter: number;
}>();

const styles = {
  primary:
    "bg-brand-primary hover:focus:bg-brand-primary-hover text-brand-on-primary",
  secondary:
    "bg-brand-secondary hover:focus:bg-brand-secondary-hover text-brand-on-secondary",
  tertiary:
    "bg-brand-tertiary hover:focus:bg-brand-tertiary-hover text-brand-on-tertiary",
  outline:
    "text-brand-primary bg-transparent hover:focus:bg-surface-surface-container outline outline-2 outline-offset-[-2px] outline-brand-primary",
  ghost: "bg-transparent hover:focus:bg-surface-surface-container",
  filled: "bg-brand-primary text-brand-on-primary",
};
</script>
<template>
  <div class="relative">
    <!-- use when filled icon is ready -->
    <!-- <Icon size="1rem" name="shopware:heart" v-if="type !== 'filled'" class="w-6 h-5 block hover:cursor-pointer" :class="[
      styles[type]
    ]" /> -->
    <div class="i-carbon-favorite w-6 h-5 hover:cursor-pointer" :class="[
      styles[type]
    ]" v-if="type !== 'filled'"></div>
    <div class="i-carbon-favorite-filled w-6 h-5 hover:cursor-pointer" :class="[
      styles[type]
    ]" v-else></div>
    <SwMainCounter
      v-if="counter > 0"
      class="absolute top-[-50%] left-[50%]"
      :count="counter"
    />
  </div>
</template>
