<script lang="ts">
export default {
  name: "CheckoutSuccessPaidPage",
};
</script>

<template>
  <div class="container mx-auto w-1/2 mb-24 mt-24 text-center">
    <h1
      class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-secondary-900 md:text-5xl lg:text-6xl dark:text-white"
    >
      {{ $t("checkout.yourOrder") }}
      <span
        class="underline underline-offset-3 decoration-8 decoration-green-400 dark:decoration-green-600"
        >{{ $t("checkout.orderPaid") }}</span
      >
    </h1>
    <p
      class="text-lg font-normal text-secondary-500 lg:text-xl dark:text-secondary-400"
    >
      {{ $t("checkout.checkStatus") }}
    </p>
    <div class="mt-12 text-center">
      <a
        href="/"
        class="inline-flex justify-center items-center py-2 px-4 text-base font-medium text-center text-white bg-primary rounded-lg hover:bg-secondary-400 focus:ring-4 focus:ring-primary dark:focus:ring-primary"
      >
        {{ $t("checkout.backToHomepage") }}
        <div class="i-carbon-undo ml-2" />
      </a>
    </div>
  </div>
</template>
