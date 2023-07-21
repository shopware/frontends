<script lang="ts">
export default {
  name: "AccountAddressDetailPage",
};
</script>

<script setup lang="ts">
import { CustomerAddress } from "@shopware-pwa/types";

definePageMeta({
  layout: "account",
});
const route = useRoute();
const isCreation = ref(route.params.id === "new");

const {
  loadCustomerAddresses,
  customerAddresses,
  setDefaultCustomerShippingAddress,
  setDefaultCustomerBillingAddress,
  createCustomerAddress,
  updateCustomerAddress,
} = useAddress();
const { defaultBillingAddressId, defaultShippingAddressId } = useUser();
const { getCountries, fetchCountries } = useCountries();
const { getSalutations, fetchSalutations } = useSalutations();
const { pushSuccess, pushError } = useNotifications();
const { refreshSessionContext } = useSessionContext();
const router = useRouter();

const formData = reactive({
  id: "",
  countryId: "",
  firstName: "",
  lastName: "",
  salutationId: "",
  zipcode: "",
  city: "",
  street: "",
  company: "",
  fullName: "",
  isShippingAddress: false,
  isBillingAddress: false,
  hasCompany: false,
});

const countries = ref<Array<{ id: string; name: string }>>([]);
const salutations = ref<Array<{ id: string; name: string }>>([]);
const isLoading = ref(true);

onMounted(async () => {
  if (getCountries?.value && Object.keys(getCountries.value).length === 0) {
    await fetchCountries();
  }

  if (getSalutations?.value && Object.keys(getSalutations.value).length === 0) {
    await fetchSalutations();
  }
  if (
    customerAddresses?.value &&
    Object.keys(customerAddresses.value).length === 0
  ) {
    await loadCustomerAddresses();
  }
  isLoading.value = false;
  countries.value = getCountries.value.map((c) => ({
    id: c.id,
    name: c.translated.name,
  }));
  salutations.value = getSalutations.value.map((c) => ({
    id: c.id,
    name: (c.translated as any).displayName,
  }));
  const addressId = route?.params?.id;
  if (addressId) {
    const selectedAddress = customerAddresses.value.find(
      (address) => address.id === addressId
    );
    formData.id = selectedAddress?.id ?? "";
    formData.countryId =
      selectedAddress?.countryId ?? countries.value[0].id;
    formData.firstName = selectedAddress?.firstName ?? "";
    formData.lastName = selectedAddress?.lastName ?? "";
    formData.salutationId = selectedAddress?.salutationId ?? salutations.value[0].id;
    formData.zipcode = selectedAddress?.zipcode ?? "";
    formData.city = selectedAddress?.city ?? "";
    formData.street = selectedAddress?.street ?? "";
    formData.company = selectedAddress?.company ?? "";
    formData.fullName = formData?.firstName + " " + formData?.lastName;
    formData.hasCompany = !!formData.company;
    formData.isBillingAddress =
      selectedAddress?.id === defaultBillingAddressId.value;
    formData.isShippingAddress =
      selectedAddress?.id === defaultShippingAddressId.value;
  }
});

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

const hasCompanyChange = (checked: boolean) => {
  formData.hasCompany = checked;
};

const isShippingAddressChange = (checked: boolean) => {
  formData.isShippingAddress = checked;
};

const isBillingAddressChange = (checked: boolean) => {
  formData.isShippingAddress = checked;
};

const handleCountryChange = (event: any) => {
  formData.countryId = event.id;
};
const invokeChange = async (): Promise<void> => {
  const [fistName, ...lastName] = formData.fullName.split(" ");
  const dto = {
    countryId: formData.countryId,
    salutationId: formData.salutationId,
    firstName: fistName,
    lastName: lastName.join(" "),
    zipcode: formData.zipcode,
    city: formData.city,
    street: formData.street,
  } as any;
  dto.company = formData.hasCompany ? formData.company : "";
  try {
    let customerAddress: CustomerAddress;
    if (!formData.id) {
      customerAddress = await createCustomerAddress(dto);
    } else {
      dto.id = formData.id;
      customerAddress = await updateCustomerAddress(dto);
    }
    if (formData.isShippingAddress) {
      await setDefaultCustomerShippingAddress(customerAddress.id);
    }
    if (formData.isBillingAddress) {
      await setDefaultCustomerBillingAddress(customerAddress.id);
    }
    pushSuccess(isCreation ? "Created successfully" : "Updated successfully");
    refreshSessionContext();
    router.push("/account/address");
  } catch (e) {
    pushError("Something went wrong!");
  }
};
</script>

