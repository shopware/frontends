<script setup lang="ts">
import type { Schemas } from "#shopware";
import { ApiClientError } from "@shopware/api-client";
import type { ApiError } from "@shopware/api-client";

const {
  createCustomerAddress,
  updateCustomerAddress,
  errorMessageBuilder,
  loadCustomerAddresses,
} = useAddress();

const emits = defineEmits<{
  (e: "success"): void;
  (e: "close"): void;
}>();

const props = withDefaults(
  defineProps<{
    address?: Schemas["CustomerAddress"];
    title?: string;
  }>(),
  {
    title: "Account address",
    address: undefined,
  },
);

const { getSalutations } = useSalutations();
const { t } = useI18n();
const { pushError } = useNotifications();

const formData = reactive<Schemas["CustomerAddress"]>({
  countryId: props.address?.countryId ?? "",
  countryStateId: props.address?.countryStateId ?? "",
  salutationId: props.address?.salutationId ?? "",
  firstName: props.address?.firstName ?? "",
  lastName: props.address?.lastName ?? "",
  zipcode: props.address?.zipcode ?? "",
  city: props.address?.city ?? "",
  street: props.address?.street ?? "",
  id: props.address?.id ?? "",
} as Schemas["CustomerAddress"]);

const invokeSave = async (): Promise<void> => {
  try {
    const saveAddress = formData.id
      ? updateCustomerAddress
      : createCustomerAddress;
    await saveAddress(formData as Schemas["CustomerAddress"]);
    loadCustomerAddresses();
    emits("success");
  } catch (e) {
    if (e instanceof ApiClientError) {
      e.details.errors.forEach((element: ApiError) => {
        pushError(errorMessageBuilder(element) || t("messages.error"));
      });
    }
  }
};

const firstNameInputElement = ref();
useFocus(firstNameInputElement, { initialValue: true });
</script>

<template>
  <div class="mt-5 md:mt-0 md:col-span-2">
    <div class="shadow overflow-hidden sm:rounded-md">
      <form
        id="account-address"
        ref="formElement"
        name="account-address"
        method="post"
      >
        <div class="px-4 py-5 bg-white sm:p-6">
          <h3 class="text-2xl border-b pb-3">
            {{ props.title }}
          </h3>
          <div class="grid grid-cols-6 gap-6 mt-8">
            <div class="col-span-6 sm:col-span-6">
              <label
                for="country"
                class="block mb-2 text-sm font-medium text-secondary-500"
              >
                {{ $t("form.salutation") }}
              </label>
              <select
                id="salutation"
                v-model="formData.salutationId"
                required
                name="salutation"
                autocomplete="salutation-name"
                class="mt-1 block w-full py-2.5 px-3 border border-secondary-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-light focus:border-light sm:text-sm"
                data-testid="account-address-form-salutation-select"
              >
                <option
                  v-for="salutation in getSalutations"
                  :key="salutation.id"
                  :value="salutation.id"
                  data-testid="account-address-form-salutation-select-option"
                >
                  {{ salutation.displayName }}
                </option>
              </select>
            </div>
            <div class="col-span-6 sm:col-span-3">
              <label
                for="first-name"
                class="block mb-2 text-sm font-medium text-secondary-500"
              >
                {{ $t("form.firstName") }}
              </label>
              <input
                id="first-name"
                ref="firstNameInputElement"
                v-model="formData.firstName"
                type="text"
                required
                name="first-name"
                class="mt-1 block w-full p-2.5 border border-secondary-300 text-secondary-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-light"
                data-testid="account-address-form-firstname-input"
              />
            </div>

            <div class="col-span-6 sm:col-span-3">
              <label
                for="last-name"
                class="block mb-2 text-sm font-medium text-secondary-500"
              >
                {{ $t("form.lastName") }}
              </label>
              <input
                id="last-name"
                v-model="formData.lastName"
                type="text"
                required
                name="last-name"
                class="mt-1 block w-full p-2.5 border border-secondary-300 text-secondary-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-light"
                data-testid="account-address-form-lastname-input"
              />
            </div>
            <SharedCountryStateInput
              v-model:countryId="formData.countryId"
              v-model:stateId="formData.countryStateId"
              class="col-span-6 sm:col-span-6"
            />
            <div class="col-span-6">
              <label
                for="street-address"
                class="block mb-2 text-sm font-medium text-secondary-500"
              >
                {{ $t("form.streetAddress") }}
              </label>
              <input
                id="street-address"
                v-model="formData.street"
                type="text"
                required
                name="street-address"
                autocomplete="street-address"
                class="mt-1 block w-full p-2.5 border border-secondary-300 text-secondary-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-light"
                data-testid="account-address-form-street-input"
              />
            </div>

            <div class="col-span-6 sm:col-span-6 lg:col-span-4">
              <label
                for="city"
                class="block mb-2 text-sm font-medium text-secondary-500"
              >
                {{ $t("form.city") }}
              </label>
              <input
                id="city"
                v-model="formData.city"
                type="text"
                required
                name="city"
                autocomplete="address-level2"
                class="mt-1 block w-full p-2.5 border border-secondary-300 text-secondary-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-light"
                data-testid="account-address-form-city-input"
              />
            </div>
            <div class="col-span-6 sm:col-span-3 lg:col-span-2">
              <label
                for="postal-code"
                class="block mb-2 text-sm font-medium text-secondary-500"
              >
                {{ $t("form.postalCode") }}
              </label>
              <input
                id="postal-code"
                v-model="formData.zipcode"
                type="text"
                required
                name="postal-code"
                autocomplete="postal-code"
                class="mt-1 block w-full p-2.5 border border-secondary-300 text-secondary-900 text-sm rounded-md shadow-sm focus:ring-brand-light focus:border-light"
                data-testid="account-address-form-postal-code-input"
              />
            </div>
          </div>
        </div>
        <div class="px-4 py-3 bg-secondary-50 text-right sm:px-6">
          <button
            type="submit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light"
            data-testid="account-address-form-submit-button"
            @click.stop.prevent="invokeSave"
          >
            {{ $t("form.save") }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
