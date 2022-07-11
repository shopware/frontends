<script>
export default {
  name: "DefaultLayout",
};
</script>
<template>
  <div>
    <SwModal />
    <SwHeader />
    <SwNotifications />
    <div class="mx-auto">
      <SwBreadcrumbs />
      <slot />
    </div>
    <SwSideCart />
  </div>
</template>
