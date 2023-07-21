<script lang="ts">
export default {
  name: "AccountAddressPage",
};
</script>

<script setup lang="ts">
import SharedCard from "../../../components/shared/SharedCard.vue";
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";

definePageMeta({
  layout: "account",
});
const router = useRouter();
const loadingData = ref(true);
const { pushSuccess, pushError } = useNotifications();
const { refreshSessionContext } = useSessionContext();
const {
  customerAddresses,
  loadCustomerAddresses,
  setDefaultCustomerShippingAddress,
  setDefaultCustomerBillingAddress,
  deleteCustomerAddress,
} = useAddress();
const {
  userDefaultBillingAddress,
  userDefaultShippingAddress,
  defaultBillingAddressId,
  defaultShippingAddressId,
} = useUser();

useBreadcrumbs([
  {
    name: "My Account",
    path: "/account",
  },
  {
    name: "Address",
    path: "/account/address",
  },
]);

onBeforeMount(async () => {
  await loadCustomerAddresses();
  loadingData.value = false;
});

const removeAddress = async (addressId: string) => {
  try {
    await deleteCustomerAddress(addressId);
    pushSuccess("Address deleted");
  } catch (error) {
    pushError("Address deleted error");
  }
};

const setDefaultShippingAddress = async (id: string) => {
  try {
    await setDefaultCustomerShippingAddress(id);
    refreshSessionContext();
    pushSuccess("Set default shipping address successfully");
  } catch (error) {
    pushError("Set default shipping address error");
  }
};

const setDefaultBillingAddress = async (id: string) => {
  try {
    await setDefaultCustomerBillingAddress(id);
    refreshSessionContext();
    pushSuccess("Set default billing address successfully");
  } catch (error) {
    pushError("Set default billing address error");
  }
};
</script>

<template>
  <section class="flex flex-col space-y-10 mb-24">
    <section>
      <h3 class="mb-4">
        {{ $t('street_address') }}
      </h3>
      <p class="text-base">
        {{ $t('view_your_current_default_address') }}
      </p>
    </section>
    <section>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div class="flex flex-col">
          <h6>{{ $t('billing_address') }}</h6>
          <SharedCard class="flex-1">
            <template #content>
              <p class="text-base md:text-sm">
                {{ userDefaultBillingAddress?.firstName }}
                {{ userDefaultBillingAddress?.lastName }}<br>
                {{ userDefaultBillingAddress?.street }}<br>
                {{ userDefaultBillingAddress?.zipcode }}
                {{ userDefaultBillingAddress?.city }},<br>
                {{
                  getTranslatedProperty(
                    userDefaultBillingAddress?.country,
                    "name"
                  )
                }}
              </p>
            </template>
          </SharedCard>
        </div>
        <div class="flex flex-col">
          <h6>{{ $t('shipping_address') }}</h6>
          <SharedCard class="flex-1">
            <template #content>
              <p
                v-if="
                  userDefaultShippingAddress?.id ===
                    userDefaultBillingAddress?.id
                "
                class="text-base md:text-sm"
              >
                {{ $t('same_as_billing_address') }}
              </p>
              <p
                v-else
                class="text-base md:text-sm"
              >
                {{ userDefaultShippingAddress?.firstName }}
                {{ userDefaultShippingAddress?.lastName }}<br>
                {{ userDefaultShippingAddress?.street }}<br>
                {{ userDefaultShippingAddress?.zipcode }}
                {{ userDefaultShippingAddress?.city }},<br>
                {{
                  getTranslatedProperty(
                    userDefaultShippingAddress?.country,
                    "name"
                  )
                }}
              </p>
            </template>
          </SharedCard>
        </div>
      </div>
      <button
        class="text-base font-medium text-white bg-gray-800 shadow-sm py-2 px-5"
        @click="router.push('/account/address/new')"
      >
        {{ $t('add_address') }}
      </button>
    </section>
    <section>
      <h6 class="text-xl font-bold md:text-2xl md:font-normal">
        {{ $t('all_addresses') }}
      </h6>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          v-for="customerAddress of customerAddresses"
          class="flex flex-col"
        >
          <SharedCard class="flex-1">
            <template #content>
              <div class="flex flex-col h-full">
                <p class="text-base md:text-sm">
                  {{ customerAddress?.firstName }} {{ customerAddress?.lastName
                  }}<br>
                  {{ customerAddress?.street }}<br>
                  {{ customerAddress?.zipcode }}
                  {{ customerAddress?.city }},<br>
                  {{ getTranslatedProperty(customerAddress?.country, "name") }}
                </p>
                <div class="flex-1 flex flex-col mt-4 gap-3 justify-end">
                  <div v-if="defaultShippingAddressId !== customerAddress.id">
                    <button
                      class="inline hover:bg-gray-50 border border-gray-300 px-3 py-2 text-gray-700 text-xs font-medium"
                      @click="setDefaultShippingAddress(customerAddress.id)"
                    >
                      {{ $t('make_shipping_address') }}
                    </button>
                  </div>
                  <div v-if="defaultBillingAddressId !== customerAddress.id">
                    <button
                      class="inline hover:bg-gray-50 border border-gray-300 px-3 py-2 text-gray-700 text-xs font-medium"
                      @click="setDefaultBillingAddress(customerAddress.id)"
                    >
                      {{ $t('make_billing_address') }}
                    </button>
                  </div>
                  <div class="flex gap-3">
                    <button
                      class="text-sm font-medium text-white bg-gray-800 shadow-sm py-2 px-4"
                      @click="router.push(`/account/address/${customerAddress.id}`)"
                    >
                      {{ $t('edit') }}
                    </button>
                    <button
                      class="text-sm font-medium text-gray-700 bg-gray-100 shadow-sm py-2 px-4"
                      @click="() => removeAddress(customerAddress.id)"
                    >
                      {{ $t('delete') }}
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </SharedCard>
        </div>
      </div>
    </section>
  </section>
</template>
