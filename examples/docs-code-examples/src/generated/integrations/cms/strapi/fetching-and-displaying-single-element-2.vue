<template>
  <div>
    <GlobalBanner />
    <LayoutHeader />
    <LayoutNotifications />
    <main class="mx-auto">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>
