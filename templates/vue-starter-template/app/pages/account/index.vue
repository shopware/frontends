<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";

const { resolveApiErrors } = useApiErrorsResolver("account_newsletter");
const { user } = useUser();
const { pushSuccess, pushError } = useNotifications();
const { t } = useI18n();
const {
  isNewsletterSubscriber,
  newsletterUnsubscribe,
  newsletterSubscribe,
  getNewsletterStatus,
  SUBSRIBE_KEY,
  confirmationNeeded,
} = useNewsletter();

const newsletter = ref(false);
const newsletterDisabled = ref(false);

async function handleNewsletterChange() {
  newsletterDisabled.value = true;

  try {
    if (newsletter.value) {
      await newsletterSubscribe({
        email: user.value?.email || "",
        option: SUBSRIBE_KEY,
      });
      // Wait to avoid UI flickering
      await getNewsletterStatus();
      pushSuccess(t("account.overview.newsletter.messages.subscribed"));
    } else {
      await newsletterUnsubscribe(user.value?.email || "");
      pushSuccess(t("account.overview.newsletter.messages.unsubscribed"));
    }
  } catch (error) {
    if (error instanceof ApiClientError) {
      const errors = resolveApiErrors(error.details.errors);
      for (const error of errors) {
        pushError(error);
      }
    }
  } finally {
    newsletterDisabled.value = false;
  }
}

onBeforeMount(async () => {
  await getNewsletterStatus();
  newsletter.value = isNewsletterSubscriber.value;
});
</script>
<template>
  <NuxtLayout name="account">
    <div>
      <AccountPageHeader
        class="mb-14"
        :title="$t('account.overview.header')"
        :subtitle="$t('account.overview.subHeader')"
      />

      <div class="mb-10">
        <AccountSectionHeader
          class="mb-4"
          :title="$t('account.overview.personalDataSectionHeader')"
        />
        <AccountPersonalDataSection
          :customer-name="user?.firstName + ' ' + user?.lastName"
          :customer-email="user?.email || ''"
        />
      </div>

      <div class="mb-10">
        <AccountSectionHeader
          class="mb-4"
          :title="$t('account.overview.newsletter.subscriptionSectionHeader')"
        />
        <AccountNewsletterSection
          v-model="newsletter"
          :disabled="confirmationNeeded || newsletterDisabled"
          :confirmation-needed="confirmationNeeded"
          @change="handleNewsletterChange"
        />
      </div>

      <div class="block md:flex gap-10 mb-10">
        <div class="flex-1 mb-10">
          <AccountSectionHeader
            class="mb-4"
            :title="$t('account.overview.defaultBillingAddressSectionHeader')"
          />
          <AccountAddressDataSection
            v-if="user?.defaultBillingAddress"
            :address="user.defaultBillingAddress"
          />
        </div>

        <div class="flex-1 mb-10">
          <AccountSectionHeader
            class="mb-4"
            :title="$t('account.overview.defaultShippingAddressSectionHeader')"
          />
          <AccountAddressDataSection
            v-if="user?.defaultShippingAddress"
            :address="user.defaultShippingAddress"
          />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
