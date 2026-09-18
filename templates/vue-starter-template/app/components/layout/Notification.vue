<script setup lang="ts">
import type { Notification } from "@shopware/composables";
import type { ComputedRef } from "vue";

const emit = defineEmits<{
  "click:close": [id: number];
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

const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
</script>
<template>
  <!-- don't remove; enforce unocss to include dynamically used classes: class="bg-blue-100 bg-green-100 bg-orange-100 bg-red-100" -->
  <div
    v-if="notification.message.length > 0"
    :id="`toast-${notification.id}`"
    :data-testid="`notification-element-${notification.type}`"
    class="flex items-start w-full max-w-md p-4 bg-white rounded-lg shadow"
    role="status"
  >
    <div
      :class="`text-${themeTypeColor}-500 bg-${themeTypeColor}-100`"
      class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg"
    >
      <!-- don't remove; enforce unocss to include dynamically used classes: class="i-carbon-information i-carbon-checkmark i-carbon-warning-alt i-carbon-close-outline" -->
      <div :class="`w-5 h-5 i-carbon-${icon}`" />
    </div>
    <div class="ml-3 flex-1 min-w-0">
      <div
        data-testid="notification-element-message"
        class="text-sm font-normal"
      >
        {{ notification.message }}
      </div>
      <NuxtLink
        v-if="notification.action"
        :to="formatLink(notification.action.to)"
        data-testid="notification-element-action"
        class="mt-1 inline-flex min-h-8 items-center text-sm font-bold text-brand-primary"
        @click="emit('click:close', notification.id)"
      >
        {{ notification.action.label }}
      </NuxtLink>
    </div>
    <button
      data-testid="notification-element-button"
      type="button"
      class="ml-2 -mx-1.5 -my-1.5 bg-white rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 flex-shrink-0"
      :data-dismiss-target="`toast-${notification.id}`"
      :aria-label="$t('layout.ariaLabels.closeNotification')"
      @click="emit('click:close', notification.id)"
    >
      <span class="sr-only">{{ $t("close") }}</span>
      <div class="w-5 h-5 i-carbon-close" />
    </button>
  </div>
</template>
