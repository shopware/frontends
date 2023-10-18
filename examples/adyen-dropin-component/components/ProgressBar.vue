<script setup lang="ts">
</script>
<template>
  <ol
    class="flex items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4"
  >
    <li :class="{'text-green-600 dark:text-green-500': activeStep===1}" class="flex items-center">
      <span
        :class="{'text-green-600 dark:text-green-500': activeStep===1}"
        class="flex items-center justify-center w-5 h-5 mr-2 text-xs border border-green-600 rounded-full shrink-0 dark:border-green-500"
      >
        1
      </span>
      Logging in
      <svg
        class="w-3 h-3 ml-2 sm:ml-4"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 12 10"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m7 9 4-4-4-4M1 9l4-4-4-4"
        />
      </svg>
    </li>
    <li class="flex items-center" :class="{'text-green-600 dark:text-green-500': activeStep===2}">
      <span
      :class="{'text-green-600 dark:text-green-500': activeStep===2}"
        class="flex items-center justify-center w-5 h-5 mr-2 text-xs border border-gray-500 rounded-full shrink-0 dark:border-gray-400"
      >
        2
      </span>
      Adding product to Cart
      <svg
        class="w-3 h-3 ml-2 sm:ml-4"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 12 10"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m7 9 4-4-4-4M1 9l4-4-4-4"
        />
      </svg>
    </li>
    <li class="flex items-center" :class="{'text-green-600 dark:text-green-500': activeStep===3}">
      <span
      :class="{'text-green-600 dark:text-green-500': activeStep===3}"
        class="flex items-center justify-center w-5 h-5 mr-2 text-xs border border-gray-500 rounded-full shrink-0 dark:border-gray-400"
      >
        3
      </span>
      Click "Pay" button
    </li>
     <li class="flex items-center" :class="{'text-green-600 dark:text-green-500': activeStep===4}">
      <span
      :class="{'text-green-600 dark:text-green-500': activeStep===4}"
        class="flex items-center justify-center w-5 h-5 mr-2 text-xs border border-gray-500 rounded-full shrink-0 dark:border-gray-400"
      >
        4
      </span>
      Creating an order
    </li>
    <li class="flex items-center" :class="{'text-green-600 dark:text-green-500': activeStep===5}">
      <span
      :class="{'text-green-600 dark:text-green-500': activeStep===5}"
        class="flex items-center justify-center w-5 h-5 mr-2 text-xs border border-gray-500 rounded-full shrink-0 dark:border-gray-400"
      >
        5
      </span>
      Updating the payment info
    </li>
  </ol>
</template>
