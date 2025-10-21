<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
import type { Schemas } from "#shopware";

const { createCustomerAddress } = useAddress();
const { pushError, pushSuccess } = useNotifications();
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

async function handleSubmit(
  addressData: Omit<Schemas["CustomerAddress"], "id" | "customerId">,
) {
  try {
    await createCustomerAddress(addressData as Schemas["CustomerAddress"]);
    pushSuccess($t("account.address.new.successMessage"));
    await router.push("/account/address");
  } catch (error) {
    if (error instanceof ApiClientError) {
      for (const errorItem of error.details.errors) {
        if (errorItem?.detail) {
          pushError(errorItem.detail);
        }
      }
    }
  }
}
</script>

<template>
  <NuxtLayout name="account">
    <div>
      <AccountPageHeader
        class="mb-14"
        :title="$t('account.address.new.header')"
        :subtitle="$t('account.address.new.subHeader')"
      />

      <div class="mb-10">
        <AccountSectionHeader
          class="mb-4"
          :title="$t('account.address.new.personalDataSectionHeader')"
        />

        <AccountAddressForm :address="state" @handleSubmit="handleSubmit" />
      </div>
    </div>
  </NuxtLayout>
</template>
