<script lang="ts">
export default {
  name: "CheckoutPage",
};
</script>
<script setup lang="ts">
definePageMeta({
  layout: "checkout",
});

const { push } = useRouter();
const { getCountries } = useCountries();
const { getSalutations } = useSalutations();
const {
  paymentMethods,
  shippingMethods,
  getPaymentMethods,
  getShippingMethods,
  createOrder,
} = useCheckout();
const { register, logout, isLoggedIn, user, errors } = useUser();
const {
  refreshSessionContext,
  shippingMethod,
  paymentMethod,
  setShippingMethod,
  setPaymentMethod,
} = useSessionContext();
const { cartItems } = useCart();
const isModalOpened = inject("isModalOpened");
const isLoading = reactive({} as any);

const password = ref<string | null>();
const selectedShippingMethod = computed({
  get(): string {
    return shippingMethod.value?.id || "";
  },
  async set(shippingMethodId: string) {
    isLoading[shippingMethodId] = true;
    await setShippingMethod({ id: shippingMethodId });
    isLoading[shippingMethodId] = false;
  },
});
const selectedPaymentMethod = computed({
  get(): string {
    return paymentMethod.value?.id || "";
  },
  async set(paymentMethodId: string) {
    isLoading[paymentMethodId] = true;
    await setPaymentMethod({ id: paymentMethodId });
    isLoading[paymentMethodId] = false;
  },
});

const isCheckoutAvailable = computed(() => {
  return cartItems.value.length > 0;
});

const billingAddress = reactive({
  firstName: "",
  lastName: "",
  street: "",
  zipcode: "",
  city: "",
  state: "",
  countryId: "",
  phone: "",
  email: "",
  salutationId: "",
});

const registerPayload = computed(() => ({
  email: billingAddress.email,
  guest: true,
  firstName: billingAddress.firstName,
  lastName: billingAddress.lastName,
  countryId: billingAddress.countryId,
  salutationId: billingAddress.salutationId,
  billingAddress,
  storefrontUrl: window.location.origin,
}));

const placeOrder = async () => {
  isLoading["placeOrder"] = true;
  const order = await createOrder();
  isLoading["placeOrder"] = false;
  return push("/checkout/success/" + order.id);
};

onMounted(async () => {
  refreshSessionContext();
  isLoading["shippingMethods"] = true;
  await getShippingMethods();
  isLoading["shippingMethods"] = false;

  isLoading["paymentMethods"] = true;
  await getPaymentMethods();
  isLoading["paymentMethods"] = false;
});

const submitBillingAddress = async (e: Event) => {
  e.preventDefault();
  // prevent default but leave default browser's validation as long as there is no validation library
  if (document.forms.namedItem("checkout-billing-address")?.reportValidity()) {
    try {
      await register(registerPayload.value);
    } catch (error) {}
  }
};
</script>

