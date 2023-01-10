<template>
  <div class="container mx-auto w-1/2 mb-24 mt-24 text-center">
    <h1
      class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
    >
      Your order
      <span
        class="underline underline-offset-3 decoration-8 decoration-red-400 dark:decoration-red-600"
        >is not paid</span
      >
    </h1>
    <p class="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
      Unfortunately, your order couldn't be paid.<br />You can try to pay it
      again or contact us.
    </p>
    <div class="mt-12 text-center">
      <router-link
        :to="`/checkout/success/${$route.params.id}`"
        class="inline-flex justify-center items-center py-2 px-4 text-base font-medium text-center text-white bg-brand-primary rounded-lg hover:bg-gray-400 focus:ring-4 focus:ring-brand-primary dark:focus:ring-brand-primary"
      >
        Check the order details
        <div class="i-carbon-undo ml-2"></div>
      </router-link>
    </div>
  </div>
</template>
