<script setup>
const props = defineProps({
  title: String,
  maintainer: String,
  link: String,
  description: String,
  icon: String,
});
</script>

<template>
  <div
    class="gap-3 flex flex-col border-1px border-#eeeeee rounded-md p-6 shadow-md bg-#fdfdfd hover:shadow-lg hover:border-#e8e8e8 dark:border-#444 dark:bg-#222 dark:hover:border-#333 dark:hover:bg-#212121"
  >
    <div class="text-4xl text-center">
      {{ icon }}
    </div>
    <div class="mt-5 flex flex-col flex-grow">
      <div class="font-semibold mb-2 text-#333 dark:text-#ddd">
        <div>
          <a :href="link" target="_blank">{{ title }}</a>
        </div>
      </div>
      <div class="flex flex-col justify-between grow">
        <div class="font-light text-sm mb-4">{{ description }}</div>
        <div class="font-light text-xs">by @{{ maintainer }}</div>
      </div>
    </div>
  </div>
</template>
