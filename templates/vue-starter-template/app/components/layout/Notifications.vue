<script setup lang="ts">
const { notifications, removeOne } = useNotifications();
</script>
<template>
  <!-- Pin to the bottom of the viewport so toasts never cover header cart / account actions. -->
  <Teleport to="body">
    <div
      v-if="notifications.length"
      data-testid="notification-container"
      class="fixed inset-x-0 z-[60] flex flex-col items-stretch gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end sm:p-5 bottom-[var(--sw-guidance-banner-height,0px)]"
      aria-live="polite"
      aria-relevant="additions"
    >
      <LayoutNotification
        v-for="notification in notifications"
        :key="notification.id"
        :notification="notification"
        @click:close="removeOne(notification.id)"
      />
    </div>
  </Teleport>
</template>
