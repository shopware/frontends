<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import type { Schemas } from "#shopware";
import { addressFormRules } from "../../../utils/validation/rules/addressFormRules";

const props = defineProps<{
  address: Schemas["CustomerAddress"];
}>();

const emit = defineEmits<{
  handleSubmit: [Omit<Schemas["CustomerAddress"], "id" | "customerId">];
}>();
const router = useRouter();

type AccountType = "private" | "business";

const state = ref({
  firstName: "",
  lastName: "",
  salutationId: "",
  accountType: "private" as AccountType,
  company: "",
  street: "",
  zipcode: "",
  city: "",
  countryId: "",
  countryStateId: "",
});

function populateStateFromAddress(address: Schemas["CustomerAddress"]) {
  Object.assign(state.value, address);
}

watch(
  () => props.address,
  (newAddress) => {
    if (newAddress) {
      populateStateFromAddress(newAddress);
    }
  },
  { immediate: true },
);

const $v = useVuelidate(addressFormRules(state), state);

async function handleSubmit() {
  const valid = await $v.value.$validate();
  if (!valid) {
    return;
  }

  emit("handleSubmit", state.value);
}
</script>
<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
    <FormSalutationSelect
      v-model="state.salutationId"
      id="salutation"
      :errorMessage="$v.salutationId?.$errors[0]?.$message"
    />

    <div class="flex gap-4">
      <FormInputField
        class="basis-1/2"
        v-model="state.firstName"
        id="first-name"
        :label="$t('form.firstName')"
        :placeholder="$t('form.firstNamePlaceholder')"
        :errorMessage="$v.firstName?.$errors[0]?.$message"
      />
      <FormInputField
        class="basis-1/2"
        v-model="state.lastName"
        id="last-name"
        :label="$t('form.lastName')"
        :placeholder="$t('form.lastNamePlaceholder')"
        :errorMessage="$v.lastName?.$errors[0]?.$message"
      />
    </div>

    <!-- TODO - add company input after backend #13071 -->
    <!-- <FormInputField
      v-if="state.accountType === 'business'"
      v-model="state.company"
      id="company"
      :label="$t('form.company')"
      :placeholder="$t('form.companyPlaceholder')"
      :errorMessage="$v.company?.$errors[0]?.$message"
    /> -->

    <FormInputField
      v-model="state.street"
      id="street"
      :label="$t('form.streetAddress')"
      :placeholder="$t('form.streetPlaceholder')"
      :errorMessage="$v.street?.$errors[0]?.$message"
    />

    <div class="flex gap-4">
      <FormInputField
        class="basis-1/2"
        v-model="state.zipcode"
        id="zipcode"
        :label="$t('form.postalCode')"
        :placeholder="$t('form.postalCodePlaceholder')"
        :errorMessage="$v.zipcode?.$errors[0]?.$message"
      />
      <FormInputField
        class="basis-1/2"
        v-model="state.city"
        id="city"
        :label="$t('form.city')"
        :placeholder="$t('form.cityPlaceholder')"
        :errorMessage="$v.city?.$errors[0]?.$message"
      />
    </div>

    <SharedCountryStateInput
      v-model:country-id="state.countryId"
      v-model:state-id="state.countryStateId"
      :country-id-validation="$v.countryId"
      :state-id-validation="$v.countryStateId"
    />

    <p class="text-sm text-surface-on-surface-variant">
      {{ $t("form.requiredFieldsNote") }}
    </p>

    <div class="flex gap-4 mt-6">
      <FormBaseButton type="submit" variant="primary">
        {{ $t("account.address.new.saveButton") }}
      </FormBaseButton>
      <FormBaseButton
        type="button"
        variant="secondary"
        @click="router.push('/account/address')"
      >
        {{ $t("form.cancel") }}
      </FormBaseButton>
    </div>
  </form>
</template>
