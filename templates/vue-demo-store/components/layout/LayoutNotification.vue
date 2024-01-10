<script setup lang="ts">
import type { ComputedRef } from "vue";
import type { Notification } from "@shopware-pwa/composables-next";

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

// i-carbon icons map
const iconsMap = {
  info: "information",
  success: "checkmark",
  warning: "warning-alt",
  danger: "close-outline",
};

const themeTypeColor: ComputedRef<string> = computed(
  () => colorCssMap[props.notification.type] || "blue",
);
const icon = computed(() => iconsMap[props.notification.type] || "information");
</script>
<template>
  <!-- don't remove; enforce unocss to include dynamically used classes: class="bg-blue-100 bg-green-100 bg-orange-100 bg-red-100" -->
  <div
    v-if="notification.message.length > 0"
    :id="`toast-${notification.id}`"
    :data-testid="`notification-element-${notification.type}`"
    class="flex items-center w-full max-w-xs p-4 mb-4 text-secondary-500 bg-white rounded-lg shadow dark:text-secondary-400 dark:bg-secondary-800"
    role="alert"
  >
    <div
      :class="`text-${themeTypeColor}-500 bg-${themeTypeColor}-100 dark:bg-${themeTypeColor}-800 dark:text-${themeTypeColor}-200`"
      class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg"
    >
      <!-- don't remove; enforce unocss to include dynamically used classes: class="i-carbon-information i-carbon-checkmark i-carbon-warning-alt i-carbon-close-outline" -->
      <div :class="`w-5 h-5 i-carbon-${icon}`" />
    </div>
    <div
      data-testid="notification-element-message"
      class="ml-3 text-sm font-normal"
    >
      {{ notification.message }}
    </div>
    <button
      data-testid="notification-element-button"
      type="button"
      class="ml-auto -mx-1.5 -my-1.5 bg-white text-secondary-400 hover:text-secondary-900 rounded-lg focus:ring-2 focus:ring-secondary-300 p-1.5 hover:bg-secondary-100 inline-flex h-8 w-8 dark:text-secondary-500 dark:hover:text-white dark:bg-secondary-800 dark:hover:bg-secondary-700"
      :data-dismiss-target="`toast-${notification.id}`"
      aria-label="Close notification"
      @click="$emit('click:close', notification.id)"
    >
      <span class="sr-only">{{ $t("close") }}</span>
      <div class="w-5 h-5 i-carbon-close" />
    </button>
  </div>
</template>