<template>
  <div class="m-10">
    <div v-if="isCheckoutAvailable" class="checkout-inner">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              Personal Information
            </h3>
            <p class="mt-1 text-sm text-gray-600">
              Use a permanent address where you can receive mail.
            </p>
          </div>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <div class="shadow overflow-hidden sm:rounded-md">
            <form
              v-if="!isLoggedIn"
              name="checkout-billing-address"
              id="checkout-billing-address"
              method="post"
            >
              <div v-if="errors.register.length" class="m-5">
                {{ errors.register }}
              </div>
              <div class="px-4 py-5 bg-white sm:p-6">
                <div class="contents text-base font-medium text-gray-900">
                  Register or
                  <a
                    href="#"
                    class="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
                    @click="isModalOpened = true"
                  >
                    Sign in
                  </a>
                  <Teleport v-if="isModalOpened" to="#modal-content">
                    <SwLoginForm @success="isModalOpened = false" /> </Teleport
                  >.
                </div>
                <p class="text-sm text-gray-500">In order to place an order.</p>
                <div class="grid grid-cols-6 gap-6 mt-8">
                  <div class="col-span-6 sm:col-span-6">
                    <label
                      for="country"
                      class="block text-sm font-medium text-gray-700"
                      >Salutation</label
                    >
                    <select
                      id="salutation"
                      v-model="billingAddress.salutationId"
                      required
                      name="salutation"
                      autocomplete="salutation-name"
                      class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option
                        v-for="salutation in getSalutations"
                        :key="salutation.id"
                        :value="salutation.id"
                      >
                        {{ salutation.displayName }}
                      </option>
                    </select>
                  </div>
                  <div class="col-span-6 sm:col-span-3">
                    <label
                      for="first-name"
                      class="block text-sm font-medium text-gray-700"
                      >First name</label
                    >
                    <input
                      id="first-name"
                      v-model="billingAddress.firstName"
                      type="text"
                      required
                      name="first-name"
                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <label
                      for="last-name"
                      class="block text-sm font-medium text-gray-700"
                      >Last name</label
                    >
                    <input
                      id="last-name"
                      v-model="billingAddress.lastName"
                      type="text"
                      required
                      name="last-name"
                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <label
                      for="email-address"
                      class="block text-sm font-medium text-gray-700"
                      >Email address</label
                    >
                    <input
                      id="email-address"
                      v-model="billingAddress.email"
                      type="email"
                      required
                      name="email-address"
                      autocomplete="off"
                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <!-- <div class="col-span-6 sm:col-span-3">
                    <label for="email-address" class="block text-sm font-medium text-gray-700">Password</label>
                    <input v-model="password" autocomplete="off" type="password" name="password" id="password" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                  </div> -->

                  <div class="col-span-6 sm:col-span-3">
                    <label
                      for="country"
                      class="block text-sm font-medium text-gray-700"
                      >Country</label
                    >
                    <select
                      id="country"
                      v-model="billingAddress.countryId"
                      required
                      name="country"
                      autocomplete="country-name"
                      class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option
                        v-for="country in getCountries"
                        :key="country.id"
                        :value="country.id"
                      >
                        {{ country.name }}
                      </option>
                    </select>
                  </div>

                  <div class="col-span-6">
                    <label
                      for="street-address"
                      class="block text-sm font-medium text-gray-700"
                      >Street address</label
                    >
                    <input
                      id="street-address"
                      v-model="billingAddress.street"
                      type="text"
                      required
                      name="street-address"
                      autocomplete="street-address"
                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div class="col-span-6 sm:col-span-6 lg:col-span-2">
                    <label
                      for="city"
                      class="block text-sm font-medium text-gray-700"
                      >City</label
                    >
                    <input
                      id="city"
                      v-model="billingAddress.city"
                      type="text"
                      required
                      name="city"
                      autocomplete="address-level2"
                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <!-- <div class="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label for="region" class="block text-sm font-medium text-gray-700">State / Province</label>
                    <input type="text" name="region" id="region" autocomplete="address-level1" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                  </div> -->

                  <div class="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label
                      for="postal-code"
                      class="block text-sm font-medium text-gray-700"
                      >ZIP / Postal code</label
                    >
                    <input
                      id="postal-code"
                      v-model="billingAddress.zipcode"
                      type="text"
                      required
                      name="postal-code"
                      autocomplete="postal-code"
                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
              <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  @click="submitBillingAddress"
                >
                  Save
                </button>
              </div>
            </form>
            <div v-else class="p-6">
              You are logged-in as {{ user?.firstName }}! You can log out
              <a href="#" class="text-indigo-700" @click="logout">here</a>.
            </div>
          </div>
        </div>
      </div>
      <div class="md:grid md:grid-cols-3 md:gap-6 mt-10">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              Shipping and Payment methods
            </h3>
            <p class="mt-1 text-sm text-gray-600">
              Select you favorite shipping and payment providers!
            </p>
          </div>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <div class="shadow overflow-hidden sm:rounded-md">
            <div class="px-4 py-5 bg-white sm:p-6">
              <fieldset>
                <legend class="contents text-base font-medium text-gray-900">
                  Shipping method
                </legend>
                <p class="text-sm text-gray-500">Select a shipping method.</p>
                <div class="mt-4 space-y-4">
                  <div
                    v-if="isLoading['shippingMethods']"
                    class="w-60 h-24 mx-auto mt-20"
                  >
                    <div
                      class="flex animate-pulse flex-row items-top pt-4 h-full justify-center space-x-5"
                    >
                      <div class="w-4 bg-gray-300 h-4 rounded-full" />
                      <div class="flex flex-col space-y-3">
                        <div class="w-36 bg-gray-300 h-6 rounded-md" />
                        <div class="w-24 bg-gray-300 h-6 rounded-md" />
                      </div>
                    </div>
                  </div>
                  <div
                    v-for="shippingMethod in shippingMethods"
                    v-else
                    :key="shippingMethod.id"
                    class="flex items-center"
                  >
                    <input
                      :id="shippingMethod.id"
                      v-model="selectedShippingMethod"
                      :value="shippingMethod.id"
                      name="shipping-method"
                      type="radio"
                      class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label
                      :for="shippingMethod.id"
                      :class="{ 'animate-pulse': isLoading[shippingMethod.id] }"
                      class="ml-3 block text-sm font-medium text-gray-700"
                    >
                      {{ shippingMethod.name }}
                    </label>
                  </div>
                </div>
              </fieldset>
              <fieldset class="mt-10">
                <legend class="contents text-base font-medium text-gray-900">
                  Payment method
                </legend>
                <p class="text-sm text-gray-500">Select a payment method.</p>
                <div class="mt-4 space-y-4">
                  <div
                    v-if="isLoading['paymentMethods']"
                    class="w-60 h-24 mx-auto mt-20"
                  >
                    <div
                      class="flex animate-pulse flex-row items-top pt-4 h-full justify-center space-x-5"
                    >
                      <div class="w-4 bg-gray-300 h-4 rounded-full" />
                      <div class="flex flex-col space-y-3">
                        <div class="w-36 bg-gray-300 h-6 rounded-md" />
                        <div class="w-24 bg-gray-300 h-6 rounded-md" />
                      </div>
                    </div>
                  </div>
                  <div
                    v-for="paymentMethod in paymentMethods"
                    v-else
                    :key="paymentMethod.id"
                    class="flex items-center"
                  >
                    <input
                      :id="paymentMethod.id"
                      v-model="selectedPaymentMethod"
                      :value="paymentMethod.id"
                      name="payment-method"
                      type="radio"
                      class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label
                      :for="paymentMethod.id"
                      :class="{ 'animate-pulse': isLoading[paymentMethod.id] }"
                      class="ml-3 block text-sm font-medium text-gray-700"
                    >
                      {{ paymentMethod.name }}
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
      <div class="md:grid md:grid-cols-3 md:gap-6 mt-10">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              Order summary
            </h3>
            <p class="mt-1 text-sm text-gray-600">Order details and totals.</p>
          </div>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <div class="shadow overflow-hidden sm:rounded-md">
            <div class="px-4 py-5 bg-white sm:p-6">
              <div class="contents text-base font-medium text-gray-900">
                Cart items
              </div>
              <p class="text-sm text-gray-500">
                List of cart's items, including discounts.
              </p>
              <div class="flow-root mt-8">
                <ul role="list" class="-my-6 divide-y divide-gray-200">
                  <li
                    v-for="cartItem in cartItems"
                    :key="cartItem.id"
                    class="flex py-6"
                  >
                    <SwCartItem :cart-item="cartItem" />
                  </li>
                </ul>
              </div>
            </div>
            <div class="px-4 py-3 bg-gray-50 text-right sm:px-6 mt-4">
              <div class="text-right">
                <span v-if="!isLoggedIn" class="pr-4"
                  >You must be logged-in before submitting an order.</span
                >
                <button
                  :disabled="!isLoggedIn"
                  type="button"
                  :class="{
                    grayscale: !isLoggedIn,
                    'hover:bg-indigo-700': isLoggedIn,
                    'animate-pulse': isLoading['placeOrder'],
                  }"
                  class="inline-flex justify-right py-2 px-8 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  @click="placeOrder"
                >
                  Place the order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="p-8 text-center">
      <div class="mb-8">
        Your cart is empty! There is nothing to buy, so far :)
      </div>
      <NuxtLink
        class="inline-flex justify-center py-2 px-8 border border-transparent shadow-sm text-sm font-medium rounded-md hover:bg-indigo-700 text-white bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        to="/"
      >
        ↩ go to home page
      </NuxtLink>
    </div>
  </div>
</template>
