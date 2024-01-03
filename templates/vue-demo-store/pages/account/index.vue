<script lang="ts">
export default {
  name: "AccountPage",
};
</script>

<script setup lang="ts">
definePageMeta({
  layout: "account",
});
const newsletter = ref(false);

const { getCountries } = useCountries();
const { getSalutations } = useSalutations();
const {
  user,
  loadSalutation,
  userDefaultPaymentMethod,
  userDefaultBillingAddress,
  userDefaultShippingAddress,
} = useUser();
const {
  isNewsletterSubscriber,
  newsletterUnsubscribe,
  newsletterSubscribe,
  getNewsletterStatus,
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

const updateNewsletterStatus = async () => {
  try {
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
    console.log("error", error);
    pushError(t("messages.error"));
  } finally {
    getNewsletterStatus().then(() => {
      newsletter.value = isNewsletterSubscriber.value;
    });
  }
};

onBeforeMount(async () => {
  getNewsletterStatus().then(() => {
    newsletter.value = isNewsletterSubscriber.value;
  });
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
      <div class="w-1/2 flex flex-col">
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
      <div class="w-1/2 flex flex-col">
        <h3 class="border-b pb-3 font-bold mb-3">
          {{ $t("account.paymentMethodHeader") }}
        </h3>
        <p class="font-medium">
          {{ userDefaultPaymentMethod?.name }}
        </p>
        <p>{{ userDefaultPaymentMethod?.description }}</p>
        <div class="mt-5">
          <NuxtLink
            class="justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-dark focus:outline-none focus:ring-2 focus:ring-primary mt-auto"
            data-testid="my-account-change-payment-method-button"
            :to="formatLink(`/account/payment`)"
          >
            {{ $t("account.change") }}
          </NuxtLink>
        </div>
      </div>
    </section>
    <section class="mb-10">
      <h3 class="border-b pb-3 font-bold mb-5">
        {{ $t("account.newsletterSettingHeader") }}
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
