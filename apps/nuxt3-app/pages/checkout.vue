<script setup lang="ts">
import { useCountries, useSalutations, useUser, useCheckout, useSessionContext } from "@shopware-pwa/composables";
const { getCountries } = useCountries();
const { getSalutations } = useSalutations();
const { paymentMethods, shippingMethods, getPaymentMethods, getShippingMethods } = useCheckout();
const { register, isLoggedIn, user, errors } = useUser();
const { refreshSessionContext, shippingMethod, paymentMethod, setShippingMethod, setPaymentMethod } = useSessionContext();

const password = ref<string|null>();
const selectedShippingMethod = computed({
  get(): string {
    return shippingMethod.value?.id;
  },
  set(shippingMethodId: string) {
    setShippingMethod({id: shippingMethodId});
  },
});
const selectedPaymentMethod = computed({
  get(): string {
    return paymentMethod.value?.id;
  },
  set(paymentMethodId: string) {
    setPaymentMethod({id: paymentMethodId});
  },
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
  salutationId: ""
});

const registerPayload = computed(() => ({
  email: billingAddress.email,
  guest: true,
  firstName: billingAddress.firstName,
  lastName: billingAddress.lastName,
  countryId: billingAddress.countryId,
  salutationId: billingAddress.salutationId,
  billingAddress,
  storefrontUrl: window.location.origin
}))

onMounted(() => {
  refreshSessionContext();
  getShippingMethods();
  getPaymentMethods();
})

const submitBillingAddress = async (e: Event) => {
  e.preventDefault();
  // prevent default but leave default browser's validation as long as there is no validation library
  if(document.forms['checkout-billing-address']?.reportValidity()) {
    try {
      await register(registerPayload.value)
    } catch (error) {
      
    }
  }
}
</script>

<template>
  <div class="m-10">
    <div class="md:grid md:grid-cols-3 md:gap-6">
      <div class="md:col-span-1">
        <div class="px-4 sm:px-0">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
          <p class="mt-1 text-sm text-gray-600">Use a permanent address where you can receive mail.</p>
        </div>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-2">
          <div class="shadow overflow-hidden sm:rounded-md">
            <form v-if="!isLoggedIn" method="post" id="checkout-billing-address">
              <div class="m-5" v-if="errors.register.length">
                {{ errors.register }}
              </div>
              <div class="px-4 py-5 bg-white sm:p-6">
                
                <div class="grid grid-cols-6 gap-6">
                  <div class="col-span-6 sm:col-span-6">
                    <label for="country" class="block text-sm font-medium text-gray-700">Salutation</label>
                    <select required v-model="billingAddress.salutationId" id="salutation" name="salutation" autocomplete="salutation-name" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <option v-for="salutation in getSalutations" :key="salutation.id" :value="salutation.id">{{ salutation.displayName }}</option>
                    </select>
                  </div>
                  <div class="col-span-6 sm:col-span-3">
                    <label for="first-name" class="block text-sm font-medium text-gray-700">First name</label>
                    <input v-model="billingAddress.firstName" type="text" required name="first-name" id="first-name" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <label for="last-name" class="block text-sm font-medium text-gray-700">Last name</label>
                    <input v-model="billingAddress.lastName" type="text" required name="last-name" id="last-name" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                  </div>

                  <div class="col-span-6 sm:col-span-3">
                    <label for="email-address" class="block text-sm font-medium text-gray-700">Email address</label>
                    <input v-model="billingAddress.email" type="email" required name="email-address" id="email-address" autocomplete="off" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                  </div>
                  <!-- <div class="col-span-6 sm:col-span-3">
                    <label for="email-address" class="block text-sm font-medium text-gray-700">Password</label>
                    <input v-model="password" autocomplete="off" type="password" name="password" id="password" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                  </div> -->

                  <div class="col-span-6 sm:col-span-3">
                    <label for="country" class="block text-sm font-medium text-gray-700">Country</label>
                    <select required v-model="billingAddress.countryId" id="country" name="country" autocomplete="country-name" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <option v-for="country in getCountries" :key="country.id" :value="country.id">{{ country.name }}</option>
                    </select>
                  </div>

                  <div class="col-span-6">
                    <label for="street-address" class="block text-sm font-medium text-gray-700">Street address</label>
                    <input v-model="billingAddress.street" type="text" required name="street-address" id="street-address" autocomplete="street-address" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                  </div>

                  <div class="col-span-6 sm:col-span-6 lg:col-span-2">
                    <label for="city" class="block text-sm font-medium text-gray-700">City</label>
                    <input v-model="billingAddress.city" type="text" required name="city" id="city" autocomplete="address-level2" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                  </div>

                  <!-- <div class="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label for="region" class="block text-sm font-medium text-gray-700">State / Province</label>
                    <input type="text" name="region" id="region" autocomplete="address-level1" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                  </div> -->

                  <div class="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label for="postal-code" class="block text-sm font-medium text-gray-700">ZIP / Postal code</label>
                    <input v-model="billingAddress.zipcode" type="text" required name="postal-code" id="postal-code" autocomplete="postal-code" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                  </div>
                </div>
              </div>
              <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button @click="submitBillingAddress" type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Save</button>
              </div>
            </form>
            <div v-else>You are logged-in as {{ user.firstName }}! </div>
          </div>
      </div>
    </div>
    <div class="md:grid md:grid-cols-3 md:gap-6 mt-10">
      <div class="md:col-span-1">
        <div class="px-4 sm:px-0">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Shipping and Payment methods</h3>
          <p class="mt-1 text-sm text-gray-600">Select you favorite shipping and payment providers!</p>
        </div>
      </div>
      <div class="mt-5 md:mt-0 md:col-span-2">
        <div class="shadow overflow-hidden sm:rounded-md">
          <div class="px-4 py-5 bg-white sm:p-6">
            <fieldset>
              <legend class="contents text-base font-medium text-gray-900">Shipping method</legend>
              <p class="text-sm text-gray-500">Select a shipping method.</p>
              <div class="mt-4 space-y-4">
                <div v-for="shippingMethod in shippingMethods" :key="shippingMethod.id" class="flex items-center">
                  <input :id="shippingMethod.id" v-model="selectedShippingMethod" :value="shippingMethod.id"  name="shipping-method" type="radio" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300">
                  <label :for="shippingMethod.id" class="ml-3 block text-sm font-medium text-gray-700"> {{ shippingMethod.name }} </label>
                </div>
              </div>
            </fieldset>
              <fieldset class="mt-10">
              <legend class="contents text-base font-medium text-gray-900">Payment method</legend>
              <p class="text-sm text-gray-500">Select a payment method.</p>
              <div class="mt-4 space-y-4">
                <div v-for="paymentMethod in paymentMethods" :key="paymentMethod.id" class="flex items-center">
                  <input :id="paymentMethod.id" v-model="selectedPaymentMethod" :value="paymentMethod.id"  name="payment-method" type="radio" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300">
                  <label :for="paymentMethod.id" class="ml-3 block text-sm font-medium text-gray-700"> {{ paymentMethod.name }} </label>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
