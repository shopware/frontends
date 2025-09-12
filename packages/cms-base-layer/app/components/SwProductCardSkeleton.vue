<template>
  <div class="inline-flex flex-col items-start justify-start self-stretch overflow-hidden p-px w-full"
    aria-hidden="true">
    <!-- image skeleton -->
    <div class="relative flex h-80 flex-col items-start justify-start self-stretch overflow-hidden">
      <div class="relative h-80 w-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>

      <div
        class="absolute top-[281px] left-2 inline-flex items-center justify-center rounded bg-gray-300 dark:bg-gray-600 px-3 py-1 animate-pulse">
        <span class="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded block"></span>
      </div>

      <div class="absolute top-4 right-4 h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
    </div>

    <!-- details skeleton -->
    <div class="flex flex-col items-start justify-start gap-4 self-stretch p-2">
      <div class="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>

      <div class="w-full">
        <div class="h-7 w-3/4 rounded bg-gray-200 dark:bg-gray-700 mb-2 animate-pulse"></div>
        <div class="h-7 w-1/2 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      </div>

      <div class="h-6 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>

      <div class="flex w-full gap-3">
        <div class="flex-1 h-10 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        <div class="w-24 h-10 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      </div>
    </div>
  </div>
</template>