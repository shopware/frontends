<script lang="ts">
export default {
  name: "CheckoutPage",
};
</script>
<script setup lang="ts">
import { SharedModal } from "~~/components/shared/SharedModal.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, requiredIf } from "@vuelidate/validators";
import { ClientApiError, ShopwareError } from "@shopware-pwa/types";

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
const { register, logout, isLoggedIn, isGuestSession, user } = useUser();
const {
  refreshSessionContext,
  selectedShippingMethod: shippingMethod,
  selectedPaymentMethod: paymentMethod,
  setShippingMethod,
  setPaymentMethod,
  activeShippingAddress,
  setActiveShippingAddress,
  activeBillingAddress,
  setActiveBillingAddress,
} = useSessionContext();
const { cart, cartItems, subtotal, totalPrice, shippingTotal } = useCart();
const { customerAddresses, loadCustomerAddresses } = useAddress();
const modal = inject<SharedModal>("modal") as SharedModal;
const isLoading = reactive<{ [key: string]: boolean }>({});

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

const selectedShippingAddress = computed({
  get(): string {
    return activeShippingAddress.value?.id || "";
  },
  async set(shippingAddressId: string) {
    isLoading[`shipping-${shippingAddressId}`] = true;
    await setActiveShippingAddress({ id: shippingAddressId });
    isLoading[`shipping-${shippingAddressId}`] = false;
  },
});

const selectedBillingAddress = computed({
  get(): string {
    return activeBillingAddress.value?.id || "";
  },
  async set(billingAddressId: string) {
    isLoading[`billing-${billingAddressId}`] = true;
    await setActiveBillingAddress({ id: billingAddressId });
    isLoading[`billing-${billingAddressId}`] = false;
  },
});

const isCartLoading = computed(() => {
  return !cart.value;
});

const isCheckoutAvailable = computed(() => {
  return cartItems.value.length > 0;
});

const state = reactive({
  salutationId: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  guest: false,
  billingAddress: {
    street: "",
    zipcode: "",
    city: "",
    countryId: "",
  },
  customShipping: false,
});

const rules = computed(() => ({
  salutationId: {
    required,
  },
  firstName: {
    required,
    minLength: minLength(3),
  },
  lastName: {
    required,
    minLength: minLength(3),
  },
  email: {
    required,
    email,
  },
  password: {
    required: requiredIf(() => {
      return !state.guest;
    }),
    minLength: minLength(8),
  },
  billingAddress: {
    street: {
      required,
      minLength: minLength(3),
    },
    zipcode: {
      required,
    },
    city: {
      required,
    },
    countryId: {
      required,
    },
  },
}));

const $v = useVuelidate(rules, state);

const placeOrder = async () => {
  isLoading["placeOrder"] = true;
  const order = await createOrder();
  isLoading["placeOrder"] = false;
  return push("/checkout/success/" + order.id);
};

onMounted(async () => {
  refreshSessionContext();

  isLoading["shippingAddress"] = true;
  isLoading["shippingMethods"] = true;
  isLoading["paymentMethods"] = true;

  Promise.any([
    isLoggedIn.value ? loadCustomerAddresses() : null,
    getShippingMethods(),
    getPaymentMethods(),
  ]).finally(() => {
    isLoading["shippingAddress"] = false;
    isLoading["shippingMethods"] = false;
    isLoading["paymentMethods"] = false;
  });
});

const registerErrors = ref<ShopwareError[]>([]);
const invokeSubmit = async () => {
  $v.value.$touch();
  registerErrors.value = [];
  const valid = await $v.value.$validate();
  if (valid) {
    try {
      await register(state);
    } catch (error) {
      const e = error as ClientApiError;
      registerErrors.value = e.messages;
    }
  }
};
</script>

