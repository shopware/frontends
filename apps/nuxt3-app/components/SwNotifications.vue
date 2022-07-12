<script setup lang="ts">
const { notifications, removeOne } = useNotifications();
</script>
<template>
  <div class="fixed right-5 top-5 z-50">
    <SwNotification
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
      @click:close="removeOne(notification.id)"
    />
  </div>
</template>
