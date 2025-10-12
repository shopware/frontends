<script lang="ts" setup>
import {
  downloadFile,
  getMedia,
  getSmallestThumbnailUrl,
} from "@shopware/helpers";
import type { Schemas } from "#shopware";

const { apiClient } = useShopwareContext();

const props = defineProps<{
  order: Schemas["Order"];
}>();

// Change inside computed
const { paymentUrl, handlePayment, isAsynchronous, state, paymentMethod } =
  useOrderPayment(computed(() => props.order));

const goToUrl = (url: string | null) => {
  if (typeof window !== "undefined" && url) {
    window.location.href = url;
  }
};
const billingAddress = computed(() => props.order?.billingAddress);

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString(
    (typeof navigator !== "undefined" && navigator.language) || "en-US",
  );

const isExpand = ref(false);

function toggleView() {
  isExpand.value = !isExpand.value;
}

const shippingAddress = computed(
  () => props.order.deliveries?.[0]?.shippingOrderAddress,
);

const shippingMethod = computed(() => {
  if (!props.order.deliveries?.length) return undefined;
  return props.order.deliveries[props.order.deliveries.length - 1]
    ?.shippingMethod;
});

const subtotal = computed(() => props.order.amountTotal);
const shippingCosts = computed(() => props.order.shippingCosts);
const total = computed(() => props.order.amountTotal);

const lineItems = computed<Array<Schemas["OrderLineItem"]>>(
  () => props.order.lineItems || [],
);

const getMediaFileHandler = async (mediaId: string, fileName: string) => {
  const response = await getMediaFile(mediaId);
  downloadFile(response, fileName);
};

async function getMediaFile(downloadId: string) {
  const response = await apiClient.invoke(
    "orderDownloadFile get /order/download/{orderId}/{downloadId}",
    {
      accept: "application/octet-stream",
      pathParams: {
        orderId: props.order.id,
        downloadId,
      },
    },
  );

  return response.data;
}

const hasDocuments = computed(() => !!props.order?.documents?.length);
const documents = computed(() => props.order.documents || []);

// const paymentChangeable = computed(() => {
//   return props.order.paymentChangeable?.[props.order.id as string] ?? false;
// });