<template>
  <div class="m-10">
    <div
      v-if="isCheckoutAvailable || isCartLoading"
      class="checkout-inner"
      :class="{
        'opacity-20': isCartLoading,
      }"
    >
      <div class="md:grid md:grid-cols-2 md:gap-6">
        <div class="md:col-span-1">
          <div class="grid gap-4 shadow px-4 py-5 bg-white sm:p-6 mb-8">
            <div>
              <h3 class="text-lg font-medium text-gray-900 m-0">
                Personal Information
              </h3>
              <div class="text-sm text-gray-600">
                Use a permanent address where you can receive mail.
              </div>
            </div>
            <form
              v-if="!isLoggedIn"
              class="grid gap-8"
              name="checkout-billing-address"
              id="checkout-billing-address"
              method="post"
              @submit.prevent="invokeSubmit"
            >
              <div
                v-if="registerErrors.length"
                class="bg-red-200 border-l-4 border-red-500 text-red-700 p-4"
                role="alert"
              >
                <p class="font-bold">Error!!!</p>
                <ul>
                  <li
                    v-for="(error, index) in registerErrors"
                    :key="error.detail"
                  >
                    {{ error.detail }}
                  </li>
                </ul>
              </div>
              <div class="text-sm">
                Register or
                <a
                  href="#"
                  class="whitespace-nowrap font-medium text-brand-primary hover:text-brand-dark"
                  @click="modal.open('AccountLoginForm')"
                  data-testid="checkout-sign-in-link"
                >
                  Sign in
                </a>
                <p class="text-gray-500">In order to place an order.</p>
              </div>
              <div class="grid grid-cols-6 gap-6">
                <div class="col-span-6">
                  <label
                    for="salutation"
                    class="block text-sm font-medium text-gray-700"
                    >Salutation</label
                  >
                  <select
                    id="salutation"
                    v-model="state.salutationId"
                    required
                    name="salutation"
                    autocomplete="salutation-name"
                    class="mt-1 block w-full p-2.5 border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light"
                    data-testid="checkout-pi-salutation-select"
                    @blur="$v.salutationId.$touch()"
                  >
                    <option disabled selected value="">
                      Choose salutation...
                    </option>
                    <option
                      v-for="salutation in getSalutations"
                      :key="salutation.id"
                      :value="salutation.id"
                    >
                      {{ salutation.displayName }}
                    </option>
                  </select>
                  <span
                    v-if="$v.salutationId.$error"
                    class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
                  >
                    {{ $v.salutationId.$errors[0].$message }}
                  </span>
                </div>
                <div class="col-span-6 sm:col-span-3">
                  <label
                    for="first-name"
                    class="block text-sm font-medium text-gray-700"
                    >First name</label
                  >
                  <input
                    id="first-name"
                    v-model="state.firstName"
                    type="text"
                    required
                    name="first-name"
                    placeholder="Enter first name..."
                    class="mt-1 block w-full p-2.5 border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light"
                    data-testid="checkout-pi-first-name-input"
                    @blur="$v.firstName.$touch()"
                  />
                  <span
                    v-if="$v.firstName.$error"
                    class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
                  >
                    {{ $v.firstName.$errors[0].$message }}
                  </span>
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label
                    for="last-name"
                    class="block text-sm font-medium text-gray-700"
                    >Last name</label
                  >
                  <input
                    id="last-name"
                    v-model="state.lastName"
                    type="text"
                    required
                    name="last-name"
                    placeholder="Enter last name..."
                    class="mt-1 block w-full p-2.5 border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light"
                    data-testid="checkout-pi-last-name-input"
                    @blur="$v.lastName.$touch()"
                  />
                  <span
                    v-if="$v.lastName.$error"
                    class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
                  >
                    {{ $v.lastName.$errors[0].$message }}
                  </span>
                </div>

                <div class="col-span-6">
                  <div class="flex items-center">
                    <input
                      id="create-account"
                      type="checkbox"
                      v-model="state.guest"
                      data-testid="checkout-create-account-checkbox"
                      class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      for="create-account"
                      class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >Do not create a customer account.</label
                    >
                  </div>
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label
                    for="email-address"
                    class="block text-sm font-medium text-gray-700"
                    >Email address</label
                  >
                  <input
                    id="email-address"
                    v-model="state.email"
                    type="email"
                    required
                    name="email-address"
                    placeholder="Enter email address..."
                    autocomplete="off"
                    class="mt-1 block w-full p-2.5 border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light"
                    data-testid="checkout-pi-email-input"
                    @blur="$v.email.$touch()"
                  />
                  <span
                    v-if="$v.email.$error"
                    class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
                  >
                    {{ $v.email.$errors[0].$message }}
                  </span>
                </div>
                <div class="col-span-6 sm:col-span-3">
                  <div v-if="!state.guest">
                    <label
                      for="password"
                      class="block text-sm font-medium text-gray-700"
                      >Password</label
                    >
                    <input
                      v-model="state.password"
                      autocomplete="off"
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Enter password..."
                      class="mt-1 block w-full p-2.5 border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light"
                      @blur="$v.password.$touch()"
                    />
                    <span
                      v-if="$v.password.$error"
                      class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
                    >
                      {{ $v.password.$errors[0].$message }}
                    </span>
                  </div>
                </div>

                <div class="col-span-6">
                  <label
                    for="street-address"
                    class="block text-sm font-medium text-gray-700"
                    >Street address</label
                  >
                  <input
                    id="street-address"
                    v-model="state.billingAddress.street"
                    type="text"
                    required
                    name="street-address"
                    placeholder="Enter street..."
                    autocomplete="street-address"
                    class="mt-1 block w-full p-2.5 border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light"
                    data-testid="checkout-pi-street-address-input"
                    @blur="$v.billingAddress.street.$touch()"
                  />
                  <span
                    v-if="$v.billingAddress.street.$error"
                    class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
                  >
                    {{ $v.billingAddress.street.$errors[0].$message }}
                  </span>
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label
                    for="postal-code"
                    class="block text-sm font-medium text-gray-700"
                    >ZIP / Postal code</label
                  >
                  <input
                    id="postal-code"
                    v-model="state.billingAddress.zipcode"
                    type="text"
                    required
                    name="postal-code"
                    placeholder="Enter zip code..."
                    autocomplete="postal-code"
                    class="mt-1 block w-full p-2.5 border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light"
                    data-testid="checkout-pi-zip-code-input"
                    @blur="$v.billingAddress.zipcode.$touch()"
                  />
                  <span
                    v-if="$v.billingAddress.zipcode.$error"
                    class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
                  >
                    {{ $v.billingAddress.zipcode.$errors[0].$message }}
                  </span>
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label
                    for="city"
                    class="block text-sm font-medium text-gray-700"
                    >City</label
                  >
                  <input
                    id="city"
                    v-model="state.billingAddress.city"
                    type="text"
                    required
                    name="city"
                    placeholder="Enter city..."
                    autocomplete="address-level2"
                    class="mt-1 block w-full p-2.5 border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light"
                    data-testid="checkout-pi-city-input"
                    @blur="$v.billingAddress.city.$touch()"
                  />
                  <span
                    v-if="$v.billingAddress.city.$error"
                    class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
                  >
                    {{ $v.billingAddress.city.$errors[0].$message }}
                  </span>
                </div>

                <div class="col-span-6">
                  <label
                    for="country"
                    class="block text-sm font-medium text-gray-700"
                    >Country</label
                  >
                  <select
                    id="country"
                    v-model="state.billingAddress.countryId"
                    required
                    name="country"
                    autocomplete="country-name"
                    class="mt-1 block w-full p-2.5 border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light"
                    data-testid="checkout-pi-country-input"
                    @blur="$v.billingAddress.countryId.$touch()"
                  >
                    <option disabled selected value="">
                      Choose country...
                    </option>
                    <option
                      v-for="country in getCountries"
                      :key="country.id"
                      :value="country.id"
                    >
                      {{ country.name }}
                    </option>
                  </select>
                  <span
                    v-if="$v.billingAddress.countryId.$error"
                    class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
                  >
                    {{ $v.billingAddress.countryId.$errors[0].$message }}
                  </span>
                </div>
              </div>
              <button
                type="submit"
                class="flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary"
                data-testid="checkout-pi-submit-button"
              >
                Save
              </button>
            </form>
            <div v-else>
              You are logged-in as {{ user?.firstName }}
              <span
                v-if="isGuestSession"
                class="bg-gray-100 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
                >guest</span
              >! You can log out
              <a
                href="#"
                class="text-brand-primary hover:text-brand-dark"
                @click="logout"
                data-testid="checkout-logout"
                >here</a
              >.
            </div>
          </div>
          <fieldset class="grid gap-4 shadow px-4 py-5 bg-white sm:p-6 mb-8">
            <legend class="pt-5">
              <h3 class="text-lg font-medium text-gray-900 m-0">
                Shipping method
              </h3>
              <div class="text-sm text-gray-600">Select a payment method.</div>
            </legend>
            <div v-if="isLoading['shippingMethods']" class="w-60 h-24">
              <div
                class="flex animate-pulse flex-row items-top pt-4 h-full space-x-5"
              >
                <div class="w-4 bg-gray-300 h-4 mt-1 rounded-full" />
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
                class="focus:ring-brand-primary h-4 w-4 border-gray-300"
                :data-testid="`checkout-shipping-method-${shippingMethod.id}`"
              />
              <label
                :for="shippingMethod.id"
                :class="{ 'animate-pulse': isLoading[shippingMethod.id] }"
                class="ml-2 block text-sm font-medium text-gray-700"
              >
                {{ shippingMethod.name }}
              </label>
            </div>
          </fieldset>
          <fieldset class="grid gap-4 shadow px-4 py-5 bg-white sm:p-6">
            <legend class="pt-5">
              <h3 class="text-lg font-medium text-gray-900 m-0">
                Payment method
              </h3>
              <div class="text-sm text-gray-600">Select a payment method</div>
            </legend>
            <div v-if="isLoading['paymentMethods']" class="w-60 h-24">
              <div
                class="flex animate-pulse flex-row items-top pt-4 h-full space-x-5"
              >
                <div class="w-4 bg-gray-300 h-4 mt-1 rounded-full" />
                <div class="flex flex-col space-y-3">
                  <div class="w-36 bg-gray-300 h-6 rounded-md" />
                  <div class="w-24 bg-gray-300 h-6 rounded-md" />
                </div>
              </div>
            </div>
            <div
              v-else
              v-for="paymentMethod in paymentMethods"
              :key="paymentMethod.id"
              class="flex items-center"
            >
              <input
                :id="paymentMethod.id"
                v-model="selectedPaymentMethod"
                :value="paymentMethod.id"
                name="payment-method"
                type="radio"
                class="focus:ring-brand-primary h-4 w-4 border-gray-300"
                :data-testid="`checkout-payment-method-${paymentMethod.id}`"
              />
              <label
                :for="paymentMethod.id"
                :class="{ 'animate-pulse': isLoading[paymentMethod.id] }"
                class="ml-2 block text-sm font-medium text-gray-700"
              >
                {{ paymentMethod.name }}
              </label>
            </div>
          </fieldset>
          <fieldset
            v-if="isLoggedIn"
            class="grid gap-4 shadow px-4 py-5 bg-white sm:p-6"
          >
            <legend class="pt-5">
              <h3 class="text-lg font-medium text-gray-900 m-0">
                Billing Address
              </h3>
              <div class="text-sm text-gray-600">Select a billing address</div>
            </legend>
            <div v-if="isLoading['paymentMethods']" class="w-60 h-24">
              <div
                class="flex animate-pulse flex-row items-top pt-4 h-full space-x-5"
              >
                <div class="w-4 bg-gray-300 h-4 mt-1 rounded-full" />
                <div class="flex flex-col space-y-3">
                  <div class="w-36 bg-gray-300 h-6 rounded-md" />
                  <div class="w-24 bg-gray-300 h-6 rounded-md" />
                </div>
              </div>
            </div>
            <div
              v-else
              v-for="address in customerAddresses"
              :key="address.id"
              class="flex mb-3"
            >
              <input
                :id="`billing-${address.id}`"
                v-model="selectedBillingAddress"
                :value="address.id"
                name="billing-address"
                type="radio"
                class="focus:ring-brand-primary h-4 w-4 border-gray-300"
                :data-testid="`checkout-billing-address-${address.id}`"
              />
              <label
                :for="`billing-${address.id}`"
                :class="{ 'animate-pulse': isLoading[`billing-${address.id}`] }"
                class="ml-2 field-label"
              >
                <AccountAddressCard
                  :key="address.id"
                  :address="address"
                  :countries="getCountries"
                  :salutations="getSalutations"
                  :canSetDefault="false"
                />
              </label>
            </div>
            <button
              type="button"
              class="flex font-medium text-brand-dark"
              @click="
                modal.open('AccountAddressForm', {
                  countries: getCountries,
                  salutations: getSalutations,
                  title: 'Add new billing address',
                })
              "
            >
              Add new billing address
            </button>
            <label for="customShipping" class="field-label">
              <input
                id="customShipping"
                name="privacy"
                type="checkbox"
                v-model="state.customShipping"
                class="mt-1 focus:ring-indigo-500 h-4 w-4 border text-indigo-600 rounded"
              />
              Different shipping address
            </label>
            <div v-if="state.customShipping">
              <div
                v-for="address in customerAddresses"
                :key="address.id"
                class="flex mb-3"
              >
                <input
                  :id="`shipping-${address.id}`"
                  v-model="selectedShippingAddress"
                  :value="address.id"
                  name="shipping-address"
                  type="radio"
                  class="focus:ring-brand-primary h-4 w-4 border-gray-300"
                  :data-testid="`checkout-shipping-address-${address.id}`"
                />
                <label
                  :for="`shipping-${address.id}`"
                  :class="{
                    'animate-pulse': isLoading[`shipping-${address.id}`],
                  }"
                  class="ml-2 field-label"
                >
                  <AccountAddressCard
                    :key="address.id"
                    :address="address"
                    :countries="getCountries"
                    :salutations="getSalutations"
                    :canSetDefault="false"
                  />
                </label>
              </div>
              <button
                type="button"
                class="flex font-medium text-brand-dark"
                @click="
                  modal.open('AccountAddressForm', {
                    countries: getCountries,
                    salutations: getSalutations,
                    title: 'Add new shipping address',
                  })
                "
              >
                Add new shipping address
              </button>
            </div>
          </fieldset>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-1">
          <div class="grid gap-4 shadow px-4 py-5 bg-white sm:p-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 m-0">
                Order summary
              </h3>
              <p class="text-sm text-gray-600">Order details and totals.</p>
            </div>
            <ul role="list" class="-my-4 divide-y divide-gray-200 pl-0">
              <li
                v-for="cartItem in cartItems"
                :key="cartItem.id"
                class="flex py-6"
              >
                <CheckoutCartItem :cart-item="cartItem" />
              </li>
            </ul>

            <div class="flex justify-between text-sm text-gray-500">
              <p>Subtotal</p>
              <SharedPrice
                :value="subtotal"
                class="text-gray-900 font-medium"
                data-testid="cart-subtotal"
              />
            </div>

            <div
              class="flex pb-4 border-b justify-between text-sm text-gray-500"
            >
              <p>Shipping estimate</p>
              <SharedPrice
                :value="shippingTotal"
                class="text-gray-900 font-medium"
                data-testid="cart-subtotal"
              />
            </div>

            <div class="flex justify-between text-gray-900 font-medium">
              <p>Order total</p>
              <SharedPrice :value="totalPrice" data-testid="cart-subtotal" />
            </div>

            <div class="mt-4">
              <div class="text-right">
                <span v-if="!isLoggedIn" class="text-sm text-gray-600"
                  >You must be logged-in before submitting an order.</span
                >
                <button
                  :disabled="!isLoggedIn"
                  type="button"
                  :class="{
                    grayscale: !isLoggedIn,
                    'opacity-50 cursor-not-allowed hover:bg-brand-primary':
                      !isLoggedIn,
                    'animate-pulse': isLoading['placeOrder'],
                  }"
                  class="w-full flex justify-center py-2 px-4 border border-transparent font-medium rounded-md text-white bg-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  @click="placeOrder"
                  data-testid="checkout-place-order-button"
                >
                  Place the order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center">
      <h1 class="m-10 text-2xl font-medium text-gray-900">
        Your cart is empty!
      </h1>
      <NuxtLink
        class="inline-flex justify-center py-2 px-4 my-8 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-light"
        to="/"
        data-testid="checkout-go-home-link"
      >
        Go to home page
      </NuxtLink>
    </div>
  </div>
</template>
