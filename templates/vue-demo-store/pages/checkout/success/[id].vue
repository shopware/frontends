<script setup lang="ts">
const { params } = useRoute();
const orderId = params.id as string;
const {
  loadOrderDetails,
  shippingAddress,
  billingAddress,
  shippingMethod,
  paymentMethod,
  order,
  subtotal,
  total,
  shippingCosts,
} = useOrderDetails(orderId);

onMounted(() => {
  loadOrderDetails();
});

const isExpand = ref(false);

const toggleView = () => (isExpand.value = !isExpand.value);

const format: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
};

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString("en-us", format);
</script>

<template>
  <div class="max-w-2xl mx-auto py-4 px-4 sm:py-4 sm:px-6 lg:max-w-5xl lg:px-8">
    <div class="space-y-1">
      <div class="text-brand-dark">Thank you!</div>
      <div class="text-3xl font-bold">It's on the way</div>
      <div class="text-gray-400">
        Your order #{{ order?.orderNumber }} has shipped and will be with you
        soon
      </div>
    </div>
    <div v-if="billingAddress">
      <div class="pt-8">
        <div>
          <AccountOrderSummary>
            <div class="col-span-2">{{ order?.orderNumber }}</div>
            <div>
              <SharedPrice
                v-if="order?.amountTotal"
                :value="order.amountTotal"
                class="text-gray-600 font-normal"
                data-testid="order-subtotal"
              />
            </div>
            <div v-if="order?.orderDate">{{ formatDate(order.orderDate) }}</div>
            <div
              @click="toggleView"
              class="justify-self-end text-brand-dark cursor-pointer"
              :aria-expanded="isExpand"
            >
              View
            </div>
          </AccountOrderSummary>
          <template v-if="order?.id">
            <AccountOrderDetails v-if="isExpand" :orderId="order.id" />
          </template>
        </div>
      </div>
      <div class="border-t border-gray-200 flex">
        <div class="md:w-36"></div>
        <div class="flex-1 flex-col ml-4">
          <div class="md:flex md:flex-wrap py-6 md:py-10">
            <div class="w-auto md:w-1/2">
              <div class="font-medium">Shipping address</div>
              <div class="pt-2 text-gray-600">
                <div>
                  {{ shippingAddress?.firstName }}
                  {{ shippingAddress?.lastName }}
                </div>
                <div>
                  {{ shippingAddress?.street }}
                </div>
                <div>
                  {{ shippingAddress?.city }}, {{ shippingAddress?.zipcode }}
                </div>
              </div>
            </div>
            <div class="w-auto md:w-1/2">
              <div class="font-medium">Billing address</div>
              <div class="pt-2 text-gray-600">
                <div>
                  {{ billingAddress.firstName }} {{ billingAddress.lastName }}
                </div>
                <div>
                  {{ billingAddress.street }}
                </div>
                <div>
                  {{ billingAddress.city }}, {{ billingAddress.zipcode }}
                </div>
              </div>
            </div>
          </div>
          <div
            class="md:flex md:flex-wrap border-t border-gray-100 md:flex py-6 md:py-10"
          >
            <div class="w-auto md:w-1/2">
              <div class="font-medium">Payment method</div>
              <div class="pt-2 text-gray-600">
                <div>{{ paymentMethod?.name }}</div>
              </div>
            </div>
            <div class="w-auto md:w-1/2">
              <div class="font-medium">Shipping method</div>
              <div class="pt-2 text-gray-600">
                <div>{{ shippingMethod?.name }}</div>
                <div v-if="shippingMethod?.deliveryTime">
                  Takes up to {{ shippingMethod.deliveryTime?.name }}
                </div>
              </div>
            </div>
          </div>
          <div class="border-t border-gray-100 py-6 md:py-10 space-y-4">
            <div
              v-if="subtotal"
              class="flex justify-between text-base font-medium"
            >
              <p>Subtotal</p>
              <SharedPrice
                :value="subtotal"
                class="text-gray-600 font-normal"
                data-testid="order-subtotal"
              />
            </div>
            <div
              v-if="shippingCosts"
              class="flex justify-between text-base font-medium"
            >
              <p>Shipping</p>
              <SharedPrice
                :value="shippingCosts"
                class="text-gray-600 font-normal"
                data-testid="order-shipping"
              />
            </div>
            <div
              v-if="total"
              class="flex justify-between text-base font-medium"
            >
              <p>Total</p>
              <SharedPrice
                :value="total"
                class="text-gray-600 font-normal"
                data-testid="order-total"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
