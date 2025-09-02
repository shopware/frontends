<template>
  <div class="max-w-screen-xl mx-auto px-6 sm:px-4 mt-20 flex gap-20">
    <div class="flex flex-col gap-3">
      <h2 class="text-brand-primary text-base font-bold leading-normal">
        {{ $t("account.menu.header") }}
      </h2>
      <AccountMenuList />
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>