const statusTechnicalName = computed(
  () => props.order?.stateMachineState?.name,
);
</script>
<template>
  <div v-if="order">
    <main>
      <div class="bg-white overflow-hidden sm:rounded-lg">
        <div class="bg-white border-b border-gray-200">
          <div class="flex flex-col sm:flex-row justify-between mb-6">
            <div>
              <h2 class="text-2xl font-semibold text-gray-800">
                {{ $t("account.orderDetails.order") }} #{{ order.orderNumber }}
              </h2>
              <p class="text-sm text-gray-600">
                {{
                  $t("account.orderDetails.placedOn", {
                    d: formatDate(order.orderDate),
                  })
                }}
              </p>
            </div>
            <div class="mt-4 sm:mt-0">
              <AccountOrderStatus
                v-if="order.stateMachineState"
                :state="order.stateMachineState"
              />
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ $t("account.orderDetails.itemsHeader.item") }}
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ $t("account.orderDetails.itemsHeader.quantity") }}
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ $t("account.orderDetails.itemsHeader.price") }}
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ $t("account.orderDetails.itemsHeader.total") }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <template v-for="item in lineItems" :key="item.id">
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <img
                            v-if="item.type === 'product'"
                            class="h-10 w-10"
                            :src="getSmallestThumbnailUrl(item.cover)"
                            :alt="item.label"
                          />
                          <div
                            v-else-if="item.type === 'promotion'"
                            class="h-10 w-10 i-carbon-tag text-3xl text-center"
                          ></div>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">
                            {{ item.label }}

                            <span
                              v-if="item.type === 'promotion'"
                              class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300"
                              >{{ $t("cart.promotion") }}</span
                            >
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {{ item.quantity }}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      <SharedPrice
                        :value="item.unitPrice"
                        class="text-secondary-600 font-normal"
                        data-testid="order-item-unitprice"
                      />
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      <SharedPrice
                        :value="item.totalPrice"
                        class="text-secondary-600 font-normal"
                        data-testid="order-item-totalprice"
                      />
                    </td>
                  </tr>
                  <tr v-if="item.downloads?.length">
                    <td colspan="4" class="py-3">
                      <template v-for="media in getMedia(item)" :key="media.id">
                        <div
                          v-if="media.accessGranted"
                          class="flex gap-2 cursor-pointer pl-5 pb-3 hover:text-primary-500"
                          @click="getMediaFileHandler(media.id, media.fileName)"
                        >
                          <div class="w-5 h-5 i-carbon-download" />
                          {{ media.fileName }}
                        </div>
                      </template>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

          <div class="mt-8 flex flex-col sm:flex-row justify-between">
            <div v-if="shippingAddress" class="mb-4 sm:mb-0">
              <h3 class="text-lg font-semibold text-gray-700 mb-2">
                {{ $t("account.orderDetails.shippingAddress") }}
              </h3>
              <address class="not-italic text-sm text-gray-600">
                {{ shippingAddress.street }}<br />
                {{ shippingAddress.city }}
                <span v-if="shippingAddress.countryState"
                  >, {{ shippingAddress.countryState }}</span
                >
                {{ shippingAddress.zipcode }}<br />
                {{ shippingAddress.country }}
              </address>
            </div>

            <div v-if="billingAddress" class="mb-4 sm:mb-0">
              <h3 class="text-lg font-semibold text-gray-700 mb-2">
                {{ $t("account.orderDetails.billingAddress") }}
              </h3>
              <address class="not-italic text-sm text-gray-600">
                {{ billingAddress.street }}<br />
                {{ billingAddress.city }}
                <span v-if="billingAddress.countryState"
                  >, {{ billingAddress.countryState }}</span
                >
                {{ billingAddress.zipcode }}<br />
                {{ billingAddress.country }}
              </address>
            </div>

            <div class="w-full sm:w-1/3">
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-lg font-semibold text-gray-700 mb-2">
                  {{ $t("account.orderDetails.orderSummary") }}
                </h3>
                <div class="flex justify-between mb-2">
                  <span class="text-sm text-gray-600">
                    {{ $t("account.orderDetails.subtotal") }}</span
                  >
                  <span class="text-sm text-gray-900">
                    <SharedPrice
                      :value="subtotal"
                      class="text-secondary-600 font-normal"
                      data-testid="order-subtotal"
                    />
                  </span>
                </div>
                <div class="flex justify-between mb-2">
                  <span class="text-sm text-gray-600">{{
                    $t("account.orderDetails.shipping")
                  }}</span>
                  <span class="text-sm text-gray-900">
                    <SharedPrice
                      :value="shippingCosts"
                      class="text-secondary-600 font-normal"
                      data-testid="order-subtotal"
                  /></span>
                </div>

                <div
                  class="border-t border-gray-200 mt-2 pt-2 flex justify-between"
                >
                  <span class="text-base font-semibold text-gray-900">{{
                    $t("account.orderDetails.total")
                  }}</span>
                  <span class="text-base font-semibold text-gray-900">
                    <SharedPrice
                      :value="total"
                      class="text-secondary-600 font-normal"
                      data-testid="order-subtotal"
                  /></span>
                </div>
              </div>
            </div>
          </div>
          <AccountOrderDownloads v-if="hasDocuments" :documents="documents" />
          <div
            v-if="shippingMethod"
            class="mt-8 bg-white p-6 rounded-lg shadow"
          >
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              {{ $t("account.orderDetails.shippingMethod") }}
            </h3>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div>
                  <p>
                    {{ shippingMethod?.translated.name }}
                  </p>
                  <p
                    v-if="shippingMethod?.deliveryTime"
                    class="text-sm text-gray-500"
                  >
                    {{ $t("checkout.takesUpTo") }}
                    {{ shippingMethod.deliveryTime?.name }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="paymentMethod" class="mt-8 bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              {{ $t("account.orderDetails.paymentMethod") }}
            </h3>
            <div v-if="!isLoading" class="flex items-center justify-between">
              <div class="flex items-center">
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {{ paymentMethod?.translated.name }}
                  </p>
                </div>
              </div>
              <!-- <button
                v-if="paymentChangeable && statusTechnicalName === 'open'"
                @click="openChangePaymentModal"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {{ $t("account.orderDetails.change") }}
              </button> -->
            </div>
            <div v-else class="animate-pulse">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-32 h-4 bg-gray-200 rounded"></div>
                </div>
                <div class="w-24 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- <div
      v-if="isChangePaymentModalOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
    >
      <div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4">
          {{ $t("account.orderDetails.changePaymentMethod") }}
        </h2>
        <div class="space-y-4">
          <template v-if="loadingPaymentMethods">
            <div
              v-for="i in 3"
              :key="i"
              class="flex items-center animate-pulse"
            >
              <div class="w-4 h-4 bg-gray-200 rounded-full mr-3"></div>
              <div class="flex-grow">
                <div class="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </template>
          <template v-else>
            <div
              v-for="method in paymentMethods"
              :key="method.id"
              class="flex items-center"
            >
              <input
                type="radio"
                :id="method.id"
                :value="method.id"
                v-model="paymentMethodUI"
                class="mr-3"
              />
              <label :for="method.id" class="flex-grow">
                <span class="font-medium">{{ method.name }}</span>

                <span
                  v-if="method.description"
                  class="block text-sm text-gray-500"
                >
                  {{ method.description }}</span
                >
              </label>
            </div>
          </template>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button
            @click="closeChangePaymentModal"
            class="px-4 py-2 bg-dark-600 text-white rounded hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :disabled="!selectedPaymentMethod"
          >
            {{ $t("account.orderDetails.close") }}
          </button>
          <button
            @click="confirmChangePaymentModal"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :disabled="!selectedPaymentMethod"
          >
            {{ $t("account.orderDetails.confirm") }}
          </button>
        </div>
      </div>
    </div> -->
  </div>
</template>
