<script setup lang="ts">
const { notifications, removeOne } = useNotifications();
</script>
<template>
  <div class="fixed right-5 bottom-10 sm:top-20 z-50">
    <LayoutNotification
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
      @click:close="removeOne(notification.id)"
    />
  </div>
</template>
