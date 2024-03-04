<script setup lang="ts">
import Image from "./components/Image.vue";
</script>
<template>
  <div test-id="test-wrapper">
    <Suspense>
      <div>
        <div
          class="flex p-4 m-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
          role="alert"
        >
          <svg
            aria-hidden="true"
            class="flex-shrink-0 inline w-5 h-5 mr-3"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span class="sr-only">Info</span>
          <div>
            <span class="font-medium">See how it works!</span> Change the window
            size and reload the page. Then see in the network tab what image is
            loaded.<br /><br />
            For upscaling the window, images are being loaded automatically when
            viewport reaches the specific breakpoint from srcset attribute.
          </div>
        </div>
        <Image />
      </div>

      <template #fallback> Loading... </template>
    </Suspense>
  </div>
</template>
