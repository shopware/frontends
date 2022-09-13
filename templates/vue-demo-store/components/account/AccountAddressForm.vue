<script setup lang="ts">
import { CustomerAddress, Country, Salutation } from "@shopware-pwa/types";
const { createCustomerAddress, updateCustomerAddress } = useAddress();

const emits = defineEmits<{
  (e: "success"): void;
  (e: "close"): void;
}>();

const props = defineProps<{
  address?: CustomerAddress;
  countries: Array<Country>;
  salutations: Array<Salutation>;
}>();

const formData = reactive<CustomerAddress>({
  countryId: props.address?.countryId ?? "",
  salutationId: props.address?.salutationId ?? "",
  firstName: props.address?.firstName ?? "",
  lastName: props.address?.lastName ?? "",
  zipcode: props.address?.zipcode ?? "",
  city: props.address?.city ?? "",
  street: props.address?.street ?? "",
  salutation: props.address?.salutation ?? "",
  id: props.address?.id ?? "",
});

const invokeSave = async (): Promise<void> => {
  try {
    let addressResult = false;
    const saveAddress = formData.id
      ? updateCustomerAddress
      : createCustomerAddress;
    await saveAddress(formData);
    if (addressResult) {
      emits("success");
    }
  } catch (error) {
    console.error("error save address", error);
  }
};
</script>

<template>
  <div class="mt-5 md:mt-0 md:col-span-2">
    <div class="shadow overflow-hidden sm:rounded-md">
      <form name="account-address" id="account-address" method="post">
        <div class="px-4 py-5 bg-white sm:p-6">
          <h3 class="text-2xl border-b pb-3">Account address</h3>
          <div class="grid grid-cols-6 gap-6 mt-8">
            <div class="col-span-6 sm:col-span-6">
              <label
                for="country"
                class="block mb-2 text-sm font-medium text-gray-500"
              >
                Salutation
              </label>
              <select
                id="salutation"
                v-model="formData.salutationId"
                required
                name="salutation"
                autocomplete="salutation-name"
                class="mt-1 block w-full py-2.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-light focus:border-brand-light sm:text-sm"
              >
                <option
                  v-for="salutation in props.salutations"
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
                class="block mb-2 text-sm font-medium text-gray-500"
              >
                First name
              </label>
              <input
                id="first-name"
                v-model="formData.firstName"
                type="text"
                required
                name="first-name"
                class="mt-1 block w-full p-2.5 border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light"
              />
            </div>

            <div class="col-span-6 sm:col-span-3">
              <label
                for="last-name"
                class="block mb-2 text-sm font-medium text-gray-500"
              >
                Last name
              </label>
              <input
                id="last-name"
                v-model="formData.lastName"
                type="text"
                required
                name="last-name"
                class="mt-1 block w-full p-2.5 border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light"
              />
            </div>
            <div class="col-span-6 sm:col-span-6">
              <label
                for="country"
                class="block mb-2 text-sm font-medium text-gray-500"
              >
                Country
              </label>
              <select
                id="country"
                v-model="formData.countryId"
                required
                name="country"
                autocomplete="country-name"
                class="mt-1 block w-full py-2.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-light focus:border-brand-light sm:text-sm"
              >
                <option
                  v-for="country in props.countries"
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
                class="block mb-2 text-sm font-medium text-gray-500"
              >
                Street address
              </label>
              <input
                id="street-address"
                v-model="formData.street"
                type="text"
                required
                name="street-address"
                autocomplete="street-address"
                class="mt-1 block w-full p-2.5 border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light"
              />
            </div>

            <div class="col-span-6 sm:col-span-6 lg:col-span-4">
              <label
                for="city"
                class="block mb-2 text-sm font-medium text-gray-500"
              >
                City
              </label>
              <input
                id="city"
                v-model="formData.city"
                type="text"
                required
                name="city"
                autocomplete="address-level2"
                class="mt-1 block w-full p-2.5 border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light"
              />
            </div>
            <div class="col-span-6 sm:col-span-3 lg:col-span-2">
              <label
                for="postal-code"
                class="block mb-2 text-sm font-medium text-gray-500"
              >
                ZIP / Postal code
              </label>
              <input
                id="postal-code"
                v-model="formData.zipcode"
                type="text"
                required
                name="postal-code"
                autocomplete="postal-code"
                class="mt-1 block w-full p-2.5 border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-brand-light"
              />
            </div>
          </div>
        </div>
        <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button
            type="submit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light"
            @click="invokeSave"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
