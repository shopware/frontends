<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
import type { Schemas } from "#shopware";

const { apiClient } = useShopwareContext();
const { pushError, pushSuccess } = useNotifications();
const { t } = useI18n();

const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

const router = useRouter();
const route = useRoute();
const id = route.params.id;

const state = ref<Schemas["CustomerAddress"]>();

try {
  const result = await apiClient.invoke(
    "listAddress post /account/list-address",
    {
      body: {
        filter: [
          {
            type: "equals",
            field: "id",
            value: id as string,
          },
        ],
      },
    },
  );

  if (result.data.elements[0]) {
    state.value = result.data.elements[0];
  }
} catch (error) {
  if (error instanceof ApiClientError) {
    for (const errorItem of error.details.errors) {
      if (errorItem?.detail) {
        // TODO - when moving to the utils, add new address resolver for this error code
        if (errorItem.code === "FRAMEWORK__INVALID_UUID") {
          pushError(errorItem.detail);
          await router.push(formatLink("/account/address"));
        }
      }
    }
  }
}

async function handleSubmit(
  address: Omit<Schemas["CustomerAddress"], "id" | "customerId">,
) {
  if (!state.value?.id) {
    pushError(t("account.address.notFound"));
    return;
  }
  try {
    await apiClient.invoke(
      "updateCustomerAddress patch /account/address/{addressId}",
      {
        pathParams: {
          addressId: state.value?.id,
        },
        body: address,
      },
    );

    pushSuccess(t("account.address.edit.successMessage"));
    await router.push(formatLink("/account/address"));
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
        :title="$t('account.address.edit.header')"
        :subtitle="$t('account.address.edit.subHeader')"
      />

      <div class="mb-10">
        <AccountSectionHeader
          class="mb-4"
          :title="$t('account.address.edit.personalDataSectionHeader')"
        />
        <AccountAddressForm
          v-if="state"
          :address="state"
          @handleSubmit="handleSubmit"
        />
      </div>
    </div>
  </NuxtLayout>
</template>
