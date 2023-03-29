<script setup lang="ts"></script>

<template>
  <div class="relative bg-white">
    <div class="mx-auto px-4 sm:px-6">
      <div
        class="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10"
      >
        <div class="flex justify-start lg:w-0 lg:flex-1 space-x-4 md:space-x-0">
          <NuxtLink to="/">
            <span class="sr-only">Shopware</span>
            <img
              class="h-8 w-auto sm:h-10"
              src="/logo.svg"
              alt="Logo"
              width="40px"
              height="40px"
            />
          </NuxtLink>
        </div>
        <AccountMenu />
      </div>
    </div>
  </div>
</template>
