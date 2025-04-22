<script setup lang="ts">
const { sessionContext } = useSessionContext();

const onChangeHandler = async (url: string) => {
  navigateTo(`${url}`, {
    external: true,
  });
};

/**
 * List of stores to be used in the application.
 */
const stores = [
  {
    name: "store1 - localhost:3000",
    url: "/",
  },
  {
    name: "store2 - localhost:3000/pl-PL",
    url: "/pl-PL",
  },
];
</script>

<template>
  <div class="container mx-auto p-4">
    <h1>Multi sales channel example</h1>

    <p>This example shows how to use the multi sales channel feature</p>

    <h2>Assumptions:</h2>

    <p>This example is using 2 sales channels:</p>

    <ul>
      <li>
        Store 1 - default sales channel on
        <span class="bg-red text-white px-1"> localhost:3000 </span>
      </li>
      <li>
        Store 2 - sales channel on
        <span class="bg-red text-white px-1">localhost:3000/pl-PL</span>
      </li>
    </ul>

    <hr />

    <h3 class="text-center">
      Selected storefront: {{ sessionContext?.salesChannel?.translated?.name }}
    </h3>

    <div class="grid grid-cols-1 gap-4 mt-6">
      <div
        v-for="store in stores"
        @click="onChangeHandler(store.url)"
        :key="store.name"
        class="cursor-pointer p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white hover:bg-gray-100 text-center"
      >
        <span class="text-lg font-semibold text-gray-700">{{
          store.name
        }}</span>
      </div>
    </div>
  </div>
</template>
