<script setup lang="ts">
definePageMeta({
  layout: "default",
});
</script>
<template>
  <div class="container mx-auto px-6 sm:px-4 my-10 md:my-20">
    <div class="flex flex-col lg:flex-row gap-10 lg:gap-0">
      <div
        class="w-full lg:w-1/2 lg:border-r lg:border-gray-200 lg:pr-16 flex flex-col justify-start"
      >
        <AccountLoginForm hide-sign-up />
      </div>

      <div
        class="w-full lg:w-1/2 lg:pl-16 border-t lg:border-t-0 border-gray-200 pt-10 lg:pt-0"
        id="registration"
      >
        <AccountRegistrationForm />
      </div>
    </div>
  </div>
</template>