<template>
  <section class="flex flex-col space-y-10 mb-24">
    <section>
      <h3 class="mb-4">
        {{ isCreation ? $t('add_new_address') : $t('edit_address') }}
      </h3>
    </section>
    <div class="flex flex-col gap-4">
      <div
        v-if="isLoading"
        class="w-full h-full"
      >
        <div class="flex animate-pulse flex-col items-top h-full space-y-5">
          <div class="w-full bg-gray-300 h-6 rounded-md" />
          <div class="w-full bg-gray-300 h-12 rounded-md" />
          <div class="flex flex-row space-x-5">
            <div class="w-1/2 bg-gray-300 h-6 rounded-md" />
            <div class="w-1/2 bg-gray-300 h-6 rounded-md" />
          </div>
        </div>
      </div>
      <form
        v-else
        class="flex flex-col gap-6"
        @submit.prevent="invokeChange"
      >
        <div>
          <p class="text-sm text-brand-dark mb-1 font-medium">
            {{ $t('full_name') }}
          </p>
          <input
            v-model="formData.fullName"
            class="border border-gray-300 py-2 px-3 text-sm text-gray-900 w-full shadow-input"
          >
        </div>
        <div>
          <p class="text-sm font-medium text-brand-dark mb-1">
            {{ $t('street_address') }}
          </p>
          <textarea
            v-model="formData.street"
            class="border border-gray-300 py-2 px-3 text-sm text-gray-900 w-full shadow-input"
            :rows="3"
          />
        </div>
        <div>
          <SharedCheckbox
            content="Add company"
            :model-value="formData.hasCompany"
            @update:modelValue="hasCompanyChange"
          />
        </div>
        <div v-if="formData.hasCompany">
          <p class="text-sm text-brand-dark mb-1 font-medium">
            {{ $t('company') }}
          </p>
          <input
            v-model="formData.company"
            class="border border-gray-300 py-2 px-3 text-sm text-gray-900 w-full shadow-input"
          >
        </div>
        <div class="grid grid-col-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <p class="text-sm text-brand-dark mb-1 font-medium">
              {{ $t('zip_code') }}
            </p>
            <input
              v-model="formData.zipcode"
              class="border border-gray-300 py-2 px-3 text-sm text-dark-primary w-full shadow-input"
            >
          </div>
          <div>
            <p class="text-sm text-brand-dark mb-1 font-medium">
              {{ $t('city') }}
            </p>
            <input
              v-model="formData.city"
              class="border border-gray-300 py-2 px-3 text-sm text-dark-primary w-full shadow-input"
            >
          </div>
          <div v-if="countries?.length">
            <p class="text-sm text-brand-dark mb-1 font-medium">
              {{ $t('country') }}
            </p>
            <SharedSelect
              :options="countries"
              :selected-option="formData.countryId"
              @change="handleCountryChange"
            />
          </div>
        </div>

        <div>
          <SharedCheckbox
            :model-value="formData.isShippingAddress"
            content="Use as shipping address"
            @update:modelValue="isShippingAddressChange"
          />
        </div>

        <div>
          <SharedCheckbox
            :model-value="formData.isBillingAddress"
            content="Use as billing address"
            @update:modelValue="isBillingAddressChange"
          />
        </div>
        <div>
          <button
            class="text-white font-medium py-2.5 px-5 bg-brand-primary"
            type="submit"
          >
            {{ isCreation ? $t('add_address') : $t('update_address') }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>
