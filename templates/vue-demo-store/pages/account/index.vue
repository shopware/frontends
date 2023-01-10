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
const { isNewsletterSubscriber, newsletterSubscribe } = useNewsletter();
const { pushSuccess, pushError } = useNotifications();

newsletter.value = await isNewsletterSubscriber();

const updateNewsletterStatus = async () => {
  try {
    if (!newsletter.value) {
      await newsletterSubscribe({
        email: user.value?.email || "",
        option: "subscribe",
      });
      pushSuccess("Newsletter subscribed");
    } else {
      await newsletterSubscribe({
        email: user.value?.email || "",
        option: "unsubscribe",
      });
      pushSuccess("Newsletter unsubscribe");
    }
  } catch (error) {
    newsletter.value = !newsletter.value;
    console.log("error", error);
    pushError("Something goes wrong please try again later");
  }
};

onBeforeMount(async () => {
  if (user?.value?.salutationId) {
    await loadSalutation(user.value.salutationId);
  }
});
</script>

<template>
  <section>
    <div class="container mx-auto my-6">
      <h1 class="text-2xl mb-10">Account Overview</h1>
    </div>
    <section class="flex gap-10 mb-10">
      <div class="w-1/2 flex flex-col">
        <h3 class="border-b pb-3 font-bold mb-3">Your profile</h3>

        <p>
          {{ user?.firstName }}
          {{ user?.lastName }}
        </p>
        <p>{{ user?.email }}</p>
        <div class="mt-5">
          <button
            class="justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary mt-auto"
            data-testid="my-account-change-profile-button"
            @click="$router.push('/account/profile')"
          >
            Change
          </button>
        </div>
      </div>
      <div class="w-1/2 flex flex-col">
        <h3 class="border-b pb-3 font-bold mb-3">Payment Method</h3>
        <p class="font-medium">{{ userDefaultPaymentMethod?.name }}</p>
        <p>{{ userDefaultPaymentMethod?.description }}</p>
        <div class="mt-5">
          <button
            class="justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary mt-auto"
            data-testid="my-account-change-payment-method-button"
            @click="$router.push('/account/payment')"
          >
            Change
          </button>
        </div>
      </div>
    </section>
    <section class="mb-10">
      <h3 class="border-b pb-3 font-bold mb-5">Newsletter setting</h3>
      <div class="flex">
        <input
          id="newsletter-checkbox"
          name="newsletter-checkbox"
          type="checkbox"
          v-model="newsletter"
          class="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
          @click="updateNewsletterStatus"
        />

        <label for="newsletter-checkbox" class="pl-5 text-base mt--1">
          Yes, I would like to subscribe to the free Demostore newsletter. (I
          may unsubscribe at any time.)
        </label>
      </div>
    </section>
    <section class="flex gap-10 mb-10">
      <div class="w-1/2 flex flex-col">
        <h3 class="border-b pb-3 font-bold mb-3">Default billing address</h3>
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
          <button
            class="justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary mt-auto"
            data-testid="my-account-change-default-billing-address-button"
            @click="$router.push('/account/address')"
          >
            Change
          </button>
        </div>
      </div>
      <div class="w-1/2 flex flex-col">
        <h3 class="border-b pb-3 font-bold mb-3">Default shipping address</h3>
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
          <button
            class="justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary mt-auto"
            data-testid="my-account-change-default-shipping-address-button"
            @click="$router.push('/account/address')"
          >
            Change
          </button>
        </div>
      </div>
    </section>
  </section>
</template>
