<script setup lang="ts">
definePageMeta({
  layout: "checkout",
});

const {
  shippingMethods,
  getShippingMethods,
  paymentMethods,
  getPaymentMethods,
  setShippingMethod,
  setPaymentMethod,
  createOrder,
} = useCheckout();

const {
  selectedPaymentMethod: sessionSelectedPaymentMethod,
  selectedShippingMethod: sessionSelectedShippingMethod,
} = useSessionContext();

const { changeProductQuantity, removeItemById, isEmpty, refreshCart, cart } =
  useCart();

const { register, isLoggedIn, isGuestSession, userDefaultBillingAddress } =
  useUser();

const {
  selectedShippingMethod,
  selectedPaymentMethod,
  canPlaceOrder,
  $vBaseInfo,
  $vBillingAddress,
  customerBaseInfo,
  billingAddress,
} = useTemplateCheckout();

const isUserSession = computed(() => isLoggedIn.value || isGuestSession.value);
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
const { push } = useRouter();

function handleRemoveItem(id: string) {
  removeItemById(id);
}

function handleUpdateQuantity(id: string, quantity: number) {
  changeProductQuantity({ id, quantity });
}

async function handlePlaceOrder() {
  const order = await createOrder();
  await push(formatLink(`/checkout/success/${order.id}`));
  refreshCart();
}

function handleChangeShippingMethod(id: string) {
  setShippingMethod({ id });
}

function handleChangePaymentMethod(id: string) {
  setPaymentMethod({ id });
}

async function handleSaveAddress() {
  $vBaseInfo.$touch();
  $vBillingAddress.$touch();

  const { valid: validBaseInfo } = await $vBaseInfo.$validate();
  const { valid: validbillingAddress } = await $vBillingAddress.$validate();

  if (validBaseInfo || validbillingAddress) {
    return;
  }

  await register({
    firstName: billingAddress.value.firstName,
    lastName: billingAddress.value.lastName,
    email: customerBaseInfo.value.email,
    password: customerBaseInfo.value.password,
    guest: true,
    billingAddress: {
      customerId: "",
      firstName: billingAddress.value.firstName,
      id: "",
      lastName: billingAddress.value.lastName,
      street: billingAddress.value.street,
      zipcode: billingAddress.value.zipcode,
      city: billingAddress.value.city,
      countryId: billingAddress.value.countryId,
    },
    acceptedDataProtection: true,
  });
}

onMounted(() => {
  getShippingMethods();
  getPaymentMethods();

  if (userDefaultBillingAddress.value) {
    billingAddress.value = userDefaultBillingAddress.value;
  }

  if (sessionSelectedPaymentMethod.value) {
    selectedPaymentMethod.value = sessionSelectedPaymentMethod.value.id;
  }

  if (sessionSelectedShippingMethod.value) {
    selectedShippingMethod.value = sessionSelectedShippingMethod.value.id;
  }
});
</script>
<template>
  <div class="container mx-auto">
    <h1 v-if="!isEmpty" class="text-10 my-20 font-['Noto_Serif']">
      {{ $t("checkout.title") }}
    </h1>

    <div v-if="isEmpty" class="flex flex-col items-center justify-center py-20">
      <p class="text-surface-on-surface text-lg mb-6">
        {{ $t("cart.emptyCartLabel") }}
      </p>
      <NuxtLink
        :to="formatLink('/')"
        class="bg-brand-primary text-brand-on-primary text-center font-bold leading-6 py-3 px-4 rounded-md"
      >
        {{ $t("cart.continueShopping") }}
      </NuxtLink>
    </div>

    <div v-else class="flex gap-20 justify-between">
      <div class="w-1/2">
        <CheckoutStepHeader :step="1" label="Shipping address">
          <CheckoutCustomerBaseInfo
            class="mb-4"
            v-model:email="customerBaseInfo.email"
            v-model:password="customerBaseInfo.password"
            :errorMessages="toRef($vBaseInfo)"
          />
          <CheckoutCustomerAddress
            class="mb-4"
            v-model="billingAddress"
            :errorMessages="toRef($vBillingAddress)"
          />
          <FormBaseButton
            :label="$t('checkout.saveAddressButton')"
            @click="handleSaveAddress"
          />

          <!-- <CheckoutCustomerAddressChosen v-else :address="billingAddress" /> -->
        </CheckoutStepHeader>
        <CheckoutStepHeader :step="2" label="Shipping">
          <CheckoutShippingMethods
            :shippingMethods="shippingMethods"
            v-model:selectedShippingMethod="selectedShippingMethod"
            @change="handleChangeShippingMethod"
          />
        </CheckoutStepHeader>
        <CheckoutStepHeader :step="3" label="Payment information">
          <CheckoutPaymentMethods
            :paymentMethods="paymentMethods"
            v-model:selectedPaymentMethod="selectedPaymentMethod"
            @change="handleChangePaymentMethod"
          />
        </CheckoutStepHeader>
        <FormBaseButton
          :label="$t('checkout.placeOrderButton')"
          @click="handlePlaceOrder"
          :disabled="!canPlaceOrder"
        />
      </div>
      <div class="w-1/2">
        <CheckoutSummaryBox
          v-if="cart"
          :cart="cart"
          @remove="handleRemoveItem"
          @updateQuantity="handleUpdateQuantity"
        />
      </div>
    </div>
  </div>
</template>
