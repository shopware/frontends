<template>
  <div class="border border-outline-outline p4 animate-pulse">
    <div
      class="flex justify-between items-center pb-2 border-b border-outline-outline"
    >
      <div class="h-6 w-40 rounded bg-surface-on-surface/10" />
      <div class="h-7 w-24 rounded bg-surface-on-surface/10" />
    </div>

    <div class="mt-4 flex flex-row w-full">
      <div v-for="column in 4" :key="column" class="flex-1">
        <div class="p-4 border-b border-outline-outline-variant">
          <div class="h-6 w-2/3 rounded bg-surface-on-surface/10" />
        </div>
        <div class="p-4">
          <div class="h-6 w-1/2 rounded bg-surface-on-surface/10" />
        </div>
      </div>
    </div>

    <div class="mt-4 mb-2">
      <div class="h-5 w-28 rounded bg-surface-on-surface/10" />
    </div>

    <div class="mt-4 overflow-hidden" />

    <div class="mt-4">
      <div class="flex justify-between">
        <div class="h-5 w-20 rounded bg-surface-on-surface/10" />
        <div class="h-5 w-16 rounded bg-surface-on-surface/10" />
      </div>
      <div class="flex justify-between">
        <div class="h-5 w-24 rounded bg-surface-on-surface/10" />
        <div class="h-5 w-16 rounded bg-surface-on-surface/10" />
      </div>
      <div
        class="border-t border-outline-outline-variant pt-2 mt-2 flex justify-between"
      >
        <div class="h-6 w-16 rounded bg-surface-on-surface/10" />
        <div class="h-6 w-20 rounded bg-surface-on-surface/10" />
      </div>
    </div>
  </div>
</template>
