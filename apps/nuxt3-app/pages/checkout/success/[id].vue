<script async setup lang="ts">
const { params } = useRoute();
const orderId = params.id as string;
const {
  loadOrderDetails,
  personalDetails,
  billingAddress,
  shippingAddress,
  order,
} = useOrderDetails({ order: { id: orderId } as any });

onMounted(() => {
  loadOrderDetails();
});
const lineItems = computed(() => order.value?.lineItems || []);
</script>

<template>
  <div class="max-w-2xl mx-auto py-4 px-4 sm:py-4 sm:px-6 lg:max-w-7xl lg:px-8">
    <h2 class="text-center">Your order has been sent. Thank you!</h2>
    <div
      class="bg-white shadow overflow-hidden sm:rounded-lg"
      v-if="billingAddress"
    >
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Personal Information
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          Including shipping and billing addresses.
        </p>
        <div class="w-auto mt-4 text-sm">
          {{ personalDetails.firstName }} {{ personalDetails.lastName }}
          <span class="text-gray-500">({{ personalDetails.email }})</span>
        </div>
      </div>
      <div class="border-t border-gray-200 md:flex">
        <div class="w-auto md:w-1/2">
          <h3 class="p-6">Shipping address</h3>
          <dl class="pb-4">
            <div
              class="bg-gray-50 px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-500">Full name</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ shippingAddress?.firstName }} {{ shippingAddress?.lastName }}
              </dd>
            </div>
            <div
              class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-500">Street</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ shippingAddress?.street }}
              </dd>
            </div>
            <div
              class="bg-gray-50 px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-500">Zip code</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ shippingAddress?.zipcode }}
              </dd>
            </div>
            <div
              class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-500">City</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ shippingAddress?.city }}
              </dd>
            </div>
          </dl>
        </div>
        <div class="w-auto md:w-1/2 md:border-l border-gray-200">
          <h3 class="p-6">Billing address</h3>
          <dl class="pb-4">
            <div
              class="bg-gray-50 px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-500">Full name</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ billingAddress.firstName }} {{ billingAddress.lastName }}
              </dd>
            </div>
            <div
              class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-500">Street</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ billingAddress.street }}
              </dd>
            </div>
            <div
              class="bg-gray-50 px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-500">Zip code</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ billingAddress.zipcode }}
              </dd>
            </div>
            <div
              class="bg-white px-2 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt class="text-sm font-medium text-gray-500">City</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ billingAddress.city }}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div class="border-t border-gray-200 md:flex">
        <div class="w-auto md:w-1/2">
          <div class="px-4 py-5 sm:px-6">
            <div class="contents text-base font-medium text-gray-900">
              Cart items
            </div>
            <p class="text-sm text-gray-500">
              List of cart's items, including discounts.
            </p>
          </div>
          <div class="flow-root p-6">
            <ul role="list" class="-my-6 divide-y divide-gray-200">
              <li
                class="flex py-6"
                v-for="orderItem in lineItems"
                :key="orderItem.identifier"
              >
                <SwOrderItem :orderItem="orderItem" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
