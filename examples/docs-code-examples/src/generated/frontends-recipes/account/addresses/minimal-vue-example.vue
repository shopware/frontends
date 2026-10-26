<script setup lang="ts">
import type { Schemas } from "#shopware";

const {
  customerAddresses,
  loadCustomerAddresses,
  createCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
  setDefaultCustomerBillingAddress,
  setDefaultCustomerShippingAddress,
} = useAddress();
const { getCountries, getStatesForCountry } = useCountries();
const { getSalutations } = useSalutations();
const { refreshSessionContext } = useSessionContext();
// the ids work on every Shopware version — see Edge Cases for why not the address flags
const { defaultBillingAddressId, defaultShippingAddressId } = useUser();

const emptyAddress = () => ({
  salutationId: "",
  firstName: "",
  lastName: "",
  street: "",
  zipcode: "",
  city: "",
  countryId: "",
  countryStateId: "",
});

const form = reactive(emptyAddress());
const editedId = ref("");
const pendingId = ref("");
const isSaving = ref(false);
const addressError = ref("");

const states = computed(() =>
  form.countryId ? (getStatesForCountry(form.countryId) ?? []) : [],
);

// an empty string is not a valid UUID, so drop the optional ids left unset.
// the body type is what the operation really accepts; the cast only satisfies
// the stricter signature useAddress declares.
const toRequestBody = () => {
  const { salutationId, countryStateId, ...required } = form;
  const body: Schemas["CustomerAddressBody"] = {
    ...required,
    ...(salutationId ? { salutationId } : {}),
    ...(countryStateId ? { countryStateId } : {}),
  };
  return body as Schemas["CustomerAddress"];
};

const selectCountry = (countryId: string) => {
  form.countryId = countryId;
  // a state id from the previous country is not valid for the new one
  form.countryStateId = "";
};

onMounted(async () => {
  try {
    await loadCustomerAddresses();
  } catch {
    addressError.value = "Your addresses could not be loaded.";
  }
});

const startEdit = (address: Schemas["CustomerAddress"]) => {
  editedId.value = address.id;
  Object.assign(form, {
    salutationId: address.salutationId ?? "",
    firstName: address.firstName,
    lastName: address.lastName,
    street: address.street,
    zipcode: address.zipcode ?? "",
    city: address.city,
    countryId: address.countryId,
    countryStateId: address.countryStateId ?? "",
  });
};

const resetForm = () => {
  editedId.value = "";
  Object.assign(form, emptyAddress());
};

const save = async () => {
  addressError.value = "";
  isSaving.value = true;

  try {
    if (editedId.value) {
      await updateCustomerAddress({
        ...toRequestBody(),
        id: editedId.value,
      });
    } else {
      await createCustomerAddress(toRequestBody());
    }

    // no write method updates the shared list
    await loadCustomerAddresses();
    resetForm();
  } catch {
    addressError.value = "The address could not be saved.";
  } finally {
    isSaving.value = false;
  }
};

const runOnAddress = async (
  addressId: string,
  action: () => Promise<unknown>,
  message: string,
  refreshContext = false,
) => {
  addressError.value = "";
  pendingId.value = addressId;

  try {
    await action();
    await loadCustomerAddresses();
    if (refreshContext) await refreshSessionContext();
  } catch {
    addressError.value = message;
  } finally {
    pendingId.value = "";
  }
};

const remove = (addressId: string) =>
  runOnAddress(
    addressId,
    () => deleteCustomerAddress(addressId),
    "This address could not be deleted.",
  );

const makeDefaultBilling = (addressId: string) =>
  runOnAddress(
    addressId,
    () => setDefaultCustomerBillingAddress(addressId),
    "The default billing address could not be changed.",
    true,
  );

const makeDefaultShipping = (addressId: string) =>
  runOnAddress(
    addressId,
    () => setDefaultCustomerShippingAddress(addressId),
    "The default shipping address could not be changed.",
    true,
  );
</script>

<template>
  <p v-if="addressError">{{ addressError }}</p>

  <p v-if="!customerAddresses.length">
    No addresses to display (the list is also empty before the first load
    resolves).
  </p>

  <ul v-else>
    <li v-for="address in customerAddresses" :key="address.id">
      <p>
        {{ address.firstName }} {{ address.lastName }}, {{ address.street }},
        {{ address.zipcode }} {{ address.city }}
      </p>

      <p v-if="address.id === defaultBillingAddressId">
        Default billing address
      </p>
      <p v-if="address.id === defaultShippingAddressId">
        Default shipping address
      </p>

      <button
        type="button"
        :disabled="pendingId === address.id"
        @click="startEdit(address)"
      >
        Edit
      </button>

      <button
        v-if="address.id !== defaultBillingAddressId"
        type="button"
        :disabled="pendingId === address.id"
        @click="makeDefaultBilling(address.id)"
      >
        Use for billing
      </button>

      <button
        v-if="address.id !== defaultShippingAddressId"
        type="button"
        :disabled="pendingId === address.id"
        @click="makeDefaultShipping(address.id)"
      >
        Use for shipping
      </button>

      <button
        v-if="
          address.id !== defaultBillingAddressId &&
          address.id !== defaultShippingAddressId
        "
        type="button"
        :disabled="pendingId === address.id"
        @click="remove(address.id)"
      >
        Delete
      </button>
    </li>
  </ul>

  <form @submit.prevent="save">
    <h2>{{ editedId ? "Edit this address" : "Add an address" }}</h2>

    <label>
      Salutation
      <select v-model="form.salutationId">
        <option value="">Not specified</option>
        <option
          v-for="salutation in getSalutations"
          :key="salutation.id"
          :value="salutation.id"
        >
          {{ salutation.translated?.displayName ?? salutation.displayName }}
        </option>
      </select>
    </label>

    <label>
      First name
      <input v-model="form.firstName" type="text" autocomplete="given-name" />
    </label>

    <label>
      Last name
      <input v-model="form.lastName" type="text" autocomplete="family-name" />
    </label>

    <label>
      Street
      <input v-model="form.street" type="text" autocomplete="street-address" />
    </label>

    <label>
      Postal code
      <input v-model="form.zipcode" type="text" autocomplete="postal-code" />
    </label>

    <label>
      City
      <input v-model="form.city" type="text" autocomplete="address-level2" />
    </label>

    <label>
      Country
      <select
        :value="form.countryId"
        @change="selectCountry(($event.target as HTMLSelectElement).value)"
      >
        <option value="">Select a country</option>
        <option
          v-for="country in getCountries"
          :key="country.id"
          :value="country.id"
        >
          {{ country.translated.name }}
        </option>
      </select>
    </label>

    <label v-if="states.length">
      State
      <select v-model="form.countryStateId">
        <option value="">Not specified</option>
        <option v-for="state in states" :key="state.id" :value="state.id">
          {{ state.translated?.name ?? state.name }}
        </option>
      </select>
    </label>

    <button type="submit" :disabled="isSaving">
      {{ isSaving ? "Saving…" : editedId ? "Save changes" : "Add the address" }}
    </button>

    <button v-if="editedId" type="button" @click="resetForm()">Cancel</button>
  </form>
</template>
