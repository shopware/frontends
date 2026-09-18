<script setup lang="ts">
defineOptions({
  name: "CheckoutSuccessSkeleton",
});
</script>
<template>
  <div
    role="status"
    class="container mx-auto px-6 sm:px-4 py-10 md:py-20 animate-pulse"
  >
    <div class="flex items-start gap-4 md:gap-6 mb-12 md:mb-16">
      <div
        class="w-12.5 h-12.5 rounded-full bg-surface-surface-container shrink-0"
      />
      <div class="flex-1 max-w-xl">
        <div class="h-10 bg-surface-surface-container rounded w-3/4 mb-4" />
        <div class="h-4 bg-surface-surface-container rounded w-full mb-2" />
        <div class="h-4 bg-surface-surface-container rounded w-2/3" />
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-10 lg:gap-20 justify-between">
      <div class="w-full lg:w-1/2 flex flex-col gap-10">
        <div>
          <div class="h-5 bg-surface-surface-container rounded w-32 mb-6" />
          <div
            v-for="n in 2"
            :key="n"
            class="flex gap-4 py-4 border-b border-outline-outline-variant"
          >
            <div class="w-24 h-24 bg-surface-surface-container shrink-0" />
            <div class="flex-1">
              <div
                class="h-4 bg-surface-surface-container rounded w-2/3 mb-3"
              />
              <div class="h-3 bg-surface-surface-container rounded w-16" />
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            v-for="card in 4"
            :key="card"
            class="h-32 bg-surface-surface-container"
          />
        </div>
      </div>
      <div class="w-full lg:w-1/2">
        <div class="border border-outline-outline">
          <div class="h-16 border-b border-outline-outline-variant" />
          <div class="p-6 flex flex-col gap-3">
            <div class="h-4 bg-surface-surface-container rounded w-full" />
            <div class="h-4 bg-surface-surface-container rounded w-full" />
            <div class="h-5 bg-surface-surface-container rounded w-full mt-2" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
