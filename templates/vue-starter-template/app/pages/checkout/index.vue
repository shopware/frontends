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
const { handleApiError: handleRegistrationError } = useApiErrorsResolver(
  "checkout_guest_registration_form",
);
const { handleApiError: handlePlaceOrderError } = useApiErrorsResolver(
  "checkout_place_order",
);
const { pushError } = useNotifications();

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

function persistentError(message: string) {
  pushError(message, { persistent: true });
}

function restoreFocus(trigger: Element | null) {
  if (trigger instanceof HTMLElement) {
    nextTick(() => trigger.focus());
  }
}

function focusFirstInvalid() {
  nextTick(() => {
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  });
}

const isPlacingOrder = ref(false);
const isRegisteringGuest = ref(false);

async function handlePlaceOrder() {
  if (isPlacingOrder.value) return;

  isPlacingOrder.value = true;
  const trigger = document.activeElement;
  try {
    const order = await createOrder();
    await push(formatLink(`/checkout/success/${order.id}`));
    await refreshCart();
  } catch (error) {
    handlePlaceOrderError(error, persistentError);
    restoreFocus(trigger);
  } finally {
    isPlacingOrder.value = false;
  }
}

function handleChangeShippingMethod(id: string) {
  setShippingMethod({ id });
}

function handleChangePaymentMethod(id: string) {
  setPaymentMethod({ id });
}

async function handleRegisterGuest() {
  if (isRegisteringGuest.value) return;

  $vBaseInfo.email.$touch();
  $vBillingAddress.$touch();

  const { valid: validEmail } = await $vBaseInfo.email.$validate();
  const { valid: validBillingAddress } = await $vBillingAddress.$validate();

  if (!validEmail || !validBillingAddress) {
    focusFirstInvalid();
    return;
  }

  isRegisteringGuest.value = true;
  const trigger = document.activeElement;
  try {
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
  } catch (error) {
    handleRegistrationError(error, persistentError);
  } finally {
    isRegisteringGuest.value = false;
    restoreFocus(trigger);
  }
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
      <div class="w-1/2 relative">
        <div
          v-if="isPlacingOrder"
          class="absolute inset-0 z-10 flex items-center justify-center bg-surface-surface/70 backdrop-blur-[1px] cursor-wait"
          role="status"
          :aria-label="$t('checkout.placingOrder')"
        >
          <div class="flex flex-col items-center gap-3">
            <span
              class="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"
              aria-hidden="true"
            />
            <span class="text-sm font-bold text-surface-on-surface">
              {{ $t("checkout.placingOrder") }}
            </span>
          </div>
        </div>
        <CheckoutStepHeader :step="1" label="Shipping address">
          <template v-if="!isUserSession">
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
              :label="
                isRegisteringGuest
                  ? $t('checkout.registeringGuest')
                  : $t('checkout.guestRegistrationButton')
              "
              :loading="isRegisteringGuest"
              @click="handleRegisterGuest"
            />
          </template>

          <CheckoutCustomerAddressChosen v-else :address="billingAddress" />
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
          :label="
            isPlacingOrder
              ? $t('checkout.placingOrder')
              : $t('checkout.placeOrderButton')
          "
          :loading="isPlacingOrder"
          :disabled="!canPlaceOrder"
          @click="handlePlaceOrder"
        />
      </div>
      <div class="w-1/2 relative">
        <div
          v-if="isPlacingOrder"
          class="absolute inset-0 z-10 bg-surface-surface/70 backdrop-blur-[1px] cursor-wait"
          aria-hidden="true"
        />
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
