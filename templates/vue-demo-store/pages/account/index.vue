<script lang="ts">
export default {
  name: "AccountPage",
};
</script>

<script setup lang="ts">
import { getTranslatedProperty } from '@shopware-pwa/helpers-next';
import { getCustomerOrders } from "@shopware-pwa/api-client";
import SharedCard from '../../components/shared/SharedCard.vue';
import SharedCheckbox from '../../components/shared/SharedCheckbox.vue';
import { Order } from '@shopware-pwa/types';
import SharedOrders from '../../components/shared/SharedOrders.vue';
import {
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: "account",
});
const newsletter = ref(false);
const router = useRouter();
// const { getCountries } = useCountries();
// const { getSalutations } = useSalutations();
const {
  user,
  logout,
  loadSalutation,
  userDefaultPaymentMethod,
  userDefaultBillingAddress,
  userDefaultShippingAddress,
} = useUser();
const {
  isNewsletterSubscriber,
  newsletterUnsubscribe,
  newsletterSubscribe,
} = useNewsletter();
const { pushSuccess, pushError } = useNotifications();
const { apiInstance } = useShopwareContext();
const orders = ref<Order[]>();
useBreadcrumbs([
  {
    name: "My Account",
    path: "/account",
  },
]);

onMounted(async () => {
  const fetchedOrders = await getCustomerOrders({
    limit: 3,
    sort: [
      { field: "orderDateTime", order: "DESC", naturalSorting: false }
    ]
  }, apiInstance);
  orders.value = fetchedOrders?.elements;
});


const updateNewsletterStatus = async (value: any) => {
  newsletter.value = value;
  try {
    if (newsletter.value) {
      await newsletterSubscribe({
        email: user.value?.email || "",
        option: "subscribe",
      });
      pushSuccess(t("newsletter.messages.newsletterSubscribed"));
    } else {
      await newsletterUnsubscribe(user.value?.email || "");
      pushSuccess("Newsletter unsubscribe");
    }
  } catch (error) {
    newsletter.value = !value;
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
  <section class="flex flex-col space-y-10 mb-24">
    <section>
      <h3 class="mb-4">
        {{ $t('account_overview') }}
      </h3>
      <p class="text-base">
        {{ $t('directly_access_your_profile') }}
      </p>
    </section>
    <section>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="flex flex-col">
          <h6>Personal data</h6>
          <SharedCard class="flex-1">
            <template #content>
              <p class="text-base md:text-sm">
                {{ user?.firstName }} {{ user?.lastName }}
                <br>
                <br>
                {{ user?.email }}
              </p>
            </template>
            <template #actions>
              <button
                class="text-sm font-medium text-white bg-gray-800 shadow-sm py-2 px-4"
                @click="() => router.push('/account/profile')"
              >
                {{ $t('edit_profile') }}
              </button>
            </template>
          </SharedCard>
        </div>
        <div class="flex flex-col">
          <h6>{{ $t('default_payment_method') }}</h6>
          <SharedCard class="flex-1">
            <template #content>
              <p class="text-base md:text-sm font-medium mb-2">
                {{ userDefaultPaymentMethod?.name }}
              </p>
              <p class="text-base md:text-sm">
                {{ userDefaultPaymentMethod?.description }}
              </p>
              <!-- <p>
                Apple Pay<br/>
                Mastercard<br/>
                •••• Ending in 1545
              </p> -->
            </template>
            <template #actions>
              <button
                class="text-sm font-medium text-white bg-gray-800 shadow-sm py-2 px-4"
                @click="() => router.push('/account/payment')"
              >
                {{ $t('change_payment_method') }}
              </button>
            </template>
          </SharedCard>
        </div>
      </div>
    </section>
    <section>
      <h6>{{ $t('newsletter_subscription') }}</h6>
      <SharedCard class="flex-1">
        <template #content>
          <div class="flex space-x-2 items-center">
            <SharedCheckbox
              id="subscription"
              name="subscription"
              :model-value="newsletter"
              @update:modelValue="updateNewsletterStatus"
            />
            <label
              for="subscription"
              class="font-medium text-sm text-gray-700"
            >{{ $t('yes_would_to_subscribe') }}</label>
          </div>
        </template>
      </SharedCard>
    </section>
    <section>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="flex flex-col">
          <h6>{{ $t('billing_address') }}</h6>
          <SharedCard class="flex-1">
            <template #content>
              <p class="text-base md:text-sm">
                {{ userDefaultBillingAddress?.firstName }} {{ userDefaultBillingAddress?.lastName }}<br>
                {{ userDefaultBillingAddress?.street }}<br>
                {{ userDefaultBillingAddress?.zipcode }} {{ userDefaultBillingAddress?.city }},<br>
                {{ getTranslatedProperty(userDefaultBillingAddress?.country, 'name') }}
              </p>
            </template>
            <template #actions>
              <button
                class="text-sm font-medium text-white bg-gray-800 shadow-sm py-2 px-4"
                @click="() => router.push('/account/address')"
              >
                {{ $t('change_billing_address') }}
              </button>
            </template>
          </SharedCard>
        </div>
        <div class="flex flex-col">
          <h6>{{ $t('shipping_address') }}</h6>
          <SharedCard class="flex-1">
            <template #content>
              <p
                v-if="userDefaultShippingAddress?.id === userDefaultBillingAddress?.id"
                class="text-base md:text-sm"
              >
                {{ $t('same_billing_address') }}
              </p>
              <p
                v-else
                class="text-base md:text-sm"
              >
                {{ userDefaultShippingAddress?.firstName }} {{ userDefaultShippingAddress?.lastName }}<br>
                {{ userDefaultShippingAddress?.street }}<br>
                {{ userDefaultShippingAddress?.zipcode }} {{ userDefaultShippingAddress?.city }},<br>
                {{ getTranslatedProperty(userDefaultShippingAddress?.country, 'name') }}
              </p>
            </template>
            <template #actions>
              <button
                class="text-sm font-medium text-white bg-gray-800 shadow-sm py-2 px-4"
                @click="() => router.push('/account/address')"
              >
                {{ $t('change_billing_address') }}
              </button>
            </template>
          </SharedCard>
        </div>
      </div>
    </section>
    <section>
      <h6 class="mb-4">
        {{ $t('latest_orders') }}
      </h6>
      <SharedOrders :orders="orders || []" />
      <button
        class="mt-6 text-sm font-medium text-white bg-gray-800 shadow-sm py-2 px-4"
        @click="() => router.push('/account/order')"
      >
        {{ $t('show_all_orders') }}
      </button>
    </section>
    <section class="block md:hidden">
      <button
        class="w-full flex items-center justify-center border border-gray-300 shadow-sm py-2 px-4 hover:bg-gray-50"
        @click="logout()"
      >
        <ArrowRightOnRectangleIcon class="h-5 w-5 text-gray-500" />
        <span class="ml-2 text-gray-700 text-sm font-medium">{{ $t('logout') }}</span>
      </button>
    </section>
  </section>
</template>
