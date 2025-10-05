<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";

defineOptions({
  name: "AccountPage",
});
definePageMeta({
  layout: "account",
});
const newsletter = ref(false);

const { getCountries } = useCountries();
const { getSalutations } = useSalutations();
const {
  user,
  loadSalutation,
  userDefaultBillingAddress,
  userDefaultShippingAddress,
} = useUser();
const {
  isNewsletterSubscriber,
  newsletterUnsubscribe,
  newsletterSubscribe,
  getNewsletterStatus: getNewsletterStatusApi,
  confirmationNeeded,
} = useNewsletter();
const { pushSuccess, pushError } = useNotifications();
const { t } = useI18n();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

useBreadcrumbs([
  {
    name: t("breadcrumbs.accountOverview"),
    path: "/account",
  },
]);

const newsletterDisabled = ref(false);

async function updateNewsletterStatus() {
  try {
    newsletterDisabled.value = true;
    if (!newsletter.value) {
      await newsletterSubscribe({
        email: user.value?.email || "",
        option: "subscribe",
      });
      pushSuccess(t("newsletter.messages.newsletterSubscribed"));
    } else {
      await newsletterUnsubscribe(user.value?.email || "");

      pushSuccess(t("newsletter.messages.newsletterUnsubscribed"));
    }
  } catch (error) {
    if (error instanceof ApiClientError) {
      for (const errorItem of error.details.errors) {
        if (errorItem?.detail) {
          pushError(errorItem.detail);
        }
      }
    }
  } finally {
    await getNewsletterStatus();

    newsletter.value = isNewsletterSubscriber.value;
    newsletterDisabled.value = false;
  }
}

async function getNewsletterStatus() {
  try {
    await getNewsletterStatusApi();
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

onBeforeMount(async () => {
  await getNewsletterStatus();
  newsletter.value = isNewsletterSubscriber.value;
  if (user?.value?.salutationId) {
    await loadSalutation(user.value.salutationId);
  }
});
</script>

<template>
  <section>
    <div class="container mx-auto my-6">
      <h1 class="text-2xl mb-10">{{ $t("account.accountOverviewHeader") }}</h1>
    </div>
    <section class="flex gap-10 mb-10">
      <div class="w-full flex flex-col">
        <h3 class="border-b pb-3 font-bold mb-3">
          {{ $t("account.yourProfile") }}
        </h3>
        <p>
          {{ user?.firstName }}
          {{ user?.lastName }}
        </p>
        <p>{{ user?.email }}</p>
        <div class="mt-5">
          <NuxtLink
            class="justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-dark focus:outline-none focus:ring-2 focus:ring-primary mt-auto"
            data-testid="my-account-change-profile-button"
            :to="formatLink(`/account/profile`)"
          >
            {{ $t("account.change") }}
          </NuxtLink>
        </div>
      </div>
    </section>
    <section class="mb-10">
      <h3 class="border-b pb-3 font-bold mb-5 flex items-center gap-2">
        {{ $t("account.newsletterSettingHeader") }}
        <div
          v-if="newsletterDisabled"
          class="i-svg-spinners-180-ring w-5 h-5 text-gray-500"
        />
      </h3>

      <div
        v-if="confirmationNeeded"
        class="bg-green-100 border-t border-b border-green-500 text-green-700 px-4 py-3 mb-4"
      >
        <p class="text-sm">
          {{ $t("newsletter.subscriptionInfo") }}
        </p>
      </div>
      <div class="flex">
        <input
          id="newsletter-checkbox"
          :disabled="newsletterDisabled"
          v-model="newsletter"
          name="newsletter-checkbox"
          type="checkbox"
          class="h-4 w-4 border-secondary-300 rounded text-indigo-600 focus:ring-indigo-500"
          @click="updateNewsletterStatus"
        />
        <label for="newsletter-checkbox" class="pl-5 text-base mt--1">
          {{ $t("newsletter.subscriptionCheckbox") }}
        </label>
      </div>
    </section>
    <section class="flex gap-10 mb-10">
      <div class="w-1/2 flex flex-col">
        <h3 class="border-b pb-3 font-bold mb-3">
          {{ $t("account.defaultBillingAddressHeader") }}
        </h3>
        <AccountAddressCard
          v-if="userDefaultBillingAddress?.id"
          :key="userDefaultBillingAddress.id"
          :address="userDefaultBillingAddress"
          :countries="getCountries"
          :salutations="getSalutations"
          :can-set-default="false"
          :can-edit="false"
        />
        <div class="mt-5">
          <NuxtLink
            class="justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-dark focus:outline-none focus:ring-2 focus:ring-primary mt-auto"
            data-testid="my-account-change-default-billing-address-button"
            :to="formatLink(`/account/address`)"
          >
            {{ $t("account.change") }}
          </NuxtLink>
        </div>
      </div>
      <div class="w-1/2 flex flex-col">
        <h3 class="border-b pb-3 font-bold mb-3">
          {{ $t("account.defaultShippingAddressHeader") }}
        </h3>
        <AccountAddressCard
          v-if="userDefaultShippingAddress?.id"
          :key="userDefaultShippingAddress.id"
          :address="userDefaultShippingAddress"
          :countries="getCountries"
          :salutations="getSalutations"
          :can-set-default="false"
          :can-edit="false"
        />
        <div class="mt-5">
          <NuxtLink
            class="justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-dark focus:outline-none focus:ring-2 focus:ring-primary mt-auto"
            data-testid="my-account-change-default-shipping-address-button"
            :to="formatLink(`/account/address`)"
          >
            {{ $t("account.change") }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </section>
</template>
