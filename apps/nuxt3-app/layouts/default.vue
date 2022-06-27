<template>
  <div>
    <SwModal />
    <SwHeader />
    <SwNotifications />
    <div class="max-w-screen-xl mx-auto">
      <SwBreadcrumbs />
      <slot />
      </div>
    <SwSideCart />
  </div>
</template>