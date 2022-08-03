<script setup lang="ts">
import { ComputedRef } from "vue";
import { Notification } from "@shopware-pwa/composables-next";

defineEmits<{
  (e: "click:close", id: number): void;
}>();

const props = defineProps<{
  notification: Notification;
}>();

const colorCssMap = {
  info: "blue",
  success: "green",
  warning: "orange",
  danger: "red",
};
// @todo: replace with dynamic import
const TypeIconComponent = computed(() => {
  switch (props.notification.type) {
    case "success":
      return defineAsyncComponent(() => import("./icons/SuccessMark.vue"));
    case "warning":
      return defineAsyncComponent(() => import("./icons/WarningMark.vue"));
    case "danger":
      return defineAsyncComponent(() => import("./icons/ErrorMark.vue"));
    default:
      return defineAsyncComponent(() => import("./icons/InfoMark.vue"));
  }
});

const themeTypeColor: ComputedRef<string> = computed(
  () => colorCssMap[props.notification.type] || "blue"
);
</script>
<template>
  <div
    :id="`toast-${notification.id}`"
    class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
    role="alert"
  >
    <div
      :class="`text-${themeTypeColor}-500 bg-${themeTypeColor}-100 dark:bg-${themeTypeColor}-800 dark:text-${themeTypeColor}-200`"
      class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg"
    >
      <component :is="TypeIconComponent" />
    </div>
    <div class="ml-3 text-sm font-normal">
      {{ notification.message }}
    </div>
    <button
      type="button"
      class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
      :data-dismiss-target="`toast-${notification.id}`"
      aria-label="Close"
      @click="$emit('click:close', notification.id)"
    >
      <span class="sr-only">Close</span>
      <svg
        class="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</template>
