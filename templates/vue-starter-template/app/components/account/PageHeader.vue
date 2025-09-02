<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>
<template>  
    <div class="flex flex-col gap-2">
        <h1 class="text-surface-on-surface text-10 font-['Noto_Serif'] leading-15">{{ title }}</h1>
        <p class="self-stretch text-surface-on-surface font-['Inter']">{{ subtitle }}</p>
    </div>
</template>