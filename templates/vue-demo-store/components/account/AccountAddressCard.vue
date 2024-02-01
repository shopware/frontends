<script setup lang="ts">
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";
import type { Schemas } from "#shopware";
const { pushSuccess, pushError } = useNotifications();
const {
  setDefaultCustomerShippingAddress,
  setDefaultCustomerBillingAddress,
  deleteCustomerAddress,
  loadCustomerAddresses,
} = useAddress();
const { defaultBillingAddressId, defaultShippingAddressId } = useUser();
const { refreshSessionContext } = useSessionContext();
const { t } = useI18n();

const emits = defineEmits<{
  (e: "success"): void;
}>();

const props = withDefaults(
  defineProps<{
    address: Schemas["CustomerAddress"];
    countries: Array<Schemas["Country"]>;
    salutations: Array<Schemas["Salutation"]>;
    canSetDefault?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
  }>(),
  {
    canSetDefault: true,
    canEdit: true,
    canDelete: false,
  },
);
const canBeDeleted = computed(
  () =>
    props.canDelete &&
    defaultShippingAddressId.value !== props.address.id &&
    defaultBillingAddressId.value !== props.address.id,
);

const setDefaultShippingAddress = async () => {
  try {
    await setDefaultCustomerShippingAddress(props.address.id);
    refreshSessionContext();
    pushSuccess(t("account.messages.defaultShippingAddressSuccess"));
  } catch (error) {
    pushError(t("account.messages.defaultShippingAddressError"));
  }
};

const setDefaultBillingAddress = async () => {
  try {
    await setDefaultCustomerBillingAddress(props.address.id);
    refreshSessionContext();
    pushSuccess(t("account.messages.defaultBillingAddressSuccess"));
  } catch (error) {
    pushError(t("account.messages.defaultBillingAddressError"));
  }
};

const removeAddress = async (addressId: string) => {
  try {
    await deleteCustomerAddress(addressId);
    pushSuccess(t("account.messages.addressDeletedSuccess"));
  } catch (error) {
    pushError(t("account.messages.addressDeletedError"));
  } finally {
    loadCustomerAddresses();
  }
};

const addAddressModalController = useModal();
const addressSaved = () => {
  addAddressModalController.close();
  emits("success");
};
</script>

<template>
  <div class="col-span-6 lg:col-span-3 max-w-md">
    <div class="flex items-center mb-2">
      <h5
        class="text-xl leading-none text-secondary-900 mr-2"
        data-testid="address-box-name"
      >
        {{ `${address.firstName} ${address.lastName}` }}
      </h5>
      <button
        v-if="canEdit"
        title="Open address editor"
        class="cursor-pointer i-carbon-edit text-xl inline-block"
        data-testid="address-edit"
        @click.prevent="addAddressModalController.open"
      />
      <SharedModal :controller="addAddressModalController">
        <SharedAccountAddressForm
          :address="address"
          :title="$t('account.editAddress')"
          @success="addressSaved"
        />
      </SharedModal>
      <div
        v-if="canBeDeleted"
        class="i-carbon-delete text-xl inline-block cursor-pointer ml-2"
        data-testid="address-delete"
        @click.prevent="removeAddress(address.id)"
      />
    </div>
    <div class="flow-root">
      <span class="block" data-testid="address-box-street">{{
        address.street
      }}</span>
      <p>
        <span data-testid="address-box-zipcode">{{ address.zipcode }}</span
        >&nbsp;
        <span data-testid="address-box-city">{{ address.city }}</span>
      </p>
      <p v-if="address.country" class="text-sm">
        <span>({{ getTranslatedProperty(address.country, "name") }}</span>
        <span v-if="address.countryState"
          >, {{ getTranslatedProperty(address.countryState, "name") }}</span
        >)
      </p>
    </div>
    <div v-if="canSetDefault">
      <a
        v-if="defaultShippingAddressId !== address.id"
        role="button"
        tabindex="0"
        class="block text-sm mt-4 font-medium text-blue-600 hover:underline"
        data-testid="address-set-default-shipping"
        @click="setDefaultShippingAddress()"
      >
        {{ $t("account.setDefaultShippingAddress") }}
      </a>
      <a
        v-if="defaultBillingAddressId !== address.id"
        role="button"
        tabindex="0"
        class="block text-sm mt-2 font-medium text-blue-600 hover:underline"
        data-testid="address-set-default-billing"
        @click="setDefaultBillingAddress()"
      >
        {{ $t("account.setDefaultBillingAddress") }}
      </a>
    </div>
  </div>
</template>
