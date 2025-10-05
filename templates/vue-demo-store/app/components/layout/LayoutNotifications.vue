<script setup lang="ts">
const { notifications, removeOne } = useNotifications();
</script>
<template>
  <div
    data-testid="notification-container"
    class="fixed right-5 bottom-10 sm:top-20 z-50 max-h-fit"
  >
    <LayoutNotification
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
      @click:close="removeOne(notification.id)"
    />
  </div>
</template>
